<template>
  <div :class="collect ? 'iconfont icon icon-dianzan active' : 'iconfont icon icon-dianzan'" @click="insertGood()"></div>
</template>

<script>
export default {
  data () {
    return {
      collect: false
    }
  },
  watch: {
    is_collect (newValue) {
      this.collect = this.is_collect
    }
  },
  mounted () {
    this.collect = this.is_collect
  },
  props: {
    is_collect: {
      type: Boolean,
      default: false
    },
    pk_id: [String, Number],
    collect_type: Number
  },
  methods: {
    insertGood () {
      // const { collect_type, pk_id } = this
      // const params = {
      //   collect_type,
      //   pk_id: parseInt(pk_id)
      // }
      if (!this.$store.getters.getToken) {
        this.$message.warning('请先登录')
        return false
      }
      // insertGood(params)
      //   .then((res) => {
      //     const { code, data } = res
      //     if (code === 200) {
      //       this.$message.success(data ? '点赞成功' : '取消成功')
      //       this.good = data
      //       this.$emit('success', data)
      //     }
      //   })
    }
  }
}
</script>

<style>
</style>
