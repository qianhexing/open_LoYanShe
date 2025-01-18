import request from '@/plugins/request.js'

export function getUser (params) {
  return request({
    url: '/user/getUser',
    method: 'get',
    params
  })
}
// 获取当前服务器时间
export function getCurrentTime () {
  return request({
    url: '/getCurrentTime',
    method: 'get'
  })
}
// 浏览次数记录
export function updateBrowsTime (data) {
  return request({
    url: '/times/update',
    method: 'post',
    data
  })
}
