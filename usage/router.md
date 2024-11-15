## 🧑‍💻**vue-router, unhead и нестандартное использование**

Здесь описаны различные примеры использования фреймворка

### Регистрация vue-router
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