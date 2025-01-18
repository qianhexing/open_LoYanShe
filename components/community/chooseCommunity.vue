<template>
  <div>
    <el-drawer
      :title="'关联帖子'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()"
      :wrapperClosable="false">
      <div class="add-wrap" v-loading="loading">
        <el-input v-model="keywords" placeholder="输入检索帖子标题">
          <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="search()"></i>
        </el-input>
        <div class="community-list-wrap">
          <div class="community-list" @click="chooseCommunity(list)" v-for="list in list" :key="list.community_id">
            <!-- {{list}} -->
            <h4 class="community-title">{{ list.title }}</h4>
            <div v-html="list.content" class="community-content"></div>
          </div>
        </div>
      </div>
      <LoadMore :page="page"
      :pageSize="pageSize"
      :loading="loading"
      :total="total"
      @loadMore="getCommunityList()"></LoadMore>
    </el-drawer>
  </div>
</template>

<script>
import { formatCommunity } from '../../pages/community/formatCommunity.js'
import { getCommunityList } from '../../api/community.js'
export default {
  data () {
    return {
      keywords: '',
      page: 0,
      pageSize: 10,
      show: false,
      loading: false,
      total: 0,
      list: []
    }
  },
  props: {
    user_id: {
      type: Number,
      default: null
    }
  },
  methods: {
    showModel () {
      this.show = true
      this.getCommunityList()
    },
    search () {
      this.page = 0
      this.getCommunityList()
    },
    init () {
      this.keywords = ''
      this.page = 0
    },
    closeModel () {
      this.show = false
      this.init()
    },
    getCommunityList () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      this.page += 1
      const { page, pageSize, keywords } = this
      const params = {
        page,
        pageSize,
        where: {
          title: keywords
        }
      }
      if (this.user_id) {
        params.where.user_id = this.user_id
      }
      getCommunityList(params)
        .then((res) => {
          let data = res.data.rows
          this.total = res.data.count
          if (data.length > 0) {
            data = formatCommunity(data)
          }
          if (params.page === 1) {
            this.list = data
          } else {
            this.list.push(...data)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    chooseCommunity (list) {
      this.$emit('choose', list)
      this.closeModel()
    }
  }
}
</script>

<style scoped lang="less">
.add-wrap{
  margin: 0 10px;
  .community-title{
    margin: 5px 0;
  }
  .community-content{
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .community-list{
    padding: 10px;
    cursor: pointer;
    transition: 0.3s;
  }
  .community-list:hover{
    background: #ffdac7;
  }
}
</style>
