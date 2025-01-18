<template>
  <div class="notice-nav">
    <div class="nav-list">
      <nuxt-link to="/message" active-class="active" exact>
        <div class="iconfont icon-lingdang icon"></div>
        <div>通知</div>
      </nuxt-link>
    </div>
    <div class="nav-list">
      <nuxt-link to="/message/commentMessage" active-class="active">
        <div class="iconfont icon-xiaoxi icon"></div>
        <div>评论</div>
      </nuxt-link>
    </div>
    <div class="nav-list">
      <nuxt-link to="/message/atMe" active-class="active">
        <div class="iconfont icon-- icon"></div>
        <div>@我</div>
      </nuxt-link>
    </div>
    <div class="nav-list">
      <nuxt-link to="/message/goodMessage" active-class="active">
        <div class="iconfont icon-good icon"></div>
        <div>收到的赞</div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
</script>

<style scoped lang="less">
  .notice-nav{
    display: flex;
    text-align: center;
    .nav-list{
      width: 25%;
      a{
        color: #000000;
        display: inline-block;
      }
      .icon{
        font-size: 25px;
      }
    }
  }
  .active{
    color: #ffaa7f !important;
  }
</style>
