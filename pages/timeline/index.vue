<template>
  <div>
    <div class="head-seat"></div>
    <div>
      <div class="timeline">
        <el-calendar v-model="value"></el-calendar>
      </div>
      <div style="margin: 10px;">
        <div class="qhx-tip">
          今日共有 {{ total }} 条裙子在预约中
        </div>
        <el-checkbox v-model="checked" @change="changeChecked">不显示子图鉴</el-checkbox>
      </div>
      <div class="library-wrap" style="padding-top: 15px;">
      <div class="library-list-wrap" v-for="(list, index) in list" :key="list.library_id" :style="{'animation-delay': (0.15 * index) + 's'}">
        <section class="library-list">
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
        </section>
      </div>
    </div>
    <LoadMore :page="page"
    :pageSize="pageSize"
    :loading="loading"
    :total="total"
    @loadMore="getLibraryList()"></LoadMore>
    </div>
  </div>
</template>

<script>
// import { setLoginType, loginIn } from '../../api/user.js'
import { getLibraryList } from '@/api/library'
export default {
  data () {
    return {
      value: new Date(),
      checked: true,
      page: 1,
      pageSize: 18,
      loading: false
    }
  },
  layout: 'BaseLayout',
  watch: {
    value () {
      if (this.loading) {
        this.$message.warning('加载中请稍后重试')
      } else {
        this.page = 0
        this.list = []
        this.getLibraryList()
      }
    }
  },
  mounted () {
  },
  methods: {
    changeChecked () {
      this.page = 0
      this.list = []
      this.getLibraryList()
    },
    getLibraryList (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      const params = {
        page: page || this.page,
        pageSize: pageSize || this.pageSize,
        filter_list: [
          {
            value: this.value,
            op: 'and',
            field: 'appointment_time'
          }
        ]
      }
      if (this.checked) {
        params.filter_list.push({
          field: 'parent_id',
          op: 'and',
          value: 0
        })
      }
      getLibraryList(params)
        .then((res) => {
          if (res.code === 200) {
            const data = res.data
            if (data.rows.length > 0) {
              if (page === 1) {
                this.list = data.rows
              } else {
                this.list.push(...data.rows)
              }
            }
            console.log(res)
            this.total = data.count
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  async asyncData ({ $axios, params, query, env }) {
    const res = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/library/list',
      data: {
        page: 1,
        pageSize: 18,
        filter_list: [
          {
            value: new Date(),
            op: 'and',
            field: 'appointment_time'
          },
          {
            field: 'parent_id',
            op: 'and',
            value: 0
          }
        ]
      }
    })
    console.log('获取到的列表', res.data)
    return {
      total: res.data.data.count,
      list: res.data.data.rows,
      current: 1
    }
  }
}
</script>

<style lang="less">
.timeline{
  max-width: 800px;
  margin: 0 auto;
  margin-top: 10px;
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
}
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
@media screen and (min-width: 750px) {
  .timeline{
    .el-calendar-day{
      height: 70px;
    }
  }
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
  .timeline{
    .el-calendar-day{
      height: 50px;
    }
  }
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
