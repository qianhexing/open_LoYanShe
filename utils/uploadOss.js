import { Message } from 'element-ui'

const uploadOss = (file, addr) => {
  console.log(window.$nuxt.$store.getters.getUserInfo)
  const user_info = window.$nuxt.$store.getters.getUserInfo
  console.log(window.$nuxt.$client)
  return new Promise((resolve) => {
    const data = {
      code: 200,
      meg: '上传成功'
    }
    if (user_info) {
      const file_type = file.type.replace('image/', '')
      const file_name = addr + user_info.user_id + '_' + new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + file_type
      window.$nuxt.$client.put(file_name, file)
        .then((res) => {
          if (res.url) {
            console.log(res)
          } else {
            Message.error('文件上传失败')
          }
          data.url = file_name
          resolve(data)
        })
        .catch((err) => {
          console.log(err)
          Message.error('文件上传错误')
          data.code = 403
          data.msg = '文件上传错误'
          resolve(data)
        })
    } else {
      data.code = 403
      data.msg = '获取不到用户信息，请重新登录'
      Message.error('获取不到用户信息，请重新登录')
      resolve(data)
    }
  })
}
export default uploadOss
// uploadOss (fileName, file) {
//   return new Promise((resolve, reject) => {
//     this.$client.put(fileName, file)
//       .then((res) => {
//         if (res.url) {
//           console.log(res)
//         } else {
//           this.$message.error('文件上传失败')
//         }
//         resolve()
//       })
//       .catch((err) => {
//         this.$message.error('文件上传错误')
//         console.log(err)
//         resolve()
//       })
//   })
// }
