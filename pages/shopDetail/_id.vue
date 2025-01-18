<template>
  <div>
    <div class="library-wrap">
      <div class="library-list-wrap" v-for="list in list" :key="list.library_id">
        <section class="library-list">
          <div class="library-cover" v-if="list.square_cover && list.square_cover !== ''">
            <img :src="BASE_IMG + list.square_cover" alt="" :title="list.name">
          </div>
          <div class="library-cover" v-else>
            <img :src="BASE_IMG + list.cover" alt="" :title="list.name">
          </div>
          <div class="library-info">
            <nuxt-link :to="`/libraryDetail/` + list.library_id" title="洛丽塔图书馆" class="base-nav-list" active-class="active">
              <h1 class="library-name">
                <el-tag size="mini">{{list.shop_country == 0 ? '国牌' : '日牌'}}</el-tag>
                {{list.name}}
              </h1>
            </nuxt-link>
            <div class="qhx-tip">
              <div class="library-watch">
                <span class="iconfont icon-xianshikejian"></span>
                {{list.count_times || 0}}
              </div>
              <div class="qhx-date">{{list.date}}</div>
            </div>
            <div class="library-money">
              <el-tag type="mini">版型 {{list.pattern}}</el-tag>
              {{list.price}} {{list.shop_country == 0 ? '元' : '日元'}}
            </div>
            <div>
              <div class="info-list">
                <div class="info-title">
                  图鉴类型：
                </div>
                <div class="info-cotent">
                  <el-tag type="danger" size="mini">{{list.library_type}}</el-tag>
                </div>
              </div>
              <div class="info-list">
                <div class="info-title">
                  当前状态：
                </div>
                <div class="info-cotent">
                  <el-tag type="danger" size="mini">{{list.state}}</el-tag>
                </div>
              </div>
            </div>
            <div class="shop-info">
              <div class="shop-logo">
                <img :src="BASE_IMG + list.shop_logo" :title="list.shop_name" />
              </div>
              <div class="shop-name">{{list.shop_name}}</div>
            </div>
            <div></div>
          </div>
        </section>
      </div>
    </div>
    <PagingBox :total="total" :pageSize="20" :current="current" :to="'/library/'"></PagingBox>
  </div>
</template>

<script>
import PagingBox from '@/components/PagingBox.vue'
export default {
  data () {
    return {
      total: null,
      list: [],
      current: 1
    }
  },
  layout: 'BaseLayout',
  components: {
    PagingBox
  },
  async asyncData ({ $axios, params }) {
    console.log(params.id)
    let current = params.id
    current = parseInt(current) < 1 ? 1 : parseInt(current)
    const res = await $axios({
      method: 'post',
      url: '/getLibraryListFilter.php',
      data: {
        search: [],
        current: current || 1,
        state: ''
      }
    })
    return {
      total: res.data.count,
      list: res.data.data,
      current: current || 1
    }
  }
}
</script>

<style lang="less">
// @media screen and (max-width: 750px) {

// }
</style>
