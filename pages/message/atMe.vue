<template>
  <div>
    <div class="pub-background">
      <div class="head-seat"></div>
      <div class="message-warp">
        <MessageHeader></MessageHeader>
        <div class="">
          <h4>共收到 {{ total }} 条评论</h4>
          <div v-for="list in list" :key="list.at_id">
            <div v-if="list.pk_type === 0 && list.comment" class="list">
              <div class="space-face-wrap">
                <div class="space-face">
                  <img :src="BASE_IMG + list.comment.user.user_face" >
                </div>
                <div v-if="list.comment.user.avatar && list.comment.user.avatar.avatar_frame" class="space-avatar">
                  <img :src="BASE_IMG + list.comment.user.avatar.avatar_frame">
                </div>
              </div>
              <div style="flex: 1;">
                <div>
                  <nobr class="user-name">
                    {{list.comment.user.user_name}}
                  </nobr>
                  <nobr style="margin: 0 5px;">
                    艾特了我
                  </nobr>
                  <nobr>
                    <nuxt-link :to="'/community/detail/' + list.comment.id" target="_blank" v-if="list.comment.type === 'community'">
                      <nobr class="list-content" v-html="list.comment.comment_content">
                      </nobr>
                    </nuxt-link>
                    <nuxt-link :to="'/library/detail/' + list.comment.community_id" target="_blank" v-else-if="list.comment.type === 'library'">
                      <nobr class="list-content" v-html="list.comment.comment_content">
                      </nobr>
                    </nuxt-link>
                    <nuxt-link :to="'/shop/detail/' + list.comment.community_id" target="_blank" v-else-if="list.comment.type === 'shop'">
                      <nobr class="list-content" v-html="list.comment.comment_content">
                      </nobr>
                    </nuxt-link>
                    <nuxt-link :to="'/compilations/detail/' + list.comment.community_id" target="_blank" v-else-if="list.comment.type === 'comp'">
                      <nobr class="list-content" v-html="list.comment.comment_content">
                      </nobr>
                    </nuxt-link>
                  </nobr>
                </div>
                <div class="qhx-tip">{{ dayjs(list.date).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </div>
              <el-tag size="mini" type="danger" v-show="list.notice === 0">未读</el-tag>
              <el-tag size="mini" v-show="list.notice === 1">已读</el-tag>
            </div>
            <div v-else  class="list">
              <div class="space-face-wrap">
                <div class="space-face">
                  <img :src="BASE_IMG + list.community.user.user_face" >
                </div>
                <div v-if="list.community.user.avatar && list.community.user.avatar.avatar_frame" class="space-avatar">
                  <img :src="BASE_IMG + list.community.user.avatar.avatar_frame">
                </div>
              </div>
              <div style="flex: 1;">
                <div>
                  <nobr class="user-name">
                    {{list.community.user.user_name}}
                  </nobr>
                  <nobr style="margin: 0 5px;">
                    在帖子里@了我
                  </nobr>
                  <nuxt-link :to="'/community/detail/' + list.community.community_id" target="_blank">
                    <nobr class="list-content" v-html="list.community.title">
                    </nobr>
                  </nuxt-link>
                </div>
                <div class="qhx-tip">{{ dayjs(list.date).format('YYYY-MM-DD HH:mm:ss') }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无数据"></el-empty>
        <LoadMore :page="page"
        :pageSize="pageSize"
        :loading="loading"
        :total="total"
        @loadMore="getNoticeAtuser()"></LoadMore>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoticeAtuser } from '@/api/notice.js'
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
    this.getNoticeAtuser()
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
    getNoticeAtuser (page, pageSize) {
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
      getNoticeAtuser(params)
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
.list{
  display: flex;
  align-items: center;
}
</style>
