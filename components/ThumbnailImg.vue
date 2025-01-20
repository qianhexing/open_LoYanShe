<template>
  <img :src="thumbnailUrl" :title="title" alt="">
</template>
<script >
import Vue from 'vue'
import { getFileExtension } from '@/plugins/public.js'

export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    imageSize: {
      type: Number,
      default: 300
    },
    quality: {
      type: Number,
      default: 80
    }
  },
  data () {
    return {
    }
  },
  computed: {
    thumbnailUrl () {
      const file_type = getFileExtension(this.url)
      if (file_type === 'gif') {
        return `${Vue.prototype.BASE_IMG}${this.url}`
      } else {
        return `${Vue.prototype.BASE_IMG}${this.url}?x-oss-process=image/quality,q_${this.quality}/resize,w_${this.imageSize}`
      }
    }
  },
  watch: {
  },
  created () {
  },
  activated () {
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped lang="less">

</style>
