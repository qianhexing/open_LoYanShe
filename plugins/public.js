export function _debounce (fn, del) {
  const delay = del || 300
  let timer
  return function () {
    const th = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}
export function dateDifference (sDate1, sDate2) {
  let dateSpan
  sDate1 = Date.parse(sDate1)
  sDate2 = Date.parse(sDate2)
  dateSpan = sDate2 - sDate1
  dateSpan = Math.abs(dateSpan)
  const iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
  return iDays
}
// 格式化时间
export function formatDate (date, format = 'Y-M-D H:M:S') {
  const dateee = new Date(date)
  const mon = (dateee.getMonth() + parseInt(1)) < 10 ? '0' + (dateee.getMonth() + parseInt(1)) : (dateee.getMonth() + parseInt(1))
  const day = dateee.getDate() < 10 ? '0' + dateee.getDate() : dateee.getDate()
  const hour = dateee.getHours() < 10 ? '0' + dateee.getHours() : dateee.getHours()
  const min = dateee.getMinutes() < 10 ? '0' + dateee.getMinutes() : dateee.getMinutes()
  const sec = dateee.getSeconds() < 10 ? '0' + dateee.getSeconds() : dateee.getSeconds()
  let dateTime
  if (format === 'Y-M-D H:M:S') {
    dateTime = dateee.getFullYear() + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec
  } else if (format === 'Y-M-D') {
    dateTime = dateee.getFullYear() + '-' + mon + '-' + day
  }
  return dateTime
}
/* 格式化帖子 */
export function formatCommunity (text) {
  // 替换投票标签
  const regex = /<lolitavote>(.*?)<\/lolitavote>/g
  const replacement = '<div style="width: 100%; padding: 20px 0; box-shadow: 0px 0px 7px #ccc;text-align:center">请进入详情页面投票</div> '

  text = text.replace(regex, replacement)
  return text
}
// 获取地址后缀名
export function getFileExtension (filePath) {
  // 获取文件扩展名
  if (!filePath) {
    return null
  }
  const extname = filePath.split('.').pop().toLowerCase()
  // 如果没有扩展名，返回 null
  if (extname === filePath) {
    return null
  }
  return extname
}
