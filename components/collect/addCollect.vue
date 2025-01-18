<template>
  <div>
    <el-drawer
      :title="'添加收藏'"
      :visible.sync="show"
      :size="$store.state.app.isMobile ? '100%' : '40%'"
      @close="closeModel()"
      :wrapperClosable="false">
      <div class="add-wrap" v-loading="loading">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="list.id"
            :value="list.id"
            v-for="list in list"
            :checked="list.is_collect == 0 ? false : true"
            :key="list.id"
            style="display: flex; align-items: center;"
          >
            <div class="favorite-list">
              <div class="favorite-cover">
                <img :src="BASE_IMG + (list.favorite_pic ? list.favorite_pic : 'static/plan_cover/default.jpg')" >
              </div>
            {{list.favorite_name}}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="bottom-seat"></div>
      <div class="add-bootom-fun">
        <el-button style="width: 100%;" type="primary" @click="add()">添加进收藏夹</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getFavoriteOptions, insertCollect } from '@/api/collect.js'
export default {
  data () {
    return {
      show: false,
      loading: false,
      list: [],
      checkList: [],
      pk_id: null
    }
  },
  methods: {
    showModel (params) {
      if (!params) {
        this.$message.error('未传参')
        return false
      }
      if (!this.$store.getters.getToken) {
        this.$message.warning('请登录')
        return false
      }
      this.show = true
      this.pk_id = params.pk_id
      this.getFavoriteOptions(params)
    },
    init () {
      this.list = []
      this.checkList = []
      this.pk_id = null
    },
    closeModel () {
      this.show = false
      this.init()
    },
    add () {
      if (this.loading) {
        this.$message.warning('请求中请稍候')
        return false
      }
      if (this.pk_id === null) {
        this.$message.warning('pk_id为空')
        return false
      }
      this.loading = true
      const params = {
        ids: this.checkList,
        pk_id: this.pk_id
      }
      insertCollect(params)
        .then((res) => {
          const { code, data } = res
          if (code === 200) {
            this.$emit('success', data)
            this.$message.success(data ? '收藏成功' : '取消收藏成功')
            this.closeModel()
          }
        })
    },
    getFavoriteOptions (params) {
      this.loading = true
      getFavoriteOptions(params)
        .then((res) => {
          const { code, data } = res
          if (code === 200) {
            this.list = data
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
.add-wrap{
  margin: 0 10px;
  position: relative;
  .favorite-list{
    display: flex;
    align-items: center;
    margin: 5px 0;
    .favorite-cover{
      width: 100px;
      height: 100px;
      overflow: hidden;
      margin-right: 5px;
      img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
.bottom-seat{
  height: 40px;
}
.add-bootom-fun{
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>
