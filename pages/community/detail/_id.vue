<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <div class="community-detail-wrap">
      <div class="community-info">
        <div class="communitry-title">
          <el-tag size="mini">{{community.type}}</el-tag>
          <el-tag size="mini" effect="dark" type="danger" v-if="community.boutique != 0">精华帖</el-tag>
          <el-tag size="mini" effect="dark" type="danger" v-if="community.sort != 0">顶置帖</el-tag>
          {{community.title}}
        </div>
        <div class="communitry-content">
          <richText :content="community.content"></richText>
        </div>
        <div class="user-info">
          <nuxt-link :to="'/userSpace/' + community.user_id">
            <userInfo :user_info="{
              user_name:  community.user_name,
              user_id: community.user_id,
              user_face: community.user_face
            }"
            style="display: inline-block;"></userInfo>
          </nuxt-link>
        </div>
        <div class="qhx-tip">
          <div class="qhx-date">{{community.date}}</div>
        </div>
        <!-- 图鉴 -->
        <div class="">
          <div class="qhx-title" v-if="community.library_list && community.library_list.length > 0" style="margin: 10px 0;">搭配安利</div>
          <div v-for="(list, index) in community.library_list" :key="index">
            <div class="community-library">
              <div class="library-cover">
                <img :src="BASE_IMG + (list.library_info.square_cover ? list.library_info.square_cover : list.library_info.cover)" alt="">
              </div>
              <div class="library-info">
                <nuxt-link :to="'/library/detail/' + list.library_info.library_id" target="_blank">
                  <div class="library-name">
                    <el-tag type="danger" size="mini" effect="dark">版型 {{list.library_info.pattern}}</el-tag>
                    {{list.library_info.name}}
                  </div>
                </nuxt-link>
                <div class="info-list">
                  <div class="info-title">
                    图鉴类型：
                  </div>
                  <div class="info-cotent">
                    <el-tag type="danger" size="mini">{{list.library_info.library_type}}</el-tag>
                  </div>
                </div>
                <div class="info-list">
                  <div class="info-title">
                    当前状态：
                  </div>
                  <div class="info-cotent">
                    <el-tag type="danger" size="mini">{{list.library_info.state}}</el-tag>
                  </div>
                </div>
                <div class="info-list">
                  <div class="info-title">
                    推荐原因：
                  </div>
                  <div class="info-cotent">
                    {{list.reason ? list.reason : '暂无原因'}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 搭配详情 -->
        <div class="">
          <div class="qhx-title" v-if="community.collocation_list && community.collocation_list.length > 0" style="margin: 10px 0;">搭配详情</div>
          <div v-for="(list, index) in community.collocation_list" :key="index">
            <div class="community-library">
              <div class="library-cover">
                <img :src="BASE_IMG + (list.library_info.square_cover ? list.library_info.square_cover : list.library_info.cover)" alt="">
              </div>
              <div class="library-info">
                <nuxt-link :to="'/library/detail/' + list.library_info.library_id" target="_blank">
                  <div class="library-name">
                    <el-tag type="danger" size="mini" effect="dark">版型 {{list.library_info.pattern}}</el-tag>
                    {{list.library_info.name}}
                  </div>
                </nuxt-link>
                <div class="info-list">
                  <div class="info-title">
                    图鉴类型：
                  </div>
                  <div class="info-cotent">
                    <el-tag type="danger" size="mini">{{list.library_info.library_type}}</el-tag>
                  </div>
                </div>
                <div class="info-list">
                  <div class="info-title">
                    当前状态：
                  </div>
                  <div class="info-cotent">
                    <el-tag type="danger" size="mini">{{list.library_info.state}}</el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 店铺 -->
        <div class="">
          <div class="qhx-title" v-if="community.shop_list && community.shop_list.length > 0" style="margin: 10px 0;">店铺安利</div>
          <div class="shop-list-wrao">
            <div class="shop-list" v-for="(shop, index) in community.shop_list" :key="index">
              <div class="shop-cover">
                <img :src="BASE_IMG + shop.shop_logo" alt="">
              </div>
              <div class="shop-info">
                <nuxt-link :to="'/shop/detail/' + shop.shop_id" target="_blank">
                  <div class="shop-name">
                    <el-tag type="danger" size="mini">{{shop.shop_country == 0 ? '国牌' : '日牌'}}</el-tag>
                    {{shop.shop_name}}
                  </div>
                </nuxt-link>
                <div class="info-list">
                  <div class="info-title">
                    推荐原因：
                  </div>
                  <div class="info-cotent">
                    {{shop.reason ? shop.reason : '暂无原因'}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="community-img">
          <div class="img-list" v-for="(img, index) in community.img_list" :key="index">
            <img :src="BASE_IMG + img" alt="">
          </div>
        </div>
      </div>
      <div class="qhx-section-title">评论区</div>
      <CommentSection :type="'community'" :id="id"></CommentSection>
    </div>
  </div>
</template>

<script>
import userInfo from '@/components/user/userInfo.vue'
import { updateBrowsTime } from '@/api/home.js'
export default {
  data () {
    return {
      total: null,
      community: null
    }
  },
  layout: 'BaseLayout',
  created () {
    console.log(this.$store)
  },
  components: {
    userInfo
  },
  head () {
    return {
      title: (this.community ? this.community.title : '') + '-Lo研社 洛丽塔图书馆',
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
  mounted () {
    const { id } = this
    setTimeout(() => {
      updateBrowsTime({ id: parseInt(id), type: 'community' })
    }, 5000)
  },
  async asyncData ({ $axios, params, redirect }) {
    console.log(params.id)
    const id = params.id
    const res = await $axios({
      method: 'post',
      url: '/getCommunityDetail.php',
      data: {
        community_id: id
      }
    })
    console.log(res)
    const data = res.data
    let collocation_list = []
    let library_list = []
    let shop_list = []
    const community_data = data.data
    if (data.code === 200) {
      if (community_data.community_type === '0') {
        try {
          community_data.content = JSON.parse(community_data.content.replace(/\n/g, '<br>'))
          community_data.img_list = community_data.content.img_url
          community_data.content = community_data.content.content
        } catch (e) {
          community_data.content = '字符串解析失败了Σ( °△°|||)，您可以反馈给管理员3292658709@qq.com'
          community_data.img_list = []
        }
      } else {
        console.log()
        if (community_data.img_list && community_data.img_list !== '') {
          community_data.img_list = community_data.img_list.split(',')
        } else {
          community_data.img_list = []
        }
      }
      collocation_list = res.data.collocation_list
      library_list = res.data.library_list
      shop_list = res.data.shop_list
    } else {
      redirect({ path: '/404' })
    }
    const community = {
      ...community_data,
      collocation_list,
      library_list,
      shop_list
    }
    return {
      community,
      id
    }
  }
}
</script>
<style lang="less">
  @media screen and (min-width: 750px) {
    .community-detail-wrap{
      .communitry-content{
        img{
          max-width: 500px;
          width: auto;
        }
      }
    }
  }
  @media screen and (max-width: 750px) {
    .communitry-content{
      img{
        width: 100%
      }
    }
    .community-detail-wrap{
      .communitry-content{
        img{
          width: 100%
        }
      }
    }
  }
</style>
<style scoped lang="less">
  .community-detail-wrap{
    width: 100%;
    max-width: 700px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 1px 1px 10px #ccc;
    margin: 25px auto;
    .community-info{
      .communitry-title{
        font-size: 16px;
        color: #FFAA7F;
        // color: #f56c6c;
        font-weight: bolder;
      }
      .communitry-content{
        padding: 10px
      }
      .community-library{
        display: flex;
        padding: 5px 10px;
        .library-cover{
          width: 100px;
          height: 100px;
          overflow: hidden;
          border-radius: 5px;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .library-info{
          flex: 1;
          margin-left: 10px;
          .library-name{
            color: #000000;
            font-weight: bolder;
            font-size: 16px;
            transition: 0.3s;
            cursor: pointer;
          }
          .library-name:hover{
            color: #FFAA7F;
          }
        }
      }
      .info-list{
        margin: 5px 0;
        display: flex;
      }
      .shop-list-wrao{
        .shop-list{
          display: flex;
          margin: 10px;
          .shop-cover{
            width: 70px;
            height: 70px;
            border-radius: 5px;
            overflow: hidden;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .shop-info{
            margin-left: 10px;
            .shop-name{
              font-size: 16px;
              font-weight: bolder;
              color: #000000;
              cursor: pointer;
              transition: 0.3s;
            }
            .shop-name:hover{
              color: #FFAA7F
            }
          }
        }
      }
      .community-img{
        margin: 5px;
        text-align: center;
        img{
          max-width: 100%;
        }
      }
    }
  }
  @media screen and (min-width: 750px) {
    .community-detail-wrap{
      .community-info{
        padding: 40px 50px;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .community-info{
      padding: 30px 30px;
    }
  }
</style>
