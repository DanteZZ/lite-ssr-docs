---
sidebar_position: 2
---
# 🔎 **USAGE**  {#basic-usage}

## LSSR Configuration {#lssr-config}
```typescript
// lssr.config.ts
import { defineLssrConfig } from "lite-ssr";

export default defineLssrConfig({
    entry?: "/src/main.ts", // Optional, path to the app initialization file
    head?: { // Optional, unhead configuration (https://unhead.unjs.io/usage/composables/use-head#input)
        title: "My LSSR App"
    },
    html?: "/index.html", // Optional, path to a custom HTML file (use wisely!)
    dist?: "/dist" // Directory for build output
});
```

## Creating Asynchronous Stores {#async-stores}
To organize data fetching on both the server and client side, the library provides the ability to create prefetch stores to simplify working with asynchronous requests.

Example of creating a store:
```typescript
// useData.ts
import { ref } from "vue";
import { definePrefetchStore } from "lite-ssr/vue";

export const useData = definePrefetchStore('data', () => {
    // Initializing states
    const data = ref<null | any>(null);
    const loading = ref<boolean>(false);
    const error = ref<boolean>(false);

    // Initializing asynchronous functions
    const fetchData = async (id: number) => {
        loading.value = true;

        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        
        if (response.ok) {
            data.value = await response.json();
        } else {
            data.value = null;
            error.value = true;
        }

        loading.value = false;
    };

    // Returning states and functions
    return {
        data,
        loading,
        error,
        fetchData
    }
})
```

::: info
Prefetch stores, like Pinia stores, require unique naming. This is necessary for the proper transfer of data received on the SSR side to the client!
:::

Example of using the created store:
```html
<!--App.vue-->
<template>
    <div>
        <span v-if="loading">Loading data...</span>
        <span v-else-if="error">Failed to load data</span>
        <pre v-else>{{ serializedData }}</pre>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { useData } from "./useData";

    // Connecting our store
    const { fetchData, data, loading, error } = useData(); 

    // Serializing data for readability
    const serializedData = computed( 
        () => data ? JSON.stringify(data, null, '\t') : ''
    )

    // Fetching data on component mount
    fetchData(1);
</script>
```

::: info
The asynchronous methods returned by a prefetch store are asynchronous. However, on the SSR side, they are registered via the `onPrefetch` hook, so they cannot be used inside other hooks (e.g., `onMounted`). In fact, on the SSR side, these methods will return nothing. On the client side, they work as regular asynchronous methods.
:::
<br />

## Prefetching Data Inside a Component via useAsyncData (DEPRECATED)  {#async-data}

The library also provides its own alternative to **useAsyncData** from Nuxt. However, we strongly recommend not using it due to its poor performance.

```html
<!--App.vue-->
<template>
    <div>
        <span v-if="loading">Loading data...</span>
        <span v-else-if="error">Failed to load data</span>
        <pre v-else>{{ serializedData }}</pre>
    </div>
</template>

<script setup lang="ts">
    import { computed, defineProps } from 'vue'
    import { useAsyncData } from "lite-ssr/vue";


    // Initializing the asynchronous request
    const fetchTodo = async (id: number) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
        if (!response.ok) throw new Error();
        return response.json();
    };

    // Performing the request
    const { data, loading, error } = useAsyncData('data', () => fetchTodo(1));

    // Serializing data for readability
    const serializedData = computed( 
        () => data ? JSON.stringify(data, null, '\t') : ''
    )
</script>
```

::: warning
We repeat, we strongly advise against using this approach. Since tracking the obtained values requires the function to receive the component’s path, props, and other information for proper data transfer to the client. Instead, it is better to use Prefetch Stores!
:::
<br />