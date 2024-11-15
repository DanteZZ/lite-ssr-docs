## 🧑‍💻**vue-router, unhead и нестандартное использование**

Здесь описаны различные примеры использования фреймворка

### Кастомный index.html
Фреймворк имеет собственный index.html, на основе которого генерируется конечный html файл. В целом подключение библиотек можно сделать через само приложение, либо в секции `head`в `lssr.config.ts`.

Если вам всё-таки требуется указать собственную реализацию index.html, необходимо добавить соответствующий путь в конфигурацию плагина `lssrVite`:
```typescript
lssrVite({
    head: "./index.html"
})
```

Стандартный `index.html`:
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