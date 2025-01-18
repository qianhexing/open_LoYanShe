<template>
  <div>
    <div class="pub-background">
      <div class="head-seat"></div>
      建设中……
    </div>
  </div>
</template>

<script>
import { getLibraryList } from '@/api/library.js'
import { getWikiOptions, getWikiOptionsByKeywords } from '@/api/wiki.js'
import { getShopOptionsByKeywords } from '@/api/shop.js'
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
