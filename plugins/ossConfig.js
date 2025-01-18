import Vue from 'vue'
import OSS from 'ali-oss'
const ossConfig = {
  install (Vue) {
    Vue.prototype.$client = null
  }
}
Vue.use(ossConfig)
