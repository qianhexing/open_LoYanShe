<template>
  <div class="pub-load-more">
    <div v-show="total !== 0">
      <div v-show="loading">
        <i class="el-icon-loading"></i>
      </div>
      <div v-show="!loading">
        <div class="load-more" v-if="has_more" @click="loadMore()">
          加载更多
        </div>
        <div v-else>
          没有更多(o°ω°o)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    has_more () {
      const maxPage = Math.ceil(this.total / this.pageSize)
      const page = this.page
      let has_more = false
      if (page < maxPage) {
        has_more = true
      } else {
        has_more = false
      }
      return has_more
    }
  },
  props: [
    'total',
    'page',
    'pageSize',
    'loading'
  ],
  methods: {
    loadMore () {
      if (this.loading) {
        this.$message.warning('加载中请稍后')
        return false
      }
      if (this.page < Math.ceil(this.total / this.pageSize)) {
        this.$emit('loadMore')
      } else {
        this.$message.warning('没有更多')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .pub-load-more{
    text-align: center;
    padding: 20px 10px;
    .load-more{
      color: #409EFF;
      cursor: pointer;
    }
  }
</style>
