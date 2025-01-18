import request from '@/plugins/request.js'

export function getLibraryList (data) {
  return request({
    url: '/library/list',
    method: 'post',
    data
  })
}
export function insertLibrary (data) {
  return request({
    url: '/library/insert',
    method: 'post',
    data
  })
}

export function updateLibrary (data) {
  return request({
    url: '/library/update',
    method: 'post',
    data
  })
}

export function getLibraryById (data) {
  return request({
    url: '/library/id',
    method: 'post',
    data
  })
}
export function sortLibrary (data) {
  return request({
    url: '/library/sort',
    method: 'post',
    data
  })
}
