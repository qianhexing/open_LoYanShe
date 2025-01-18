<!--
 * @Author: qianhexing
 * @Date: 2023-03-03 10:50:16
 * @LastEditors: qianhexing
 * @LastEditTime: 2023-03-03 15:20:26
 * @FilePath: \ssr-lolita\components\vote\addVote.vue
-->
<template>
  <div>
    <el-drawer
      :title="'新建投票'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      :modal="false"
      :wrapperClosable="false"
      @close="closeModel()"
    >
      <div class="add-wrap">
        <el-form :model="form" :rules="rules" ref="form" label-width="90px">
          <el-form-item label="投票标题" prop="vote_title">
            <el-input v-model="form.vote_title"></el-input>
          </el-form-item>
          <el-form-item label="投票类型" prop="vote_type">
            <el-select v-model="form.vote_type" placeholder="请选择投票类型">
              <el-option
                v-for="item in voteType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="补充描述" prop="vote_describe">
            <el-input v-model="form.vote_describe" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <!-- 选项 -->
        <div
          v-for="(item, index) in form.vote_options"
          :key="index"
          class="add-options"
        >
          <el-input v-model="form.vote_options[index]" placeholder="请输入选项内容"></el-input>
          <i class="el-icon-delete-solid delete-options" @click="deleteOptions(index)"></i>
        </div>
        <div class="add-new-options" @click="addOptions()">
          <i class="el-icon-plus" style="margin-right: 5px;"></i>
          新增选项
        </div>
        <div style="margin: 10px;">
          <el-button type="primary" style="width: 100%;" @click="insertVote()">创建投票</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { insertVote } from '@/api/vote'
export default {
  data () {
    return {
      show: false,
      form: {
        vote_title: '',
        vote_type: 0,
        vote_describe: '',
        vote_options: ['', '']
      },
      voteType: [
        {
          value: 0,
          label: '单选'
        },
        {
          value: 1,
          label: '多选'
        }
      ],
      rules: {
        vote_title: [
          { required: true, message: '请输入投票标题', trigger: 'blur' }
        ],
        vote_type: [
          { required: true, message: '请选择投票类型', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    showModel () {
      this.show = true
    },
    init () {
      this.form = {
        vote_title: '',
        vote_type: 0,
        vote_describe: '',
        vote_options: ['', '']
      }
    },
    closeModel () {
      this.show = false
      this.init()
    },
    insertVote () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            vote_title: this.form.vote_title,
            vote_type: this.form.vote_type,
            vote_describe: this.form.vote_describe,
            vote_options: this.form.vote_options
          }
          param.vote_options = param.vote_options.filter(item => item !== '')
          if (param.vote_options.length < 2) {
            this.$message.warning('至少两个非空选项')
            return false
          }
          if (param.vote_options.length > 10) {
            this.$message.warning('最多10个选项')
            return false
          }
          this.loading = true
          insertVote(param)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('投票创建成功')
                this.$emit('insertVote', res.data)
                this.closeModel()
              } else {
                this.$message.error(res.msg)
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    deleteOptions (index) {
      if (this.form.vote_options.length > 2) {
        this.form.vote_options.splice(index, 1)
      } else {
        this.$message.warning('至少保留两个选项')
      }
    },
    addOptions () {
      if (this.form.vote_options.length < 10) {
        this.form.vote_options.push('')
      } else {
        this.$message.warning('最多添加10个选项')
      }
    }
  }
}
</script>

<style scoped lang="less">
.add-wrap{
  margin: 0 10px;
  .add-new-options{
    display: flex;
    align-items: center;
    margin: 10px 0;
    justify-content: center;
    cursor: pointer;
    .el-icon-plus{
      background: #409EFF;
      color: #fff;
      border-radius: 50%;
      padding: 5px;
    }
  }
  .add-options{
    display: flex;
    align-items: center;
    margin: 10px 0;
    .delete-options{
      margin-left: 10px;
      cursor: pointer;
      background: #409EFF;
      color: #fff;
      border-radius: 50%;
      padding: 5px;
    }
  }
}
</style>
