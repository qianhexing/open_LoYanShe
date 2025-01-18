import request from '@/plugins/request.js'

export function insartComment (data) {
  return request({
    url: '/comment/insert',
    method: 'post',
    data
  })
}
export function getReplyByCommentId (data) {
  return request({
    url: '/reply/comment/id/list',
    method: 'post',
    data
  })
}
/* 获取评论列表 */
export function getCommentList (data) {
  return request({
    url: '/comment/list',
    method: 'post',
    data
  })
}
