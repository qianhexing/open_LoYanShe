import request from '@/plugins/request.js'

export function getFavoriteVistor (params) {
  return request({
    url: '/favorite/list/visitor',
    method: 'get',
    params
  })
}

export function insertFavorite (data) {
  return request({
    url: '/favorite/insert',
    method: 'post',
    data
  })
}

export function updateFavorite (data) {
  return request({
    url: '/favorite/update',
    method: 'post',
    data
  })
}

// 删除收藏夹
export function deleteFavorite (data) {
  return request({
    url: '/favorite/delete',
    method: 'post',
    data
  })
}

// 收藏夹选项
export function getFavoriteOptions (data) {
  return request({
    url: '/favorite/options',
    method: 'post',
    data
  })
}

// 获取收藏列表
export function getCollectListVistor (data) {
  return request({
    url: '/collect/list/visitor',
    method: 'post',
    data
  })
}

// 获取收藏夹详情
export function getCollectDetail (params) {
  return request({
    url: '/favorite/detail',
    method: 'get',
    params
  })
}

// 删除收藏夹
export function deleteCollect (data) {
  return request({
    url: '/collect/delete',
    method: 'post',
    data
  })
}

export function insertCollect (data) {
  return request({
    url: '/collect/insert',
    method: 'post',
    data
  })
}
