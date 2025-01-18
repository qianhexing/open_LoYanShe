<template>
  <div>
    <el-drawer
      :title="'添加服饰'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()"
      :wrapperClosable="false">
      <div class="add-wrap">
        <el-form :model="form" :rules="rules" ref="form" label-width="90px">
          <el-form-item label="服饰图片">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleChange"
              :multiple="false"
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                >
                <span class="el-upload-list__item-actions">
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
          </el-form-item>
          <el-form-item label="笔记">
            <el-input v-model="form.clothes_note" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin: 10px;" v-show="!loading">
          <el-button type="primary" style="width: 100%;" @click="add()">{{'添加服饰'}}</el-button>
        </div>
        <div style="margin: 10px;"  v-show="loading">
          <el-button type="danger" style="width: 100%;">正在上传</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { insertClothes } from '../../api/wardrobe.js'
import uplpadOss from '../../utils/uploadOss.js'
export default {
  data () {
    return {
      show: false,
      loading: false,
      disabled: false,
      form: {
        clothes_note: ''
      },
      fileList: [],
      rules: {
        wardrobe_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  props: [
    'wardrobe_id'
  ],
  methods: {
    showModel () {
      this.show = true
    },
    init () {
      this.form = {
        clothes_note: ''
      }
      this.fileList = []
    },
    closeModel () {
      this.show = false
      this.init()
    },
    handleChange (file, fileList) {
      if (this.beforeUpload(file.raw)) {
        this.fileList = fileList
      } else {
        this.fileList = []
      }
    },
    beforeUpload (file) {
      const isImg = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('封面图片只能是 JPG, PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传封面大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    handleRemove (file) {
      const index = this.fileList.findIndex((value) => {
        return file.uid === value.uid
      })
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
    },
    handleExceed () {
      this.$message.warning('封面只可以选择一张')
    },
    async add () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      const { clothes_note } = this.form
      const params = {
        wardrobe_id: this.wardrobe_id
      }
      if (clothes_note !== '') {
        params.clothes_note = clothes_note
      }
      if (this.fileList.length === 0) {
        this.$message.warning('必须上传服饰封面')
        return false
      } else {
        const res = await uplpadOss(this.fileList[0].raw, 'static/wardrobe/wardrobe_list/')
        if (res.code === 200) {
          params.clothes_img = res.url
        }
      }
      insertClothes(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.$emit('success')
            this.closeModel()
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="less">
  .add-wrap{
    margin: 10px;
  }
</style>
