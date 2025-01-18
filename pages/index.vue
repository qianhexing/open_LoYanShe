<template>
  <div class="home-page">
    <!-- <DataCharts :item="ip"></DataCharts> -->
    <div class="home-back" v-if="!$store.state.app.isMobile"></div>
    <div class="head-seat"></div>
    <div class="home-wrap">
      <ul class="home-comp-list-wrap" v-if="!$store.state.app.isMobile">
        <li v-for="(item, index) in compilations" :key="index" class="animate__animated animate__fadeInDown" :style="{'animation-delay': (0.15 * index) + 's'}">
          <nuxt-link :to="'/compilations/detail/' + item.comp_id" :title="item.comp_name">
            <div  class="home-comp-list">
              <div class="home-comp-cover">
                 <img :src="BASE_IMG + item.comp_cover" :TITLE="item.comp_name">
              </div>
              <div class="home-comp-title">
                {{item.comp_name}}
              </div>
              <div style="height: 140px; padding: 10px 0;">
                <div class="home-comp-desc">
                  {{item.comp_describe}}
                </div>
              </div>
              <div class="home-comp-footer qhx-tip">
                <div class="">
                  共收录 {{item.library_count}}
                </div>
                <div class="qhx-date">
                  {{item.create_date}}
                </div>
              </div>
            </div>
          </nuxt-link>
        </li>
      </ul>
      <ul class="m-home-comp-list-wrap" v-else>
        <li v-for="(item, index) in compilations" :key="index" class="animate__animated animate__fadeInDown" :style="{'animation-delay': (0.15 * index) + 's'}">
          <nuxt-link :to="'/compilations/detail/' + item.comp_id" :title="item.comp_name">
            <div  class="m-home-comp-list">
              <div class="home-comp-cover">
                 <img :src="BASE_IMG + item.comp_cover" :title="item.comp_name">
              </div>
              <div class="home-comp-info">
                <div class="home-comp-title">
                  {{item.comp_name}}
                </div>
                <div style="height: calc(100vw * 0.5265 - 75px); padding: 10px 0;">
                  <div class="home-comp-desc">
                    {{item.comp_describe}}
                  </div>
                </div>
                <div class="home-comp-footer qhx-tip">
                  <div class="">
                    共收录 {{item.library_count}}
                  </div>
                  <div class="qhx-date">
                    {{item.create_date}}
                  </div>
                </div>
              </div>
            </div>
          </nuxt-link>
        </li>
      </ul>
      <div class="home-title">数据统计</div>
      <DataCharts :item="webInfo"></DataCharts>
      <div class="home-library-wrao">
        <div class="library-back">
          <div class="library-back-list" :style="{ background: 'url(https://lolitalibrary.com/static/ssr/s1.jpg)', transform: 'translateX(' + library_back[0] + 'px)' }"></div>
          <div class="library-back-list" :style="{ background: 'url(https://lolitalibrary.com/static/ssr/s1.jpg)', transform: 'translateX(' + library_back[1] + 'px)' }"></div>
          <div class="library-back-list" :style="{ background: 'url(https://lolitalibrary.com/static/ssr/s1.jpg)', transform: 'translateX(' + library_back[2] + 'px)' }"></div>
          <div class="library-back-list" :style="{ background: 'url(https://lolitalibrary.com/static/ssr/s1.jpg)', transform: 'translateX(' + library_back[3] + 'px)' }"></div>
          <div class="library-back-list" :style="{ background: 'url(https://lolitalibrary.com/static/ssr/s1.jpg)', transform: 'translateX(' + library_back[4] + 'px)' }"></div>
        </div>
        <div class="library-list-wrap">
          <div class="library-title" style="color: #FFFFFF;">最新收录</div>
           <!-- @mouseenter="clearScorllLibrary" @mouseleave="scorllLibrary" -->
          <div>
            <div class="library-list"
            v-for="(list, index) in library_list"
            :key="list.library_id"
            :style="{ transform: 'translateX(' + (library_style[index] ? library_style[index].left : 0) + 'px) scale(' + (library_style[index] ? library_style[index].scale : 1) +')',
            zIndex: library_style[index] ? library_style[index].zIndex : 0 }">
              <div class="library-cover" @click="jumpMid(index)">
                <img v-lazy="BASE_IMG + (list.square_cover && list.square_cover !== null ? list.square_cover : list.cover)">
              </div>
              <nuxt-link :to="'/library/detail/' + list.library_id" target="_blank">
                <div class="library-name">
                  <el-tag size="mini" type="danger">{{$country(list.shop_country)}}</el-tag>
                  {{list.name}}
                </div>
              </nuxt-link>
              <div class="shop-info">
                <div class="shop-cover">
                  <img v-lazy="BASE_IMG + list.shop_logo" >
                </div>
                <div class="shop-name">
                  {{list.shop_name}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="home-title">关于我们</div>
        <div class="about-us">
          <div class="us-info">
            <div class="us-face">
              <img :src="BASE_IMG + '/ssr/home/20220527.jpg'" >
            </div>
            <div>
              <div class="us-name">
                <a href="https://weibo.com/u/7315355175" target="_blank" style="color: #FFAA7F;">@雪柔</a> &
                <a href="https://weibo.com/u/6052516131" target="_blank" style="color: #FFAA7F;">@千河星</a>
              </div>
              <span>雪柔负责数据，我负责写代码</span>
              <span>我们都是小鸭子，每天嘎嘎嘎嘎嘎</span>
              <span>现在有更多的小伙伴来一起建设Lo研了呢</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="home-title">洛丽塔大图书馆之主の留言✧*｡٩(ˊᗜˋ*)و✧*｡</div>
        <div class="about-admin">
          <span>从约莫17年就有了建设一个洛丽塔网站的想法，彼时还是学生有大把的时间可以用在喜欢的事上，可是却没有实现想法的能力，如今已经是社畜了，有了技术没了的是时间。</span>
          <span>很高兴你能看到这里，即使我们并不相识。</span>
          <span>回想起来这么多年都过去了，Lo研依旧是这么烂的东西，作为站长的我还真是屑呢，零零散散的几个访问量，不知是什么执念支持着我，各种版本不知不觉也迭代了10万+行的代码。</span>
          <span>时间飞逝，此时的我不再像彼时，曾经我也想过，无论赚不赚钱，我只想把Lo研做好，无论过去多久。回想起来我有些太理想主义了，也不希望自己所热爱的圈子被资本侵蚀，某站就是最好的例子，可是用爱发电走不长远，我有很多想做的东西，对于将来Lo研收益化是必然的趋势，只有收支平衡才能一一去实现。</span>
          <span>建站期间经历了太多的事，从小白到一点一点学习编程知识，从<s>毕业</s>，(说起来我只能算是个高中<s>毕业</s>生呢，起点就是地狱难度，)到找工作到每天上下班拿着几千的工资，靠着业余和游戏里挤出来的时间一点点建设网站，再到数据库遭受攻击，数据被清空，一年的努力都白忙活，遇到了特别多的困难，也不再细说，未来也一样会遇到。</span>
          <span>这个项目陪伴了我非常久，即时我根本没有投入非常多的时间<s>因为大多数时间在摸鱼</s>，路还长远，Lo研这么久了都能维持下去，以后也一样可以</span>
          <span class="qhx-tip qhx-date">2022-09-09 ---By 千河星</span>
          <span>快五年了！我还在鸭！！。</span>
          <span class="qhx-tip qhx-date">2024-03-08 ---By 千河星</span>
        </div>
      </div>
      <!-- 关于网站 -->
      <div class="home-about-app" style="text-align: center;">
        网站持续建设中……
        <br/>
        <!-- {{webInfo}} -->
      </div>
    </div>
  </div>
</template>

<script>
import DataCharts from '@/components/home/DataCharts.vue'
export default {
  name: 'IndexPage',
  layout: 'BaseLayout',
  data () {
    return {
      webInfo: null,
      compilations: [],
      library_back: [0, -300, -600, -900, 0],
      timer: null,
      library_timer: null,
      library_style: [],
      mid_index: 6,
      library_list: []
    }
  },
  components: {
    DataCharts
  },
  mounted () {
    this.mid_index = Math.ceil(this.library_list.length / 2)
    this.timer = setInterval(() => {
      // const window_width = document.documentElement.offsetWidth || document.body.offsetWidth
      this.library_back = this.library_back.map((v, index) => {
        v -= (1.5 - index * 0.2)
        if (v < -3840) {
          v = 0
        }
        return v
      })
    }, 20)
    this.calcLibraryStyle()
    this.scorllLibrary()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.library_timer)
    this.timer = null
    this.library_timer = null
  },
  methods: {
    calcLibraryStyle () {
      const length = this.library_list.length
      const window_width = document.documentElement.offsetWidth || document.body.offsetWidth
      const mid = Math.ceil(length / 2)
      const tem = []
      for (let i = 0; i < length; i++) {
        let index = this.mid_index - mid + i
        if (index < 0) {
          index = length + index
        } else if (index >= length) {
          index = index - length
        }
        const multiple = (i + 1) <= mid ? -(i + 1 - mid) : (i + 1 - mid)
        tem[index] = {
          left: (i + 1) <= mid ? (window_width / 2 - (multiple * 135 + 135)) : (window_width / 2 + multiple * 135 - 135),
          zIndex: (i + 1) > mid ? (length - i) : (i + 1),
          opacity: 1 - multiple * 0.05,
          scale: 1 - multiple * 0.03
        }
      }
      this.library_style = tem
    },
    scorllLibrary () {
      if (this.library_timer !== null) {
        return false
      }
      this.library_timer = setInterval(() => {
        this.mid_index += 1
        if (this.mid_index > this.library_list.length) {
          this.mid_index = 0
        }
        this.calcLibraryStyle()
      }, 6000)
    },
    clearScorllLibrary () {
      clearInterval(this.library_timer)
      this.library_timer = null
    },
    jumpMid (index) {
      this.mid_index = index + 1
      this.calcLibraryStyle()
    }
  },
  head () {
    return {
      title: 'Lo研社 Lolita图书馆',
      meta: [
        {
          name: 'keywords',
          content: 'Lo研社,lolita图书馆,Lolita店铺'
        },
        {
          hid: 'description',
          name: 'names',
          content: '洛丽塔小裙子百科全书'
        }
      ]
    }
  },
  async asyncData ({ $axios, env }) {
    let data = await $axios({
      method: 'post',
      url: '/getLibraryToatl.php'
    })
    data = data.data
    let library_count = 0
    data.data.forEach((value) => {
      library_count += parseInt(value.count)
    })
    data.library_count = library_count
    console.log(data)
    let compilations = await $axios({
      method: 'post',
      url: '/compilations/getCompilationsList.php',
      data: {
        current: 1,
        size: 3,
        search: ''
      }
    })
    compilations = compilations.data.data
    const res = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/library/list',
      data: { page: 1, pageSize: 10 }
    })
    const library_list = res.data.data.rows
    // const library = await $axios({
    //   method: 'post',
    //   url: '/getLibraryListFilter.php',
    //   data: {
    //     search: [],
    //     current: 1,
    //     state: '',
    //     size: 11
    //   }
    // })
    // const library_list = library.data.data
    return {
      webInfo: data,
      compilations,
      library_list
    }
  }
}
</script>

<style type="text/css" scoped lang="less">
  .home-page{
    position: relative;
    .home-back{
      width: 100%;
      height: 100vh;
      background: url("https://lolitalibrary.com/ali/ssr/home/back.jpg");
      background-size: cover;
      background-position:center center;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .home-wrap{
      position: relative;
      .home-comp-list-wrap{
        display: flex;
        justify-content: center;
        margin: 0;
        padding: calc(50vh - 282px) 0 calc(50vh - 238px) 0;
        .home-comp-list{
          width: 420px;
          height: 450px;
          background-color: rgba(18,18,18,0.8);
          box-shadow: 0px 3px 7px 0px rgb(0 0 0 / 35%);
          border-radius: 4px;
          color: #fff;
          margin: 0 8px;
          .home-comp-cover{
            width: 380px;
            height: 190px;
            padding-top: 20px;
            margin: 0 auto 20px auto;
            overflow: hidden;
            img{
              width: 100%;
            }
          }
          .home-comp-title{
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            color: #fefefe;
            padding: 0 17px;
          }
          .home-comp-desc{
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            color: #fefefe;
            padding: 0 17px;
            letter-spacing: 1px;
            line-height: 22px;
            word-break: break-all;
            overflow:hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
          .home-comp-footer{
            display: flex;
            padding: 0 17px;
            font-size: 14px;
            color: ;
          }
        }
      }
    }
    .m-home-comp-list-wrap{
      margin: 0;
      padding: 0;
      .m-home-comp-list{
          width: 100%;
          height: calc(100vw * 0.5625);
          background-color: rgba(18,18,18,0.8);
          box-shadow: 0px 3px 7px 0px rgb(0 0 0 / 35%);
          border-radius: 4px;
          color: #fff;
          margin: 8px 0;
          position: relative;
          .home-comp-cover{
            width: 100%;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            img{
              width: 100%;
            }
          }
          .home-comp-info{
            position: relative;
            height: 100%;
            background: rgba(255, 255, 255, 0.4);
            color: #000000;
          }
          .home-comp-title{
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 18px;
            font-weight: bolder;
            font-stretch: bolder;
            padding: 0 17px;
            padding-top: 10px;
          }
          .home-comp-desc{
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            padding: 0 17px;
            letter-spacing: 1px;
            line-height: 22px;
            word-break: break-all;
            overflow:hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
          .home-comp-footer{
            display: flex;
            padding: 0 17px;
            font-size: 14px;
            color: #000000;
          }
      }
    }
    .home-library-wrao{
      position: relative;
      width: 100%;
      overflow: hidden;
      height: 140px * 5;
      .library-back{
        height: 140px * 5;
        width: 100%;
        overflow: hidden;
        .library-back-list{
           height: 140px;
           width: 3840px * 2;
        }
      }
      .library-list-wrap{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 140px * 5;
        background: rgba(0, 0, 0, 0.4);
        .library-title{
          font-size: 28px;
          padding: 40px 0;
          text-align: center;
          font-weight: bolder;
        }
        .library-list{
          position: absolute;
          padding: 10px;
          border-radius: 5px;
          background: #fff;
          box-shadow: 1px 1px 10px #CCCCCC;
          text-align: center;
          bottom: 90px;
          transition: 0.3s;
          .library-cover{
            width: 250px;
            height: 300px;
            margin: 0 auto 10px auto;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .library-name{
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 16px;
            transition: 0.3s;
            font-weight: bolder;
            cursor: pointer;
            color: #000000;
          }
          .library-name:hover{
            color: #FFAA7F
          }
          .shop-info{
            margin: 10px;
            display: flex;
            width: 250px;
            align-items: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .shop-cover{
              width: 40px;
              height: 40px;
              overflow: hidden;
              border-radius: 50%;
              margin: 5px;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            .shop-name{
              font-size: 16px;
              font-weight: bolder;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .home-title{
      font-weight: bolder;
      text-align: center;
      font-size: 28px;
      padding: 40px 0;
      text-align: center;
      font-weight: bolder;
    }
    .about-us{
      .us-info{
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          display: block;
          margin: 5px 0;
        }
      }
      .us-face{
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin-right: 15px;
        overflow: hidden;
        img{
          width: 100%;
        }
      }
    }
    .about-admin{
      max-width: 600px;
      margin: 10px auto;
      text-align: center;
      span{
        display: block;
        margin: 10px;
        line-height: 30px;
      }
    }
  }
</style>
