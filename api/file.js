import request from '@/plugins/request.js'

export function insertFile (data) {
  return request({
    url: '/file/insert',
    method: 'post',
    data
  })
}
export function deleteFile (data) {
  return request({
    url: '/file/delete',
    method: 'post',
    data
  })
}

export function getImageInfo (data) {
  return request({
    url: '/image/info',
    method: 'post',
    data
  })
}
