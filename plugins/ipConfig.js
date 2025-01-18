import Vue from 'vue'
const ipConfig = {
  install (Vue) {
    Vue.prototype.BASE_URL = 'https://lolitalibrary.com/apiLolita'
    Vue.prototype.BASE_IMG = 'https://www.lolitalibrary.com/ali/'
    Vue.prototype.BASE_NODE = 'https://lolitalibrary.com/node/'
    Vue.prototype.BASE_JAVA = 'https://lolitalibrary.com:9443/lolita'
    Vue.prototype.DOMAIN_NAME = 'https://lolitalibrary.com'
  }
}
// const BASE_URL = 'https://lolitalibrary.com/apiLolita'
// const BASE_IMG = 'https://www.lolitalibrary.com/'
Vue.use(ipConfig)
