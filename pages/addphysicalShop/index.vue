<template>
  <!-- 添加实体店 -->
  <div>
    <div class="head-seat"></div>
    <!-- <el-amap vid="amap"></el-amap> -->
    <!-- <el-amap v-if="!loading" vid="amap" class="amap-demo" style="height: 50vh; width: 100vw;" :center="center"></el-amap> -->
    <div class="add-library">
      <el-form ref="shop" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="所属店铺" prop="shop_id">
          <el-select
              v-model="form.shop_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getShopOptions"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in shop_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="实体店名" prop="physical_name">
          <el-input v-model="form.physical_name" placeholder="请输入店铺名"></el-input>
        </el-form-item>
        <el-form-item label="店铺logo" prop="shop_logo">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="cover"
            :on-change="coverChange"
            :limit="1"
            :on-exceed="coverExceed">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="coverRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-cascader
          v-model="form.province"
          :options="address_options"
          :props="{ checkStrictly: true }"
          clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item label="笔记">
          <el-input v-model="form.physical_desc" placeholder="店铺简介" type="textarea"></el-input>
        </el-form-item>
        <div style="display: flex; align-items: center;">
          <el-input v-model="searchKeyword" placeholder="输入地址" />
          <el-button type="primary" @click="searchAddress">搜索地址,生成经纬度</el-button>
        </div>
        <div v-if="coordinates">
          <p>经度: {{ coordinates.lng }}</p>
          <p>纬度: {{ coordinates.lat }}</p>
        </div>
        <div id="container" style="width: 100%; height: 30vh;"> </div>
        <br>
        <el-button @click="add()" type="primary" v-if="!loading">上传店铺</el-button>
        <el-button type="danger" v-else>请求中</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// let amapManager = new VueAMap.AMapManager();
import address from './address.json'
import { getShopOptionsByKeywords, insertPhysicalShop } from '@/api/shop.js'
import uploadImage from '@/utils/uploadImage.js'
export default {
  layout: 'BaseLayout',
  data () {
    return {
      rules: {},
      // amapManager: AMapManager,
      searchText: '',
      keyword: '',
      loading: true,
      coordinates: null,
      searchKeyword: '',
      cover: [],
      form: {
        physical_name: '',
        shop_id: null,
        province: [], // 省市区
        address: ''
      },
      address_options: [],
      shop_options: [],
      map: null,
      marker: null
    }
  },
  mounted () {
    console.log('省市区数据', address)
    this.address_options = address.map((child) => {
      child.children = child.children.map((child2) => {
        child2.children = child2.children.map((child3) => {
          return {
            label: child3.label,
            value: child3.label
          }
        })
        return {
          label: child2.label,
          value: child2.label,
          children: child2.children
        }
      })
      return {
        label: child.label,
        value: child.label,
        children: child.children
      }
    })
    console.log(this.$AMap, '高德地图')
    this.$AMap.service('AMap.Geocoder', function () {})
    setTimeout(() => {
      this.loading = false
    }, 2000)
    this.map = new this.$AMap.Map('container', {
      // pitch: 20, // 角度，有效范围 0 度- 83 度
      // viewMode: '3D',
      // terrain: true,
      zoom: 13, // 地图级别
      center: [116.481181, 39.989792] // 设置地图中心
    })
    window._AMapSecurityConfig = {
      securityJsCode: '627969390a1096484f1f71d87cf1b42d' // 申请key时的安全密钥
    }
  },
  components: {
  },
  methods: {
    async add () {
      console.log(this.form, '参数')
      const { province, physical_name, shop_id, address } = this.form
      const coordinates = this.coordinates
      const params = {
        physical_name,
        shop_id,
        address
      }
      if (province.length === 3) {
        params.province = province[0]
        params.city = province[1]
        params.area = province[2]
      } else {
        this.$message.warning('请选择省市区')
        return
      }
      if (coordinates !== null) {
        params.latitude = coordinates.lat
        params.longitude = coordinates.lng
      } else {
        this.$message.warning('请选择经纬度')
        return
      }
      if (this.loading) {
        this.$message.warning('请求中，请稍后')
        return false
      }
      let cover = null
      if (this.cover.length > 0) {
        // const cover_file = await compressImage(this.cover[0].url, 300, 300)
        cover = await uploadImage(this, this.cover[0].raw, 'static/shoplogo/')
        console.log('cover封面', cover)
        params.physical_logo = cover
      }
      this.loading = true
      insertPhysicalShop(params)
        .then((res) => {
          console.log('添加测试', res)
          if (res.code === 200) {
            this.initData()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    initData () {
      this.form = {
        physical_name: '',
        shop_id: null,
        province: [], // 省市区
        address: ''
      }
      this.coordinates = null
      this.searchKeyword = null
      this.cover = []
    },
    coverExceed () {
      this.$message.warning('最多选1张图片')
    },
    coverChange (file, fileList) {
      console.log(file)
      this.cover = fileList
    },
    setMapCenter (position) {
      this.map.setCenter(position)
      this.map.setZoom(11)
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
        this.shop_options = data
      } else {
        this.shop_options = []
      }
      this.loading = false
    },
    searchAddress () {
      const geocoder = new this.$AMap.Geocoder()
      console.log(this.searchKeyword)
      geocoder.getLocation(this.searchKeyword, (status, result) => {
        console.log(result, status)
        if (status === 'complete' && result.geocodes.length > 0) {
          this.coordinates = result.geocodes[0].location
          this.setMapCenter(this.coordinates)
          if (this.marker) {
            this.map.remove(this.marker)
          }
          this.marker = new this.$AMap.Marker({
            position: new this.$AMap.LngLat(this.coordinates.lng, this.coordinates.lat)
          })
          // 将创建的点标记添加到已有的地图实例：
          this.map.add(this.marker)
        } else {
          alert('未找到相关地址')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .add-library{
    max-width: 1040px;
    padding: 20px;
    margin: 20px auto;
    background: #fff;
    box-shadow: 1px 1px 10px #ccc;
    border-radius: 4px;
    .add-select{
      width: 50%;
      min-width: 200px;
    }
  }
</style>
