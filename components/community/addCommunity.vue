<template>
  <div>
    <el-drawer
      title="发帖"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '60%'"
      @close="closeModel()"
      :wrapperClosable="false">
      <div v-if="show">
        <el-input v-model="form.title" placeholder="标题"></el-input>
        <quill @change="onEditorChange" ref="editor"></quill>
        <el-checkbox v-model="open_compress" style="margin: 10px;">是否开启压缩图片(服务器资源有限默认开启)</el-checkbox>
        <div style="margin: 0 10px;">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleChange"
            :before-upload="handleUpload"
            :multiple="true"
            :limit="9"
            :on-exceed="handleExceed">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
          </el-upload>
        </div>
        <div style="margin: 10px;">
          <el-button type="primary" @click="addCommunity()" style="width: 100%;">发送帖子</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { insertCommunity } from '../../api/community.js'
import { isLogin } from '../../api/user.js'
import quill from './quillEdit.vue'
export default {
  components: {
    quill
  },
  data () {
    return {
      show: false,
      content: 'ss',
      form: {
        title: '',
        contnet: ''
      },
      fileList: [],
      // 上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      open_compress: true // 开启压缩
    }
  },
  methods: {
    showModel () {
      this.show = true
      isLogin()
    },
    closeModel () {
      this.$emit('close')
      this.init()
    },
    init () {},
    onEditorChange (e) {
      this.form.content = e
    },
    // 上传图片
    uploadOss (fileName, file) {
      return new Promise((resolve, reject) => {
        this.$client.put(fileName, file)
          .then((res) => {
            if (res.url) {
              console.log(res)
            } else {
              this.$message.error('文件上传失败')
            }
            resolve()
          })
          .catch((err) => {
            this.$message.error('文件上传错误')
            console.log(err)
            resolve()
          })
      })
    },
    handleRemove (file) {
      const index = this.fileList.findIndex((value) => {
        console.log(value)
        return file.uid === value.uid
      })
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
      console.log(this.fileList, index)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleUpload (file, fileList) {
      console.log(file, fileList)
    },
    handleChange (file, fileList) {
      console.log(file)
      // this.uploadOss('test/test111.jpg', file.raw)
      this.fileList = fileList
    },
    handleExceed () {
      this.$message.warning('最多选9张图片')
    },
    async addImageList () {
      const img_list = []
      let file_list = []
      this.fileList.forEach((file) => {
        img_list.push(file.raw)
      })
      for (let i = 0; i < img_list.length; i++) {
        const file_type = img_list[i].type.replace('image/', '')
        const file_name = 'static/community/' + this.$store.getters.getUserInfo.user_id + '_' + new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + file_type
        await this.uploadOss(file_name, img_list[i])
        file_list.push(file_name)
      }
      if (file_list.length > 0) {
        file_list = file_list.join()
      } else {
        file_list = null
      }
      return file_list
    },
    // 发帖
    async addCommunity () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      const { title, content } = this.form
      if (title === '' || content === '') {
        this.$message.warning('标题或内容不可为空')
        return false
      }
      this.loading = true
      const img_list = await this.addImageList()
      const params = {
        title,
        content,
        type: '日常交流'
      }
      // 设置图片
      console.log(img_list)
      if (img_list) {
        params.img_list = img_list
      }
      insertCommunity(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('发帖成功')
            this.$router.push({ path: '/blank?to=' + '/community/1' })
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  asyncData () {
    return {
      open_compress: true
    }
  }
}
</script>

<style>
</style>
