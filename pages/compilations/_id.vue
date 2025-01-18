<template>
  <div class="pub-background">
    <div class="head-seat"></div>
    <div class="comp-wrap">
      <div class="comp-list-wrap">
        <div class="comp-list-box" v-for="list in comp_list" :key="list.comp_id">
          <div class="comp-list">
            <div class="comp-cover">
              <img v-lazy="BASE_IMG + list.comp_cover" >
            </div>
            <nuxt-link :to="'/compilations/detail/' + list.comp_id">
              <div class="comp-info">
                <div class="comp-name">
                  {{list.comp_name}}
                </div>
                <div style="height: 100px;">
                  <div class="comp-desc">
                    <span v-html="list.comp_describe"></span>
                  </div>
                </div>
                <div class="qhx-tip">
                  <div>共收录 {{list.library_count}}</div>
                  <div class="qhx-date">
                    {{list.create_date}}
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <PagingBox :total="total" :pageSize="pageSize" :current="page" :to="'/compilations/'"></PagingBox>
  </div>
</template>

<script>
const pageSize = 20
export default {
  data () {
    return {
      total: 0,
      comp_list: [],
      page: 1,
      pageSize
    }
  },
  layout: 'BaseLayout',
  created () {
    console.log(this.$store)
  },
  async asyncData ({ $axios, params }) {
    console.log(params.id)
    const id = params.id
    const res = await $axios({
      method: 'post',
      url: '/getCompilationsList.php',
      data: {
        current: id || 1,
        search: '',
        size: pageSize
      }
    })
    console.log(res)
    const comp_list = res.data.data
    const total = res.data.count
    return {
      page: id,
      comp_list,
      total
    }
  }
}
</script>

<style scoped lang="less">
  .comp-list-wrap{
    display: flex;
    flex-wrap: wrap;
    .comp-list-box{
      transition: 0.3s;
      .comp-list{
        margin: 10px;
        padding: 20px;
        background: #fff;
        border-radius: 5px;
        overflow: hidden;
        .comp-cover{
          width: 100%;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .comp-info{
          .comp-name{
            font-size: 16px;
            font-weight: bolder;
            color: #000;
            transition: 0.3s;
          }
          .comp-name:hover{
            color: #FFAA7F;
          }
          .comp-desc{
            margin: 5px;
            color: #000;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
  @media screen and (max-width: 750px) {
    .comp-list-box{
      width: 100%;
    }
  }
  @media screen and (min-width: 750px) {
    .comp-list-box{
      width: 33%;
    }
  }
</style>
