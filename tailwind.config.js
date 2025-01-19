const { addDynamicIconSelectors } = require('@iconify/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF4785',
        secondary: '#1EA7FD'
      },
      spacing: {
        128: '32rem'
      }
    }
  },
  plugins: [
    addDynamicIconSelectors()
  ],
  // 由于你使用的是 Nuxt 2.x 版本，需要添加以下配置以确保与 Nuxt 的兼容性
  corePlugins: {
    preflight: false
  }
}
