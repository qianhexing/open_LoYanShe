<template>
  <div style="background: #f1f1f1;" class="pub-background">
    <div class="head-seat"></div>
    <div class="wiki-detail-warp" v-if="detail">
      <div class="wiki-detail">
        <h4 class="wiki-title">{{ detail.wiki_name }}</h4>
        <div class="qhx-tip wiki-small-title">{{ detail.other_name }}</div>
        <div>{{ detail.wiki_describe }}</div>
      </div>
    </div>
    <div class="wiki-detail-warp" style="margin-top: 20px; margin-bottom: 20px;" v-if="section_list.length > 0">
      <div v-for="(list, index) in section_list" :key="index" style="margin-bottom: 20px;">
        <div class="wiki-detail">
          <h4 class="wiki-title">{{ list.section_title }}</h4>
          <div v-html="list.section_content"></div>
        </div>
      </div>
    </div>
    <div class="wiki-detail-warp" style="text-align: center;" v-hasPermi="['wiki:section:insert']">
      <el-button type="primary" size="mini" @click="addWikiSection()">新增词条段落</el-button>
    </div>
    <addWikiSection ref="addWikiSection"></addWikiSection>
  </div>
</template>

<script>
export default {
  layout: 'BaseLayout',
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
  components: {
    addWikiSection: () => import('@/components/wiki/addWikiSection.vue')
  },
  async asyncData ({ env, $axios, params }) {
    const id = params.id
    const res_section = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/wikiSection/list',
      data: { wiki_id: id }
    })
    const res = await $axios({
      method: 'post',
      baseURL: env.baseUrl,
      url: '/wiki/detail',
      data: { wiki_id: id }
    })
    console.log(res)
    const detail = res.data.data
    const section_list = res_section.data.data
    return {
      section_list,
      detail
    }
  },
  head () {
    return {
      title: this.detail.wiki_name + '-lolita百科',
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
  computed: {
    getClientWidth () {
      return this.clientWidth - 40
    }
  },
  mounted () {
    this.$set(this, 'clientWidth', document.body.clientWidth)
  },
  methods: {
    addWikiSection () {
      this.$refs.addWikiSection.showModel()
    }
  }
}
</script>

<style lang="less" scoped>
.wiki-detail-warp {
  background: #fff;
  border-radius: 5px;
  margin: 0 auto;

  .wiki-title {
    text-align: center;
  }

  .wiki-small-title {
    text-align: center;
    margin-bottom: 10px;
    display: block;
  }

  .wiki-list-wrap {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;

    .wiki-list {
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
}

@media (min-width: 750px) {
  .wiki-detail-warp {
    width: 850px;
    padding: 20px 40px;
  }
}

@media (max-width: 750px) {
  .wiki-detail-warp {
    width: calc(100% - 40px);
    padding: 20px;
  }
}</style>
