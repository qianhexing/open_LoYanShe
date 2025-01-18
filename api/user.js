import request from '@/plugins/request.js'

export function isLogin () {
  return request({
    url: '/',
    method: 'get'
  })
}

export function setLoginType () {
  return request({
    url: '/user/loginType',
    method: 'post'
  })
}

export function getUserIsDataByIds (data) {
  return request({
    url: '/user/isData/ids',
    method: 'post',
    data
  })
}

export function getSmsCode (data) {
  return request({
    url: '/user/sendSms',
    method: 'post',
    data
  })
}
// 判断是否有用户名或手机号
export function checkHasName (data) {
  return request({
    url: '/user/hasName',
    method: 'post',
    data
  })
}
// 创建用户
export function insertUser (data) {
  return request({
    url: '/user/insert',
    method: 'post',
    data
  })
}
// 登录
export function loginIn (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
