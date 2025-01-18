<!--
 * @Author: qianhexing
 * @Date: 2023-03-11 20:17:09
 * @LastEditors: qianhexing
 * @LastEditTime: 2023-03-11 21:51:17
 * @FilePath: \ssr-lolita\components\imageViewer.vue
-->
<template>
  <div>
    <el-image-viewer v-if="showImage" :initial-index="initialIndex" :on-close="onClose" :url-list="urlList" style="z-index: 9999;" />
  </div>
</template>

<script>
export default {
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    showImage: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    onSwitch: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
    }
  },
  watch: {
    showImage (val) {
      if (val) {
        // 阻止默认滚动事件
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  methods: {
    handleClose () {
      this.onClose()
    }
  }
}
</script>
