<template>
  <div class="wardrobe-memory">
    <h3>记忆 Memory</h3>
    <el-timeline v-loading="loading">
      <el-timeline-item :timestamp="formatDate(list.date)" placement="top" v-for="list in list" :key="list.memory_id">
        <el-card>
          <h4>
            <span v-html="list.memory_title"></span>
          </h4>
          <span v-html="list.memory_note"></span>
          <div class="qhx-tip">
            <div class="qhx-date">
              {{ formatDate(list.date) }}
            </div>
          </div>
          <el-card style="margin: 10px 0;"
          v-for="community in list.community_list"
          :key="community.community_id">
            <nuxt-link :to="'/community/detail/' + community.community_id" target="_blank">
              <h4 class="community-title">
                <span v-html="community.title"></span>
              </h4>
            </nuxt-link>
            <div v-html="community.content"></div>
            <div class="community-image-wrap">
              <div class="community-image"
              v-for="(image, index) in community.img_list"
              :key="index">
                <img :src="BASE_IMG + image" >
              </div>
            </div>
          </el-card>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无记忆"></el-empty>
    <LoadMore :page="page"
    :pageSize="pageSize"
    :loading="loading"
    :total="total"
    @loadMore="getClothesMemoryList()"></LoadMore>
  </div>
</template>

<script>
import { getClothesMemoryList } from '../../api/wardrobe.js'
import { formatDate } from '../../plugins/public.js'
import { formatCommunity } from '../../pages/community/formatCommunity.js'
export default {
  data () {
    return {
      total: 0,
      page: 0,
      pageSize: 10,
      loading: false,
      list: []
    }
  },
  watch: {
    clothes_id () {
      this.page = 0
      this.list = []
      this.getClothesMemoryList()
    }
  },
  mounted () {
    this.getClothesMemoryList()
  },
  props: [
    'clothes_id'
  ],
  methods: {
    formatDate,
    reload () {
      const size = this.page * this.pageSize
      this.getClothesMemoryList(1, size)
    },
    getClothesMemoryList (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      const params = {
        clothes_id: this.clothes_id,
        page: page || this.page,
        pageSize: pageSize || this.pageSize
      }
      getClothesMemoryList(params)
        .then((res) => {
          if (res.code === 200) {
            let data = res.data.rows
            data = data.map((value) => {
              if (value.community_list.length > 0) {
                value.community_list = formatCommunity(value.community_list)
              }
              return value
            })
            if (params.page === 1) {
              this.list = data
            } else {
              this.list.push(...data)
            }
            console.log(this.list)
            this.total = res.data.count
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="less">
  .wardrobe-memory{
    padding-right: 20px;
    .community-title{
      transition: 0.3s;
      display: inline-block;
      color: #000000;
      margin: 5px 0;
    }
    .community-title:hover{
      color: #FFAA7F;
    }
    .community-image-wrap{
      display: flex;
      flex-wrap: wrap;
      margin: 10px 0;
      .community-image{
        width: 220px;
        height: 220px;
        overflow: hidden;
        padding: 5px;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
</style>
