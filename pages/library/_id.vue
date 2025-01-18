<template>
  <div style="background: #f1f1f1;">
    <div class="head-seat"></div>
    <div class="library-head">
      <nuxt-link :to="'/timeline'">
          <el-button size="medium" type="danger">上新日历</el-button>
        </nuxt-link>
      <el-input size="medium"
      class="library-search"
      v-model="keywords"
      @keyup.enter.native="search()"
      placeholder="根据裙子名字搜索">
         <i slot="suffix" class="el-input__icon el-icon-close" style="cursor: pointer;" @click="clearSearch()"></i>
         <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="search()"></i>
      </el-input>
      <div style="display: flex; justify-content: center;">
        <nuxt-link :to="'/advancedSearch'">
          <el-button size="medium" type="primary" style="margin: 0 10px;">高级检索</el-button>
        </nuxt-link>
        <nuxt-link :to="'/addLibrary'">
          <el-button size="medium" type="danger">补充图鉴</el-button>
        </nuxt-link>
        <!-- <a href="https://lolitalibrary.com/lolita.html#/addLibrary" target="_blank"></a> -->
      </div>
    </div>
    <div class="library-wrap" style="padding-top: 15px;">
      <div class="library-list-wrap animate__animated animate__fadeIn " v-for="(list, index) in list" :key="list.library_id" :style="{'animation-delay': (0.15 * index) + 's'}">
        <section class="library-list animate__animated animate__slideInLeft" :style="{'animation-delay': (0.15 * index) + 's'}">
          <div style="display: flex;">
            <div class="library-cover" v-if="list.square_cover && list.square_cover !== ''" @click="previewImage([list.cover], 0)">
              <img :src="BASE_IMG + list.square_cover" alt="" :title="list.name">
            </div>
            <div v-else class="library-cover" @click="previewImage([list.cover], 0)">
              <img v-lazy="BASE_IMG + list.cover" alt="" :title="list.name">
            </div>
            <div class="library-info">
              <nuxt-link :to="`/library/detail/` + list.library_id" title="洛丽塔图书馆" class="base-nav-list" active-class="active">
                <h1 class="library-name">
                  <el-tag size="mini">{{list.shop_country == 0 ? '国牌' : '日牌'}}</el-tag>
                  {{list.name}}
                </h1>
              </nuxt-link>
              <div class="qhx-tip">
                <!-- <div class="library-watch">
                  <span class="iconfont icon-xianshikejian"></span>
                  {{list.count_times || 0}}
                </div> -->
                <div class="qhx-date">{{list.date}}</div>
              </div>
              <div class="library-money">
                <el-tag type="mini" v-show="list.pattern">版型 {{list.pattern}}</el-tag>
                <span v-show="list.price">{{list.price}} {{list.shop_country == 0 ? '元' : '日元'}}</span>
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
              <nuxt-link v-if="list.shop" :to="`/shop/detail/` + list.shop.shop_id" :title="list.shop_name" class="base-nav-list" active-class="active">
                <div class="shop-info">
                  <div class="shop-logo">
                    <img :src="BASE_IMG + list.shop.shop_logo" :title="list.shop_name" />
                  </div>
                  <div class="shop-name">{{list.shop.shop_name}}</div>
                </div>
              </nuxt-link>
              <div></div>
            </div>
          </div>
          <div class="library-data" v-if="list.statistical_data">
            <div class="data-list">
              <!-- <div class="iconfont icon icon-dianzan"></div> -->
              <GoodBtn :pk_type="2"
              :pk_id="list.library_id"
              :is_good="list.is_good"
              :key="list.library_id"
              @success="goodSuccess($event, list.library_id)"
              ></GoodBtn>
              <div class="number">
                {{ list.statistical_data.good_count }} 点赞
              </div>
            </div>
            <div class="data-list" @click="collectAdd(list.library_id)">
              <div :class="list.is_collect ? 'iconfont icon icon-shoucang collect-active collect-icon' : 'iconfont icon icon-shoucang collect-icon'"></div>
              <div class="number">
                {{ list.statistical_data.collect_count }} 收藏
              </div>
            </div>
            <div class="data-list">
              <div class="iconfont icon icon-xianshikejian"></div>
              <div class="number">
                {{ list.statistical_data.times_count }} 浏览
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <addCollect ref="addCollect" @success="collectSuccess"></addCollect>
    <imageViewer :show-image="showImage" :initial-index="initialIndex" :on-close="handleClose" :url-list="srcList" style="z-index: 9999;" />
    <el-empty :image-size="200" v-show="total === 0 && !loading"  description="暂无图鉴"></el-empty>
    <PagingBox :total="total" :pageSize="18" :current="current" :to="'/library/'" :query="keywords ? 'keywords=' + keywords : undefined"></PagingBox>
  </div>
</template>

<script>
import PagingBox from '@/components/PagingBox.vue'
import { getUserIsDataByIds } from '@/api/user.js'
import { getLibraryList } from '@/api/library'
import addCollect from '@/components/collect/addCollect.vue'
export default {
  data () {
    return {
      total: null,
      list: [],
      current: 1,
      filter_list: [],
      keywords: '',
      loading: false,
      srcList: [],
      initialIndex: 0,
      showImage: false
    }
  },
  head () {
    return {
      title: '洛丽塔图书馆',
      meta: [
        {
          name: 'keywords',
          content: 'Lo研社,lolita图书馆'
        },
        {
          hid: 'description',
          name: 'names',
          content: '洛丽塔小裙子百科全书'
        }
      ]
    }
  },
  layout: 'BaseLayout',
  components: {
    PagingBox,
    addCollect
  },
  watch: {
    '$route.query' (newValue) {
      if (newValue.keywords) {
        this.keywords = newValue.keywords
      } else {
        this.keywords = ''
      }
      this.getLibraryListFilter()
    }
  },
  mounted () {
    console.log(this.$route)
    this.$nextTick(() => {
      this.getUserIsDataByIds()
    })
  },
  methods: {
    collectAdd (pk_id) {
      const params = {
        pk_id: parseInt(pk_id),
        collect_type: 2
      }
      this.$refs.addCollect.showModel(params)
    },
    collectSuccess (is_collect) {
      const pk_id = this.$refs.addCollect.pk_id
      const index = this.list.findIndex((value) => {
        return parseInt(value.library_id) === parseInt(pk_id)
      })
      if (index !== -1) {
        const num = is_collect ? 1 : -1
        if (!this.list[index].is_collect === is_collect) {
          this.list[index].statistical_data.collect_count = parseInt(this.list[index].statistical_data.collect_count) + num
        }
        this.list[index].is_collect = is_collect
      }
    },
    // 预览图片
    previewImage (e, index) {
      this.srcList = e.map((item) => {
        return this.BASE_IMG + item
      })
      this.initialIndex = index
      this.showImage = true
    },
    /** 关闭图片预览 */
    handleClose () {
      this.showImage = false
    },
    goodSuccess (is_good, library_id) {
      console.log(is_good, library_id, '点赞')
      const index = this.list.findIndex((value) => {
        return value.library_id === library_id
      })
      if (index !== -1) {
        const num = is_good ? 1 : -1
        this.list[index].statistical_data.good_count = parseInt(this.list[index].statistical_data.good_count) + num
      }
    },
    clearSearch () {
      this.$router.push({ path: '/library/1' })
    },
    search () {
      if (this.keywords === '' || !this.keywords) {
        this.$message.warning('请输入关键词')
        return false
      }
      this.$router.push({ path: '/library/1', query: { keywords: this.keywords } })
    },
    // 获取点赞收藏状态
    getUserIsDataByIds () {
      const ids = []
      if (this.list.length === 0) {
        return false
      }
      if (!this.$store.getters.getToken) {
        return false
      }
      this.list.forEach((value) => {
        ids.push(value.library_id)
      })
      const params = {
        ids: ids.join(),
        pk_type: 2
      }
      getUserIsDataByIds(params)
        .then((res) => {
          const { data, code } = res
          if (code === 200) {
            if (data.length > 0) {
              data.forEach((value) => {
                const index = this.list.findIndex((item) => {
                  return item.library_id === value.pk_id
                })
                if (index !== -1) {
                  this.$set(this.list[index], 'is_good', value.is_good)
                  this.$set(this.list[index], 'is_collect', value.is_collect)
                }
              })
            }
          }
        })
    },
    getLibraryListFilter () {
      const search = []
      this.loading = true
      if (this.keywords !== '') {
        search.push({
          field: 'name',
          op: 'and',
          value: this.keywords
        })
      }
      const loading = this.$loading({
        lock: true,
        text: '加载中请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      // this.$axios({
      //   method: 'post',
      //   url: '/getLibraryListFilter.php',
      //   data: {
      //     search,
      //     current: this.current || 1,
      //     state: '',
      //     size: 18
      //   }
      // })
      getLibraryList({ page: this.current || 1, pageSize: 18, filter_list: search })
        .then((res) => {
          this.total = res.data.count
          this.list = res.data.rows
        })
        .finally(() => {
          this.loading = false
          loading.close()
        })
    }
  },
  async asyncData ({ $axios, params, query, env }) {
    console.log(query, '传参')
    let current = params.id
    const keywords = query.keywords
    const search = []
    if (keywords) {
      search.push({
        field: 'name',
        op: 'and',
        value: keywords
      })
    }
    current = parseInt(current) < 1 ? 1 : parseInt(current)
    const res = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/library/list',
      data: { page: current || 1, pageSize: 18, filter_list: search }
    })
    console.log('获取到的列表', res.data)
    // const library_list = res.data.data.rows
    // const res = await $axios({
    //   method: 'post',
    //   url: '/getLibraryListFilter.php',
    //   data: {
    //     search,
    //     current: current || 1,
    //     state: '',
    //     size: 18
    //   }
    // })
    return {
      total: res.data.data.count,
      list: res.data.data.rows,
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
.library-wrap{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 10px auto;
    padding: 10px 0;
    // background: #fff;
    border-radius: 5px;
    justify-content: center;
    .library-list-wrap{
      transition: 0.3s;
      .library-list{
        padding: 20px 10px;
        box-shadow: 2px 2px 10px #CCCCCC;
        background: #fff;
        border-radius: 10px;
        .library-cover{
          cursor: pointer;
          overflow: hidden;
          margin: 0px 10px;
          img{
            width: 100%;
          }
        }
        .library-info{
          flex: 1;
          margin: 0 10px;
          .library-name{
            font-size: 16px;
            font-weight: bolder;
            color: #000000;
            margin: 5px 0;
            transition: 0.3s;
          }
          .library-name:hover{
            color: #ffaa7f;
          }
          .library-money{
            color: #ffaa7f;
            font-size: 16px;
            font-weight: bolder;
          }
          // 信息列表
          .info-list{
            display: flex;
            margin: 8px 0;
          }
          .shop-info{
            display: flex;
            align-items: center;
            margin: 10px 0;
            color: #000000;
            transition: 0.3s;
            .shop-logo{
              width: 40px;
              height: 40px;
              overflow: hidden;
              border-radius: 50%;
              box-shadow: 1px 8px 8px #ccc;
              img{
                width: 100%;
              }
            }
            .shop-name{
              flex: 1;
              margin-left: 10px;
              font-weight: bold;
            }
          }
          .shop-info:hover{
            color: #FFAA7F;
          }
        }
      }
      .library-data{
        display: flex;
        justify-content: center;
        margin-top: 10px;
        color: #999999;
        .data-list{
          text-align: center;
          width: 25%;
          .icon{
            font-size: 25px;
          }
          .number{
            margin-top: 4px;
            font-size: 12px;
          }
          .collect-icon{
            transition: 0.3;
            cursor: pointer;
          }
          .collect-icon:hover{
            color: #FFAA7F;
          }
          .collect-active{
            color: #FFAA7F;
          }
        }
      }
    }
  }
@media screen and (min-width: 750px) {
  .library-head{
    display: flex;
  }
  .library-list-wrap{
    width: 33%;
    min-width: 400px;
    .library-list{
      margin: 10px 8px;
      .library-cover{
        width: 150px;
        height: 150px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .library-head{
    text-align: center;
  }
  .library-list-wrap{
    width: 100%;
    .library-list{
      margin: 10px 0;
      .library-cover{
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
