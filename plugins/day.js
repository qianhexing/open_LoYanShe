import Vue from 'vue'
import dayjs from 'dayjs'
const dayjsConfig = {
  install (Vue) {
    Vue.prototype.dayjs = dayjs
  }
}
Vue.use(dayjsConfig)
