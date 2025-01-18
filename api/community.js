import request from '@/plugins/request.js'

export function insertCommunity (data) {
  return request({
    url: '/community/insert',
    method: 'post',
    data
  })
}

export function getCommunityList (data) {
  return request({
    url: '/community/list',
    method: 'post',
    data
  })
}
