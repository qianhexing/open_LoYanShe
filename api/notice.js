import request from '@/plugins/request.js'
export function hasNotice () {
  return request({
    url: '/notice/hasNotice',
    method: 'get'
  })
}
export function getNoticeList (params) {
  return request({
    url: '/notice/list',
    method: 'get',
    params
  })
}
// 获取收到的评论记录
export function getNoticeComment (params) {
  return request({
    url: '/notice/comment',
    method: 'get',
    params
  })
}
// 获取收到的艾特数据
export function getNoticeAtuser (params) {
  return request({
    url: '/notice/atuser',
    method: 'get',
    params
  })
}
