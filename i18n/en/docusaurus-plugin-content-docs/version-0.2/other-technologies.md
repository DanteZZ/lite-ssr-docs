---
sidebar_position: 3
---
# 🧑‍💻 **vue-router, unhead, and Custom Usage** {#other-technologies}

This section describes various use cases for the framework.

## vue-router Registration {#vue-router-registration}
When registering the router, it's important to correctly register the history. Here's an example:

```ts
// router.ts
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import routes from './routes';

const baseUrl = import.meta.env.BASE_URL // Get baseUrl from meta.env
const history = import.meta.env.SSR ? 
    createMemoryHistory(baseUrl) :  // For SSR, register createMemoryHistory
    createWebHistory(baseUrl) // For client, use standard createWebHistory

const router = createRouter({
  history,
  routes
})

export default router
```

## @unhead/vue Registration {#vue-unhead-registration}

Although the library supports unhead, it doesn't have a direct dependency on it. Therefore, you need to manually register it on the client side:

```ts
// main.ts
import { createApp } from 'lite-ssr/vue'
import App from './app/App.vue'
import { createHead } from '@unhead/vue'

const app = createApp(App)
app.use(createHead()) // Register @unhead/vue
app.mount('#app');

export default app;
```

## Asynchronous App Registration {#async-app-registration}

If you need to asynchronously fetch data before registering the app (such as plugin configuration, etc.), you can use `defineAsyncApp`:

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

## Custom index.html {#custom-index-html}

The framework has its own `index.html`, based on which the final HTML file is generated. In general, you can include libraries either through the app itself or in the `head` section of `lssr.config.ts`.

If you still need to specify your own `index.html` implementation, you must add the corresponding path in the `lssrVite` plugin configuration:

```typescript
lssrVite({
    head: "./index.html"
})
```

Default `index.html`:

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