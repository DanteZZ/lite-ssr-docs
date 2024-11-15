import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lite-SSR Docs",
  description: "Documentation for Lite-SSR",
  base: "/lite-ssr-docs/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'О проекте',
        items: [
          { text: 'Информация о проекте', link: '/' },
          { text: 'Установка', link: '/installation' },
        ]
      },
      {
        text: 'Базовое использование',
        items: [
          { text: 'Настройка', link: '/basic-usage/configuration' },
          { text: 'Асинхронные сторы', link: '/basic-usage/async-stores' },
          { text: 'asyncData', link: '/basic-usage/async-data' },
        ]
      },
      {
        text: 'Основное использование',
        items: [
          { text: 'Асинхронная регистрация приложения', link: '/usage/async-app-registration' },
          { text: 'Unhead', link: '/usage/unhead' },
          { text: 'Кастомный index.html', link: '/usage/custom-index-html' },
          { text: 'router', link: '/usage/router' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://gitlab.zebrains.team/frontend/modules/lite-ssr' }
    ]
  }
})
