import request from '@/plugins/request.js'

export function getWardrobeVistor (params) {
  return request({
    url: '/wardrobe/list/visitor',
    method: 'get',
    params
  })
}
// 获取衣柜衣服By ID
export function getWardrobeClothesById (data) {
  return request({
    url: '/clothes/list',
    method: 'post',
    data
  })
}
// 获取衣柜衣服机体
export function getClothesMemoryList (data) {
  return request({
    url: '/memory/list',
    method: 'post',
    data
  })
}

export function updataWardrobe (data) {
  return request({
    url: '/wardrobe/update',
    method: 'post',
    data
  })
}

export function insertWardrobe (data) {
  return request({
    url: '/wardrobe/insert',
    method: 'post',
    data
  })
}

export function insertClothes (data) {
  return request({
    url: '/clothes/insert',
    method: 'post',
    data
  })
}

export function insertMemory (data) {
  return request({
    url: '/memory/insert',
    method: 'post',
    data
  })
}
