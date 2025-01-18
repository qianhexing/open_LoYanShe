import Vue from 'vue'
import dayjs from 'dayjs'
const counrty = (i = 0) => {
  const index = parseInt(i)
  let name = '国牌'
  if (index === 1) {
    name = '日牌'
  }
  return name
}

const setFavoriteType = (value) => {
  switch (value) {
    case 0:
      return '关注列表'
    case 1:
      return '店铺收藏夹'
    case 2:
      return '图鉴收藏夹'
    case 3:
      return '帖子收藏夹'
    default:
      return '未知'
  }
}
// 设置国别
const setCount = (value) => {
  switch (value) {
    case 0:
      return '国牌'
    case 1:
      return '日牌'
    default:
      return '其他'
  }
}
const isTure = (value) => {
  let is = false
  if (value === 0) {
    is = false
  } else if (value > 0) {
    is = true
  }
  return is
}
const setDate = (value) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}
// 设置统计数字
const setStatisticsNumber = (value) => {
  if (!value) {
    value = 0
  }
  return value
}
Vue.filter('isTure', isTure)
Vue.filter('setFavoriteType', setFavoriteType)
Vue.filter('setDate', setDate)
Vue.filter('setCount', setCount)
Vue.filter('setStatisticsNumber', setStatisticsNumber)
Vue.prototype.$country = counrty
