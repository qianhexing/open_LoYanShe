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
          <el-form-item label="记忆标题" prop="memory_title">
            <el-input v-model="form.memory_title"></el-input>
          </el-form-item>
          <el-form-item label="日记">
            <el-input v-model="form.memory_note" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="关联帖子">
            <el-button type="primary" @click="showChooseCommunity()">关联帖子</el-button>
            <div class="community-lits" v-for="(list, index) in community_list" :key="list.community_id">
              <el-card>
                <div class="box-card">
                  <h4 class="community-title">{{list.title}}</h4>
                  <el-button type="danger" icon="el-icon-delete" circle @click="removeCommunity(index)"></el-button>
                </div>
              </el-card>
            </div>
          </el-form-item>
        </el-form>
        <div style="margin: 10px;" v-show="!loading">
          <el-button type="primary" style="width: 100%;" @click="add()">{{'添加回忆'}}</el-button>
        </div>
        <div style="margin: 10px;"  v-show="loading">
          <el-button type="danger" style="width: 100%;">正在上传</el-button>
        </div>
      </div>
    </el-drawer>
    <chooseCommunity ref="chooseCommunity"
    v-if="$store.getters.getUserInfo"
    :user_id="$store.getters.getUserInfo.user_id"
    @choose="chooseCommunity">
    </chooseCommunity>
  </div>
</template>

<script>
import { insertMemory } from '../../api/wardrobe.js'
import chooseCommunity from '../community/chooseCommunity.vue'
export default {
  data () {
    return {
      show: false,
      loading: false,
      disabled: false,
      form: {
        memory_title: '',
        memory_note: ''
      },
      fileList: [],
      rules: {
        memory_title: [
          { required: true, message: '请输入回忆标题', trigger: 'blur' }
        ]
      },
      community_list: []
    }
  },
  components: {
    chooseCommunity
  },
  props: [
    'clothes_id'
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
      this.community_list = []
    },
    showChooseCommunity () {
      this.$refs.chooseCommunity.showModel()
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
    chooseCommunity (list) {
      console.log(list)
      const index = this.community_list.findIndex((value) => {
        return value.community_id === list.community_id
      })
      if (index === -1) {
        this.community_list.push(list)
      } else {
        this.$message.warning('重复添加')
      }
    },
    removeCommunity (index) {
      this.community_list.splice(index, 1)
    },
    add () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      const { memory_title, memory_note } = this.form
      const params = {
        clothes_id: this.clothes_id,
        memory_title,
        memory_note
      }
      if (this.community_list.length > 0) {
        const community_list = this.community_list.map((value) => {
          return value.community_id
        })
        params.mount_community = community_list.join()
      }
      insertMemory(params)
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
    .community-lits{
      margin: 10px 0;
      .box-card{
        display: flex;
        align-items: center;
        .community-title{
          flex: 1;
        }
      }
    }
  }
</style>
