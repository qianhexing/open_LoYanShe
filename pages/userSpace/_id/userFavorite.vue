<template>
  <div class="space-wardrobe" v-loading="loading">
    <div class="fun-list" v-if="$store.getters.getUserInfo && (id == $store.getters.getUserInfo.user_id)">
      <el-button type="primary" @click="showAddWardrobe()" size="medium">
        <i class="el-icon-plus" style="margin-right: 5px;"></i>
        新增收藏夹
      </el-button>
    </div>
    <div class="wardrobe-list-wrap">
      <div class="wardrobe-list-box" v-for="list in list" :key="list.wardrobe_id">
        <div class="wardrobe-list">
          <div class="wardrobe-cover">
            <img :src="BASE_IMG + (list.favorite_pic ? list.favorite_pic : 'static/plan_cover/default.jpg')" >
          </div>
          <div class="wardrobe-info">
            <nuxt-link :to="'/favorite/' + list.id">
              <div class="wardrobe-name">{{list.favorite_name}}</div>
            </nuxt-link>
            <el-tag size="mini" type="danger" :effect="'dark'" style="margin: 5px 0;">{{ list.collect_type | setFavoriteType}}</el-tag>
            <el-tag size="mini" type="danger" :effect="'dark'" style="margin: 5px 0;">{{ list.collect_count | setStatisticsNumber}} 个收藏</el-tag>
            <div class="qhx-tip">
              <span>{{formatDate(list.create_time)}}</span>
              <span style="margin-left: 5px; color: #F56C6C;">{{list.is_private == 0 ? '公开' : '私有'}}</span>
            </div>
            <div>
              {{list.favorite_desc}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <addFavorite
    ref="addFavorite"
    @success="reload"></addFavorite>
    <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无衣柜"></el-empty>
    <LoadMore :page="page"
    :pageSize="pageSize"
    :loading="loading"
    :total="total"
    @loadMore="getFavoriteVistor()"></LoadMore>
  </div>
</template>

<script>
import { getFavoriteVistor } from '../../../api/collect.js'
import { formatDate } from '../../../plugins/public.js'
import addFavorite from '../../../components/collect/addFavorite.vue'
export default {
  data () {
    return {
      pageSize: 9,
      page: 0,
      loading: false,
      total: 0,
      list: []
    }
  },
  components: {
    addFavorite
  },
  mounted () {
    this.getFavoriteVistor()
  },
  methods: {
    formatDate,
    getFavoriteVistor (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      getFavoriteVistor({
        user_id: this.id,
        page: page || this.page,
        pageSize: pageSize || this.pageSize
      })
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
            this.total = data.count
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    reload () {
      const size = this.page * this.pageSize
      this.getFavoriteVistor(1, size)
    },
    showAddWardrobe () {
      this.$refs.addFavorite.showModel()
    }
  },
  asyncData ({ $axios, params }) {
    const id = params.id
    return {
      id
    }
  }
}
</script>

<style scoped lang="less">
.space-wardrobe{
  .fun-list{
    display: flex;
    justify-content: center;
  }
  .wardrobe-list-wrap{
    display: flex;
    flex-wrap: wrap;
    .wardrobe-list-box{
      .wardrobe-list{
        background: rgba(17, 17, 17, 0.75);
        border-radius: 5px;
        padding: 20px;
        display: flex;
        box-shadow: 1px 1px 10px #CCCCCC;
        .wardrobe-cover{
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
        .wardrobe-info{
          color: #FFFFFF;
          margin-left: 5px;
          flex: 1;
          .wardrobe-name{
            font-size: 17px;
            transition: 0.3s;
            font-weight: bolder;
            color: #FFFFFF;
            cursor: pointer;
          }
          .wardrobe-name:hover{
            color: #FFAA7F;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 750px) {
   .space-wardrobe{
    .wardrobe-list-box{
      width: calc(33% - 10px);
      margin: 10px 5px;
      min-width: 300px;
    }
   }
}
@media screen and (max-width: 750px) {
   .space-wardrobe{
     .wardrobe-list-box{
       width: 100%;
       margin: 5px 0;
     }
   }
}
</style>
