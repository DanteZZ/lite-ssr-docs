---
sidebar_position: 1
---
# 🗒️ **Getting Started**

## **Installation** {#installation}

1. Install dependencies (**Vue**):
```bash
pnpm i lite-ssr @unhead/vue 
```

2. Replace `createApp` with `createApp` from lite-ssr and export the app:

```ts
import { createApp } from 'lite-ssr/vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app');

export default app // Make sure to export app
```

::: info
Exporting the app is required so that lite-ssr can use a single entry file to render the app on both the server and client, as well as to pass pre-fetched data between the server and client.
:::

3. Create the configuration file `/lssr.config.ts`

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

4. Add the configuration file to `tsconfig.node.json`

```json
// tsconfig.node.json
{
  ...
  "include": ["lssr.config.ts"]
}
```

5. Modify the start and build scripts in `package.json`

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

## **Running the Project** {#run-app}
<br />
Run in dev mode:

```bash
pnpm run dev
```

Build the project:

```bash
pnpm run build
```

Run the project in production mode:

```bash
pnpm run serve
```

<br />

---