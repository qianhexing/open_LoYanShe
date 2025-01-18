<template>
  <div :class="good ? 'iconfont icon icon-dianzan active' : 'iconfont icon icon-dianzan'" @click="insertGood()"></div>
</template>

<script>
import { insertGood } from '@/api/good.js'
export default {
  data () {
    return {
      good: false
    }
  },
  watch: {
    is_good (newValue) {
      this.good = this.is_good
    }
  },
  mounted () {
    this.good = this.is_good
  },
  props: {
    is_good: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    pk_id: [String, Number],
    pk_type: Number
  },
  methods: {
    insertGood () {
      const { pk_type, pk_id, type } = this
      const params = {
        pk_type,
        pk_id: parseInt(pk_id),
        type
      }
      if (!this.$store.getters.getToken) {
        this.$message.warning('请先登录')
        return false
      }
      insertGood(params)
        .then((res) => {
          const { code, data } = res
          if (code === 200) {
            this.$message.success(data ? '点赞成功' : '取消成功')
            this.good = data
            this.$emit('success', data)
          }
        })
    }
  }
}
</script>

<style scoped="scoped" lang="less">
  .active{
    color: #409EFF;
  }
  .icon{
    cursor: pointer;
  }
  .icon:hover{
    color: #409EFF;
  }
</style>
