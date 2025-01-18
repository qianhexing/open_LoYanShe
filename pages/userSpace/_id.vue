<template>
  <div class="pub-background space-wrap">
    <div class="head-seat"></div>
    <div class="space-user-info" v-if="user_info">
      <div class="space-face-wrap">
        <div class="space-face">
          <img :src="BASE_IMG + user_info.user_face" >
        </div>
        <div v-if="user_info.avatar && user_info.avatar.avatar_frame" class="space-avatar">
          <img :src="BASE_IMG + user_info.avatar.avatar_frame">
        </div>
      </div>
      <div class="user-info">
        <div class="user-name">{{user_info.user_name}}
          <el-tag size="mini" type="danger" effect="dark" style="transform: scale(0.6);">LV {{user_info.level}}</el-tag>
        </div>
        <div class="signature">个性签名功能，还没做ฅ( ̳• ◡ • ̳)ฅ</div>
        <!-- {{user_info}} -->
      </div>
    </div>
    <div class="space-mian">
      <div class="space-nav">
        <nuxt-link :to="`/userSpace/` + id" title="动态" class="nav-list" active-class="active" exact>
            <nav>动态</nav>
        </nuxt-link>
        <nuxt-link :to="`/userSpace/${id}/userWardrobe`" title="衣柜" class="nav-list" active-class="active">
            <nav>衣柜</nav>
        </nuxt-link>
        <nuxt-link :to="`/userSpace/${id}/userFavorite`" title="收藏" class="nav-list" active-class="active">
            <nav>收藏</nav>
        </nuxt-link>
      </div>
      <nuxt-child/>
    </div>
  </div>
</template>

<script>
import { getUserSaceInfoById } from '../../api/userSpace.js'
export default {
  layout: 'UserLayout',
  data () {
    return {
      loading: false,
      user_info: null,
      id: null
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      getUserSaceInfoById(this.id)
        .then((r) => {
          this.user_info = r.data
        })
    }
  },
  asyncData ({ $axios, params }) {
    const id = parseInt(params.id)
    return {
      id
    }
  }
}
</script>

<style scoped lang="less">
  .space-wrap{
    .space-user-info{
      display: flex;
      padding: 100px 20px 20px 20px;
      max-width: 1200px;
      background: #FFFFFF;
      margin: 0 auto;
      box-shadow: 1px 1px 10px #CCCCCC;
      .user-info{
        margin-left: 10px;
        .user-name{
          font-size: 18px;
          font-weight: bolder;
          color: #FFAA7F;
          margin: 6px 0;
        }
        .signature{
          font-size: 14px;
        }
      }
    }
    .space-mian{
      max-width: 1200px;
      padding: 0 20px;
      background: #FFFFFF;
      box-shadow: 1px 1px 10px #CCCCCC;
      margin: 10px auto;
    }
    .space-nav{
      max-width: 1200px;
      padding: 20px 0;
      background: #FFFFFF;
      display: flex;
      .nav-list{
        font-size: 16px;
        padding: 10px;
        margin-right: 10px;
        color: #000;
        transition: 0.3s;
      }
      .active{
        color: #409EFF;
        border-bottom: 2px solid #409EFF;
      }
    }
  }
</style>
