<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <div>
      <div class="library-detail-wrap" v-if="library">
        <div class="lib-det-cover">
          <img :src="BASE_IMG + library.cover" >
        </div>
        <section class="lib-det-info">
          <div class="lib-det-name">
            {{library.name}}
            <el-tag size="mini" type="danger" effect="dark" v-show="library.pattern">版型: {{library.pattern}}</el-tag>
            <el-tag size="mini" type="danger" style="cursor: pointer;" @click="editLibrary()" v-hasPermi="['library:detail:update']">修改图鉴</el-tag>
            <el-tag size="mini"
              type="danger"
              style="cursor: pointer;"
              @click="jumpToSort(library.library_id)"
              v-hasPermi="['library:detail:update']"
              v-if="library.library_type === '系列'"
            >下级图鉴排序</el-tag>
          </div>
          <div class="lib-det-tip qhx-tip">
            <div>{{library.date}}</div>
          </div>
          <div class="lib-det-money" v-show="library.price">
            <div>最高: {{library.price}} {{shop.shop_country == 0 ? '元' : '日元'}}</div>
          </div>
          <div style="margin: 8px 0;">
            <el-tag
            size="mini"
            type="warning"
            effect="light">
              {{library.state}}
            </el-tag>
            <el-tag
            v-for="(list, index) in styleList"
            :key="index"
            size="mini"
            type="danger"
            effect="dark"
            style="margin-right: 5px;">
              {{list.wiki_name}}
            </el-tag>
          </div>
          <div class="lib-det-data" v-if="libraryData">
            <div class="lib-det-data-list">
              <div class="lib-det-data-up">
                <nobr>{{library.score_number != 0 ? parseFloat(library.score) / parseFloat(library.score_number) : 0}}</nobr>
                <nobr style="font-size: 14px;">星</nobr>
              </div>
              <div class="lib-det-data-down">{{library.score_number}}人 评分</div>
            </div>
            <div class="lib-det-data-list">
              <div class="lib-det-data-up" style="color: #00a1d6;">
                <span class="iconfont icon-haoping"></span>
              </div>
              <div class="lib-det-data-down">{{libraryData.good_count}}人 点赞</div>
            </div>
            <div class="lib-det-data-list">
              <div class="lib-det-data-up" style="color: #ffaa7f;">
                <span class="iconfont icon-shoucang"></span>
              </div>
              <div class="lib-det-data-down">{{libraryData.collect_count}}人 收藏</div>
            </div>
            <div class="lib-det-data-list">
              <div class="lib-det-data-up">
                <span class="iconfont icon-xianshikejian" style="color: #999;"></span>
              </div>
              <div class="lib-det-data-down">{{libraryData.times_count}}次 浏览</div>
            </div>
          </div>
          <!-- 信息列表 -->
          <div v-for="(field, index) in fieldList" :key="index">
            <div v-if="library[field.field] && library[field.field] !== null ">
              <div class="lib-det-info-title">
                {{field.title}}
              </div>
              <div class="lib-det-info-tag" v-if="field.mode == 1">
                <el-tag
                v-for="(list, index2) in library[field.field]"
                :key="index2"
                size="mini"
                :type="field.type || 'primary'"
                :effect="field.effect || 'dark'"
                style="margin-right: 5px;">
                  {{list}}
                </el-tag>
              </div>
              <div class="lib-det-info-tag" v-else>
                {{library[field.field]}}
              </div>
            </div>
          </div>
        </section>
        <section class="lib-det-shop-info">
          <nuxt-link :to="'/shop/detail/' + shop.shop_id">
            <div class="lib-det-shop-cover">
              <img :src="BASE_IMG + shop.shop_logo" >
            </div>
            <div class="lib-det-shop-name">{{shop.shop_name}}</div>
          </nuxt-link>
          <div class="lib-det-shop-url" style="display: flex; justify-content: center;">
            <a :href="shop.shop_url" v-if="shop.shop_url" target="_blank">
              <el-button type="primary" size="mini">{{shop.shop_country == 0 ? '淘宝地址' : '官网地址'}}</el-button>
            </a>
            <a :href="shop.wb_url" v-if="shop.wb_url" target="_blank">
              <el-button type="primary" size="mini">微博地址</el-button>
            </a>
          </div>
        </section>
      </div>
      <div class="library-tab-wrap">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="详细图片" name="first">
            <div class="library-detail-wrap">
              <div style="flex: 1;">
                <div v-for="(img, index) in detail_image" :key="index" class="detail-img-list">
                  <img v-lazy="BASE_IMG + img" alt="" class="detail-img">
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="评论区" name="second">
            <div class="library-detail-wrap">
              <div style="flex: 1;">
                <CommentSection :type="'library'" :id="id"></CommentSection>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { updateBrowsTime } from '@/api/home.js'
import { getLibraryList } from '@/api/library.js'
const fieldList = [
  {
    field: 'size',
    title: '尺码'
  },
  {
    field: 'color',
    title: '颜色',
    type: 'success',
    effect: 'light',
    mode: 1
  },
  {
    field: 'pattern_elements',
    title: '柄图元素',
    type: 'primary',
    effect: 'light',
    mode: 1
  },
  {
    field: 'design_elements',
    title: '设计元素',
    type: 'danger',
    effect: 'light',
    mode: 1
  },
  {
    field: 'cloth_elements',
    title: '主料',
    type: 'danger',
    effect: 'dark',
    mode: 1
  },
  {
    field: 'secondary_cloth',
    title: '辅料',
    type: 'danger',
    effect: 'light',
    mode: 1
  },
  {
    field: 'notes',
    title: '笔记'
  }
]
export default {
  data () {
    return {
      total: null,
      library: null,
      shop: null,
      fieldList: null,
      libraryData: null,
      styleList: null,
      library_list: []
    }
  },
  layout: 'BaseLayout',
  mounted () {
    const { id } = this
    setTimeout(() => {
      updateBrowsTime({ id: parseInt(id), type: 'library' })
    }, 5000)
    this.getLibraryList()
  },
  methods: {
    jumpToSort () {
      this.$router.push({ path: '/sortLibrary/' + this.id })
    },
    editLibrary () {
      this.$router.push({ path: '/addLibrary', query: { library_id: this.id } })
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    getLibraryList () {
      const params = {
        page: 1,
        pageSize: 999,
        filter_list: [
          {
            value: this.id,
            op: 'and',
            field: 'parent_id'
          }
        ]
      }
      getLibraryList(params)
        .then((res) => {
          console.log(res, '图鉴列表')
          this.library_list = res.data.rows
        })
    }
  },
  head () {
    return {
      title: this.library.name + '-lolita,lo研社'
      // meta: [
      //   {
      //     name: "keywords",
      //     content:
      //       "淘宝，西瓜视频，抖音，今日头条，懂球帝，微信，微博",
      //   },
      //   // hid是一个唯一标识
      //   {
      //       hid: 'description', name: 'names', content: '应用大全'
      //   },
      // ],
    }
  },
  async asyncData ({ $axios, params }) {
    console.log(params.id)
    const id = params.id
    let detail_image = []
    let libraryData = await $axios({
      method: 'post',
      url: '/getMapData.php',
      data: {
        pk_id: id,
        pk_type: '2'
      }
    })
    libraryData = libraryData.data
    // 图鉴详情
    const res = await $axios({
      method: 'post',
      url: '/getLibraryDetail.php',
      data: {
        library_id: id
      }
    })
    // eslint-disable-next-line
    let library = res.data.library
    if (library) {
      // 柄图元素
      if (library.pattern_elements && library.pattern_elements !== null) {
        library.pattern_elements = library.pattern_elements.split(',')
      } else {
        library.pattern_elements = null
      }
      // 设计元素
      if (library.design_elements && library.design_elements !== null) {
        library.design_elements = library.design_elements.split(',')
      } else {
        library.design_elements = null
      }
      // 布料
      if (library.cloth_elements && library.cloth_elements !== null) {
        library.cloth_elements = library.cloth_elements.split(',')
      } else {
        library.cloth_elements = null
      }
      // 辅料
      if (library.secondary_cloth && library.secondary_cloth !== null) {
        library.secondary_cloth = library.secondary_cloth.split(',')
      } else {
        library.secondary_cloth = null
      }
      if (library.color && library.color !== null) {
        library.color = library.color.split(',')
      } else {
        library.color = null
      }
      if (library.detail_image) {
        detail_image = library.detail_image.split(',')
      }
    }
    const shop = res.data.shop
    const styleList = res.data.style_list
    return {
      library,
      shop,
      fieldList,
      libraryData,
      styleList,
      id,
      detail_image,
      activeName: 'first'
    }
  }
}
</script>

<style scoped lang="less">
  .library-tab-wrap{
    max-width: 1040px;
    box-shadow: 2px 2px 10px #CCCCCC;
    border-radius: 5px;
    margin: 25px auto;
    background: #fff;
  }
  .library-detail-wrap{
    max-width: 1040px;
    border-radius: 5px;
    margin: 0 auto;
    background: #fff;
    img{
      max-width: 100%;
    }
    .detail-img-list{
      text-align: center;
    }
    .lib-det-info{
      flex: 1;
      margin: 0 10px;
      .lib-det-name{
        font-size: 16px;
        font-weight: bolder;
      }
      .lib-det-money{
        color: #FFAA7F;
        font-size: 16px;
        font-weight: bolder;
        margin: 5px 10px;
      }
      .lib-det-data{
        display: flex;
        max-width: 375px;
        .lib-det-data-list{
          width: 25%;
          text-align: center;
          .lib-det-data-up{
            height: 30px;
            nobr{
              color: #ffaa7f;
              white-space: nowrap;
              font-size: 20px;
              font-weight: 700;
            }
            span{
              font-size: 25px;
            }
          }
          .lib-det-data-down{
            font-size: 12px;
            color: #999;
          }
        }
      }
      .lib-det-info-title{
        font-size: 16px;
        margin: 8px 0;
        font-weight: bolder;
        color: #ffaa7f;
      }
      .lib-det-info-tag{
        margin: 0 5px;
      }
    }
    // 店铺
    .lib-det-shop-info{
      width: 200px;
      .lib-det-shop-cover{
        width: 70px;
        margin: 10px auto;
        border-radius: 50%;
        overflow: hidden;
        img{
          width: 100%;
        }
      }
      .lib-det-shop-name{
        text-align: center;
        font-size: 16px;
        font-weight: bolder;
        margin: 10px 0;
        transition: 0.3s;
        cursor: pointer;
        color: #000000;
      }
      .lib-det-shop-name:hover{
        color: #ffaa7f;
      }
      .lib-det-shop-url{
        a{
          margin: 8px;
        }
      }
    }
  }
  .lib-det-cover{
    width: 180px;
    img{
      width: 100%;
    }
  }
  @media screen and (min-width: 750px) {
    .library-detail-wrap{
      display: flex;
      padding: 20px;
    }
    .library-tab-wrap{
      padding: 20px;
    }
  }
  @media screen and (max-width: 750px) {
    .library-tab-wrap{
      padding: 5px;
    }
    .library-detail-wrap{
      .lib-det-cover{
        margin: 0 auto;
      }
      .lib-det-shop-info{
        width: 100%;
        margin: 10px 0;
      }
    }
  }
</style>
