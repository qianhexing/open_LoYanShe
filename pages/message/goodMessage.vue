<template>
  <div>
    <div class="pub-background">
      <div class="head-seat"></div>
      <div class="message-warp">
        <MessageHeader></MessageHeader>
        建设中……
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
    // this.getNoticeComment()
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
