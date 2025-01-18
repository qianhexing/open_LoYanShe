<template>
  <div>
    <el-drawer
      title="回复区"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()">
      <div class="reply-wrap">
        <div class="comment" v-if="comment">
          <nuxt-link :to="`/userSpace/` + comment.user_id" target="_blank" v-if="comment.user">
            <div class="qhx-user-face-wrap">
              <div class="qhx-user-face">
                <img :src="BASE_IMG + comment.user.user_face">
              </div>
              <img :src="BASE_IMG + comment.user.avatar.avatar_frame" class="qhx-user-avatar" v-if="comment.user.avatar && comment.user.avatar.avatar_frame !== null">
            </div>
          </nuxt-link>
          <div class="reply-info">
            <nuxt-link :to="`/userSpace/` + comment.user_id" target="_blank">
                <div class="user-name">{{comment.user.user_name}}</div>
                <el-tag size="mini" type="danger" effect="dark" style="transform: scale(0.6);">LV {{comment.user.level}}</el-tag>
            </nuxt-link>
            <div class="comment-content">
              <span v-html="comment.comment_content"></span>
            </div>
            <div class="qhx-tip">
              <div>{{formatDate(comment.date)}}</div>
              <div style="margin-left: 10px;" v-if="comment.floor && comment.floor !== '0'">{{comment.floor}}楼</div>
              <div :class="(check_reply !== null && comment.comment_id === check_reply.comment_id) ? 'comment-reply comment-reply-active' : 'comment-reply'"
              @click="show_reply(0, comment.comment_id)">回复</div>
            </div>
          </div>
        </div>
        <div class="qhx-line"></div>
        <div style="margin: 10px;">{{total}} 条回复</div>
        <div>
          <div v-for="list in list" :key="list.comment_id">
            <div class="reply-list">
              <nuxt-link :to="`/userSpace/` + list.user_id" target="_blank" v-if="list.user">
                <div class="qhx-user-face-wrap">
                  <div class="qhx-user-face">
                    <img :src="BASE_IMG + list.user.user_face">
                  </div>
                  <img :src="BASE_IMG + list.user.avatar.avatar_frame" class="qhx-user-avatar" v-if="list.user.avatar && list.user.avatar.avatar_frame !== null">
                </div>
              </nuxt-link>
              <div class="reply-info">
                <div>
                  <nuxt-link :to="`/userSpace/` + list.user_id" target="_blank">
                      <div class="user-name">{{list.user.user_name}}</div>
                      <el-tag size="mini" type="danger" effect="dark" style="transform: scale(0.6);">LV {{list.user.level}}</el-tag>
                  </nuxt-link>
                  <span class="user-name" v-show="list.reply_to !== 0">回复</span>
                  <nuxt-link :to="`/userSpace/` + list.reply_to" target="_blank" v-if="list.reply_to !== 0">
                      <div class="user-name">{{list.r_user_name}}</div>
                  </nuxt-link>
                </div>
                <div class="comment-content">
                  <span v-html="list.comment_content"></span>
                </div>
                <div class="qhx-tip">
                  <div>{{formatDate(list.date)}}</div>
                  <div style="margin-left: 10px;" v-if="list.floor && list.floor !== '0'">{{list.floor}}楼</div>
                  <div :class="(check_reply !== null && list.comment_id === check_reply.comment_id) ? 'comment-reply comment-reply-active' : 'comment-reply'"
                  @click="show_reply(list.user_id, list.comment_id, list.user.user_name)">回复</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无回复"></el-empty>
        <LoadMore :page="page"
        :pageSize="pageSize"
        :loading="loading"
        :total="total"
        @loadMore="getReplyByCommentId()"></LoadMore>
        <div>
          <div style="height: 48px;"></div>
          <transition
          appear
          name="animate__animated"
          enter-active-class="animate__animated animate__fadeInUp"
          leave-active-class="animate__animated animate__fadeOutDown">
            <div class="reply-box-wrao"  :style="{ width: $store.state.app.isMobile ? '100%' : '40%'}" v-if="check_reply !== null">
              <div class="reply-box">
                <el-input
                style="flex: 1;"
                size="mini"
                :placeholder="'回复 ' + check_reply.reply_name"
                 v-model="add_reply.content"></el-input>
                <div class="reply-box-btn" @click="insartReply()">发送</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getReplyByCommentId, insartComment } from '../api/comment.js'
import { formatDate } from '@/plugins/public.js'
export default {
  data () {
    return {
      show: false,
      list: [],
      comment: null,
      page: 0,
      pageSize: 10,
      total: 0,
      loading: false,
      add_reply: {
        content: ''
      },
      check_reply: null,
      reply_id: null, // 选择回复的id
      reply_name: null
    }
  },
  props: [
    'comment_id'
  ],
  methods: {
    formatDate,
    showModel () {
      this.show = true
      this.$nextTick(() => {
        this.getReplyByCommentId()
      })
    },
    closeModel () {
      this.$emit('close')
      this.init()
    },
    init () {
      this.page = 0
      this.pageSize = 10
      this.total = 0
      this.list = []
      this.comment = null
      this.check_reply = null
    },
    show_reply (user_id, comment_id, reply_name) {
      if (!this.$store.getters.getToken) {
        this.$message.warning('你必须登录后才可以回复')
        return false
      }
      const tem = {
        reply_to: user_id || 0,
        reply_name: reply_name || '',
        comment_id
      }
      if (this.check_reply === null) {
        this.check_reply = tem
      } else {
        if (this.check_reply.comment_id === comment_id) {
          this.check_reply = null
          return false
        }
        this.check_reply = tem
      }
    },
    insartReply () {
      if (this.check_reply === null) {
        this.$message.warning('请选择回复对象')
        return false
      }
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      const params = {
        id: Number(this.comment_id),
        type: 'reply',
        comment_content: this.add_reply.content,
        reply_to: this.check_reply.reply_to
      }
      insartComment(params)
        .then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.add_reply.content = ''
            this.check_reply = null
            this.$emit('reply')
            this.reload()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    reload () {
      const size = this.page * this.pageSize
      this.getReplyByCommentId(1, size)
    },
    getReplyByCommentId (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      const { comment_id } = this
      const params = {
        comment_id: parseInt(comment_id),
        page: page || this.page,
        pageSize: pageSize || this.pageSize
      }
      getReplyByCommentId(params)
        .then((res) => {
          if (res.code === 200) {
            const data = res.data
            this.total = data.count
            if (page === 1) {
              this.list = data.rows
            } else {
              this.list.push(...data.rows)
            }
            if (data.comment) {
              this.comment = res.data.comment
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
  .reply-wrap{
    position:  relative;
    .animate-05{
      transition: all 5s !important;
    }
    .comment-reply{
      margin: 0 5px;
      padding: 3px 5px;
      transition: 0.3s;
      cursor: pointer;
      position: relative;
    }
    .comment-reply-active{
      transition: 0.3s;
      color: #409EFF;
    }
    .comment-reply:hover{
      color: #409EFF;
    }
    .comment{
      display: flex;
      margin: 10px;
      .reply-info{
        flex: 1;
        margin: 0 10px;
        .user-name{
          font-size: 13px;
          margin: 10px 0 5px 0;
          color: #000000;
          display: inline-block;
        }
      }
    }
    .reply-list{
      display: flex;
      margin: 10px;
      .reply-info{
        flex: 1;
        margin: 0 10px;
        .user-name{
          font-size: 13px;
          margin: 10px 0 5px 0;
          color: #000000;
          display: inline-block;
        }
      }
    }
    .reply-box-wrao{
      width: 100%;
      position: fixed;
      bottom: 0;
      padding: 10px 0;
      background: #fff;
      box-shadow: 1px 1px 10px #ccc;
      .reply-box{
        display: flex;
        align-items: center;
        .reply-box-btn{
          background: #409EFF;
          color: #FFFFFF;
          padding: 5px 8px;
          margin-left: 1px;
          font-size: 12px;
          border-radius: 3px;
          box-shadow: 1px 1px 4px #ccc;
          cursor: pointer;
          transition: 0.3s;
        }
        .reply-box-btn:hover{
          background: #3A8EE6;
        }
      }
    }
  }
</style>
