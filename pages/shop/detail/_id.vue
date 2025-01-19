<template>
  <div class="mt-24">
    <div class="head-seat" />
    <div v-if="shopInfo" class="shop-detail-wrap">
      <div class="shop-detail-left">
        <shopInfo :item="shopInfo" class="shopInfo" />
        <div class="shop-detail">
          <div class="shop-detail-list">
            <el-tag size="mini" type="warning">
              {{ shopInfo.shop_country == 0 ? '国牌' : '日牌' }}
            </el-tag>
            <el-tag size="mini" type="danger">
              共收录 {{ shopInfo.count_library }}
            </el-tag>
          </div>
          <div v-if="shopInfo.shop_describe" class="shop-detail-list">
            <div class="qhx-title">
              店铺简介
            </div>
            <div class="qhx-text">
              {{ shopInfo.shop_describe }}
            </div>
          </div>
          <div v-if="shopInfo.style_list && shopInfo.style_list.length > 0" class="shop-detail-list">
            <div class="qhx-title">
              主营风格
            </div>
            <div class="qhx-text">
              <el-tag
                v-for="(tag, index) in shopInfo.style_list"
                :key="index"
                size="mini"
                style="margin-right: 5px;"
              >
                {{ tag.wiki_name }}
              </el-tag>
            </div>
          </div>
          <div v-if="shopInfo.style_list && shopInfo.type_list.length > 0" class="shop-detail-list">
            <div class="qhx-title">
              主营类型
            </div>
            <div class="qhx-text">
              <el-tag
                v-for="(tag, index) in shopInfo.type_list"
                :key="index"
                size="mini"
                style="margin-right: 5px;"
              >
                {{ tag.wiki_name }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="shop-detail-right">
        <libraryList :list="library_list" :need-shop="false" />
        <LoadMore
          :page="page"
          :page-size="pageSize"
          :loading="loading"
          :total="total"
          @loadMore="getLibraryList()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import shopInfo from '@/components/shopDetail/ShopInfo.vue'
import libraryList from '@/components/library/LibraryList.vue'
const pageSize = 20
export default {
  components: {
    shopInfo,
    libraryList
  },
  layout: 'BaseLayout',
  async asyncData ({ $axios, params }) {
    const id = params.id
    const res = await $axios({
      method: 'post',
      url: '/getShopById.php',
      data: {
        shop_id: id
      }
    })
    let shopInfo = res.data.data
    if (shopInfo) {
      // 主营类型
      if (shopInfo.shop_type && shopInfo.shop_type !== null) {
        shopInfo.shop_type = shopInfo.shop_type.split(',')
      } else {
        shopInfo.shop_type = null
      }
      // 主营风格
      if (shopInfo.shop_style && shopInfo.shop_style !== null) {
        shopInfo.shop_style = shopInfo.shop_style.split(',')
      } else {
        shopInfo.shop_style = null
      }
    } else {
      shopInfo = null
    }

    const library_res = await $axios({
      method: 'post',
      url: '/getLibraryListFilter.php',
      data: {
        search: [
          {
            field: 'library.shop_id',
            op: 'equal',
            value: id
          }
        ],
        current: 1,
        state: '',
        size: pageSize
      }
    })
    const total = library_res.data.count
    const library_list = library_res.data.data
    return {
      shopInfo,
      library_list,
      total
    }
  },
  data () {
    return {
      shopInfo: null,
      library_list: [],
      pageSize,
      total: 0,
      page: 1,
      loading: false
    }
  },
  head () {
    return {
      title: this.shopInfo ? this.shopInfo.shop_name : 'Lo研社',
      meta: [
        {
          name: 'keywords',
          content: 'Lo研社,lolita图书馆,Lolita店铺'
        },
        {
          hid: 'description',
          name: 'names',
          content: '洛丽塔小裙子百科全书,' + this.shopInfo !== null ? this.shopInfo.shop_describe : ''
        }
      ]
    }
  },
  methods: {
    getLibraryList () {
      this.page += 1
      this.loading = true
      this.$axios({
        method: 'post',
        url: '/getLibraryListFilter.php',
        data: {
          search: [
            {
              field: 'library.shop_id',
              op: 'equal',
              value: this.$route.params.id
            }
          ],
          current: this.page,
          state: '',
          size: this.pageSize
        }
      })
        .then((res) => {
          if (res.data.data.length > 0) {
            this.library_list.push(...res.data.data)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.shop-detail-wrap{
  margin: 25px auto;
  max-width: 1280px;
  position: relative;
  .shop-detail-right{
    flex: 1;
  }
  .shop-detail-left{
    .shop-detail{
      margin-top: 10px;
      box-shadow: 1px 1px 10px #ccc;
      border-radius: 5px;
      background: #fff;
      .shop-detail-list{
        padding: 10px;
      }
    }
  }
  .shop-detail-right{
    padding: 15px 0;
    box-shadow: 1px 1px 10px #ccc;
    background: #FFFFFF;
    border-radius: 5px;
  }
}
@media screen and (min-width: 750px) {
  .shop-detail-wrap{
    display: flex;
    .shop-detail-left{
      width: 300px;
      margin-right: 10px;
    }
  }
}
@media screen and (max-width: 750px) {
  .shop-detail-left{
    width: 100%;
  }
}
</style>
