import OSS from 'ali-oss'
import { insertFile, deleteFile } from '@/api/file'
const crypto = require('crypto')
// const uploadOss = (_this, fileName, file) => {
//   return new Promise((resolve, reject) => {
//     _this.$client.put(fileName, file)
//       .then((res) => {
//         if (res.url) {
//           console.log(res)
//         } else {
//           _this.$message.error('文件上传失败')
//         }
//         resolve()
//       })
//       .catch((err) => {
//         _this.$message.error('文件上传错误')
//         console.log(err)
//         resolve()
//       })
//   })
// }

function calculateMD5 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function (event) {
      const fileData = event.target.result
      const buffer = Buffer.from(fileData)
      const hash = crypto.createHash('md5')
      hash.update(buffer)
      const md5 = hash.digest('hex')
      resolve(md5)
    }

    reader.onerror = function (event) {
      reject(event.target.error)
    }

    reader.readAsArrayBuffer(file)
  })
}

const uploadImage = (_this, file, path = 'static/image/') => {
  return new Promise((resolve, reject) => {
    const file_type = file.type.replace('image/', '')
    const file_name = path + new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + file_type
    calculateMD5(file)
      .then((md5) => {
        const params = {
          file_md5: md5,
          file_size: file.size || 0,
          file_type: 0, // 图片 0
          file_url: file_name
        }
        insertFile(params)
          .then((res) => {
            const data = res.data
            const ossConfig = data.oss
            console.log(res, 'MD5结果')
            if (ossConfig) {
              const client = new OSS({
                // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
                region: 'oss-cn-beijing',
                accessKeyId: ossConfig.AccessKeyId,
                accessKeySecret: ossConfig.AccessKeySecret,
                stsToken: ossConfig.SecurityToken,
                // 填写Bucket名称。
                bucket: 'qianhexing'
              })
              client.put(file_name, file)
                .then(() => {
                  resolve(data.file_url)
                })
                .catch((e) => {
                  deleteFile(params)
                  reject(e)
                })
            } else {
              resolve(data.file_url)
            }
          })
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export default uploadImage
