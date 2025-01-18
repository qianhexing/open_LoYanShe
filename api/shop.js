import request from '@/plugins/request.js'

export function getShopOptionsByKeywords (params) {
  return request({
    url: '/shop/getOptions/keywords',
    method: 'get',
    params
  })
}

export function insertShop (data) {
  return request({
    url: '/shop/insert',
    method: 'post',
    data
  })
}
export function insertPhysicalShop (data) {
  return request({
    url: '/physicalShop/insert',
    method: 'post',
    data
  })
}
