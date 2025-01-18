<template>
  <div>
    <div class="base-wrap">
      <div class="base-header-wrap">
        <div class="base-header">
          <nuxt-link :to="`/`" title="洛丽塔图书馆">
              <img :src="BASE_IMG + 'static/logo.png'" class="base-logo">
          </nuxt-link>
          <div class="base-nav">
            <nuxt-link :to="`/`" title="洛丽塔图书馆" class="base-nav-list" active-class="active" exact>
                <nav>主页</nav>
            </nuxt-link>
            <nuxt-link :to="`/library/`" title="洛丽塔图鉴" class="base-nav-list" active-class="active">
                <nav>图鉴</nav>
            </nuxt-link>
            <nuxt-link :to="`/shop/`" title="洛丽塔店铺" class="base-nav-list" active-class="active">
                <nav>店铺</nav>
            </nuxt-link>
            <nuxt-link :to="`/compilations/`" title="洛丽塔小裙子合集" class="base-nav-list" active-class="active">
                <nav>合集</nav>
            </nuxt-link>
            <nuxt-link :to="`/community/`" title="社区" class="base-nav-list" active-class="active">
                <nav>社区</nav>
            </nuxt-link>
            <a href="https://lolitalibrary.com/lolita.html" title="lo研社旧版本" target="_blank" class="base-nav-list" >
                <nav>旧版</nav>
            </a>
          </div>
          <div v-if="$store.state.user.info !== null">
            <el-popover
              placement="bottom"
              width="150"
              trigger="hover">
              <div class="base-user-menu">
                <nuxt-link :to="'/userSpace/' + $store.state.user.info.user_id">
                  <div class="base-user-menu-list">
                    个人中心
                  </div>
                </nuxt-link>
                <nuxt-link :to="'/message'">
                  <div class="base-user-menu-list">
                    消息中心
                  </div>
                </nuxt-link>
                <div class="base-user-menu-list" @click="loginout_dialog = true">
                  退出登录
                </div>
              </div>
              <div class="base-head-user" slot="reference">
                <div class="base-head-user-face">
                  <img :src="BASE_IMG + $store.state.user.info.user_face" >
                </div>
              </div>
            </el-popover>
          </div>
          <nuxt-link class="base-nav-list" :to="'/login'" v-if="$store.state.user.info === null || !$store.state.user.info">
            登录
          </nuxt-link>
          <div class="base-head-menu">
            <i class="el-icon-menu" @click="menu = true"></i>
          </div>
        </div>
        <el-drawer
          :visible.sync="menu"
          :direction="'rtl'"
          :modal="false">
          <nuxt-link
          :to="`/`"
          title="洛丽塔图书馆"
          class="base-menu-list"
          active-class="active"
          exact>
              <nav @click="menu = false">主页</nav>
          </nuxt-link>
          <nuxt-link :to="`/library/`" title="洛丽塔图鉴"  class="base-menu-list" active-class="active">
              <nav @click="menu = false">图鉴</nav>
          </nuxt-link>
          <nuxt-link :to="`/shop/`" title="洛丽塔店铺" class="base-menu-list" active-class="active">
              <nav  @click="menu = false">店铺</nav>
          </nuxt-link>
          <nuxt-link :to="`/compilations/`" title="洛丽塔小裙子合集" class="base-menu-list" active-class="active">
              <nav @click="menu = false">合集</nav>
          </nuxt-link>
          <nuxt-link :to="`/community/`" title="社区" class="base-menu-list" active-class="active">
              <nav @click="menu = false">社区</nav>
          </nuxt-link>
          <a href="https://lolitalibrary.com/lolita.html" class="base-menu-list" title="lo研社旧版本" target="_blank" >
              <nav @click="menu = false">旧版</nav>
          </a>
        </el-drawer>
      </div>
      <nuxt />
    </div>
    <el-dialog
      :visible.sync="loginout_dialog"
      width="300px"
      center>
      <span style="text-align: center; display: block;">确定要退出登录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="loginout_dialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="loginOut()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'
export default {
  data () {
    return {
      current: 0,
      menu: false,
      loginout_dialog: false
    }
  },
  mounted () {
    this.$store.commit('SET_IsMobile', this.isMobile())
    try {
      let token = localStorage.getItem('javaToken')
      if (token) {
        token = JSON.parse(token)
      }
      this.$store.commit('setToken', token)
    } catch (e) {}
    try {
      // 尝试获取本地缓存
      const user_info = JSON.parse(localStorage.getItem('userInfo'))
      this.$store.commit('setUserInfo', user_info)
    } catch (e) {}
  },
  methods: {
    ...mapActions(['Logout']),
    isMobile () {
      const flag = window.navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      if (flag) {
        return true
      } else {
        return false
      }
    },
    loginOut () {
      console.log('退出登录')
      this.Logout()
        .then(() => {
          this.$message.success('退出登录成功')
          console.log(this.$store)
          this.loginout_dialog = false
        })
    }
  }
}
</script>
<style type="text/css" lang="less">
  .head-seat{
    height: 70px;
    width: 100%;
  }
  // html{
  //   font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑, STHeiti, MingLiu;
  // }
  ul li{
    list-style: none;
    margin: 0
  }
  .pub-background{
    background: #f1f1f1;
    min-height: calc(100vh - 44px);
  }
  html {
      font-family: "Microsoft YaHei", "微软雅黑", "MicrosoftJhengHei", "华文细黑", "STHeiti", "MingLiu";
  }
  .qhx-title{
    font-size: 16px;
    font-weight: bolder;
    color: #FFAA7F;
  }
  .qhx-text{
    font-size: 14px;
    margin: 5px;
  }
  .qhx-section-title{
    font-size: 20px;
    font-weight: bolder;
    padding: 10px 15px;
  }
  .myel-paging-box{
    margin: 10px 0;
    text-align: center;
  }
</style>
<style scoped lang="less">
  .base-wrap{
    min-height: calc(100vh - 84px);
    position: relative;
    width: 100%;
  }
  .base-user-menu-list{
    text-align: center;
    cursor: pointer;
    color: #000000;
    transition: 0.3s;
    margin: 5px 0;
  }
  .base-user-menu-list:hover{
    color: #409EFF;
  }
  .base-footer{}
  .base-header-wrap{
    width: 100%;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    box-shadow: 1px 5px 5px #111111;
    margin-bottom: 10px;
    background-color: rgba(17,17,17,0.75);
    .base-header{
      max-width: 1200px;
      height: 70px;
      margin: 0 auto;
      display: flex;
      .base-nav{
        display: flex;
        align-items: center;
        line-height: 70px;
        flex: 1;
      }
    }
    .base-nav-list{
      margin: 0 30px;
      width: auto;
      height: 66px;
      line-height: 66px;
      font-size: 17px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 10px;
      color: #ccc;
      text-align: center;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      text-decoration: none;
      transition: 0.3s;
      white-space: nowrap;
    }
    .active{
      // color: #ffaa7f
      text-shadow: 0 0 10px #69e0ff, 0 0 20px #69e0ff, 0 0 40px #69e0ff;
      color: #fff;
    }
    .base-head-user{
      cursor: pointer;
      .base-head-user-face{
        border-radius: 50%;
        width: 50px;
        height: 50px;
        box-shadow: 1px 1px 10px #ccc;
        overflow: hidden;
        margin: 10px;
        img{
          width: 100%;
        }
      }
    }
    .base-head-menu{
      margin: 0 30px;
      width: auto;
      height: 66px;
      line-height: 66px;
      font-size: 25px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 10px;
      color: #ccc;
      text-align: center;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      text-decoration: none;
      transition: 0.3s;
      text-shadow: 0 0 10px #69e0ff, 0 0 20px #69e0ff, 0 0 40px #69e0ff;
    }
    .base-menu-list{
      position: relative;
      display: block;
      padding-left: 12px;
      width: 100%;
      line-height: 3.05;
      min-height: 36px;
      font-size: 16px;
      text-decoration: none;
      color: #393b40;
      border-bottom: #f5f5f5 1px solid;
      box-sizing: border-box;
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  @media screen and (min-width: 750px) {
    .base-head-menu{
      display: none;
    }
  }
  @media screen and (max-width: 750px) {
    .base-nav{
      .base-nav-list{
        display: none !important;
      }
    }
  }

</style>
