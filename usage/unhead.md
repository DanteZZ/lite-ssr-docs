## 🧑‍💻**vue-router, unhead и нестандартное использование**

Здесь описаны различные примеры использования фреймворка

### Регистрация @unhead/vue

Не смотря на то, что библиотека поддерживает unhead, прямой зависимости от него он не имеет, по этому на стороне клиента его нужно зарегистрировать самостоятельно:


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