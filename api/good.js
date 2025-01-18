import request from '@/plugins/request.js'
// 新增或删除点赞
export function insertGood (data) {
  return request({
    url: '/good/insert',
    method: 'post',
    data
  })
}
