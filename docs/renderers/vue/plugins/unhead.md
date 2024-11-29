---
sidebar_position: 2
title: Unhead
---

# Unhead (@lite-ssr/vue-unhead)

Плагин `@lite-ssr/vue-unhead` интегрирует библиотеку `@unhead/vue` для динамического изменения содержимого `<head>` в проекте, используя возможности серверного рендеринга. Этот плагин позволяет вам управлять мета-тегами, титулами страниц и другими элементами `<head>` в вашем приложении на Vue.

## Установка

Чтобы установить и настроить плагин, выполните следующие шаги:

### Шаг 1: Установите необходимые зависимости

Установите `@unhead/vue` и `@lite-ssr/vue-unhead` в ваш проект:

```bash
pnpm i @unhead/vue @lite-ssr/vue-unhead
```

### Шаг 2: Подключите плагин в `lssr.config.ts`

В вашем конфигурационном файле `lssr.config.ts` подключите плагин `vueUnheadPlugin` и настройте его, указав нужные параметры для мета-данных.

```ts
import { defineLssrConfig } from "lite-ssr";
import { vueUnheadPlugin } from "@lite-ssr/vue-unhead";

export default defineLssrConfig({
    renderer: VueRenderer,
    rendererPlugins: [
        vueUnheadPlugin({
            title: "My LiteSSR Vue app",  // Настроенный титул по умолчанию
        })
    ]
});
```

---

## Использование в проекте

### Автоматическое создание `head`

Когда вы используете плагин `@lite-ssr/vue-unhead`, вам не нужно вручную создавать объект `createHead` в приложении — это делает плагин автоматически при инициализации рендера. Таким образом, вы можете сразу использовать возможности управления мета-данными.

### Пример использования в компоненте Vue

```html
<script setup lang="ts">
import { useHead } from '@unhead/vue';

// Устанавливаем динамический заголовок страницы
useHead({
    title: "SomePageTitle"  // Название страницы будет установлено динамически
});
</script>
```

### Пример использования с префетч-данными

Если вам нужно динамически менять титул страницы в зависимости от данных, полученных с сервера, используйте следующий подход:

```html
<script setup lang="ts">
import { useTodo } from '../composables/useTodo';
import { useHead } from '@unhead/vue';

// Используем хук для получения и загрузки данных
const { todo, fetchTodo } = useTodo();
await fetchTodo(1);

// Динамически обновляем титул в зависимости от полученного todo
useHead({
    title: () => todo.value?.title  // Заголовок будет зависеть от данных
});
</script>
```

## Параметры конфигурации

Полный список параметров для `@unhead/vue` можно найти в [официальной документации Unhead](https://unhead.dev/) или в разделе [API @unhead/vue](https://unhead.dev/docs).

---

## Примечания

- Плагин `@lite-ssr/vue-unhead` обрабатывает изменения в `<head>` на стороне сервера во время рендеринга, поэтому все мета-данные и заголовки будут автоматически обновляться в зависимости от текущего состояния приложения.