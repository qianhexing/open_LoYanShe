<template>
  <div>
    <el-drawer
      :title="'新建词条段落'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      :modal="false"
      :wrapperClosable="false"
      @close="closeModel()"
    >
      <div class="add-wrap">
        <el-form :model="form" :rules="rules" ref="form" label-width="90px">
          <el-form-item label="段落标题" prop="vote_describe">
            <el-input v-model="form.section_title"></el-input>
          </el-form-item>
          <el-form-item label="段落内容" prop="vote_describe">
            <!-- <el-input v-model="form.section_title"></el-input> -->
          </el-form-item>
        </el-form>
        <div style="margin-left: 15px;">
          <quill @change="onEditorChange" :editorOption="editorOption" ref="editor"></quill>
        </div>
        <div style="margin: 20px;">
          <el-button type="primary" style="width: 100%;" @click="insertWikiSection()">创建段落</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import quill from '../community/quillEdit'
import { insertWikiSection } from '@/api/wiki'
export default {
  components: {
    quill
  },
  data () {
    return {
      editorOption: {
        placeholder: '请在这里输入',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', { header: 1 }, { header: 2 }, { color: [] }, { background: [] }],
            [{ align: [] }, 'image']
          ]
        }
      },
      show: false,
      form: {
      },
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
    add (wiki_id) {
      this.form.wiki_id = wiki_id
    },
    onEditorChange (e) {
      this.form.section_content = e
    },
    init () {
      this.form = {}
    },
    closeModel () {
      this.show = false
      this.init()
    },
    insertWikiSection () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            wiki_id: this.$route.params.id,
            section_title: this.form.section_title,
            section_content: this.form.section_content
          }
          this.loading = true
          insertWikiSection(param)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('新增段落成功')
                this.$emit('save', res.data)
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
