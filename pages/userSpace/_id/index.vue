<template>
  <div class="space-comminty" v-loading="loading">
    <div v-for="list in community" :key="list.community_id" class="community-list">
      <nuxt-link :to="'/community/detail/' + list.community_id" :title="list.title" target="_blank">
        <div class="space-comminty-title">
          {{list.title}}
        </div>
      </nuxt-link>
      <div class="space-comminty-content">
        <span v-html="list.content"></span>
      </div>
      <div class="qhx-tip">
        <div>{{list.date}}</div>
      </div>
    </div>
    <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无动态"></el-empty>
    <LoadMore :page="page"
    :pageSize="pageSize"
    :loading="loading"
    :total="total"
    @loadMore="getCommunityList()"></LoadMore>
  </div>
</template>

<script>
import { formatCommunity } from '../../community/formatCommunity.js'
const pageSize = 10
export default {
  data () {
    return {
      page: 1,
      pageSize,
      total: 0,
      loading: false,
      community: []
    }
  },
  methods: {
    getCommunityList (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      this.$axios({
        method: 'post',
        url: '/getCommunityListFilter.php',
        data: {
          current: this.page,
          size: this.pageSize,
          search: [{
            op: 'equal',
            field: 'community.user_id',
            value: this.id
          }, {
            op: 'equal',
            field: 'community.is_open',
            value: 0
          }]
        }
      })
        .then((res) => {
          let data = res.data.data
          this.total = res.data.count
          if (data && data.length > 0) {
            // 格式化帖子
            data = formatCommunity(data)
          } else {
            data = []
          }
          if (page === 1) {
            this.community = data
          } else {
            this.community.push(...data)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  async asyncData ({ $axios, params }) {
    const id = params.id
    const res = await $axios({
      method: 'post',
      url: '/getCommunityListFilter.php',
      data: {
        current: 1,
        size: pageSize,
        search: [{
          op: 'equal',
          field: 'community.user_id',
          value: id
        }, {
          op: 'equal',
          field: 'community.is_open',
          value: 0
        }]
      }
    })
    let data = res.data.data
    const total = res.data.count
    if (data && data.length > 0) {
      // 格式化帖子
      data = formatCommunity(data)
    } else {
      data = []
    }
    return {
      community: data,
      total,
      id
    }
  }
}
</script>

<style scoped lang="less">
.space-comminty{
  .community-list{
    margin: 10px 0;
  }
  .space-comminty-title{
    margin: 3px;
    font-size: 16px;
    font-weight: bolder;
    transition: 0.3s;
    color: #000;
    display: inline-block;
  }
  .space-comminty-title:hover{
    color: #FFAA7F;
  }
}
</style>
