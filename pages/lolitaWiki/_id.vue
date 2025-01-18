<template>
  <div style="background: #f1f1f1;">
    <div class="head-seat"></div>
    <div class="wiki-wrap">
      <div  v-for="(wiki_type) in list" :key="wiki_type.wiki_type_id" class="wiki-type-list">
        <h4>{{ wiki_type.wiki_type }}·{{ wiki_type.wiki_secondary_type }}</h4>
        <div class="wiki-list-wrap">
          <div v-for="(wiki) in wiki_type.wiki_list" :key="wiki.wiki_id">
            <el-popover
              placement="bottom"
              :width="$store.state.app.isMobile ? getClientWidth : 400"
              trigger="click">
              <div class="pop-wiki" style="text-align: center">
                <h4>{{ wiki.wiki_name }}</h4>
                <span>
                  {{ wiki.wiki_describe }}
                </span>
                <div style="text-align: center">
                  <nuxt-link :to="'/lolitaWiki/detail/' + wiki.wiki_id">
                    <el-button type="primary" size="mini" style="margin: 10px auto 10px auto">词条详情</el-button>
                  </nuxt-link>
                </div>
              </div>
              <el-tag
                slot="reference"
                size="mini"
                type="danger"
                class="wiki-list"
              >{{ wiki.wiki_name }}</el-tag>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <PagingBox :total="total" :pageSize="pageSize" :current="page" :to="'/lolitaWiki/'" />
  </div>
</template>

<script>
import PagingBox from '@/components/PagingBox.vue'
// import { getWikiList } from '@/api/wiki.js'
export default {
  components: {
    PagingBox
  },
  layout: 'BaseLayout',
  async asyncData ({ env, $axios, params }) {
    let page = params.id
    page = parseInt(page) < 1 ? 1 : parseInt(page)
    const res = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/wiki/list',
      data: { page, pageSize: 10 }
    })
    const data = res.data.data
    return {
      list: data.rows || [],
      total: data.count || 0,
      pageSize: 10,
      page: page || 1
    }
  },
  data () {
    return {
      total: 0,
      pageSize: 10,
      page: 1,
      list: [],
      loading: false,
      clientWidth: 200
    }
  },
  computed: {
    getClientWidth () {
      return this.clientWidth - 40
    }
  },
  head () {
    return {
      title: '洛丽塔图书馆,洛丽塔百科',
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
    this.$set(this, 'clientWidth', document.body.clientWidth)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.wiki-wrap{
  background: #fff;
  border-radius: 5px;
  margin: 0 auto;
  .wiki-list-wrap{
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    .wiki-list{
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
}
@media (min-width: 750px) {
  .wiki-wrap{
    width: 850px;
    padding: 20px 40px;
  }
}
@media (max-width: 750px) {
  .wiki-wrap{
    width: calc(100% - 40px);
    padding: 20px;
  }
}
</style>
