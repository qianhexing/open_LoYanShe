<template>
  <div>
    <div class="pub-background">
      <div class="head-seat"></div>
      <div class="message-warp">
        <MessageHeader></MessageHeader>
        <div class="comment-wrap">
          <h4>共收到 {{ total }} 条评论</h4>
          <div class="list" v-for="list in list" :key="list.comment_id">
            <div class="space-face-wrap">
              <div class="space-face">
                <img :src="BASE_IMG + list.user_face" >
              </div>
              <div v-if="list.avatar_frame" class="space-avatar">
                <img :src="BASE_IMG + list.avatar_frame">
              </div>
            </div>
            <div style="flex: 1;">
              <div>
                <nobr class="user-name">
                  {{list.user_name}}
                </nobr>
                <nobr style="margin: 0 5px;">
                  {{ list.type === 'community' ? '评论了我' : '回复了我'}}
                </nobr>
                <nobr>
                  <nuxt-link :to="'/community/detail/' + list.id" target="_blank" v-if="list.type === 'community'">
                    <nobr class="list-content" v-html="list.comment_content">
                    </nobr>
                  </nuxt-link>
                  <nuxt-link :to="'/community/detail/' + list.community_id" target="_blank" v-else-if="list.type === 'reply'">
                    <nobr class="list-content" v-html="list.comment_content">
                    </nobr>
                  </nuxt-link>
                </nobr>
              </div>
              <div class="qhx-tip">{{ dayjs(list.date).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <el-tag size="mini" type="danger" v-show="list.notice === 0">未读</el-tag>
            <el-tag size="mini" v-show="list.notice === 1">已读</el-tag>
          </div>
        </div>
        <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无评论"></el-empty>
        <LoadMore :page="page"
        :pageSize="pageSize"
        :loading="loading"
        :total="total"
        @loadMore="getNoticeComment()"></LoadMore>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoticeComment } from '@/api/notice.js'
import { getCurrentTime } from '@/api/home.js'
export default {
  layout: 'BaseLayout',
  data () {
    return {
      page: 0,
      pageSize: 10,
      total: 0,
      list: [],
      loading: false,
      current_time: null
    }
  },
  async mounted () {
    await this.getCurrentTime()
    this.getNoticeComment()
  },
  methods: {
    async getCurrentTime () {
      await getCurrentTime()
        .then((res) => {
          const { data, code } = res
          if (code === 200) {
            this.current_time = data
            console.log(data, '当前时间')
          }
        })
    },
    getNoticeComment (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      const { current_time } = this
      this.loading = true
      const params = {
        page: page || this.page,
        pageSize: pageSize || this.pageSize
      }
      if (current_time) {
        params.current_time = current_time
      }
      getNoticeComment(params)
        .then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.total = res.data.count
            if (params.page === 1) {
              this.list = res.data.rows
            } else {
              this.list.push(...res.data.rows)
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="less">
@import  '@/pages/message/index.less';
.comment-wrap{
  .list{
    display: flex;
    align-items: center;
    .list-content{
      cursor: pointer;
      transition: 0.3s;
      color: #ffaa7f;
    }
  }
  .user-name{
    font-weight: bold;
    color: #ffaa7f;
  }
}
</style>
