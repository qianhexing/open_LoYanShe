<!--
 * @Author: qianhexing
 * @Date: 2023-02-24 00:56:39
 * @LastEditors: qianhexing
 * @LastEditTime: 2023-03-10 21:15:29
 * @FilePath: \ssr-lolita\pages\vote\_id.vue
-->
<template>
  <div class="pub-background">
    <div v-if="voteDetail" class="vote">
      <div class="lolita-vote-title">
        <span>{{voteDetail.vote_title}}</span>
        <span class="qhx-tip">{{voteDetail.vote_number}}人已参与</span>
      </div>
      <!-- 投票选项 -->
      <div>
        <div v-for="list in voteDetail.vote_options" :key="list.options_id" class="lolita-vote-options" @click="choose(list.options_id)">
          <span class="lolita-options-icon" :style="{ borderRadius: voteDetail.vote_type === 0 ? '50%' : '5px' }">
            <i v-show="vote_is_check(list.options_id)" class="el-icon-check" />
          </span>
          <span class="options-content">
            <richText :content="list.options_content" />
            <!-- {{ list.options_content }} -->
          </span>
          <span class="qhx-tip" style="padding: 0 8px">票数：{{ list.options_number }}</span>
        </div>
      </div>
      <div style="text-align: left; margin-top: 10px;">
        <el-button type="primary" @click="insertVoteRecord()" size="mini" v-if="isLogin && !voteIsVote">
          {{ isLogin ? voteIsVote ? '已投票' : '投票' : '请先登录' }}
        </el-button>
        <el-button v-else-if="isLogin && voteIsVote" type="danger" size="mini">
          {{ isLogin ? voteIsVote ? '已投票' : '投票' : '请先登录' }}
        </el-button>
        <el-button size="mini" v-else>
          请先登录
        </el-button>
      </div>
      <div style="margin-top: 10px" class="qhx-tip">
        <span>创建时间：{{ dayjs(voteDetail.create_time).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getVoteDetail, getVoteIsVote, insertVoteRecord } from '@/api/vote'
import richText from '~/components/richText.vue'
export default {
  components: {
    richText
  },
  layout: 'blankLayout',
  data () {
    return {
      voteDetail: {},
      voteIsVote: false,
      check_list: []
    }
  },
  computed: {
    // 获取用户信息
    userInfo () {
      return this.$store.state.user.userInfo
    },
    // 获取token
    isLogin () {
      if (this.$store.getters.getToken) {
        return true
      } else {
        return false
      }
    },
    vote_is_check () {
      return (item) => {
        const index = this.check_list.findIndex((val) => {
          return val === item
        })
        console.log(index, this.check_list, '投票选项')
        if (index !== -1) {
          return true
        } else {
          return false
        }
      }
    }
  },
  mounted () {
    window.addEventListener('message', (e) => {
    }, false)
    this.$nextTick(() => {
      this.getVoteDetail()
      if (this.$store.getters.getToken) {
        this.getVoteIsVote()
      }
    })
  },
  methods: {
    // 获取用户是否投票
    getVoteIsVote () {
      getVoteIsVote({ vote_id: parseInt(this.$route.params.id) })
        .then((res) => {
          console.log(res.data, '投票状态')
          if (res.data === false) {
            this.voteIsVote = false
          } else {
            this.voteIsVote = true
            const check = []
            res.data.forEach((item) => {
              check.push(item.options_id)
            })
            console.log(check, 'check')
            this.check_list = check
          }
        })
    },
    insertVoteRecord () {
      const params = {
        vote_id: parseInt(this.$route.params.id),
        options_id: this.check_list
      }
      insertVoteRecord(params)
        .then((res) => {
          if (res.code === 200) {
            this.$message.success('投票成功')
            this.voteIsVote = true
            this.getVoteDetail()
          }
        })
    },
    is_check (item) {
      if (this.voteIsVote) {
        return false
      }
      const index = this.check_list.findIndex((val) => {
        return val === item
      })
      console.log(index, this.check_list, 'index')
      if (index !== -1) {
        return true
      } else {
        return false
      }
    },
    choose (item) {
      if (this.voteIsVote) {
        return false
      }
      const index = this.check_list.findIndex((val) => {
        return val === item
      })
      if (index !== -1) {
        this.check_list.splice(index, 1)
      } else if (this.voteDetail.vote_type === 0) {
        this.check_list = [item]
      } else {
        this.check_list.push(item)
      }
    },
    // 获取投票详情
    getVoteDetail () {
      getVoteDetail({ vote_id: parseInt(this.$route.params.id) })
        .then((res) => {
          this.voteDetail = res.data
          this.$nextTick(() => {
            // iframe通知父元素改变高度、
            window.parent.postMessage({ changeHeight: document.body.scrollHeight }, '*')
          })
        })
    },
    vote () {
      console.log(this)
    }
  }
}
</script>

<style lang="less" scoped>
.pub-background{
  padding: 20px 15px;
  border-radius: 5px;
}
.vote{
  width: calc(100%);
  text-align: center;
  padding: 10px 0;
  border-radius: 5px;
  .lolita-vote-title{
    font-weight: bold;
    display: flex;
    justify-content: center;
    justify-content: space-between;
    line-height: 18px;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    word-break: break-word;
    word-wrap: break-word;
  }
  .lolita-vote-options{
    margin: 10px 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    padding: 10px 0;
    .lolita-options-icon{
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background-color: #ffaa7f;
      margin: 0 10px;
      i{
        color: #fff;
      }
    }
    .options-content{
      flex: 1;
      text-align: left;
      padding: 0 10px;
      word-break: break-word;
      word-wrap: break-word;
    }
  }
  .lolita-vote-options:hover{
    background: rgba(#ffaa7f, 0.6);
  }
}
@media screen and (min-width: 750px) {
}
@media screen and (max-width: 750px) {
}
</style>
