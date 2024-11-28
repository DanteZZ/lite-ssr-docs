---
sidebar_position: 3
title: Axios/ofetch
---

# Использование axios, ofetch

:::info
Для использования axios или ofetch, не требуется устанавливать отдельный rendererPlugin, эти библиотеки работают и на стороне SSR, и на стороне браузера.
:::

Lite SSR не требует от разработчика использовать собственные модифицированные библиотеки для работы с запросами, так что вы можете использовать любую библиотеку в исходном виде. Однако если вам нужно работать с относительными путями (например, при проксировании, как `/api/v1` вместо `https://example.com/api/v1`), необходимо подключить соответствующий **requestResolver**.

## Установка библиотеки для работы с проксированием

Для работы с проксированием установите библиотеку `@lite-ssr/proxy`:

```bash
pnpm i @lite-ssr/proxy
```

Затем подключите нужный **requestResolver** для вашей библиотеки запросов.

## Пример использования для axios

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

## Пример использования для ofetch

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

Этот `requestResolver` будет подставлять нужный базовый URL для запросов, если запрос выполняется на сервере, и использовать относительные пути для запросов в приложении на клиентской стороне.

---

Теперь вы можете гибко работать с запросами, используя axios или ofetch на обеих сторонах (SSR и браузере), и правильно обрабатывать относительные пути с помощью `requestResolver`.