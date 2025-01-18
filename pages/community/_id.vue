<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <!-- {{community}} -->
    <div class="community-header">
      <el-button size="medium" type="primary" @click="showCommunity()">
        <i class="el-icon-edit-outline"></i>
        发帖
      </el-button>
    </div>
    <div class="community-wrap" :style="{ 'min-height': (max_height + 20) + 'px' }">
      <div class="community-list-wrap"
      v-for="(list, index) in community"
      :key="list.community_id"
      :style="{
        transform: 'translate('+ (style_list[index] ? style_list[index].left + 'px' : '0px') + ',' + (style_list[index] ? style_list[index].top + 'px' : '0px') + ')',
        transition: (style_list[index] ? style_list[index].transition : '0s' )
      }">
        <div class="community-list">
          <div class="user-info">
            <el-popover
              placement="bottom"
              :width="$store.state.app.isMobile ? getClientWidth : 400"
              trigger="click">
              <div>
                <div class="pop-user-info">
                  <userAvatar :user_face="BASE_IMG + list.user.user_face" style="cursor: pointer" @click.native="previewImage([list.user.user_face], 0)" />
                  <div class="user-name">
                    <div>
                      {{list.user.user_name}}
                    </div>
                    <div style="font-size: 14px" class="qhx-tip">
                      暂无签名
                    </div>
                  </div>
                </div>
                <div style="text-align: center">
                  <nuxt-link :to="'/userSpace/' + list.user.user_id">
                    <el-button type="primary" size="mini" style="margin: 10px auto 10px auto">进入空间</el-button>
                  </nuxt-link>
                </div>
              </div>
              <userInfo slot="reference" :user_info="{ user_face: list.user.user_face, user_name: list.user.user_name }" style="display: inline-block; cursor: pointer;"></userInfo>
            </el-popover>
          </div>
          <div class="community-info">
            <nuxt-link :to="'/community/detail/' + list.community_id" :title="list.title + 'Lo研社'"  target="_blank">
              <div class="community-title qhx-title">
                <el-tag size="mini">{{list.type}}</el-tag>
                {{list.title}}
              </div>
            </nuxt-link>
            <div class="community-content qhx-text">
              <richText :content="list.content" @imgLoad="waterfall()" @imgClick="ritchImage" />
              <!-- <span v-html="list.content"></span> -->
            </div>
            <div class="community-img" v-if="list.img_list.length > 0">
              <div v-for="(img, index_img) in list.img_list" :key="index_img" class="community-img-list">
                <img v-lazy="BASE_IMG + img" alt="" @click="previewImage(list.img_list, index_img)">
              </div>
            </div>
            <div class="community-data" v-if="list">
              <div class="data-list">
                <!-- <div class="iconfont icon icon-dianzan"></div> -->
                <GoodBtn :pk_type="3"
                :pk_id="list.community_id"
                :is_good="list.is_good"
                :key="list.community_id"
                @success="goodSuccess($event, list.community_id)"
                ></GoodBtn>
                <div class="number">
                  {{ list.good_count }} 点赞
                </div>
              </div>
              <div class="data-list" @click="collectAdd(list.community_id)">
                <div :class="list.is_collect ? 'iconfont icon icon-shoucang collect-active collect-icon' : 'iconfont icon icon-shoucang collect-icon'"></div>
                <div class="number">
                  {{ list.collect_count }} 收藏
                </div>
              </div>
              <div class="data-list">
                <div class="iconfont icon icon-xianshikejian"></div>
                <div class="number">
                  {{ list.times_count }} 浏览
                </div>
              </div>
            </div>
            <div class="qhx-tip">
              <div class="qhx-date">
                {{ dayjs(list.date).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <addCommunity ref="addCommunity" v-if="show_add_community"></addCommunity>
    <addCollect ref="addCollect" @success="collectSuccess"></addCollect>
    <PagingBox :total="total" :pageSize="pageSize" :current="page" :to="'/community/'"></PagingBox>
    <imageViewer :show-image="showImage" :initial-index="initialIndex" :on-close="handleClose" :url-list="srcList" style="z-index: 9999;" />
  </div>
</template>
<script>
import userInfo from '@/components/user/userInfo.vue'
import PagingBox from '@/components/PagingBox.vue'
import addCommunity from '@/components/community/addCommunity.vue'
import addCollect from '@/components/collect/addCollect.vue'
import { getUserIsDataByIds } from '@/api/user.js'
import richText from '@/components/richText'
const pageSize = 10
export default {
  components: {
    PagingBox,
    userInfo,
    addCommunity,
    addCollect,
    richText,
    userAvatar: () => import('@/components/user/userAvatar.vue')
  },
  data () {
    return {
      total: 0,
      community: [],
      pageSize,
      page: 1,
      style_list: [],
      max_height: 300,
      show_add_community: false,
      showImage: false,
      srcList: [],
      initialIndex: 0,
      clientWidth: 200
    }
  },
  computed: {
    getClientWidth () {
      return this.clientWidth - 40
    }
  },
  created () {
    this.show_add_community = true
  },
  mounted () {
    this.waterfall()
    this.$nextTick(() => {
      this.getUserIsDataByIds()
    })
    this.$set(this, 'clientWidth', document.body.clientWidth)
    window.addEventListener('resize', this.waterfall)
  },
  methods: {
    collectAdd (pk_id) {
      const params = {
        pk_id: parseInt(pk_id),
        collect_type: 3
      }
      this.$refs.addCollect.showModel(params)
    },
    collectSuccess (is_collect) {
      const pk_id = this.$refs.addCollect.pk_id
      const index = this.community.findIndex((value) => {
        return parseInt(value.community_id) === parseInt(pk_id)
      })
      if (index !== -1) {
        const num = is_collect ? 1 : -1
        if (!this.community[index].is_collect === is_collect) {
          this.community[index].statistical_data.collect_count = parseInt(this.community[index].statistical_data.collect_count) + num
        }
        this.community[index].is_collect = is_collect
      }
    },
    goodSuccess (is_good, community_id) {
      console.log(is_good, community_id, '点赞')
      const index = this.community.findIndex((value) => {
        return value.community_id === community_id
      })
      if (index !== -1) {
        const num = is_good ? 1 : -1
        this.community[index].good_count = parseInt(this.community[index].good_count) + num
      }
    },
    getUserIsDataByIds () {
      const ids = []
      if (this.community.length === 0) {
        return false
      }
      if (!this.$store.getters.getToken) {
        return false
      }
      this.community.forEach((value) => {
        ids.push(value.community_id)
      })
      const params = {
        ids: ids.join(),
        pk_type: 3
      }
      getUserIsDataByIds(params)
        .then((res) => {
          console.log(res, '是否数据')
          const { data, code } = res
          if (code === 200) {
            if (data.length > 0) {
              data.forEach((value) => {
                const index = this.community.findIndex((item) => {
                  return item.community_id === parseInt(value.pk_id)
                })
                if (index !== -1) {
                  this.$set(this.community[index], 'is_good', value.is_good)
                  this.$set(this.community[index], 'is_collect', value.is_collect)
                }
              })
            }
          }
        })
    },
    // 显示图片
    ritchImage (e) {
      this.srcList = [e]
      this.initialIndex = 0
      this.showImage = true
    },
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
    waterfall () {
      const list = document.getElementsByClassName('community-list')
      const style_list = []
      const column = 3
      let min_column = 0
      const column_height = []
      for (let i = 0; i < column; i++) {
        column_height.push(0)
      }
      Object.keys(list).forEach((key) => {
        style_list.push({
          top: column_height[min_column],
          left: min_column * (list[key].offsetWidth + 20)
        })
        column_height[min_column] += (list[key].offsetHeight + 20)

        // 判断最小列
        column_height.forEach((height, index) => {
          if (height < column_height[min_column]) {
            min_column = index
          }
        })
      })
      this.style_list = style_list
      this.$nextTick(() => {
        this.style_list = this.style_list.map((item) => {
          item.transition = '0.3s'
          return item
        })
      })
      column_height.forEach((height) => {
        if (height > this.max_height) {
          this.max_height = height
        }
      })
    },
    showCommunity () {
      this.$refs.addCommunity.showModel()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.waterfall)
  },
  layout: 'BaseLayout',
  async asyncData ({ $axios, params, env }) {
    const id = params.id || 1
    // const res = await $axios({
    //   method: 'post',
    //   url: '/getCommunityList.php',
    //   data: {
    //     current: id || 1,
    //     search: '',
    //     type: ''
    //   }
    // })

    const res = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/community/list',
      data: { page: id || 1, pageSize: 10 }
    })
    let data = res.data.data.rows
    const total = res.data.data.count
    console.log(total)
    if (data.length > 0) {
      data = data.map((value, i) => {
        if (parseInt(value.community_type) === 0) {
          try {
            const contnet = JSON.parse(value.content.replace(/\n/g, ''))
            value.content = contnet.content
            value.img_list = contnet.img_url
          } catch (e) {
            value.content = '解析错误'
            value.img_list = []
          }
        } else {
          console.log()
          if (value.img_list && value.img_list !== '') {
            value.img_list = value.img_list.split(',')
          } else {
            value.img_list = []
          }
        }
        delete value.is_good
        return value
      })
    } else {
      data = []
    }
    console.log(data)
    return {
      community: data,
      total,
      page: id
    }
  }
}
</script>
<style lang="less">
  .community-content{
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    img{
      width: 100%;
      max-width: 200px;
    }
  }
</style>
<style scoped lang="less">
.pop-user-info{
  display: flex;
  align-items: center;
  padding: 10px 0;
  .user-name{
    font-size: 16px;
    margin-left: 5px;
  }
}
  .community-header{
    display: flex;
    justify-content: center;
    margin: 30px auto 0 auto;
    max-width: 1000px;
  }
  .community-wrap{
    // display: flex;
    // flex-wrap: wrap;
    margin-top: 25px;
    min-height: 100vh;
    position: relative;
    .community-list-wrap{
      width: 33%;
      min-width: 400px;
      position: absolute;
      // transition: 0.3s;
      .community-list{
        padding: 10px;
        background: #FFFFFF;
        border-radius: 5px;
        .community-title{
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000000;
          transition: 0.3s;
          cursor: pointer;
        }
        .community-title:hover{
          color: #FFAA7F;
        }
      }
      .community-img{
        display: flex;
        flex-wrap: wrap;
      }
      .community-data{
        display: flex;
        justify-content: center;
        color: #999999;
        margin: 15px 0;
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
      .community-img-list{
        width: calc(33% - 4px);
        height: 0;
        margin: 2px;
        border-radius: 4px;
        overflow: hidden;
        padding-bottom: calc(33% - 4px);
        img{
          width: 100%;
          object-fit: cover;
        }
      }
    }
  }
  @media screen and (min-width: 750px) {
    .community-list-wrap{
      .community-list{
        margin: 10px;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .community-list-wrap{
      display: contents;
      .community-list{
        margin: 10px 0;
      }
    }
  }
</style>
