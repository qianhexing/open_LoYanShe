export function waterfall (dom, column = 3) {
  const list = dom
  const style_list = []
  let min_column = 0
  let max_height = 0
  const column_height = []
  for (let i = 0; i < column; i++) {
    column_height.push(0)
  }
  Object.keys(list).forEach((key) => {
    style_list.push({
      top: column_height[min_column],
      left: min_column * Math.floor(list[key].offsetWidth - 0.5)
    })
    console.log(Math.floor(list[key].offsetWidth - 0.5))
    column_height[min_column] += (list[key].offsetHeight)
    // 判断最小列
    column_height.forEach((height, index) => {
      if (height < column_height[min_column]) {
        min_column = index
      }
    })
  })
  column_height.forEach((height) => {
    if (height > max_height) {
      max_height = height
    }
  })
  const obj = {
    style_list,
    max_height
  }
  return obj
}
