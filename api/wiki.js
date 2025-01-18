
import request from '@/plugins/request.js'

export function getWikiOptions (params) {
  return request({
    url: '/wiki/getOptions',
    method: 'get',
    params
  })
}

export function getWikiOptionsByKeywords (params) {
  return request({
    url: '/wiki/getOptions',
    method: 'get',
    params
  })
}
// 获取wiki列表
export function getWikiList (params) {
  return request({
    url: '/wiki/list',
    method: 'get',
    params
  })
}
// 新增wiki片段
export function insertWikiSection (data) {
  return request({
    url: '/wikiSection/insert',
    method: 'post',
    data
  })
}
