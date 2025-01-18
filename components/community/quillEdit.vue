<template>
  <div>
    <!-- <div @click="addHtml()">添加</div> -->
    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :file-list="editorFileList"
      :on-change="handleChangeEditor"
      name="file"
      :show-file-list="false"
      style="display: none;"
    ></el-upload>
    <div
      ref="editor"
      class="quill-editor notranslate"
      style="height: 300px; padding-bottom: 50px;"
      v-quill:myQuillEditor="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
      :content="content"
    ></div>
    <chooseLibrary ref="chooseLibrary"
    @choose="libraryChoose"></chooseLibrary>
    <addVote ref="addVote"
    @insertVote="insertVote"></addVote>
  </div>
</template>

<script>
import chooseLibrary from '../library/chooseLibrary.vue'
import addVote from '../vote/addVote.vue'
export default {
  components: {
    chooseLibrary,
    addVote
  },
  props: {
    editorOption: {
      type: Object,
      default: () => {
        return {
          placeholder: '请在这里输入',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike', { header: 1 }, { header: 2 }, { color: [] }, { background: [] }],
              [{ align: [] }, 'image'],
              ['editorLibrary', 'lolitaVote']
            ]
          }
        }
      }
    }
  },
  data () {
    return {
      quill: null,
      content: '',
      editorFileList: [],
      mouseIndex: 0
      // editorOption: {
      //   placeholder: '请在这里输入',
      //   modules: {
      //     toolbar: [
      //       ['bold', 'italic', 'underline', 'strike', { header: 1 }, { header: 2 }, { color: [] }, { background: [] }], // 加粗，斜体，下划线，删除线
      //       // ['blockquote', 'code-block'], // 引用，代码块
      //       // 标题，键值对的形式；1、2表示字体大小
      //       // [{ list: 'ordered' }, { list: 'bullet' }], // 列表
      //       // [{ script: 'sub' }, { script: 'super' }], // 上下标
      //       // [{ indent: '-1' }, { indent: '+1' }], // 缩进
      //       // [{ direction: 'rtl' }], // 文本方向
      //       // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
      //       // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
      //       // 字体颜色，字体背景颜色
      //       // [{ font: [] }], // 字体
      //       [{ align: [] }, 'image'], // 对齐方式
      //       // ['clean'], // 清除字体样式
      //       ['editorLibrary', 'lolitaVote']
      //     ]
      //   }
      // }
    }
  },
  mounted () {
    // const BlockEmbed = this.quill.import('quill/blots/embed')
    // console.log(BlockEmbed)
    // this.quill.register(libraryEditor)
    // this.quill.import('blots/inline')
  },
  methods: {
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      // console.log('editor ready!', quill)
      this.quill = quill
      const toolbar = this.quill.getModule('toolbar')
      toolbar.addHandler('image', (value) => {
        this.uploadType = 'image'
        if (value) {
          this.$refs.upload.$children[0].$refs.input.click()
        } else {
          this.quill.format('image', false)
        }
      })
      toolbar.addHandler('editorLibrary', (value) => {
        if (value) {
          console.log(this.quill.getSelection())
          if (this.quill.getSelection()) {
            this.mouseIndex = this.quill.getSelection().index
          } else {
            this.mouseIndex = 0
          }
          this.$refs.chooseLibrary.showModel()
        } else {
          this.quill.format('editorLibrary', false)
        }
      })
      toolbar.addHandler('lolitaVote', (value) => {
        if (value) {
          if (this.quill.getSelection()) {
            this.mouseIndex = this.quill.getSelection().index
          } else {
            this.mouseIndex = 0
          }
          this.$refs.addVote.showModel()
        } else {
          this.quill.format('editorLibrary', false)
        }
      })
    },
    addHtml () {
      // const quill = this.quill
      this.quill.insertEmbed(0, 'lolitaVote', '1')
    },
    onEditorChange ({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.$emit('change', html)
    },
    libraryChoose (item) {
      const cover = (item.square_cover && item.square_cover !== '') ? item.square_cover : item.cover
      if (item) {
        const str = `<a href="/library/detail/${item.library_id}" target="_blank" style="color:#000;display: flex; max-width: 400px;padding:10px; margin: 5px 0; box-shadow:0px 0px 10px #ccc; border-radius: 5px;text-decoration: none;"><s style="display: flex;text-decoration: none;"><img src="${this.BASE_IMG + cover}" style="width: 100px;height: 100px;object-fit: cover;" /><nobr style="padding-left: 10px;"><h3 style="color: #ffaa7f; padding: 5px 0; margin:5px 0;">${item.name}</h3><div style="display:flex;align-items: center;"><h3 style="margin:5px 0;">图鉴状态: </h3><h3 style="padding: 3px 5px;margin:5px 0 5px 5px;"">${item.state}</h3></div><div style="display:flex;align-items: center;"><h3 style="margin:5px 0;">图鉴类型: </h3><h3 style="padding: 3px 5px;margin:5px 0 5px 5px;">${item.library_type}</h3></div></nobr></s><a>`
        this.$nextTick(() => {
          this.quill.insertEmbed(this.mouseIndex, 'editorLibrary', str)
        })
      }
    },
    insertVote (data) {
      this.$nextTick(() => {
        this.quill.insertEmbed(this.mouseIndex, 'lolitaVote', data)
      })
    },
    handleChangeEditor (file, fileList) {
      console.log(file)
      const fileSize = 3
      const isLt = file.size / 1024 / 1024 < fileSize
      if (!isLt) {
        this.$message.error(`上传文件大小不能超过 ${fileSize} MB!`)
        return false
      }
      const file_type = file.raw.type.replace('image/', '')
      if (file_type !== 'png' && file_type !== 'jpg' && file_type !== 'jpeg') {
        this.$message.error('只能上传图片')
        return false
      }
      const fileName = 'editor/' + this.$store.getters.getUserInfo.user_id + '_' + new Date().getTime() + Math.ceil(Math.random() * 100) + '.' + file_type
      console.log(fileName)
      this.$client.put(fileName, file.raw)
        .then((res) => {
          if (res.url) {
            const quill = this.quill
            console.log(quill, '光标')
            // 如果上传成功
            const length = quill.getSelection().index || 0
            // 插入图片  res.url为服务器返回的图片地址
            const block = quill.insertEmbed(length, 'image', this.BASE_IMG + fileName)
            console.log(block)
            // 调整光标到最后
            quill.setSelection(length + 1)
          } else {
            this.$message.error('文件上传失败')
          }
        })
        .catch((err) => {
          this.$message.error('文件上传错误')
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less">
  .ql-editorLibrary{
    background: url(~@/assets/image/libraryEditor.png) !important;
    background-size: 100% 100% !important;
    height: 28px !important
  }
  .ql-lolitaVote{
    background: url(~@/assets/image/vote.png) !important;
    background-size: 100% 100% !important;
    height: 28px !important
  }
</style>
