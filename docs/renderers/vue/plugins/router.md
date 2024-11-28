---
sidebar_position: 1
title: Vue Router
---

# Vue Router

:::info
Для использования vue-router в проекте с `@lite-ssr/vue`, не требуется устанавливать отдельный `rendererPlugin`, так как `@lite-ssr/vue` из коробки проверяет наличие `vue-router` и автоматически настраивает серверную сторону без прямой зависимости от `vue-router`.
:::

## Установка

Для начала необходимо установить `vue-router`:

```bash
pnpm i vue-router
```

## Настройка роутера

При создании роутера нужно учитывать, что для SSR используется история на основе `memoryHistory`, а для браузера — `webHistory`.

### Создание роутера

```ts
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const baseUrl = import.meta.env.BASE_URL
const history = import.meta.env.SSR ? createMemoryHistory(baseUrl) : createWebHistory(baseUrl)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/pages/Home.vue')
    }
]

const router = createRouter({
  history,
  routes
})

export default router
```

:::warning
На стороне сервера используется `memoryHistory`, на клиенте — `webHistory`. Это обязательное условие для корректной работы SSR.
:::

### Подключение роутера в приложение

После того как роутер создан, подключите его к приложению в вашем `entry` файле.

```ts
import { createApp } from '@lite-ssr/vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

app.mount('#app')

export default app
```

## Асинхронная загрузка роутов

Если вы хотите загружать маршруты асинхронно, например, из внешнего API, можно использовать асинхронную регистрацию приложения. Это позволяет загрузить маршруты только когда они реально понадобятся.

### Асинхронное создание роутера

```ts
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

const baseUrl = import.meta.env.BASE_URL
const history = import.meta.env.SSR ? createMemoryHistory(baseUrl) : createWebHistory(baseUrl)

export async function getRouter() {
    const routes = await getSomeAsyncRoutes() // Метод, который возвращает маршруты асинхронно
    return createRouter({
        history,
        routes
    })
}
```

### Использование асинхронного роутера в `entry` файле

В вашем `entry` файле используйте асинхронную регистрацию приложения:

```ts
import { createApp, defineAsyncApp } from '@lite-ssr/vue'
import App from './App.vue'
import { getRouter } from './router'

export default defineAsyncApp(async () => {
    const app = createApp(App)
    const router = await getRouter()
    app.use(router)
    app.mount('#app')
    return app
})
```

---

## Заключение

Благодаря архитектуре Lite SSR, регистрация роутов может быть асинхронной, что позволяет динамически загружать маршруты, например, из внешнего API. Это решение работает не только в разработке, но и на production-сервере, в отличие от других реализаций SSR, где обычно требуется заранее определять все маршруты. Это дает гибкость в создании более масштабируемых приложений, где маршруты могут быть подгружены в рантайме.