<template>
  <div class="comment-wrap">
    <div class="add-comment-wrap">
      <div v-if="$store.getters.getToken" class="add-comment">
        <div v-show="$store.getters.getUserInfo" class="user-face">
          <img :src="BASE_IMG + $store.getters.getUserInfo.user_face" >
        </div>
        <div class="comment-inp">
          <el-input type="textarea" v-model="add_comment.content" placeholder="发布一条友善的评论吧~"></el-input>
        </div>
        <div class="comment-btn">
          <el-button type="primary" @click="insartComment()">发布</el-button>
        </div>
      </div>
      <div v-else style="text-align: center; margin: 10px;">
        <nuxt-link :to="'/login'" style="color: #409EFF;">登录后评论</nuxt-link>
      </div>
    </div>
    <div v-for="list in comment_list" :key="list.comment_id">
      <div class="comment-list">
        <nuxt-link :to="`/userSpace/` + list.user.user_id" target="_blank">
          <div class="qhx-user-face-wrap">
            <div class="qhx-user-face">
              <img :src="BASE_IMG + list.user.user_face">
            </div>
            <img :src="BASE_IMG + list.user.avatar.avatar_frame" class="qhx-user-avatar" v-if="list.user.avatar && list.user.avatar.avatar_frame !== null">
          </div>
        </nuxt-link>
        <div class="comment-info">
          <nuxt-link :to="`/userSpace/` + list.user.user_id" target="_blank">
              <div class="user-name">{{list.user.user_name}}</div>
              <el-tag size="mini" type="danger" effect="dark" style="transform: scale(0.6);">LV {{list.user.level}}</el-tag>
          </nuxt-link>
          <div class="comment-content">
            <span v-html="list.comment_content"></span>
          </div>
          <div class="qhx-tip">
            <div>{{ dayjs(list.date).format('YYYY-MM-DD HH:mm:ss') }}</div>
            <div class="comment-footer-list" v-if="list.floor && list.floor !== '0'">{{list.floor}}楼</div>
            <el-badge :value="list.r_count" :max="99" class="item">
              <div class="comment-reply" @click="showReply(list.comment_id)">
                回复
              </div>
            </el-badge>
          </div>
        </div>
      </div>
    </div>
    <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无评论"></el-empty>
    <LoadMore :page="page"
    :pageSize="pageSize"
    :loading="loading"
    :total="total"
    @loadMore="getComment()"></LoadMore>
    <ReplySection
    :comment_id="comment_id"
    ref="reply"
    @close="comment_id = null"
    @reply="updateComment()"
    ></ReplySection>
  </div>
</template>

<script>
import { insartComment, getCommentList } from '@/api/comment.js'
export default {
  data () {
    return {
      page: 0,
      pageSize: 10,
      total: 0,
      comment_id: null,
      comment_list: [],
      add_comment: {
        content: ''
      },
      loading: false
    }
  },
  props: [
    'type',
    'id'
  ],
  mounted () {
    this.getComment()
    console.log(this)
  },
  methods: {
    getComment (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      const params = {
        page: page || this.page,
        pageSize: pageSize || this.pageSize,
        id: parseInt(this.id),
        type: this.type
      }
      // this.$axios({
      //   method: 'post',
      //   url: '/getComment.php',
      //   data: {
      //     id: this.id,
      //     type: this.type,
      //     current: page || this.page,
      //     size: pageSize || this.pageSize
      //   }
      // })
      getCommentList(params)
        .then((res) => {
          const data = res.data
          this.total = data.count
          if (page === 1) {
            this.comment_list = data.rows
          } else {
            this.comment_list.push(...data.rows)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    updateComment () {
      const index = this.comment_list.findIndex((value) => {
        return value.comment_id === this.comment_id
      })
      this.comment_list[index].r_count = parseInt(this.comment_list[index].r_count) + 1
    },
    reload () {
      const size = this.page * this.pageSize
      this.getComment(1, size)
    },
    insartComment () {
      if (this.add_comment.content.length === 0) {
        this.$message.warning('评论内容不可为空')
        return false
      }
      const params = {
        id: Number(this.id),
        type: this.type,
        comment_content: this.add_comment.content
      }
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      insartComment(params)
        .then((res) => {
          if (res.code === 200) {
            this.add_comment.content = ''
            this.reload()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    showReply (id) {
      this.comment_id = id
      this.$refs.reply.showModel()
    }
  }
}
</script>

<style scoped lang="less">
  .comment-wrap{
    width: 100%;
    .add-comment-wrap{
      .add-comment{
        display: flex;
        align-items: center;
        max-width: 900px;
        padding: 10px 15px;
        .user-face{
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: 10px;
          img{
            width: 100%;
          }
        }
        .comment-inp{
          flex: 1;
        }
        .comment-btn{
          margin-left: 15px;
        }
      }
    }
    .comment-list{
      display: flex;
      padding: 10px 15px;
      .comment-info{
        flex: 1;
        margin: 0 10px;
        img{
          max-width: 100%;
        }
        .user-name{
          font-size: 13px;
          margin: 10px 0 5px 0;
          color: #000000;
          display: inline-block;
        }
      }
    }
    .comment-footer-list{
      margin-left: 10px;
      color: #409EFF;
    }
    .comment-reply{
      margin: 0 5px;
      padding: 3px 5px;
      transition: 0.3s;
      cursor: pointer;
      position: relative;
    }
    .comment-reply:hover{
      color: #409EFF;
    }
    /deep/.el-badge__content.is-fixed{
      transform: translateY(-30%) translateX(80%) scale(0.7);
    }
  }
</style>
