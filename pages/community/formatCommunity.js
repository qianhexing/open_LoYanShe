// 格式化帖子
export const formatCommunity = (data) => {
  const community = data.map((value, i) => {
    if (parseInt(value.community_type) === 0) {
      try {
        const contnet = JSON.parse(value.content.replace(/\n/g, ''))
        value.content = contnet.content
        value.img_list = contnet.img_url
      } catch (e) {
        value.content = '解析错误'
        value.img_list = []
      }
    } else {
      console.log()
      if (value.img_list && value.img_list !== '') {
        value.img_list = value.img_list.split(',')
      } else {
        value.img_list = []
      }
    }
    return value
  })
  return community
}
