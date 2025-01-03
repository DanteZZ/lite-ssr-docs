---
sidebar_position: 3
title: Асинхронные данные
---

# Выполнение асинхронных методов на стороне SSR

В **LiteSSR** работа с асинхронными данными на стороне серверного рендеринга (SSR) упрощена благодаря предоставлению метода `definePrefetchStore`. Этот метод позволяет создавать сторы, в которых асинхронные методы автоматически оборачиваются в `onPrefetch`, что облегчает выполнение запросов и обработку данных как на сервере, так и на клиенте.

## definePrefetchStore

Метод `definePrefetchStore` предназначен для создания префетч-сторов, которые управляют асинхронными операциями в вашем приложении. Это позволяет эффективно загружать и передавать данные между сервером и клиентом, сохраняя при этом производительность и удобство разработки.

### Создание Prefetch Store

Для создания префетч-стора необходимо выполнить следующие шаги:

```ts
import { ref } from "vue";
import { definePrefetchStore } from "@lite-ssr/vue";

export const useTodo = definePrefetchStore('todo', () => {
    // Инициализация состояний
    const todo = ref<null | any>(null);
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);

    // Инициализация асинхронных функций
    const fetchTodo = async (id: number) => {
        loading.value = true;

        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        
        if (response.ok) {
            todo.value = await response.json();
        } else {
            todo.value = null;
            error.value = true;
        }

        loading.value = false;
    };

    // Возвращаем состояния и функции
    return {
        todo,
        loading,
        error,
        fetchTodo
    }
})
```

### Описание реализации

В приведённом примере мы создаём префетч-стор `useTodo` с помощью метода `definePrefetchStore`. Этот стор включает следующие компоненты:

- **Состояния (`ref`)**:
  - `todo`: хранит данные задачи.
  - `loading`: индикатор загрузки данных.
  - `error`: индикатор ошибки при загрузке данных.

- **Асинхронные функции**:
  - `fetchTodo`: функция для получения данных задачи по её идентификатору. Она обновляет состояния `loading`, `todo` и `error` в зависимости от результата запроса.

Этот подход позволяет централизованно управлять асинхронными операциями, обеспечивая их выполнение как на сервере, так и на клиенте.

:::info
**Префетч-сторы**, аналогичные сторам в Pinia, требуют уникального наименования. Это необходимо для корректной передачи данных, полученных на стороне SSR, клиенту.
:::

### Использование Prefetch Store в компоненте

После создания префетч-стора, его можно использовать в компонентах для выполнения асинхронных операций и отображения данных.

```html
<template>
    <div>
        <span v-if="loading">Загрузка данных...</span>
        <span v-else-if="error">Не удалось загрузить данные</span>
        <pre v-else>{{ serializedData }}</pre>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { useTodo } from "./useTodo";

    // Подключаем наш стор
    const { fetchTodo, todo, loading, error } = useTodo(); 

    // Сериализуем данные для удобочитаемости
    const serializedData = computed(() => todo.value ? JSON.stringify(todo.value, null, '\t') : '');

    // Получаем данные при монтировании компонента
    await fetchTodo(1);
</script>
```

### Описание использования

В данном примере мы используем префетч-стор `useTodo` внутри компонента для выполнения асинхронного запроса и отображения данных:

- **Импортируем стор**: Подключаем `useTodo` для доступа к состояниям и функциям.
- **Сериализация данных**: Используем `computed` для преобразования полученных данных в строку для удобного отображения.
- **Инициация запроса**: При монтировании компонента вызываем `fetchTodo` для получения данных задачи с идентификатором `1`.

## useAsyncData

Библиотека также предоставляет собственную альтернативу `useAsyncData` из **Nuxt**. Однако, мы настоятельно рекомендуем не использовать этот подход из-за низкой производительности и потенциальных проблем с оптимизацией.

### Пример использования useAsyncData

```html
<!-- App.vue -->
<template>
    <div>
        <span v-if="loading">Загрузка данных...</span>
        <span v-else-if="error">Не удалось загрузить данные</span>
        <pre v-else>{{ serializedData }}</pre>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useAsyncData } from "@lite-ssr/vue";

    // Инициализируем асинхронный запрос
    const fetchTodo = async (id: number) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
    };

    // Выполняем запрос
    const { data, loading, error } = await useAsyncData('todo', () => fetchTodo(1));

    // Сериализуем данные для удобочитаемости
    const serializedData = computed(() => data.value ? JSON.stringify(data.value, null, '\t') : '');
</script>
```

### Предупреждение при использовании useAsyncData

:::warning
Мы крайне не рекомендуем использовать `useAsyncData` из-за его низкой производительности. Для отслеживания полученных данных требуется получать путь компонента, его пропсы и другую информацию для корректной передачи данных на клиент. Вместо этого предпочтительнее использовать префетч-сторы, которые обеспечивают более эффективное управление асинхронными данными.
:::

## Заключение

Работа с асинхронными данными упрощена благодаря методам `definePrefetchStore` и `useAsyncData`. Однако, для обеспечения высокой производительности и оптимизации рекомендуется использовать префетч-сторы. Они предоставляют гибкий и эффективный способ управления асинхронными операциями, обеспечивая плавную работу как на сервере, так и на клиенте.