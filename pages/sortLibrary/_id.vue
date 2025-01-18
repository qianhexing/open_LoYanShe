<template>
  <div>
    <div class="head-seat"></div>
    <div class="library-wrap">
      <div class="library-list" v-for="(list, index) in list" :key="list.library_id">
        <div class="library-cover">
          <img :src="BASE_IMG + list.cover" alt="">
        </div>
        <div class="library-info">
          {{ list.name }}
        </div>
        <div class="library-op">
          <span class="el-icon-caret-top op-icon" @click="up(index)"></span>
          <span class="el-icon-caret-bottom op-icon" @click="down(index)"></span>

        </div>
      </div>
      <div class="bottom-seat"></div>
      <div class="library-op-save">
        <el-button size="small" @click="sortLibrary()" type="primary">保存排序</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getLibraryList, sortLibrary } from '@/api/library.js'
export default {
  data () {
    return {
      total: 0,
      list: [],
      loading: false
    }
  },
  layout: 'BaseLayout',
  components: {
  },
  mounted () {
    this.getLibraryList()
  },
  methods: {
    up (index) {
      if (index > 0) {
        const item = this.list[index]
        this.list.splice(index, 1)
        this.list.splice(index - 1, 0, item)
      }
    },
    down (index) {
      if (index < this.list.length - 1) {
        const item = this.list[index]
        this.list.splice(index, 1)
        this.list.splice(index + 1, 0, item)
      }
    },
    sortLibrary () {
      const sort = this.list.map((item, index) => {
        return {
          library_id: item.library_id,
          sort: this.list.length - index
        }
      })

      if (this.loading) {
        return
      }
      this.loading = true
      const params = {
        library_id: parseInt(this.id),
        sort
      }
      sortLibrary(params)
        .then(() => {
          this.$message.success('排序成功')
        })
        .finally(() => {
          this.loading = false
        })
    },
    getLibraryList () {
      const params = {
        page: 1,
        pageSize: 999,
        sort: 1,
        filter_list: [
          {
            value: this.id,
            op: 'and',
            field: 'parent_id'
          }
        ]
      }
      getLibraryList(params)
        .then((res) => {
          console.log(res, '图鉴列表')
          this.list = res.data.rows
        })
    }
  },
  asyncData ({ params }) {
    console.log(params.id)
    const id = params.id
    return {
      id
    }
  }
}
</script>

<style lang="less" scoped>
.library-wrap{
  max-width: 600px;
  margin: 0 auto;
}
// @media screen and (max-width: 750px) {

// }
.library-cover{
  width: 80px;
  height: 80px;
  img{
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
}
.library-list{
  display: flex;
  align-items: center;
  margin: 10px;
  .library-info{
    margin-left: 10px;
    flex: 1;
  }
  .library-op{
    margin: 5px;
    .op-icon{
      padding: 5px;
      background: #5cb6ff;
      border-radius: 50%;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
}
.bottom-seat{
  height: 80px;
}
.library-op-save{
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 2px 2px 10px #ccc;

  z-index: 1000;
}
</style>
