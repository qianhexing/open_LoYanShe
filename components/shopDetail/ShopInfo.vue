<template>
  <div>
    <div v-if="item">
      <div class="shop-info-wrap">
        <div class="shop-cover">
          <img :src="BASE_IMG + item.shop_logo" :title="item.shop_name" />
        </div>
        <div class="shop-info">
          <div class="shop-name">
            <el-tag size="mini">{{item.shop_country == 0 ? '国牌' : '日牌'}}</el-tag>
            {{item.shop_name}}
          </div>
        </div>
        <section>
          <div style="display: flex; justify-content: center;">
            <a :href="item.shop_url" v-if="item.shop_url" target="_blank" style="margin: 5px;">
              <el-button type="primary" size="mini">{{item.shop_country == 0 ? '淘宝地址' : '官网地址'}}</el-button>
            </a>
            <a :href="item.wb_url" v-if="item.wb_url" target="_blank" style="margin: 5px;">
              <el-button type="primary" size="mini">微博地址</el-button>
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'item'
  ]
}
</script>

<style scoped lang="less">
.shop-info-wrap{
  padding: 15px;
  background: #fff;
  box-shadow: 1px 1px 10px #ccc;
  border-radius: 5px;
  .shop-cover{
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 1px 1px 10px #ccc;
    margin: 10px auto;
    img{
      width: 100%;
    }
  }
  .shop-info{
    padding: 10px;
    text-align: center;
  }
}
</style>
