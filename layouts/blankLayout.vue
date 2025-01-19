<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import {
  mapActions
} from 'vuex'
export default {
  data () {
    return {
    }
  },
  mounted () {
    console.log(localStorage.getItem('javaToken'), 'store')
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
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
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
    background: rgba(#f1f1f1,0.4);
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
  .icon{
    font-size: 25px;
    transition: 0.3s;
  }
  .myel-paging-box{
    margin: 10px 0;
    text-align: center;
  }
</style>
<style scoped lang="less">
  .base-wrap{
    min-height: calc(100vh - 44px);
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
      height: 70px;
      margin: 0 auto;
      display: flex;
      .base-nav{
        display: flex;
        align-items: center;
        line-height: 70px;
        flex: 1;
      }
      .right-fun{
        height: 70px;
        padding-right: 15px;
        display: flex;
        align-items: center;
        color: #fff;
        .right-fun-list{
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #fff;
        }
        .right-icon{
          font-size: 24px;
          margin-right: 5px;
        }
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
    .base-header{
      padding: 0 20px;
    }
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
