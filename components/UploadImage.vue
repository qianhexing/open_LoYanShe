<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="handleChange"
      :multiple="false"
      :limit="limit"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileList: []
    }
  },
  props: {
    limit: {
      type: Number,
      default: 1
    },
    path: {
      type: String,
      default: '/'
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>
</style>
