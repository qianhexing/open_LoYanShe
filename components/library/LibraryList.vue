<template>
  <div class="library-list-comp">
    <div class="library-list-wrap animate__animated animate__fadeInRight "
    v-for="(list, index) in list"
    :key="list.library_id"
    :style="{'animation-delay': (0.15 * (index % 20)) + 's', 'width': listWidth}">
      <section class="library-list">
        <div class="library-cover" v-if="list.square_cover && list.square_cover !== ''" @click="handleShowImage([list.cover], 0)">
<!--          <img v-lazy="BASE_IMG + list.square_cover" alt="" :title="list.name">-->
          <thumbnail-img :url="list.square_cover" :title="list.name" alt=""/>
        </div>
        <div class="library-cover" v-else @click="handleShowImage([list.cover], 0)">
<!--          <img v-lazy="BASE_IMG + list.cover" alt="" :title="list.name">-->
          <thumbnail-img :url="list.square_cover" :title="list.name" alt=""/>
        </div>
        <div class="library-info">
          <nuxt-link :to="`/library/detail/` + list.library_id" title="洛丽塔图书馆" target="_blank">
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
          <nuxt-link :to="`/shop/detail/` + list.shop_id"
          target="_blank"
          :title="list.shop_name"
          class="base-nav-list"
          active-class="active"
          v-if="needShop">
            <div class="shop-info">
              <div class="shop-logo">
                <thumbnail-img :url="list.shop_logo" :title="list.shop_name" alt=""/>
              </div>
              <div class="shop-name">{{list.shop_name}}</div>
            </div>
          </nuxt-link>
          <div></div>
        </div>
      </section>
    </div>
    <imageViewer :show-image="showImage" :initial-index="initialIndex" :on-close="handleClose" :url-list="srcList" style="z-index: 9999;" />
    <el-empty :image-size="200" description="暂无数据" v-show="list.length === 0"></el-empty>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    listWidth: {
      type: String,
      default: '50%'
    },
    needShop: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showImage: false,
      initialIndex: 0,
      srcList: []
    }
  },
  methods: {
    handleClose () {
      this.showImage = false
    },
    handleShowImage (e, index) {
      this.srcList = e.map((item) => {
        return this.BASE_IMG + item
      })
      this.initialIndex = index
      this.showImage = true
    }
  }
}
</script>

<style scoped lang="less">
  .library-list-comp{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    overflow: hidden;
    .library-list-wrap{
      .library-list{
        display: flex;
        padding: 0 15px 15px 15px;
        padding-bottom: 15px;
        .library-cover{
          cursor: pointer;
          overflow: hidden;
          margin-right: 10px;
          img{
            width: 100%;
          }
        }
        .library-info{
          flex: 1;
          .library-name{
            color: #000000;
            margin: 0;
            transition: 0.3s;
          }
          .library-name:hover{
            color: #FFAA7F;
          }
          .info-list{
            display: flex;
            margin: 5px 0;
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
    }
  }
  @media screen and (min-width: 750px) {
    .library-list-wrap{
      width: 50%;
      .library-cover{
        width: 150px;
        height: 150px;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .library-list-wrap{
      width: 100% !important;
      .library-cover{
        width: 100px;
        height: 100px;
      }
    }
  }
</style>
