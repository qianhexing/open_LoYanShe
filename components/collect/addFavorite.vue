<template>
  <div>
    <el-drawer
      :title="title"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()"
      :wrapperClosable="false">
      <div class="add-wrap">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="收藏夹名称" prop="favorite_name">
            <el-input v-model="form.favorite_name"></el-input>
          </el-form-item>
          <el-form-item label="收藏类型" prop="collect_type">
            <el-select
              v-model="form.collect_type"
              placeholder="请选择收藏类型"
              :disabled="form.id ? true : false"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收藏夹描述">
            <el-input v-model="form.favorite_desc" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="是否私密">
            <el-tooltip :content="form.is_private === 0 ? '否' : '是'" placement="top">
              <el-switch
                v-model="form.is_private"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="收藏夹封面">
            <div v-if="cover && fileList.length === 0" class="el-upload--picture-card">
              <img style="width: 100%; height: 100%; object-fit: cover;"
                :src="BASE_IMG + cover"
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
          <el-button type="primary" @click="add()" style="width: 100%;">{{ title }}</el-button>
        </div>
        <div style="margin: 10px;"  v-show="loading">
          <el-button type="danger" style="width: 100%;">正在上传</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { insertFavorite, updateFavorite } from '../../api/collect.js'
import uplpadOss from '../../utils/uploadOss.js'
export default {
  data () {
    return {
      title: '添加收藏夹',
      show: false,
      loading: false,
      options: [
        { label: '店铺收藏夹', value: 1 },
        { label: '图鉴收藏夹', value: 2 },
        { label: '帖子收藏夹', value: 3 }
      ],
      form: {
        favorite_name: '',
        favorite_desc: null,
        is_private: 0,
        collect_type: 1
      },
      cover: null,
      disabled: false,
      fileList: [],
      rules: {
        favorite_name: [
          { required: true, message: '请输入收藏夹名称', trigger: 'blur' },
          { max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        collect_type: [
          { required: true, message: '请选择收藏夹类型', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    console.log(this.wardrobe_id, '衣柜id')
  },
  methods: {
    showModel () {
      this.show = true
    },
    edit (row) {
      this.title = '修改收藏夹'
      const { id, favorite_name, favorite_desc, is_private, collect_type, favorite_pic } = row
      this.form = {
        id,
        favorite_name,
        favorite_desc,
        is_private,
        collect_type: parseInt(collect_type)
      }
      if (favorite_desc) {
        this.cover = favorite_pic
      }
      this.showModel()
    },
    init () {
      this.title = '添加收藏夹'
      this.form = {
        favorite_name: '',
        favorite_desc: '',
        is_private: 0,
        collect_type: 1
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
    async addEditFavorite () {
      const { id, favorite_name, favorite_desc, is_private, collect_type } = this.form
      const params = {
        favorite_name,
        favorite_desc,
        is_private,
        collect_type
      }
      if (this.fileList.length > 0) {
        const res = await uplpadOss(this.fileList[0].raw, 'static/favorite_cover/')
        if (res.code === 200) {
          params.favorite_pic = res.url
        }
      }
      if (!id) {
        insertFavorite(params)
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
        params.id = id
        updateFavorite(params)
          .then((res) => {
            if (res.code === 200) {
              this.$emit('success')
              this.closeModel()
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.addEditFavorite()
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
