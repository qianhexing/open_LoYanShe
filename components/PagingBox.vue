<template>
  <div>
    <!-- <div class="">子组件 {{total}} {{current}} {{Math.ceil(total / pageSize)}}总页数{{getPaging}}</div> -->
    <div class="pagin-box" v-if="Math.ceil(this.total / this.pageSize) > 1">
      <div class="pagin-list" v-show="current !== 1">
        <nuxt-link :to="to + 1 + (query ? ('?' + query ): '')" title="洛丽塔图书馆">
          首页
        </nuxt-link>
      </div>
      <div :class="current == item ? 'pagin-list active' : 'pagin-list'" v-for="(item, index) in getPaging" :key="index">
        <nuxt-link :to="to + item + (query ? ('?' + query ): '')" title="洛丽塔图书馆">
          {{item}}
        </nuxt-link>
      </div>
      <div class="pagin-list" v-show="current !== Math.ceil(total / pageSize)">
        <nuxt-link :to="to + Math.ceil(total / pageSize) + (query ? ('?' + query ): '')" title="洛丽塔图书馆">
          尾页
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  computed: {
    getPaging () {
      const maxPage = Math.ceil(this.total / this.pageSize)
      const current = this.current
      let paging = []
      if (maxPage < 6) {
        for (let i = 1; i <= maxPage; i++) {
          paging.push(i)
        }
      } else if (current - 3 < 0) {
        paging = [1, 2, 3, 4, 5, 6]
      } else if (maxPage - current < 3) {
        paging = [maxPage - 5, maxPage - 4, maxPage - 3, maxPage - 2, maxPage - 1, maxPage]
      } else {
        paging = [current - 2, current - 1, current, parseInt(current) + 1, parseInt(current) + 2]
      }
      return paging
    }
  },
  props: [
    'total',
    'pageSize',
    'current',
    'to',
    'query'
  ]
}
</script>

<style scoped lang="less">
  .pagin-box{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-bottom: 20px;
    a{
      color: #fff;
    }
    .pagin-list{
      padding: 2px 8px;
      color: #fff;
      background: #ffaa7f;
      margin: 5px;
      border-radius: 3px;
      cursor: pointer;
    }
    .active{
      background: #1f91c1;
    }
  }
</style>
