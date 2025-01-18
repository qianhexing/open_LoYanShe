import request from '@/plugins/request.js'

export function getUserSaceInfoById (id) {
  return request({
    url: '/userSpace/getUserInfo',
    method: 'post',
    data: {
      id
    }
  })
}
