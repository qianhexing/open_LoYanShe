<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <div class="library-head">
      <el-input size="medium"
      class="library-search"
      v-model="keywords"
      @keyup.enter.native="search()"
      placeholder="根据店铺名字搜索">
         <i slot="suffix" class="el-input__icon el-icon-close" style="cursor: pointer;" @click="clearSearch()"></i>
         <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="search()"></i>
      </el-input>
      <div style="display: flex; justify-content: center;">
        <nuxt-link :to="'/advancedSearch/shop'">
          <el-button size="medium" type="primary" style="margin: 0 10px;">高级检索</el-button>
        </nuxt-link>
        <nuxt-link :to="'/addShop'">
          <el-button size="medium" type="danger" style="margin: 0 10px;">补充店铺</el-button>
        </nuxt-link>
        <nuxt-link :to="'/addphysicalShop'">
          <el-button size="medium" type="danger">补充实体店铺</el-button>
        </nuxt-link>
        <!-- <a href="https://lolitalibrary.com/lolita.html#/addLibrary" target="_blank"></a> -->
      </div>
    </div>
    <div class="shop-list-wrap">
      <div class="shop-list" v-for="(list, index) in list" :key="list.shop_id">
        <div class="shop-list-info animate__animated animate__fadeInLeft" :style="{'animation-delay': (0.08 * index) + 's'}">
          <nuxt-link :to="'/shop/detail/' + list.shop_id" :title="list.shop_name">
            <div class="shop-list-cover">
              <img :src="BASE_IMG + list.shop_logo" :title="list.shop_name" alt="">
            </div>
            <div class="shop-list-name">
              <el-tag size="mini" type="danger">{{list.shop_country == 0 ? '国牌' : '日牌'}}</el-tag>
              {{list.shop_name}}
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <PagingBox :total="total" :pageSize="pageSize" :current="current" :to="'/shop/'"></PagingBox>
  </div>
</template>

<script>
import PagingBox from '@/components/PagingBox.vue'
const pageSize = 20
export default {
  data () {
    return {
      total: null,
      list: [],
      current: 1,
      pageSize,
      keywords: ''
    }
  },
  head () {
    return {
      title: 'Lolita店铺',
      meta: [
        {
          name: 'keywords',
          content: 'Lo研社,洛丽塔店铺,Lolita,Lolita店铺,Lolita店铺汇总'
        },
        {
          hid: 'description',
          name: 'names',
          content: '洛丽塔店铺汇总'
        }
      ]
    }
  },
  layout: 'BaseLayout',
  components: {
    PagingBox
  },
  watch: {
    '$route.query' (newValue) {
      if (newValue.keywords) {
        this.keywords = newValue.keywords
      } else {
        this.keywords = ''
      }
      this.getShopListFilter()
    }
  },
  methods: {
    clearSearch () {
      this.$router.push({ path: '/shop/1' })
    },
    search () {
      if (this.keywords === '' || !this.keywords) {
        this.$message.warning('请输入关键词')
        return false
      }
      this.$router.push({ path: '/shop/1', query: { keywords: this.keywords } })
    },
    getShopListFilter () {
      const search = []
      this.loading = true
      if (this.keywords !== '') {
        search.push({
          field: 'shop.shop_name',
          op: 'like',
          value: this.keywords
        })
      }
      const loading = this.$loading({
        lock: true,
        text: '加载中请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      this.$axios({
        method: 'post',
        url: '/getShopListFilter.php',
        data: {
          search,
          current: this.current || 1,
          size: pageSize
        }
      })
        .then((res) => {
          this.total = res.data.count
          this.list = res.data.data
        })
        .finally(() => {
          this.loading = false
          loading.close()
        })
    }
  },
  async asyncData ({ $axios, params, query }) {
    console.log(params.id)
    let current = params.id
    current = parseInt(current) < 1 ? 1 : parseInt(current)
    const keywords = query.keywords
    const search = []
    if (keywords) {
      search.push({
        field: 'shop.shop_name',
        op: 'like',
        value: keywords
      })
    }
    const res = await $axios({
      method: 'post',
      url: '/getShopListFilter.php',
      data: {
        search,
        current: current || 1,
        size: pageSize
      }
    })
    return {
      total: res.data.count,
      list: res.data.data,
      current: current || 1,
      keywords
    }
  }
}
</script>

<style lang="less" scoped>
.library-head{
  padding-top: 30px;
  max-width: 1000px;
  margin: 0 auto;
  justify-content: center;
  .library-search{
    max-width: 500px;
  }
}
.shop-list-wrap{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: 25px auto;
  .shop-list{
    .shop-list-info{
      background-color: #fff;
      border-radius: 5px;
      margin: 10px;
      box-shadow: 2px 2px 10px #ccc;
    }
    .shop-list-cover{
      width: 60px;
      height: 60px;
      overflow: hidden;
      margin: 0 auto;
      padding: 20px 0;
      img{
        width: 100%;
      }
    }
    a{
      color: #000000;
    }
    .shop-list-name{
      text-align: center;
      padding: 0 15px 10px 15px;
    }
  }
}
@media screen and (min-width: 750px) {
  .library-head{
    display: flex;
  }
  .shop-list{
    width: 20%;
  }
}
@media screen and (max-width: 750px) {
  .library-head{
    text-align: center;
  }
  .shop-list{
    width: 50%;
  }
}
</style>
