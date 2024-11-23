---
sidebar_position: 4
---
# Система хуков для генераторов

Генераторы в **lite-ssr** могут предоставлять систему хуков, чтобы позволить разработчикам подключать плагины и расширять функциональность генератора. Эта страница объясняет, как добавить такую систему в пользовательский генератор, используя условный генератор `CustomRenderer` в качестве примера.

---

## Основные концепции системы хуков

Система хуков состоит из двух основных компонентов:

1. **Определение хуков** – разработчики генератора создают набор хуков, доступных для подписки через плагины.
2. **Диспетчеризация хуков** – хуки вызываются в определённых точках выполнения генератора, передавая плагинам данные через параметры.

Для реализации хуков можно использовать класс `HookSystem`, предоставляемый библиотекой `lite-ssr/core`.

---

## Создание системы хуков для генератора

### Шаг 1: Определение типов хуков

Создайте интерфейс, описывающий доступные хуки и параметры, которые они предоставляют. 

```ts
// /utils/Hooks.ts

import { HookSystem } from "@lite-ssr/core/shared";

interface RendererHook {
    $renderer: CustomRenderer;
    $config: Record<string, any>;
    url: string;
}

interface RendererHookTypes {
    'init': RendererHook;
    'beforeRender': RendererHook;
    'afterRender': RendererHook;
}
```

Здесь мы описали хуки `init`, `beforeRender` и `afterRender`, которые предоставляют доступ к экземпляру рендера `$renderer`, конфигурации `$config` и текущему `url`.

---

### Шаг 2: Создание системы хуков

Используйте класс `HookSystem` для управления хуками. Добавьте методы для определения и диспетчеризации хуков.

```ts
// /utils/Hooks.ts

const rendererHookSystem = new HookSystem<RendererHookTypes>();

export function defineHook<K extends keyof RendererHookTypes>(
    hookName: K,
    handler: (params: RendererHookTypes[K]) => void | Promise<void>
) {
    rendererHookSystem.defineHook(hookName, handler);
}

export async function dispatchHook<K extends keyof RendererHookTypes>(
    hookName: K,
    params: RendererHookTypes[K]
) {
    await rendererHookSystem.dispatchHook(hookName, params);
}
```

---

### Шаг 3: Интеграция хуков в генератор

Добавьте вызовы `dispatchHook` в ключевые точки работы генератора. Это позволит плагинам реагировать на события генератора.

```ts
// /common/CustomRenderer.ts

import { Renderer } from "@lite-ssr/core";
import { defineHook, dispatchHook } from "./Hooks.js";

export class CustomRenderer extends Renderer {
    public defineHook = defineHook;

    protected hookData(url: string) {
        return {
            $renderer: this,
            $config: this.config,
            url,
        };
    }

    async renderApp(url: string): Promise<string> {
        // Вызываем хук инициализации
        await dispatchHook('init', this.hookData(url));

        // Основной процесс рендера (пример)
        const html = `<div id="app">` +  
                     `<h1>Hello from my LiteSSR Renderer!</h1>` +  
                     `<h2>Current URL: ${url}</h2>` +  
                     `<h3>Current entryPoint path: ${this.entryPoint}</h3>` +  
                     `</div>`;

        return html;
    }

    async generateHtml(url: string, template: string) {
        this.html = template;
        // Вызываем хук перед рендером
        await dispatchHook('beforeRender', this.hookData(url));

        await super.generateHtml(url, this.html);
        
        // Вызываем хук после рендера
        await dispatchHook('afterRender', this.hookData(url));

        return this.html;
    }

    getInitialState() {
        return {
            customProperty: {},
        };
    }
}
```

---

### Шаг 4: Экспорт генератора и плагинов

Для удобства работы с плагинами, добавьте метод `definePlugin` в ваш генератор, используя `defineRendererPlugin` из `lite-ssr`.

```ts
// /renderer.ts

import { CustomRenderer } from "./common/CustomRenderer.js";
import { defineRendererPlugin } from "@lite-ssr/core/shared";

const { definePlugin } = CustomRenderer;

export {
    CustomRenderer,
    definePlugin,
};
```

Теперь разработчики плагинов могут использовать `definePlugin` для создания плагинов, подписывающихся на хуки генератора.

---

## Итоговый пример использования

После интеграции системы хуков ваш генератор поддерживает плагины. Например:

```ts
// Пример плагина

import { definePlugin } from 'my-lssr-renderer/renderer'

export const examplePlugin = definePlugin('example-plugin', ({ defineHook }) => {
    defineHook('beforeRender', ({ $renderer, url }) => {
        console.log(`[BeforeRender Hook]: Рендеринг начался для URL ${url}`);
    });

    defineHook('afterRender', ({ $renderer }) => {
        console.log("[AfterRender Hook]: Рендеринг завершён!");
    });
});

export default examplePlugin;
```

Теперь плагины смогут подписываться на события `init`, `beforeRender` и `afterRender`, чтобы расширить функциональность генератора.