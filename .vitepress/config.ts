import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lite-SSR",
  description: "Documentation for Lite-SSR",
  base: "/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Руководство', link: '/' },
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
        text: 'Использование',
        items: [
          { text: 'Базовое использование', link: '/basic-usage' },
          { text: 'Другие возможности', link: '/other-technologies' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://gitlab.zebrains.team/frontend/modules/lite-ssr' }
    ]
  },

  markdown: {
    container: {
      tipLabel: 'СОВЕТ',
      warningLabel: 'ПРЕДУПРЕЖДЕНИЕ',
      dangerLabel: 'ОПАСНОСТЬ',
      infoLabel: ' ',
      detailsLabel: 'Подробная информация'
    }
  }
})
