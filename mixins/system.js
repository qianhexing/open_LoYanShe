import Vue from 'vue'

export function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  components: {},
  data () {
    return {
      loading: () => this.$loading({
        lock: true,
        text: '加载中请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      }),
      imageSize: 300
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
    toDetail (id, title) {
      this.$router.push({
        path: `${this.url.detail}/${id}`,
        title
      })
    },
    thumbnail (url) {
      return `${Vue.prototype.BASE_IMG}${url}?x-oss-process=image/quality,q_80/resize,w_${this.imageSize}`
    }

  }
}
