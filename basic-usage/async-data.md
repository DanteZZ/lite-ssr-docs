## 🔎 **ИСПОЛЬЗОВАНИЕ**

### Префетч данных внутри компонента через useAsyncData (ОСУЖДАЕМ!)
> Библиотека так же предоставляет собственную альтернативу **useAsyncData** из Nuxt. Но мы настоятельно рекомендуем не использовать его, по причине низкой производительности

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

> Повторимся, мы крайне не рекомендуем использовать этот подход. Т.к. для отслеживания полученных значений функции требуется получать путь компонента, его пропсы и др. информацию для верной передачи этих данных на клиент. Вместо этого лучше используйте Префетч-сторы!
<br />