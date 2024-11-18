# 🧑‍💻**vue-router, unhead и нестандартное использование** {#other-technologies}

Здесь описаны различные примеры использования фреймворка

## Регистрация vue-router {#vue-router-registration}
При регистрации роутера, необходимо правильно зарегистрировать history. Пример использования:

```ts
// router.ts
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import routes from './routes';

const baseUrl = import.meta.env.BASE_URL // Берём baseUrl из meta.env
const history = import.meta.env.SSR ? 
    createMemoryHistory(baseUrl) :  // Для SSR регистрируем createMemoryHistory
    createWebHistory(baseUrl) // Для клиента стандартно

const router = createRouter({
  history,
  routes
})

export default router
```

## Регистрация @unhead/vue {#vue-unhead-registration}

Несмотря на то, что библиотека поддерживает unhead, прямой зависимости от него он не имеет, по этому на стороне клиента его нужно зарегистрировать самостоятельно:


```ts
// main.ts
import { createApp } from 'lite-ssr/vue'
import App from './app/App.vue'
import { createHead } from '@unhead/vue'

const app = createApp(App)
app.use(createHead()) // Регистрируем @unhead/vue
app.mount('#app');

export default app;
```

## Асинхронная регистрация приложения {#async-app-registration}

Если вам требуется асинхронно получить данные, для регистрации приложения (конфигурации плагинов, и т.д.), вы можете использовать `defineAsyncApp`:


```ts
// main.ts
import { createApp, defineAsyncApp } from 'lite-ssr/vue'
import App from './app/App.vue'
import { getRouter } from './app/router'

export default defineAsyncApp(async () => {
    const app = createApp(App)
    const router = await getRouter();

    app.use(router);
    app.mount('#app');

    return app;
})
```


## Кастомный index.html {#custom-index-html}

Фреймворк имеет собственный index.html, на основе которого генерируется конечный html файл. В целом подключение библиотек можно сделать через само приложение, либо в секции `head` в `lssr.config.ts`.

Если вам всё-таки требуется указать собственную реализацию index.html, необходимо добавить соответствующий путь в конфигурацию плагина `lssrVite`:
```typescript
lssrVite({
    head: "./index.html"
})
```

Стандартный `index.html`:
```html
<!DOCTYPE html>
<html<!--htmlAttrs-->>
  <head>
    <!--headTags-->
    <!--preload-links-->
    <!--entry-styles-->
  </head>
  <body<!--bodyAttrs-->>
    <!--bodyTagsOpen-->
    <div id="app">
      <!--app-html-->
    </div>
    <!--initial-state-->
    <!--entry-scripts-->
    <!--bodyTags-->
  </body>
</html>
```