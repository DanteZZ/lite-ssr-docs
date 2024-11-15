## 🔎 **ИСПОЛЬЗОВАНИЕ**

### Конфигурация LSSR
```typescript
// lssr.config.ts
import { defineLssrConfig } from "lite-ssr";

export default defineLssrConfig({
    entry?: "/src/main.ts", // Опционально, путь к файлу инициализации приложения
    head?: { // Опционально, конфигурация unhead (https://unhead.unjs.io/usage/composables/use-head#input)
        title: "My LSSR App"
    },
    html?: "/index.html", // Опционально, путь к кастомному html файлу (пользуйтесь с умом!)
    dist?: "/dist" // Директория для сборки
});
```