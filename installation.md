# **Установка** {#installation}

1. Установка зависимостей (**Vue**):
```bash
pnpm i lite-ssr @unhead/vue 
```

2. Заменяем `createApp` на `createApp` из lite-ssr и экспортируем приложение

```ts
import { createApp } from 'lite-ssr/vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app');

export default app // Обязательно экспортируем app
```

> Экспортировать приложение требуется для того, чтобы lite-ssr мог использовать один entry-файл для рендера приложения на сервере и клиенте, а так же для проброса префетч-данных между сервером и клиентом.

3. Создание файла конфигурации `/lssr.config.ts`

``` ts
// lssr.config.ts
import { defineLssrConfig } from "lite-ssr";

export default defineLssrConfig({
    entry: "/src/main.ts",
    head: {
        title: "LSSR App"
    }
});
```

4. Добавляем файл конфигурации в`tsconfig.node.json`

```json
// tsconfig.node.json
{
  ...
  "include": ["lssr.config.ts"]
}

```

5. Меняем команды запуска и сборки в `package.json`

```json
{
    "scripts": {
        "dev": "lssr --framework=vue",
        "build": "lssr --framework=vue --build",
        "serve": "lssr --framework=vue --serve",
    },
}
```

<br />

<h2>Запуск проекта</h2>
<br />
Запуск в dev-режиме:

```bash
pnpm run dev
```

Сборка проекта:

```bash
pnpm run build
```

Запуск проекта в production-режиме:

```bash
pnpm run serve
```

<br />

---