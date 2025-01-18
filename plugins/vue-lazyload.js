import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1.33,
  error: '',
  attempt: 2,
  throttleWait: 500,
  loading: require('@/assets/loading.jpg')
})
