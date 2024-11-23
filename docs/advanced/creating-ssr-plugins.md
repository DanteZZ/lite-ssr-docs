# Создание плагинов для SSR

Плагины в `lite-ssr` позволяют расширять функциональность вашего приложения, подписываясь на доступные хуки. Каждый плагин может выполнять задачи, такие как добавление middleware, обработка запросов или настройка серверной логики. 

---

## Общая структура плагина

Плагин создаётся с помощью метода `definePlugin`. Он:
- Регистрирует уникальное имя.
- Использует функцию `defineHook` для подписки на доступные хуки.
- Получает настройки (конфигурацию) через переданные параметры.

Пример базовой структуры плагина:

```ts
import { definePlugin } from "lite-ssr";

export const examplePlugin = definePlugin<any>(
    "example", // Уникальное имя плагина
    ({ defineHook }, config) => {
        defineHook("afterInitializePlugins", ({ $app, $config }) => {
            console.log("Плагин инициализирован:", config);
        });
    }
);

export default examplePlugin;
```

---

## Пример: Плагин для прокси

Рассмотрим пример создания плагина, который добавляет прокси-сервер, используя библиотеку `http-proxy-middleware`. Этот плагин подписывается на хук `afterMiddlewares` и добавляет middleware для обработки запросов.

### Код плагина

```ts
import { definePlugin } from "lite-ssr";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";

type ProxySettings = {
    [key: string]: Options;
} | Array<[string, Options]>;

export const proxyPlugin = definePlugin<ProxySettings>(
    "proxy",
    ({ defineHook }, config) => {
        defineHook("afterMiddlewares", ({ $app }) => {
            const items: Array<[string, Options]> = Array.isArray(config)
                ? config
                : Object.entries(config);

            items.forEach(([path, opts]) => {
                $app.use(path, createProxyMiddleware(opts));
            });
        });
    }
);

export default proxyPlugin;
```

### Разбор кода

1. **Подписка на хук**:
   - Хук `afterMiddlewares` используется для добавления middleware после всех основных middleware сервера.

2. **Конфигурация**:
   - Плагин принимает конфигурацию в формате объекта или массива кортежей, где ключи — пути, а значения — параметры прокси.

---

## Список доступных хуков

Ваши плагины могут подписываться только на существующие хуки. Вот их список:

### Описание хуков

| Хук                     | Аргументы предоставляемого объекта          | Описание                                                                 |
|-------------------------|---------------------------------------------|--------------------------------------------------------------------------|
| `afterInitializePlugins`| `$app`, `$config`, `$entry`, `$renderCreator`| Вызывается после инициализации всех плагинов.                           |
| `beforeMiddlewares`     | `$app`, `$config`, `$entry`, `$renderCreator`| Вызывается перед добавлением middleware.                                |
| `afterMiddlewares`      | `$app`, `$config`, `$entry`, `$renderCreator`| Вызывается после добавления middleware.                                 |
| `request`               | `$app`, `$config`, `$entry`, `$renderer`, `url`, `req`, `res` | Обрабатывает запрос перед началом рендеринга.                    |
| `renderStart`           | `$app`, `$config`, `$entry`, `$renderer`, `url`, `req`, `res` | Вызывается в начале процесса рендеринга.                                |
| `renderEnd`             | `$app`, `$config`, `$entry`, `$renderer`, `url`, `req`, `res` | Вызывается после завершения процесса рендеринга.                        |
| `beforeResponse`        | `$app`, `$config`, `$entry`, `$renderer`, `url`, `req`, `res` | Вызывается перед отправкой ответа клиенту.                              |
| `afterResponse`         | `$app`, `$config`, `$entry`, `$renderer`, `url`, `req`, `res` | Вызывается после отправки ответа клиенту.                               |

---

## Создание плагина как отдельного npm-пакета

Если вы хотите использовать плагин в нескольких проектах, лучше оформить его как отдельный npm-пакет.

### Шаги:

1. Создайте проект и настройте TypeScript.
2. Перенесите код плагина.
3. Скомпилируйте и опубликуйте пакет.

### Пример

Для примера используем ранее описанный `proxyPlugin`.

#### Инициализация проекта

```bash
mkdir lite-ssr-plugin-proxy
cd lite-ssr-plugin-proxy
npm init -y
npm install lite-ssr http-proxy-middleware
npm install --save-dev typescript @types/node
```

#### Настройка TypeScript

Добавьте файл `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Код плагина

Создайте файл `src/index.ts`:

```ts
import { definePlugin } from "lite-ssr";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Options } from "http-proxy-middleware";

type ProxySettings = {
    [key: string]: Options;
} | Array<[string, Options]>;

export const proxyPlugin = definePlugin<ProxySettings>(
    "proxy",
    ({ defineHook }, config) => {
        defineHook("afterMiddlewares", ({ $app }) => {
            const items: Array<[string, Options]> = Array.isArray(config)
                ? config
                : Object.entries(config);

            items.forEach(([path, opts]) => {
                $app.use(path, createProxyMiddleware(opts));
            });
        });
    }
);

export default proxyPlugin;
```

#### Сборка и публикация

1. Добавьте скрипт сборки:
   ```json
   "scripts": {
       "build": "tsc"
   }
   ```

2. Соберите пакет:
   ```bash
   npm run build
   ```

3. Опубликуйте пакет в npm:
   ```bash
   npm login
   npm publish --access public
   ```

---

Теперь ваш плагин можно установить и использовать в других проектах:

```bash
npm install lite-ssr-plugin-proxy
```

Пример использования:

```ts
import { proxyPlugin } from "lite-ssr-plugin-proxy";

const config = {
    plugins: [
        proxyPlugin({
            "/api": { target: "http://api.server", changeOrigin: true },
        }),
    ],
};

export default config;
```

---

## Итоги

- Плагины `lite-ssr` подписываются на существующие хуки и могут использовать сторонние библиотеки.
- Каждый плагин регистрируется через `definePlugin` и получает настройки через конфигурацию.
- Для многократного использования плагин удобно оформлять как npm-пакет.