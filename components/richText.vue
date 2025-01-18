<!--
 * @Author: qianhexing
 * @Date: 2023-02-26 00:04:45
 * @LastEditors: qianhexing
 * @LastEditTime: 2023-03-13 22:49:58
 * @FilePath: \ssr-lolita\components\richText.vue
-->
<template>
  <!-- 富文本组件 -->
  <div v-html="content" ref="ritchHtml"></div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      lolita_vote: []
    }
  },
  watch: {
    content () {
      this.getImg()
    }
  },
  mounted () {
    console.log(this.$store, '缓存')
    this.lolita_vote = this.$refs.ritchHtml.getElementsByClassName('lolita-vote')
    this.lolita_vote.forEach((item) => {
      // frame.contentWindow.postMessage(this.value, 'http://127.0.0.1:50874/')
      item.height = 0
      item.onload = () => {
        // item.contentWindow.postMessage('Hello to iframe from parent!', '*')
      }
    })
    this.getImg()
    // 监听图片点击事件
    this.$refs.ritchHtml.addEventListener('click', this.imgClick)
    // 哪个iframe发送过来的消息
    window.addEventListener('message', this.iframeLoad, false)
  },
  beforeDestroy () {
    // 清除监听
    this.$refs.ritchHtml.removeEventListener('click', this.imgClick)
    window.removeEventListener('message', this.iframeLoad, false)
  },
  methods: {
    // 获取所有图片标签，并且监听是否加载完成
    getImg () {
      const imgList = this.$refs.ritchHtml.getElementsByTagName('img')
      for (let i = 0; i < imgList.length; i++) {
        imgList[i].onload = () => {
          this.$emit('imgLoad')
        }
      }
    },
    imgClick (e) {
      if (e.target.tagName === 'IMG') {
        this.$emit('imgClick', e.target.src)
      }
    },
    iframeLoad (e) {
      const data = e.data
      const token = this.$store.getters.getToken
      console.log(e.source, '来源')
      if (e.origin === 'https://lolitalibrary.com' || e.origin === 'http://www.lolitalibrary.com' || e.origin === 'http://localhost:3004') {
        // 仅在数据发送来源自受信任的地址才执行对应操作
        if (data.changeHeight) {
          document.getElementById(e.source.name).height = data.changeHeight
          document.getElementById(e.source.name).contentWindow.postMessage({
            postToken: token
          }, '*')
        }
      }
      this.$emit('imgLoad')
    }
  }
}
</script>

<style>
  .lolita-vote{
    margin: 10px 0;
  }
</style>
