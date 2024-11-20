---
sidebar_position: 2
---
# 🔎 Базовое использование  {#basic-usage}

## Конфигурация LSSR {#lssr-config}
```typescript
// lssr.config.ts
import { defineLssrConfig } from "lite-ssr";

export default defineLssrConfig({
    entry?: "/src/main.ts", // Опционально, путь к файлу инициализации приложения
    head?: { // Опционально, конфигурация unhead (https://unhead.unjs.io/usage/composables/use-head#input)
        title: "My LSSR App"
    },
    html?: "/index.html", // Опционально, путь к кастомному html файлу (пользуйтесь с умом!)
    dist?: "/dist" // Директория для сборки
});
```

## Создание асинхронных сторов {#async-stores}
Для организации получения данных на стороне сервера и клиента, библиотека предоставляет возможность создавать префетч-сторы, для упрощения работы с асинхронными запросами.

Пример создания стора:
```typescript
// useData.ts
import { ref } from "vue";
import { definePrefetchStore } from "lite-ssr/vue";

export const useData = definePrefetchStore('data', () => {
    // Инициализация стейтов
    const data = ref<null | any>(null);
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);

    // Инициализация асинхроных функций
    const fetchData = async (id: number) => {
        loading.value = true;

        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        
        if (response.ok) {
            data.value = await response.json();
        } else {
            data.value = null;
            error.value = true;
        }

        loading.value = false;
    };

    // Возвращаем стейты и функции
    return {
        data,
        loading,
        error,
        fetchData
    }
})
```

::: info
Префетч-сторы, как и сторы Pinia требуют уникального наименования. Это нужно для правильной передачи информации полученной на стороне SSR клиенту!
:::

Пример использования получившегося стора:
```html
<!--App.vue-->
<template>
    <div>
        <span v-if="loading">Загрузка данных...</span>
        <span v-else-if="error">Не удалось загрузить данные</span>
        <pre v-else>{{ serializedData }}</pre>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { useData } from "./useData";

    // Подключаем наш стор
    const { fetchData, data, loading, error } = useData(); 

    // Сериализуем данные для удобочитаемости
    const serializedData = computed( 
        () => data ? JSON.stringify(data, null, '\t') : ''
    )

    // Получаем данные при монтировании компонента
    fetchData(1);
</script>
```

::: info
Асинхронные методы, возвращаемые префетч-стором, являются асинхронными, однако на стороне SSR они регистрируются через хук `onPrefetch`, соответственно их нельзя использовать внутри других хуков *(прим. onMounted)*. И фактически, на стороне SSR эти методы ничего не вернут. На стороне клиента они работают как обычные асинхронные методы.
:::
<br />

## Префетч данных внутри компонента через useAsyncData (DEPRECATED)  {#async-data}

Библиотека так же предоставляет собственную альтернативу **useAsyncData** из Nuxt. Но мы настоятельно рекомендуем не использовать его, по причине низкой производительности

```html
<!--App.vue-->
<template>
    <div>
        <span v-if="loading">Загрузка данных...</span>
        <span v-else-if="error">Не удалось загрузить данные</span>
        <pre v-else>{{ serializedData }}</pre>
    </div>
</template>

<script setup lang="ts">
    import { computed, defineProps } from 'vue'
    import { useAsyncData } from "lite-ssr/vue";


    // Инициализируем асинхронный запрос
    const fetchTodo = async (id: number) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        if (!response.ok) throw new Error();
        return response.json();
    };

    // Выполняем запрос
    const { data, loading, error } = useAsyncData('data', () => fetchTodo(1));

    // Сериализуем данные для удобочитаемости
    const serializedData = computed( 
        () => data ? JSON.stringify(data, null, '\t') : ''
    )
</script>
```

::: warning
Повторим, мы крайне не рекомендуем использовать этот подход. Т.к. для отслеживания полученных значений функции требуется получать путь компонента, его пропсы и др. информацию для верной передачи этих данных на клиент. Вместо этого лучше используйте Префетч-сторы!
:::
<br />