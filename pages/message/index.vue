<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <div class="message-warp">
      <MessageHeader></MessageHeader>
      <h4>共有 {{total}} 条未读通知</h4>
      <div class="qhx-tip">通知阅读后会被删除，对应消息模块里存有消息记录</div>
      <div class="list-wrap">
        <div class="list" v-for="(list, index) in list" :key="index">
          <div v-if="list.info">
            <!-- 通知是 艾特类型 -->
            <div v-if="list.pk_type === 3">
              <div v-if="list.info.pk_type === 0">
                <div v-if="list.info.comment" class="list-main">
                  <div class="space-face-wrap">
                    <div class="space-face">
                      <img :src="BASE_IMG + list.info.comment.user.user_face" >
                    </div>
                    <div v-if="list.info.comment.user.avatar && list.info.comment.user.avatar.avatar_frame" class="space-avatar">
                      <img :src="BASE_IMG + list.info.comment.user.avatar.avatar_frame">
                    </div>
                  </div>
                  <div class="message-main">
                    <div>
                      <nobr class="user-name">
                        {{list.info.comment.user.user_name}}
                      </nobr>
                      <nobr style="margin-right: 5px;">
                        @了我
                      </nobr>
                      <el-tag size="mini">评论</el-tag>
                      <nuxt-link :to="getUrl(list.info.comment.type) + list.info.comment.id" target="_blank">
                        <nobr class="list-content" v-html="list.info.comment.comment_content"></nobr>
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 帖子类型 -->
              <div v-else-if="list.info.pk_type === 1">
                <div v-if="list.info.community" class="list-main">
                  <div class="message-main">
                    <div v-if="list.info.community" class="list-main">
                      <div class="space-face-wrap">
                        <div class="space-face">
                          <img :src="BASE_IMG + list.info.community.user.user_face" >
                        </div>
                        <div v-if="list.info.community.user.avatar && list.info.community.user.avatar.avatar_frame" class="space-avatar">
                          <img :src="BASE_IMG + list.info.community.user.avatar.avatar_frame">
                        </div>
                      </div>
                      <nobr class="user-name">
                        {{list.info.community.user.user_name}}
                      </nobr>
                      <nobr style="margin-right: 5px;">
                        提到了我
                      </nobr>
                      <el-tag size="mini">帖子</el-tag>
                      <nuxt-link :to="'/community/detail/' + list.info.community.community_id" target="_blank">
                        <nobr class="list-content" v-html="list.info.community.title">
                        </nobr>
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 通知是 艾特类型 end-->
            <!-- 通知是 评论类型 -->
            <div v-else-if="list.pk_type === 1">
              <div class="list-main">
                <div class="space-face-wrap">
                  <div class="space-face">
                    <img :src="BASE_IMG + list.info.user.user_face" >
                  </div>
                  <div v-if="list.info.user.avatar && list.info.user.avatar.avatar_frame" class="space-avatar">
                    <img :src="BASE_IMG + list.info.user.avatar.avatar_frame">
                  </div>
                </div>
                <nobr class="user-name">
                  {{list.info.user.user_name}}
                </nobr>
                <nobr style="margin-right: 5px;">
                  评论了我
                </nobr>
                <el-tag size="mini" style="margin-right: 5px;">评论</el-tag>
                <nuxt-link :to="'/community/detail/' + list.info.id" target="_blank">
                  <div class="list-content" v-html="list.info.comment_content">
                  </div>
                </nuxt-link>
              </div>
            </div>
            <!-- 通知是 评论类型 end-->
            <!-- 通知是 回复类型 -->
            <div v-else-if="list.pk_type === 2">
              <div class="list-main">
                <div class="space-face-wrap">
                  <div class="space-face">
                    <img :src="BASE_IMG + list.info.user.user_face" >
                  </div>
                  <div v-if="list.info.user.avatar && list.info.user.avatar.avatar_frame" class="space-avatar">
                    <img :src="BASE_IMG + list.info.user.avatar.avatar_frame">
                  </div>
                </div>
                <nobr class="user-name">
                  {{list.info.user.user_name}}
                </nobr>
                <nobr style="margin-right: 5px;">
                  回复了我
                </nobr>
                <el-tag size="mini" style="margin-right: 5px;">回复</el-tag>
                <nuxt-link :to="'/community/detail/' + list.info.comment.id" target="_blank" v-if="list.info.comment">
                  <div class="list-content" v-html="list.info.comment_content">
                  </div>
                </nuxt-link>
              </div>
            </div>
            <!-- 通知是 回复end -->
          </div>
        </div>
        <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无通知"></el-empty>
        <LoadMore :page="page"
        :pageSize="pageSize"
        :loading="loading"
        :total="total"
        @loadMore="getNoticeList()"></LoadMore>
      </div>
    </div>
  </div>
</template>

<script>
// import formatCommunity from '../community/formatCommunity.js'
import MessageHeader from '../../components/message/MessageHeader.vue'
import { getNoticeList } from '@/api/notice.js'
export default {
  layout: 'BaseLayout',
  components: {
    MessageHeader
  },
  data () {
    return {
      loading: false,
      list: [],
      page: 1,
      pageSize: 2,
      total: 0
    }
  },
  mounted () {
    this.getNoticeList()
  },
  methods: {
    getUrl (type) {
      let url = ''
      if (type === 'comp') {
        url = '/compilations/detail/'
      } else if (type === 'community') {
        url = '/community/detail/'
      } else if (type === 'library') {
        url = '/library/detail/'
      }
      return url
    },
    getNoticeList () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      const { page, pageSize } = this
      const params = {
        page,
        pageSize
      }
      this.loading = true
      getNoticeList(params)
        .then((res) => {
          console.log(res)
          const { code, data } = res
          if (code === 200) {
            const { rows, count } = data
            // const list = []
            this.list = rows
            this.total = count
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
  .message-warp{
    max-width: 1100px;
    padding: 20px;
    margin: 20px auto;
    background: #fff;
    border-radius: 5px;
    .list{
      margin: 10px 0;
      .list-main{
        display: flex;
        align-items: center;
      }
      .list-content{
        cursor: pointer;
        transition: 0.3s;
        color: #ffaa7f;
      }
      .user-name{
        font-weight: bold;
        color: #ffaa7f;
      }
      .space-face-wrap{
        width: 60px;
        height: 60px;
        position: relative;
        margin-right: 10px;
        .space-face{
          width: 60px;
          height: 60px;
          img{
            width: 50px;
            height: 50px;
            margin: 5px;
            border-radius: 50%;
            overflow: hidden;
          }
        }
        .space-avatar{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          img{
            width: 100%;
          }
        }
      }
    }
  }
</style>
