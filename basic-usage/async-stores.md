## 🔎 **ИСПОЛЬЗОВАНИЕ**

### Создание асинхронных сторов
> Для организации получения данных на стороне сервера и клиента, библиотека предоставляет возможность создавать префетч-сторы, для упрощения работы с асинхронными запросами

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

**! ВАЖНАЯ ИНФОРМАЦИЯ !**
> Префетч-сторы, как и сторы Pinia требуют уникального наименования. Это нужно для правильной передачи информации полученной на стороне SSR клиенту !

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

> **Важная информация**! Асинхронные методы возвращаемые префетч-стором, являются асинхронными, однако на стороне SSR они регистрируются через хук `onPrefetch`, соответственно их нельзя использовать внутри других хуков *(прим. onMounted)*. И ффактически, на стороне SSR эти методы ничего не вернут. На стороне клиента они работают как обычные асинхронные методы.
<br />