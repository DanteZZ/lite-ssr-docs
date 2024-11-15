## 🧑‍💻**vue-router, unhead и нестандартное использование**

Здесь описаны различные примеры использования фреймворка

### Асинхронная регистрация приложения

Если вам требуется асинхронно получить данные, для регистрации приложения. (Конфигурации плагинов и т.д.), вы можете использовать `defineAsyncApp`:


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