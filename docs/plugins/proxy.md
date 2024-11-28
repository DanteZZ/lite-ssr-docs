---
sidebar_position: 1
title: Proxy
---

# Proxy (@lite-ssr/proxy)

:::info
`@lite-ssr/proxy` использует библиотеку [`http-proxy-middleware`](https://www.npmjs.com/package/http-proxy-middleware) и её конфигурации.
:::

Для начала работы с прокси установите библиотеку `@lite-ssr/proxy`:

```bash
pnpm i @lite-ssr/proxy
```

Затем настройте прокси в вашем `lssr.config.ts`:

```ts
import { defineLssrConfig } from "lite-ssr";
import { VueRenderer } from "@lite-ssr/vue/renderer";
import proxyPlugin from "@lite-ssr/proxy";

export default defineLssrConfig({
    renderer: VueRenderer,
    plugins: [
        proxyPlugin({
            '/api': {
                target: 'https://jsonplaceholder.typicode.com',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                },
            }
        })
    ],
});
```

### Конфигурация Proxy

Конфигурация прокси может быть установлена через объект, как показано выше, или через массив с кортежами:

```ts
proxyPlugin([
    [
        '/api',
        {
            target: 'https://jsonplaceholder.typicode.com',
            changeOrigin: true,
            pathRewrite: {
                '/api/todos': '/todos',
                '/api/users': '/users'
            },
        }
    ]
])
```

## Использование с axios и ofetch

Если вы используете `axios` или `ofetch`, необходимо подключить соответствующие **requestResolver'ы** для корректной работы с прокси.

### Пример для axios:

```ts
import { axiosSsrRequestResolver } from "@lite-ssr/proxy/shared";
import axios from "axios";

const axiosApi = axios.create({
    baseURL: "/api/v1"
});

axiosApi.interceptors.request.use(axiosSsrRequestResolver); // Подключаем requestResolver

export {
    axiosApi
}
```

### Пример для ofetch:

```ts
import { ofetchSsrRequestResolver } from "@lite-ssr/proxy/shared";
import { ofetch } from 'ofetch';

const ofetchApi = ofetch.create({
    baseURL: '/api/v1',
    onRequest: ofetchSsrRequestResolver, // Подключаем requestResolver
});

export {
    ofetchApi
}
```

:::note[Почему это важно?]
Со стороны браузера, при запросах с относительными путями, браузер сам подставляет недостающую часть URL (например, `http://localhost:3000`). Однако на сервере SSR не может самостоятельно подставить недостающую часть пути, так как Node.js не предоставляет возможности отлавливать все запросы и модифицировать их. Для этого библиотека `@lite-ssr/proxy` предоставляет **requestResolver'ы**, которые перенаправляют относительные пути на сервер.
:::

## Пример кастомного requestResolver'а

Если вам нужно подключить другую библиотеку запросов, вы можете создать свой собственный `requestResolver`:

```ts
const requestSsrResolver = <T>(options: T): T => {
    const opts: any = options;
    if (typeof window === 'undefined') { // Проверка, что работа производится на стороне SSR
        if (opts.baseURL && !/^https?:\/\//i.test(opts.baseURL)) {
            const base = `http://localhost:${process.env.LSSR_PORT}`;
            opts.baseURL = `${base}${opts.baseURL}`;
        }
    }
    return opts as T;
}
```

Теперь с помощью прокси вы можете эффективно управлять относительными путями на сервере, обеспечивая совместимость с клиентской и серверной стороной вашего приложения.