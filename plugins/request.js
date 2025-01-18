// import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  baseURL: 'https://lolitalibrary.com/node/',
  // baseURL: 'http://192.168.1.23:3002/',
  // baseURL: 'http//localhost:3002',
  timeout: 30000 // 请求超时时间
})
// 异常拦截处理器
const errorHandlerByCode = (error) => {
  if (error) {
    const data = error
    if (error.code === 403) {
      Message.error('没有权限')
    } else if (error.code === 401) {
      Message.warning('登录凭证已失效，请重新登录...')
      window.$nuxt.$store.dispatch('Logout')
      console.log('跳转')
      window.$nuxt.$router.push('/login')
    } else if (error.code === 404) {
      Message.warning('没有找到页面')
      window.$nuxt.$router.push('/404')
    } else {
      Message.error(data.msg)
    }
  }
  return Promise.resolve(error)
}
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      Message.error('Forbidden')
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      Message.error('Unauthorized')
    }
  }
  return Promise.reject(error)
}
request.interceptors.request.use((config) => {
  const token = window.$nuxt.$store.getters.getToken
  if (token) {
    config.headers.authorization = token
  }
  return config
}, errorHandler)
request.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (response.data.code && response.data.code !== 200) {
      return errorHandlerByCode(response.data)
    }
    return response.data
  }
}, errorHandler)
export default request

// Vue.prototype.$request = request
