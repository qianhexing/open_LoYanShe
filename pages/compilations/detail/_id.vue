<template>
  <div>
    <div class="comp-detail-wrap" v-if="compilations">
      <div class="comp-back" :style="{background: 'url(' + BASE_IMG + compilations.comp_cover +')', 'background-size': 'cover'}"></div>
      <div class="head-seat"></div>
      <div class="comp-detail-box">
        <div class="comp-detail-left">
          <div class="comp-detail-info">
            <div class="comp-detail-cover">
              <img :src="BASE_IMG + compilations.comp_cover" >
            </div>
            <div class="qhx-title" style="color: #f56c6c;">
              {{compilations.comp_name}}
            </div>
            <div class="qhx-text">
              {{compilations.comp_describe}}
            </div>
            <div class="qhx-title" style="color: #f56c6c;">
              合集管理员
            </div>
            <div class="comp-admin">
              <div class="comp-admin-face">
                <img :src="BASE_IMG + compilations.user_face" >
              </div>
              <div class="comp-admin-info">
                <div class="comp-admin-name">
                  {{compilations.user_name}}
                </div>
                <el-tag size="mini" type="danger">UID {{compilations.user_id}}</el-tag>
              </div>
            </div>
            <div class="qhx-text">
              <el-tag size="mini" type="warning">合集收录 {{total}}</el-tag>
            </div>
            <div class="qhx-title" style="color: #f56c6c;">
              评论区
            </div>
            <CommentSection :type="'comp'" :id="id"></CommentSection>
            <!-- <div style="margin: 15px 0;">
              <a target="_blank" href="https://s.click.taobao.com/t?union_lens=lensId%3AOPT%401662996847%4021049e52_0ba6_18332561a06_447d%4001%3BeventPageId%3A20150318020012640&e=m%3D2%26s%3DKQGGO6VkGgscQipKwQzePCperVdZeJviU%2F9%2F0taeK29yINtkUhsv0Kn3mIlxzAoxwdGTP5v7Esr3i5j3zWmts%2BOSR1oowSQnhXWDVnTd4sJrqPgKbSBOBpnWtijfqJw3AGIx0oe2X2hZfJ7ZQxC1%2Fb%2BmvmXqUq2iEBnEBk3xaGylLmcSHKfaX1CIFRJhZoJ2keMqUwSQcLSwn1IXvusdyogaseAKBk0cEzJFLUun%2BFGDWrJcI%2B9mMkt2lYwodYMFf7Le49%2F8qY%2BP%2BRk9cvLur7kaAOxYUezte5Cw%2FDX6F%2FcpmJbm7qWNbenfmF4kFaTFLk06LsdxhxJVXRkZOvK%2FVyaa21c5k%2BY9UIiwjLEnvGYhhQs2DjqgEA%3D%3D">
                <img :src="DOMAIN_NAME + '/static/guangao.jpg'" style="width: 100%;">
              </a>
            </div> -->
          </div>
        </div>
        <div class="comp-detail-right">
          <LibraryList :list="library_list"></LibraryList>
          <LoadMore :page="page"
          :pageSize="pageSize"
          :loading="loading"
          :total="total"
          @loadMore="getLibraryList()"></LoadMore>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LibraryList from '@/components/library/LibraryList.vue'
import LoadMore from '@/components/LoadMore.vue'
export default {
  data () {
    return {
      compilations: null,
      library_list: [],
      total: 0,
      page: 1,
      pageSize: 20,
      loading: false
    }
  },
  components: {
    LibraryList,
    LoadMore
  },
  head () {
    return {
      title: this.compilations ? this.compilations.comp_name + '-Lo研社' : 'Lo研社',
      meta: [
        {
          name: 'keywords',
          content: 'Lo研社,lolita图书馆,Lolita店铺'
        },
        {
          hid: 'description',
          name: 'names',
          content: '洛丽塔小裙子百科全书,' + this.compilations !== null ? this.compilations.comp_describe : ''
        }
      ]
    }
  },
  methods: {
    getLibraryList () {
      console.log('加载更多', this.$route.params.id)
      this.loading = true
      this.page += 1
      this.$axios({
        method: 'post',
        url: '/compilations/getCompilationsLibraryList.php',
        data: {
          comp_id: this.$route.params.id,
          current: this.page,
          size: this.pageSize
        }
      })
        .then((res) => {
          console.log(res)
          const data = res.data.data
          this.library_list.push(...data)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  layout: 'BaseLayout',
  async asyncData ({ $axios, params }) {
    const id = params.id
    const res = await $axios({
      method: 'post',
      url: '/getCompilationsById.php',
      data: {
        comp_id: id
      }
    })
    const library_res = await $axios({
      method: 'post',
      url: '/compilations/getCompilationsLibraryList.php',
      data: {
        comp_id: id,
        current: 1,
        size: 20
      }
    })
    const library_list = library_res.data.data
    const total = library_res.data.count
    const compilations = res.data.data
    return {
      compilations,
      library_list,
      total,
      id
    }
  }
}
</script>

<style scoped lang="less">
  .comp-detail-wrap{
    position: relative;
    .comp-back{
      width: 100%;
      height: 100vh;
      position: fixed;
      z-index: -1;
    }
  }
  .comp-detail-box{
    .comp-detail-left{
      .comp-detail-info{
        padding: 20px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 1px 1px 10px #ccc;
        border-radius: 5px;
        .comp-detail-cover{
          width: 100%;
          img{
            width: 100%;
          }
        }
        .comp-admin{
          display: flex;
          align-items: center;
          .comp-admin-face{
            width: 50px;
            height: 50px;
            overflow: hidden;
            margin: 10px;
            border-radius: 50%;
            img{
              width: 100%;
            }
          }
          .comp-admin-info{
            .comp-admin-name{
              font-weight: bolder;
              margin: 5px 0;
              color: #f56c6c;
            }
          }
        }
      }
    }
    .comp-detail-right{
      background: rgba(255, 255, 255, 1);
      padding-top: 20px;
      border-radius: 5px;
    }
  }
  @media screen and (min-width: 750px) {
    .comp-detail-box{
      display: flex;
      margin: 25px 20px;
      flex-direction: row-reverse;
      .comp-detail-info{
        width: 420px;
      }
      .comp-detail-right{
        margin-right: 10px;
        flex: 1;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .comp-detail-box{
      .comp-detail-left{
        margin-top: 25px;
      }
      .comp-detail-right{
        margin-top: 15px;
      }
    }
  }
</style>
