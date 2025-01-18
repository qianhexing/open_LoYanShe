import sitemap from './config/sitemap.js'
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: 3004,
    ip: '0.0.0.0',
  },
  env: {
    baseUrl: 'https://lolitalibrary.com/node/'
  },
  head: {
    title: 'Lo研社 lolita图书馆 洛丽塔图书馆',
    htmlAttrs: {
      lang: 'zh'
    },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Lolita图书馆,洛丽塔图书馆,洛丽塔交流社区,小裙子,Lo研社'},
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'keywords', name: 'keywords', content: 'Lolita图书馆,洛丽塔图书馆,洛丽塔交流社区,小裙子,Lo研社' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: "stylesheet", href: "https://at.alicdn.com/t/font_2197970_23wjir8f6nf.css" }
    ],
    script: [
      { src: 'https://hm.baidu.com/hm.js?0335ae083b2ed0e0898bed7618373dee' }
      // {
      //   type: 'text/javascript',
      //   innerHTML: `
      //     window._AMapSecurityConfig = {
      //       securityJsCode: "627969390a1096484f1f71d87cf1b42d"
      //     };
      //   `,
      // },
      // {
      //   src: 'https://webapi.amap.com/maps?v=1.4.15&key=7b338377f1d1b4b6519bf8e913c5a482&plugin=AMap.MouseTool,AMap.PolyEditor,AMap.LabelMarker,AMap.Autocomplete,AMap.ToolBar,AMap.PlaceSearch,AMap.Heatmap,AMap.Geocoder'
      // }
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'amap-security-config': ['innerHTML'] // 防止 Nuxt 清除内联脚本
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.less',
    '@/assets/css/icon/iconfont.css',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    '@/plugins/ipConfig',
    '@/plugins/day',
    '@/plugins/echarts',
    '@/plugins/country',
    '@/plugins/router',
    // '@/plugins/vue-map',
    { src: '@/plugins/vue-map', ssr: false },
    {
      src: '@/plugins/directive',
      ssr: false
    },
    {
      src: '@/plugins/vue-lazyload',
      ssr: false
    },
    {
      src: '@/plugins/vue-quill-editor',
      ssr: false
    },
    {
      src: '@/plugins/ossConfig',
      ssr: false
    }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/sitemap'
  ],
  sitemap: sitemap,

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'https://lolitalibrary.com/apiLolita'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    extractCSS: { allChunks: true }
  }
}
