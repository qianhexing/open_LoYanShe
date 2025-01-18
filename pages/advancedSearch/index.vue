<template>
  <div>
    <div class="pub-background">
      <div class="head-seat"></div>
      <div class="filter-list-wrap">
        <div class="filter-lits" v-for="(list, index) in filter_list" :key="index">
          <el-row :gutter="2">
            <el-col :span="6">
              <el-select v-model="list.field" placeholder="请选择字段" style="width: 100%;" @change="changeFiled($event, index)">
                <el-option :label="options.label" :value="options.value" v-for="(options, index) in field_options" :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="list.value" placeholder="请选择主要风格" style="width: 100%;" v-if="list.field === 'main_style'">
                <el-option :label="options.label" :value="options.value" v-for="(options, index) in main_style_options" :key="index"></el-option>
              </el-select>
              <el-autocomplete
                style="width: 100%;"
                v-else-if="list.field === 'pattern_elements' || list.field === 'design_elements' || list.field === 'cloth_elements' || list.field === 'secondary_cloth'"
                v-model="list.value"
                :fetch-suggestions="(queryString, cb) => {
                  queryPatternElements(queryString, cb, list.field)
                }"
                :trigger-on-focus="false"
                placeholder="请输入设计元素"
                @select="handleSelect"
              ></el-autocomplete>
              <el-select
                  v-else-if="list.field === 'shop_id'"
                  v-model="list.value"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入店铺名"
                  :remote-method="getShopOptions"
                  :loading="loading"
                  style="width: 100%;">
                  <el-option
                    v-for="item in shop_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              <el-input v-model="list.value" placeholder="请输入关键字" v-else></el-input>
            </el-col>
            <el-col :span="5">
              <el-select v-model="list.op" placeholder="请选择字段" style="width: 100%;">
                <el-option label="与" value="and"></el-option>
                <el-option label="或" value="or"></el-option>
                <el-option label="非" value="not"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <div style="display: flex; justify-content: center;">
                <i class="el-icon-plus icon-list" @click="add()"></i>
                <i class="el-icon-minus icon-list" @click="reduce(index)"></i>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="" style="text-align: center; margin-top: 20px;">
          <el-button type="primary" @click="search()">搜索</el-button>
          <el-button @click="reset()">重置</el-button>
        </div>
      </div>
      <div class="library-box">
        <h5 v-show="total !== 0 && !loading">共搜索到 {{total}} 条数据</h5>
        <div class="library-wrap">
          <div class="library-list" v-for="list in list" :key="list.library_id">
            <div class="library-cover">
              <img :src="BASE_IMG + (list.square_cover ? list.square_cover : list.cover)" >
            </div>
            <div class="library-info">
              <nuxt-link :to="`/library/detail/` + list.library_id" title="洛丽塔图书馆" target="_blank">
                <h1 class="library-name">
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
              <!-- <nuxt-link :to="`/shop/detail/` + list.shop_id"
              target="_blank"
              :title="list.shop_name"
              class="base-nav-list"
              active-class="active"
              v-if="needShop">
                <div class="shop-info">
                  <div class="shop-logo">
                    <img v-lazy="BASE_IMG + list.shop_logo" :title="list.shop_name" />
                  </div>
                  <div class="shop-name">{{list.shop_name}}</div>
                </div>
              </nuxt-link> -->
            </div>
          </div>
        </div>
        <el-empty :image-size="100" v-show="total === 0 && !loading"  description="暂无数据"></el-empty>
        <LoadMore :page="page"
        :pageSize="pageSize"
        :loading="loading"
        :total="total"
        @loadMore="getLibraryList()"></LoadMore>
      </div>
    </div>
  </div>
</template>

<script>
import { getLibraryList } from '../../api/library.js'
import { getWikiOptions, getWikiOptionsByKeywords } from '../../api/wiki.js'
import { getShopOptionsByKeywords } from '../../api/shop.js'
export default {
  layout: 'BaseLayout',
  data () {
    return {
      field_options: [
        { label: '图鉴名', value: 'name' },
        { label: '颜色', value: 'color' },
        { label: '图鉴类型', value: 'library_type' },
        { label: '所属店铺', value: 'shop_id' },
        { label: '主要风格', value: 'main_style' },
        { label: '柄图元素', value: 'pattern_elements' },
        { label: '设计元素', value: 'design_elements' },
        { label: '布料', value: 'cloth_elements' },
        { label: '辅料', value: 'secondary_cloth' }
      ],
      main_style_options: [],
      shop_options: [],
      filter_list: [
        {
          field: 'name',
          value: '',
          op: 'and'
        }
      ],
      loading: false,
      list: [],
      page: 0,
      pageSize: 10,
      total: 0
    }
  },
  mounted () {
    this.getMainStyle()
  },
  methods: {
    search () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
      }
      this.page = 0
      this.getLibraryList()
    },
    async getShopOptions (query) {
      if (query !== '') {
        this.loading = true
        const params = {
          shop_name: query
        }
        const results = await getShopOptionsByKeywords(params)
        let data = results.data
        if (data.length > 0) {
          data = data.map((value) => {
            return {
              value: value.shop_id,
              label: value.shop_name
            }
          })
        }
        this.loading = false
        this.shop_options = data
      } else {
        this.shop_options = []
      }
    },
    async queryPatternElements (queryString, cb, field) {
      console.log(field)
      let type_id = 3
      if (field === 'pattern_elements') {
        type_id = 3
      } else if (field === 'design_elements') {
        type_id = 2
      } else if (field === 'cloth_elements' || field === 'secondary_cloth') {
        type_id = 5
      }
      const data = await this.query(type_id, queryString)
      cb(data)
    },
    async query (type_id, queryString) {
      const params = {
        type_id,
        wiki_name: queryString
      }
      const results = await getWikiOptionsByKeywords(params)
      let data = results.data
      if (data.length > 0) {
        data = data.map((value) => {
          return {
            value: value.wiki_name
          }
        })
      }
      return data
    },
    handleSelect (item) {
      console.log(item)
    },
    getMainStyle () {
      const params = {
        type_id: 4
      }
      getWikiOptions(params)
        .then((res) => {
          if (res.code === 200) {
            let data = res.data
            if (data.length > 0) {
              data = data.map((value) => {
                return {
                  value: value.wiki_id,
                  label: value.wiki_name
                }
              })
              this.main_style_options = data
            }
          }
        })
    },
    reset () {
      this.filter_list = [
        {
          field: 'name',
          value: '',
          op: 'and'
        }
      ]
    },
    add () {
      this.filter_list.push({
        field: 'name',
        value: '',
        op: 'and'
      })
    },
    reduce (index) {
      if (this.filter_list.length > 1) {
        this.filter_list.splice(index, 1)
      } else {
        this.$message.error('至少保留一条')
      }
    },
    changeFiled (event, index) {
      console.log(event, index)
      this.filter_list[index].value = ''
    },
    getLibraryList () {
      if (this.loading) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.page += 1
      const { filter_list, page, pageSize } = this
      const params = {
        filter_list,
        page,
        pageSize
      }
      this.loading = true
      getLibraryList(params)
        .then((res) => {
          if (res.code === 200) {
            const data = res.data.rows
            if (page === 1) {
              this.list = data
            } else {
              this.list.push(...data)
            }
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
  .filter-list-wrap{
    max-width: 1080px;
    margin: 20px auto;
    padding: 20px 0;
    background: #FFFFFF;
    border-radius: 10px;
    box-shadow: 1px 1px 10px #CCCCCC;
  }
  .filter-lits{
    padding: 10px;
    .icon-list{
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #409EFF;
      margin: 0 5px;
      color: #fff;
      line-height: 25px;
      text-align: center;
      box-shadow: 1px 1px 10px #ccc;
      cursor: pointer;
      transition: 0.3s;
      margin-top: 10px;
    }
    .icon-list:hover{
      background: #317bc5;
    }
  }
  .library-box{
    max-width: 1060px;
    margin: 20px auto;
    padding: 20px 10px;
    background: #FFFFFF;
    border-radius: 10px;
    box-shadow: 1px 1px 10px #CCCCCC;
    .library-list{
      margin: 20px 0;
      display: flex;
      .library-cover{
        overflow: hidden;
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
      }
    }
  }
  @media screen and (min-width: 750px) {
    .library-cover{
      width: 150px;
      height: 150px;
    }
  }
  @media screen and (max-width: 750px) {
    .library-cover{
      width: 100px;
      height: 100px;
    }
  }
</style>
