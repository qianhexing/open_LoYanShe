<template>
  <div>
    <el-drawer
      :title="'添加衣柜'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()"
      :wrapperClosable="false">
      <div class="add-wrap">
        <el-form :model="wardrobe" :rules="rules" ref="wardrobe" label-width="90px">
          <el-form-item label="衣柜名称" prop="wardrobe_name">
            <el-input v-model="wardrobe.wardrobe_name"></el-input>
          </el-form-item>
          <el-form-item label="衣柜描述">
            <el-input v-model="wardrobe.wardrobe_desc" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="是否私密">
            <el-tooltip :content="wardrobe.is_private === 0 ? '否' : '是'" placement="top">
              <el-switch
                v-model="wardrobe.is_private"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="衣柜封面">
            <div v-if="wardrobe_cover && fileList.length === 0" class="el-upload--picture-card">
              <img style="width: 100%; height: 100%; object-fit: cover;"
                :src="BASE_IMG + wardrobe_cover"
              >
            </div>
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleChange"
              :multiple="false"
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload">
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
        </el-form>
        <div style="margin: 10px;" v-show="!loading">
          <el-button type="primary" @click="add()" style="width: 100%;">{{wardrobe_id === null ? '添加衣柜' : '修改衣柜'}}</el-button>
        </div>
        <div style="margin: 10px;"  v-show="loading">
          <el-button type="danger" style="width: 100%;">正在上传</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { insertWardrobe, updataWardrobe } from '../../api/wardrobe.js'
import uplpadOss from '../../utils/uploadOss.js'
export default {
  data () {
    return {
      show: false,
      loading: false,
      wardrobe: {
        wardrobe_name: '',
        wardrobe_desc: '',
        is_private: 0
      },
      wardrobe_cover: null,
      disabled: false,
      fileList: [],
      rules: {
        wardrobe_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    wardrobe_id: {
      type: Number,
      default: null
    },
    wardrobe_info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    console.log(this.wardrobe_id, '衣柜id')
  },
  methods: {
    showModel () {
      this.show = true
      if (this.wardrobe_id !== null) {
        const { wardrobe_name, wardrobe_desc, is_private, wardrobe_cover } = this.wardrobe_info
        this.wardrobe = {
          wardrobe_name,
          wardrobe_desc,
          is_private
        }
        if (wardrobe_cover) {
          this.wardrobe_cover = wardrobe_cover
        }
      }
    },
    init () {
      this.wardrobe = {
        wardrobe_name: '',
        wardrobe_desc: '',
        is_private: 0
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
    async addEditWardrobe () {
      const { wardrobe_name, wardrobe_desc, is_private } = this.wardrobe
      const params = {
        wardrobe_name,
        wardrobe_desc,
        is_private
      }
      if (this.fileList.length > 0) {
        const res = await uplpadOss(this.fileList[0].raw, 'static/wardrobe_cover/')
        if (res.code === 200) {
          params.wardrobe_cover = res.url
        }
      }
      if (this.wardrobe_id === null) {
        insertWardrobe(params)
          .then((res) => {
            if (res.code === 200) {
              this.$emit('success')
              this.closeModel()
              this.$message.success('添加成功')
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        params.wardrobe_id = this.wardrobe_id
        updataWardrobe(params)
          .then((res) => {
            if (res.code === 200) {
              this.closeModel()
              const data = res.data
              console.log(data)
              this.$emit('success', data)
              this.$message.success('修改成功')
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    add () {
      if (this.loading === true) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.$refs.wardrobe.validate((valid) => {
        if (valid) {
          this.loading = true
          this.addEditWardrobe()
        } else {
          this.$message.error('请按照提示正确填写')
          return false
        }
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
