import request from '@/plugins/request.js'
// 获取投票详情
export function getVoteDetail (data) {
  return request({
    url: '/vote/detail',
    method: 'post',
    data
  })
}
// 获取是否投票
export function getVoteIsVote (data) {
  return request({
    url: '/vote/isVote',
    method: 'post',
    data
  })
}
// 创建投票
export function insertVote (data) {
  return request({
    url: '/vote/insert',
    method: 'post',
    data
  })
}
// 添加投票记录
export function insertVoteRecord (data) {
  return request({
    url: '/vote/record/insert',
    method: 'post',
    data
  })
}
