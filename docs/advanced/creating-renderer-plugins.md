---
sidebar_position: 3
---
# Создание плагинов для генераторов

Плагины для генераторов `lite-ssr` предназначены для расширения функциональности конкретного генератора рендеринга. Они позволяют подписываться на пользовательские хуки, определённые разработчиком генератора, и использовать предоставляемый API.

Важно: плагины генераторов работают **только в рамках своего генератора**, и они не могут взаимодействовать с серверными сущностями напрямую.

---

## Общая структура плагина для генератора

Плагин создаётся с помощью метода `definePlugin` из пакета генератора (например, `@lite-ssr/vue/renderer` для Vue). Основные особенности:
- Каждый генератор может иметь собственные хуки.
- Плагин подписывается на доступные хуки с помощью метода `defineHook`.
- Настройки передаются через конфигурацию.

Пример базового плагина для генератора:

```ts
import { definePlugin } from "@lite-ssr/vue/renderer";

export const examplePlugin = definePlugin<any>(
    "example-plugin",
    ({ defineHook }, config) => {
        defineHook("init", ({ $app }) => {
            console.log("Плагин инициализирован с конфигурацией:", config);
        });
    }
);

export default examplePlugin;
```

---

## Эталонные хуки для генераторов

В таблице ниже приведён список стандартных хуков, предоставляемых эталонным генератором (например, Vue). Эти хуки можно использовать для создания плагинов.

| Хук                     | Аргументы предоставляемого объекта                   | Описание                                                                                     |
|-------------------------|-----------------------------------------------------|---------------------------------------------------------------------------------------------|
| `beforeProvideContext`  | `$app`, `$renderer`, `$entry`, `$config`, `url`     | Вызывается перед созданием контекста рендеринга. Используется для настройки окружения.      |
| `init`                  | `$app`, `$renderer`, `$entry`, `$config`, `url`     | Инициализация рендерера. Используется для регистрации плагинов или настройки приложений.    |
| `beforeRender`          | `$app`, `$renderer`, `$entry`, `$config`, `url`     | Вызывается перед началом процесса рендеринга.                                               |
| `beforeFillHtml`        | `$app`, `$renderer`, `$entry`, `$config`, `url`     | Вызывается перед заполнением HTML шаблона.                                                  |
| `fillHtml`              | `$app`, `$renderer`, `$entry`, `$config`, `url`     | Заполняет итоговый HTML данными, например, мета-тегами или атрибутами.                      |

---

### Детали предоставляемых аргументов

Все хуки предоставляют стандартный объект с параметрами:

- **`$app`** — экземпляр приложения (например, Vue App для генератора Vue).
- **`$renderer`** — инстанс генератора.
- **`$entry`** — путь к точке входа в приложение.
- **`$config`** — конфигурация LiteSSR.
- **`url`** — URL текущего запроса.

:::info
Генератор Vue предоставляет такие хуки, но другой генератор (например, для React) может определить свои собственные.
:::

---

## Пример: Плагин Unhead для генератора Vue

Далее представлен пример плагина для генератора Vue, который интегрирует библиотеку `unhead` для управления мета-тегами.

### Код плагина

```ts
import { definePlugin } from "@lite-ssr/vue/renderer";
import { renderSSRHead } from '@unhead/ssr';
import { createHead } from "@unhead/vue";
import { Head } from "@unhead/schema";

export const vueUnheadPlugin = definePlugin<Head>(
    "vue-unhead",
    ({ defineHook }, config) => {
        // Инициализация Unhead
        defineHook("init", ({ $app }) => {
            const head = createHead();
            $app.use(head);
            head.push(config); // Добавление начальных данных
        });

        // Настройка HTML-шаблона для вставки тегов
        defineHook("beforeFillHtml", ({ $renderer }) => {
            $renderer.html = $renderer.html
                .replace("<html", "<html<!--htmlAttrs--> ")
                .replace("<head>", "<head>\n<!--headTags--> ")
                .replace("<body", "<body<!--bodyAttrs-->")
                .replace("</body>", "<!--bodyTags-->\n</body>");
        });

        // Вставка содержимого мета-тегов в HTML
        defineHook("fillHtml", async ({ $app, $renderer }) => {
            const payload = await renderSSRHead(
                $app.config.globalProperties!.$head
            );
            let h = $renderer.html;
            Object.entries(payload).forEach(([key, value]) => {
                h = h.replace(`<!--${key}-->`, value as string);
            });
            $renderer.html = h;
        });
    }
);

export default vueUnheadPlugin;
```

### Разбор кода

1. **Хук `init`**:
   - Регистрирует `unhead` в приложении и добавляет начальные данные для управления мета-тегами.

2. **Хук `beforeFillHtml`**:
   - Настраивает HTML-шаблон, добавляя комментарии-местодержатели для вставки содержимого.

3. **Хук `fillHtml`**:
   - Выполняет финальное заполнение HTML, заменяя местодержатели реальными данными из `unhead`.

---

## Создание плагина как отдельного npm-пакета

Создание плагина для генератора как отдельного пакета аналогично процессу создания серверных плагинов. Основные шаги:

1. Инициализация npm-пакета.
2. Установка генератора (например, `@lite-ssr/vue/renderer`) в качестве зависимости.
3. Сборка и публикация.

Пример для плагина `vue-unhead`:

### Шаги

1. Инициализируйте проект:
   ```bash
   mkdir vue-unhead-plugin
   cd vue-unhead-plugin
   npm init -y
   ```

2. Установите зависимости:
   ```bash
   npm install @lite-ssr/vue/renderer @unhead/ssr @unhead/vue
   npm install --save-dev typescript
   ```

3. Настройте TypeScript:
   ```json
   {
       "compilerOptions": {
           "target": "ES2020",
           "module": "CommonJS",
           "strict": true,
           "declaration": true,
           "outDir": "dist",
           "esModuleInterop": true
       },
       "include": ["src"]
   }
   ```

4. Напишите код плагина в `src/index.ts` (пример см. выше).

5. Соберите проект:
   ```bash
   npm run build
   ```

6. Опубликуйте в npm:
   ```bash
   npm publish --access public
   ```

---

## Итоги

- Плагины для генераторов подписываются на хуки, определённые конкретным генератором.
- Разработчики генераторов имеют свободу в определении хуков.
- Плагины можно использовать как в рамках одного проекта, так и оформлять как отдельные npm-пакеты.