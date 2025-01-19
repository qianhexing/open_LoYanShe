<template>
  <div>
    <div class="login-layout">
      <div class="login-layout-head">
        <div class="login-layout-head-box">
          <nuxt-link :to="'/'">
            <img :src="BASE_IMG + 'static/logo.png'">
          </nuxt-link>
        </div>
      </div>
      <nuxt />
    </div>
    <BaseFooter class="base-footer" />
  </div>
</template>

<script>
import BaseFooter from '@/components/BaseFooter.vue'
export default {
  components: {
    BaseFooter
  },
  data () {
    return {
      current: 0
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
<style type="text/css" lang="less" scoped>
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
</style>
<style scoped lang="less">
  .login-layout{
    min-height: calc(100vh - 44px);
    position: relative;
    .login-layout-head{
      position: absolute;
      top: 0;
      left: 0;
      height: 66px;
      width: 100%;
      .login-layout-head-box{
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
      }
    }
  }
</style>
