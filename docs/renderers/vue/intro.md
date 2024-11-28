---
sidebar_position: 1
title: Начало работы
---

# Начало работы с LiteSSR + Vue 3

LiteSSR позволяет легко интегрировать серверный рендеринг в проекты на Vue 3. В этом руководстве вы узнаете, как настроить проект для работы с LiteSSR.

:::warning Важно!
Для корректной работы используйте **Node.js** версии не ниже 20 и **pnpm** для управления зависимостями.
:::

---

## Инициализация проекта

Создайте новый проект на базе Vite и Vue:

```bash
pnpm create vite
```

Во время настройки выберите:
- **Язык**: TypeScript (рекомендуется, но можно выбрать JavaScript)
- **Фреймворк**: Vue 3

---

## Установка зависимостей

Установите основную библиотеку LiteSSR и генератор для Vue:

```bash
pnpm i lite-ssr @lite-ssr/vue
```

---

## Настройка проекта

### 1. Изменение `src/main.ts`

Обновите файл `src/main.ts`, чтобы использовать `createApp` из `@lite-ssr/vue` и настроить экспорт приложения:

```ts
import { createApp } from '@lite-ssr/vue';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');

export default app; // Обязательно экспортируем app
```

> **Почему это важно?**  
> Экспорт приложения необходим для использования общего entry-файла как для рендеринга на сервере, так и на клиенте, а также для передачи префетч-данных между ними.

---

### 2. Создание конфигурации LiteSSR

Создайте файл `lssr.config.ts` в корневой директории проекта:

```ts
import { defineLssrConfig } from 'lite-ssr';
import { VueRenderer } from '@lite-ssr/vue';

export default defineLssrConfig({
    renderer: VueRenderer, // Используем VueRenderer
    entry: '/src/main.ts', // Указываем путь к entry-файлу
});
```

---

### 3. Обновление `tsconfig.node.json`

Добавьте файл конфигурации в `tsconfig.node.json`, чтобы избежать ошибок типов:

```json
{
  "include": ["lssr.config.ts"]
}
```

---

### 4. Настройка скриптов в `package.json`

Обновите команды сборки и запуска проекта в `package.json`:

```json
{
  "scripts": {
    "dev": "lssr",
    "build": "lssr --build",
    "serve": "lssr --serve"
  }
}
```

---

## Запуск проекта

### Режим разработки
Для запуска проекта в dev-режиме используйте команду:

```bash
pnpm run dev
```

### Сборка проекта
Для сборки готового проекта выполните:

```bash
pnpm run build
```

### Запуск в production-режиме
Для запуска проекта в production используйте:

```bash
pnpm run serve
```

---

Теперь ваш проект настроен для работы с LiteSSR и Vue 3. Наслаждайтесь простым и удобным серверным рендерингом!