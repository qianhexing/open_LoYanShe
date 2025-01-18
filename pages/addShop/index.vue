<template>
  <div>
    <!-- 添加店铺 -->
    <div class="head-seat"></div>
    <div class="add-library">
      <el-form ref="shop" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="店铺名字" prop="shop_name">
          <el-input v-model="form.shop_name" placeholder="请输入店铺名"></el-input>
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
        <el-form-item label="店铺地址" prop="shop_url">
          <el-input v-model="form.shop_url" placeholder="请输入店铺地址"></el-input>
        </el-form-item>
        <el-form-item label="微博名" prop="shop_url">
          <el-input v-model="form.wb_name" placeholder="请输入微博名"></el-input>
        </el-form-item>
        <el-form-item label="微博地址" prop="shop_url">
          <el-input v-model="form.wb_url" placeholder="请输入微博地址"></el-input>
        </el-form-item>
        <el-form-item label="店铺描述" prop="shop_url">
          <el-input v-model="form.shop_describe" placeholder="请输入店铺描述" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="所属国别" prop="main_type">
          <el-select
            class="add-select"
            v-model="form.shop_country"
            placeholder="请选择所属国别">
              <el-option
                v-for="item in shop_country_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主营类型" prop="shop_type">
          <el-select
            class="add-select"
            v-model="form.shop_type"
            filterable
            remote
            multiple
            reserve-keyword
            :loading="loading"
            placeholder="请选择售卖状态">
              <el-option
                v-for="item in shop_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主营风格" prop="shop_style">
          <el-select
            class="add-select"
            v-model="form.shop_style"
            filterable
            remote
            multiple
            reserve-keyword
            :loading="loading"
            placeholder="请选择主营风格">
              <el-option
                v-for="item in shop_style_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="店铺状态" prop="shop_state">
          <el-select
            class="add-select"
            v-model="form.shop_state"
            placeholder="请选择店铺状态">
              <el-option
                v-for="item in shop_state_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="主体类型" prop="main_type">
          <el-select
            class="add-select"
            multiple
            v-model="form.main_type"
            placeholder="请选择主体类型">
              <el-option
                v-for="item in main_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-button @click="add()" type="primary" v-if="!loading">上传店铺</el-button>
        <el-button type="danger" v-else>请求中</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { insertShop } from '@/api/shop.js'
import { getWikiOptionsByKeywords } from '@/api/wiki.js'
// import { insertLibrary } from '@/api/library.js'
// import compressImage from '@/utils/compressImage.js'
import uploadImage from '@/utils/uploadImage.js'
export default {
  layout: 'BaseLayout',
  data () {
    return {
      form: {
        shop_name: '',
        shop_logo: null,
        shop_url: null,
        wb_name: null,
        wb_url: null,
        shop_describe: null,
        shop_style: [],
        shop_type: [],
        shop_country: null,
        shop_state: null,
        main_type: []
      },
      disabled: false,
      shop_country_options: [
        { label: '国牌', value: 0 },
        { label: '日牌', value: 1 },
        { label: '其他', value: 2 }
      ],
      shop_state_options: [
        { label: '经营中', value: 0 },
        { label: '闭店', value: 1 },
        { label: '永久闭店', value: 2 }
      ],
      main_type_options: [
        { label: '网店', value: 0 },
        { label: '实体店', value: 1 },
        { label: '手作店', value: 2 },
        { label: '虚拟店', value: 3 }
      ],
      shop_type_options: [],
      shop_style_options: [],
      rules: {
        shop_name: [
          { required: true, message: '请输入店铺名', trigger: 'blur' }
        ]
      },
      cover: [],
      loading: false
    }
  },
  mounted () {
    this.getShopStyle()
    this.getShopType()
  },
  methods: {
    init () {
      this.cover = []
      this.form = {
        shop_name: '',
        shop_logo: null,
        shop_url: null,
        wb_name: null,
        wb_url: null,
        shop_describe: null,
        shop_style: [],
        shop_type: [],
        shop_country: null,
        shop_state: null,
        main_type: []
      }
    },
    coverChange (file, fileList) {
      console.log(file)
      this.cover = fileList
    },
    coverExceed () {
      this.$message.warning('最多选1张图片')
    },
    coverRemove (file) {
      const index = this.cover.findIndex((value) => {
        console.log(value)
        return file.uid === value.uid
      })
      if (index !== -1) {
        this.cover.splice(index, 1)
      }
      console.log(this.fileList, index)
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
            value: value.wiki_id,
            label: value.wiki_name
          }
        })
      }
      return data
    },
    async getShopType (queryString) {
      const options = await this.query(11, queryString)
      this.shop_type_options = options
    },
    async getShopStyle (queryString) {
      const options = await this.query(4, queryString)
      this.shop_style_options = options
    },
    add () {
      this.$refs.shop.validate(async (valid) => {
        if (valid) {
          if (this.loading) {
            this.$message.warning('请求中，请稍后')
            return false
          }
          let cover = null
          if (this.cover.length > 0) {
            // const cover_file = await compressImage(this.cover[0].url, 300, 300)
            cover = await uploadImage(this, this.cover[0].raw, 'static/shoplogo/')
            console.log('cover封面', cover)
          }
          if (cover === null) {
            this.$message.warning('店铺logo不能为空')
            return false
          }
          const {
            shop_name,
            shop_url,
            wb_name,
            wb_url,
            shop_describe,
            shop_type,
            shop_style,
            shop_country,
            shop_state,
            main_type
          } = this.form
          const params = {
            shop_name, shop_logo: cover, shop_url, wb_name, wb_url, shop_describe, shop_country, shop_state
          }
          if (shop_type.length > 0) {
            params.shop_type = shop_type.join()
          }
          if (shop_style.length > 0) {
            params.shop_style = shop_style.join()
          }
          if (main_type.length > 0) {
            params.main_type = main_type.join()
          }
          this.loading = true
          insertShop(params)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success('上传成功')
                this.init()
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          this.$message.warning('表单填写不完整')
          return false
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
