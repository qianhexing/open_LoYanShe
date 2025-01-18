<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <div class="collect-wrap" v-loading="loading">
      <div class="favorite-detail" v-if="info">
        <div class="favorite-cover">
          <img :src="BASE_IMG + (info.favorite_pic ? info.favorite_pic : 'static/plan_cover/default.jpg')" >
        </div>
        <div class="favorite-info">
          <div class="favorite-name">
            {{ info.favorite_name }}
          </div>
          <div class="qhx-tip">
            创建者 {{ info.user_name }} <el-tag size="mini" type="danger" effect="dark" style="margin-left: 10px;">{{ info.is_private === 0 ? '公开' : '私有' }}</el-tag>
          </div>
          <div class="qhx-tip">
            <div>{{ total }} 个内容</div>
            <div style="margin-left: 10px;">
              <i class="iconfont icon-xianshikejian"></i> {{ info.times_count || 0 }}次浏览
            </div>
          </div>
          <div style="margin: 5px 0;" v-if="$store.state.user.info && $store.state.user.info.user_id === info.user_id">
            <el-button type="primary" size="mini" @click="edit(info)">
              <i class="el-icon-plus" style="margin-right: 5px;"></i>
              修改收藏夹
            </el-button>
            <el-button type="danger"
              size="mini"
              @click="deleteFavorite(info)"
              :disabled="info.able_delete == 0 ? false : true"
            >
              <i class="el-icon-delete-solid" style="margin-right: 5px;"></i>
              删除收藏夹
            </el-button>
          </div>
          <div class="favorite-desc">
            {{ info.favorite_desc }}
          </div>
          <div class="qhx-tip">
            <div class="qhx-date">
              创建于 {{ info.create_time | setDate }}
            </div>
          </div>
        </div>
      </div>
      <h4>共 {{ total }} 条收藏记录</h4>
      <div class="collect-list-wrap">
        <div class="collect-list" v-for="list in list" :key="list.id">
          <div v-if="list.info">
            <!-- 图鉴类型 -->
            <div class="collect-library" v-if="list.collect_type === 2">
              <div class="library-cover">
                <img :src="list.info.square_cover ? (BASE_IMG + list.info.square_cover) : (BASE_IMG + list.info.cover)" >
              </div>
              <div class="library-info">
                <nuxt-link :to="`/library/detail/` + list.info.library_id" :title="list.info.name" class="base-nav-list" active-class="active" target="_blank">
                  <h1 class="library-name">
                    {{list.info.name}}
                  </h1>
                </nuxt-link>
                <div class="qhx-tip">
                  <div class="qhx-date">收藏于 {{ list.create_time | setDate }}</div>
                </div>
                <div class="library-money">
                  <el-tag type="mini" v-if="list.info.library_pattern">版型 {{list.info.library_pattern}}</el-tag>
                  <el-tag type="mini" v-else-if="list.info.pattern">版型 {{list.info.pattern}}</el-tag>
                  <span v-show="list.info.price">{{list.info.price}} {{list.info.shop_country == 0 ? '元' : '日元'}}</span>
                </div>
                <div>
                  <div class="info-list">
                    <div class="info-title">
                      图鉴类型：
                    </div>
                    <div class="info-cotent">
                      <el-tag type="danger" size="mini">{{list.info.library_type}}</el-tag>
                    </div>
                  </div>
                  <div class="info-list">
                    <div class="info-title">
                      当前状态：
                    </div>
                    <div class="info-cotent">
                      <el-tag type="danger" size="mini">{{list.info.state}}</el-tag>
                    </div>
                  </div>
                </div>
                <div>
                  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteCollect(list)"></el-button>
                </div>
              </div>
            </div>
            <!-- 帖子类型 -->
            <div class="collect-library" v-else-if="list.collect_type === 3">
              <div class="community-info">
                <nuxt-link :to="`/community/detail/` + list.info.community_id" :title="list.info.title" class="base-nav-list" active-class="active" target="_blank">
                  <h1 class="community-title">
                    {{list.info.title}}
                  </h1>
                </nuxt-link>
                <div class="community-desc" v-html="list.info.content"></div>
                <div class="community-user" v-if="list.info.user">
                  <userInfo :user_info="{ user_face: list.info.user.user_face, user_name: list.info.user.user_name, user_avatar: list.info.user.avatar ? list.info.user.avatar.avatar_frame : undefined }" style="display: inline-block;"></userInfo>
                </div>
                <div style="text-align: right;">
                  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteCollect(list)"></el-button>
                </div>
              </div>
            </div>
            <div v-else>
              收藏夹功能建设中……
            </div>
          </div>
        </div>
      </div>
      <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无收藏"></el-empty>
      <div class="myel-paging-box">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          :disabled="loading"
          @current-change="getList">
        </el-pagination>
      </div>
    </div>
    <!-- 编辑 -->
    <addFavorite ref="addFavorite" @success="getInfo()"></addFavorite>
  </div>
</template>

<script>
import addFavorite from '@/components/collect/addFavorite.vue'
import { updateBrowsTime } from '@/api/home.js'
import { getCollectListVistor, getCollectDetail, deleteFavorite, deleteCollect } from '@/api/collect.js'
export default {
  components: {
    addFavorite
  },
  data () {
    return {
      list: [],
      total: 0,
      page: 1,
      pageSize: 20,
      loading: true,
      info: null
    }
  },
  layout: 'UserLayout',
  mounted () {
    this.getList()
    this.getInfo()
      .then(() => {
        this.updateBrowsTime()
      })
  },
  methods: {
    getList (page) {
      if (page) {
        this.page = page
      }
      this.loading = true
      const { id } = this
      const params = {
        id: parseInt(id),
        page: this.page,
        pageSize: this.pageSize
      }
      getCollectListVistor(params)
        .then((res) => {
          const { rows, count } = res.data
          this.list = rows
          this.total = count
        })
        .finally(() => {
          this.loading = false
        })
    },
    edit (row) {
      this.$refs.addFavorite.edit(row)
    },
    // 浏览次数
    updateBrowsTime () {
      const { id } = this
      if (this.$store.getters.getUserInfo && this.$store.getters.getUserInfo.user_id === this.info.user_id) {
        return false
      }
      setTimeout(() => {
        updateBrowsTime({ id: parseInt(id), type: 'favorite' })
      }, 5000)
    },
    deleteFavorite (row) {
      const { id, user_id } = row
      const params = {
        id
      }
      this.$confirm('收藏夹将会被永久删除,是否确认?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFavorite(params)
          .then((res) => {
            const { code } = res
            if (code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
            this.$router.push({ path: `/userSpace/${user_id}/userFavorite` })
          })
      })
    },
    deleteCollect (row) {
      const { id } = row
      const params = {
        id
      }
      this.$confirm('确认移出收藏夹吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCollect(params)
          .then((res) => {
            const { code } = res
            if (code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              const { total, pageSize, page } = this
              if (Math.ceil((parseInt(total) - 1) / pageSize) < page && page > 1) {
                this.page = page - 1
              }
              this.getList()
            }
          })
      })
    },
    getInfo () {
      return new Promise((resolve) => {
        const { id } = this
        const params = {
          id
        }
        getCollectDetail(params)
          .then((res) => {
            const { code, data } = res
            if (code === 200) {
              this.info = data
              resolve()
            }
          })
      })
    }
  },
  asyncData ({ $axios, params }) {
    console.log(params.id)
    return {
      id: params.id,
      loading: true
    }
  }
}
</script>

<style scoped lang="less">
  .collect-wrap{
    max-width: 1200px;
    padding: 10px;
    margin: 20px auto;
    min-height: 200px;
  }
  .favorite-detail{
    border-radius: 10px;
    padding: 20px 10px;
    box-shadow: 2px 2px 10px #cccccc;
    margin: 10px 5px;
    background: #fff;
    display: flex;
    .favorite-cover{
      overflow: hidden;
      margin-right: 10px;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 5px;
      }
    }
    .favorite-info{
      flex: 1;
      .favorite-name{
        font-size: 16px;
        font-weight: bolder;
      }
      .favorite-desc{
        min-height: 40px;
      }
    }
  }
  .collect-list-wrap{
    border-radius: 5px;
    .collect-library{
      display: flex;
      padding: 20px 10px;
      margin: 10px 5px;
      box-shadow: 2px 2px 10px #cccccc;
      background: #fff;
      border-radius: 10px;
      .library-cover{
        width: 100px;
        height: 100px;
        overflow: hidden;
        margin-right: 10px;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5px;
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
      .community-info{
        .community-title{
          font-size: 16px;
          font-weight: bolder;
          color: #000000;
          margin: 5px 0;
          transition: 0.3s;
          word-break: break-all;
          overflow:hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .community-desc{
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 1px;
          word-break: break-all;
          overflow:hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .community-user-face{
          width: 50px;
          height: 50px;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
  @media screen and (min-width: 750px) {
    .favorite-cover{
      width: 150px;
      height: 150px;
    }
    .collect-list-wrap{
      display: flex;
      flex-wrap: wrap;
      .collect-list{
        width: calc(100% / 3);
        min-width: 300px;
      }
    }
  }
  @media screen and (max-width: 750px) {
    .favorite-cover{
      width: 100px;
      height: 100px;
    }
  }
</style>
