<template>
  <div>
    <el-drawer
      :title="'关联图鉴'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()"
      :modal="false"
      :wrapperClosable="false">
      <div class="add-wrap" v-loading="loading">
        <el-input v-model="keywords" placeholder="输入检索图鉴名">
          <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="search()"></i>
        </el-input>
        <div class="community-list-wrap">
          <div class="community-list" @click="chooseLibrary(item)" v-for="item in list" :key="item.library_id">
            <div class="library-list">
              <div class="library-cover" v-if="item.square_cover && item.square_cover !== ''">
                <img v-lazy="BASE_IMG + item.square_cover" alt="" :title="item.name">
              </div>
              <div class="library-cover" v-else>
                <img v-lazy="BASE_IMG + item.cover" alt="" :title="item.name">
              </div>
              <div class="library-info">
                <h4 class="community-title">{{ item.name }}</h4>
                <div class="library-money">
                  <el-tag type="mini" v-show="item.pattern">版型 {{item.pattern}}</el-tag>
                  <span v-show="item.price">{{item.price}} {{item.shop_country == 0 ? '元' : '日元'}}</span>
                </div>
                <div>
                  <div class="info-list">
                    <div class="info-title">
                      图鉴类型：
                    </div>
                    <div class="info-cotent">
                      <el-tag type="danger" size="mini">{{item.library_type}}</el-tag>
                    </div>
                  </div>
                  <div class="info-list">
                    <div class="info-title">
                      当前状态：
                    </div>
                    <div class="info-cotent">
                      <el-tag type="danger" size="mini">{{item.state}}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无数据"></el-empty>
      <LoadMore :page="page"
      :pageSize="pageSize"
      :loading="loading"
      :total="total"
      @loadMore="getLibraryList()"></LoadMore>
    </el-drawer>
  </div>
</template>

<script>
// import { formatCommunity } from '../../pages/community/formatCommunity.js'
import { getLibraryList } from '../../api/library.js'
export default {
  data () {
    return {
      keywords: '',
      page: 0,
      pageSize: 10,
      show: false,
      loading: false,
      total: 0,
      list: []
    }
  },
  props: {
    user_id: {
      type: Number,
      default: null
    },
    filter_list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    showModel () {
      this.show = true
      this.getLibraryList()
    },
    search () {
      this.page = 0
      this.getLibraryList()
    },
    init () {
      this.keywords = ''
      this.page = 0
    },
    closeModel () {
      this.show = false
      this.init()
    },
    getLibraryList () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading = true
      this.page += 1
      const { page, pageSize, keywords } = this
      const params = {
        page,
        pageSize,
        filter_list: [
          {
            field: 'name',
            value: keywords,
            op: 'and'
          },
          ...this.filter_list
        ]
      }
      getLibraryList(params)
        .then((res) => {
          const data = res.data.rows
          this.total = res.data.count
          if (params.page === 1) {
            this.list = data
          } else {
            this.list.push(...data)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    chooseLibrary (list) {
      console.log(list, '选择的=========')
      this.$emit('choose', list)
      this.closeModel()
    }
  }
}
</script>

<style scoped lang="less">
.add-wrap{
  margin: 0 10px;
  .community-title{
    margin: 5px 0;
  }
  .community-content{
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .community-list{
    padding: 10px;
    cursor: pointer;
    transition: 0.3s;
  }
  .community-list:hover{
    background: #ffdac7;
  }
  .library-list{
    display: flex;
    padding: 0 15px 15px 15px;
    padding-bottom: 15px;
    .library-cover{
      overflow: hidden;
      margin-right: 10px;
      width: 100px;
      height: 100px;
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
</style>
