<template>
  <div>
    <div class="head-seat"></div>
    <div class="add-library">
      <el-form ref="library" :model="library" :rules="rules" label-width="80px">
        <div class="add-wrap">
          <el-form :model="form" :rules="rules" ref="form" label-width="90px">
            <el-form-item label="问题描述" prop="vote_title">
              <el-input v-model="form.vote_title"></el-input>
            </el-form-item>
            <el-form-item label="问题类型" prop="vote_type">
              <el-select v-model="form.vote_type" placeholder="请选择问题类型">
                <el-option v-for="item in voteType" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 选项 -->
          <div v-for="(item, index) in form.vote_options" :key="index" class="add-options">
            <el-input v-model="form.vote_options[index]" placeholder="请输入选项内容"></el-input>
            <i class="el-icon-delete-solid delete-options" @click="deleteOptions(index)"></i>
          </div>
          <div class="add-new-options" @click="addOptions()">
            <i class="el-icon-plus" style="margin-right: 5px;"></i>
            新增选项
          </div>
          <div style="margin: 10px;">
            <el-button type="primary" style="width: 100%;" @click="insertVote()">创建问题</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getShopOptionsByKeywords } from '@/api/shop.js'
import { getWikiOptions, getWikiOptionsByKeywords } from '@/api/wiki.js'
import { insertLibrary, updateLibrary, getLibraryById } from '@/api/library.js'
import compressImage from '@/utils/compressImage.js'
import uploadImage from '@/utils/uploadImage.js'
import { formatDate } from '@/plugins/public.js'

export default {
  layout: 'BaseLayout',
  data () {
    return {
      form: {
        vote_title: '',
        vote_type: 0,
        vote_describe: '',
        vote_options: ['', '']
      },
      voteType: [
        {
          value: 0,
          label: '单选'
        },
        {
          value: 1,
          label: '多选'
        }
      ],
      library_id: null, // 初始化的图鉴ID用于修改
      loading: false,
      shop_options: [],
      library_type_options: [],
      state_options: ['预约中', '现货在售', '完售展示', '上新图透'],
      season_options: ['春', '夏', '秋', '冬'],
      main_style_options: [],
      pattern_elements_options: [],
      design_elements_options: [],
      cloth_elements_options: [],
      color_options: ['生成色', '绀色', '若草色', '酒红', 'sax'],
      library_pattern_options: [],
      theme_options: [],
      fileList: [],
      cover: [],
      size_image: [],
      disabled: false,
      library: {
        name: '',
        shop_id: null,
        main_style: null,
        library_type: null,
        size: '',
        pattern_elements: null,
        design_elements: null,
        cloth_elements: null,
        state: null,
        start_time: null,
        secondary_cloth: null,
        sale_time: null,
        notes: '',
        season: null,
        library_price: null,
        color: null,
        link: null,
        parent_id: null,
        theme: null
      },
      rules: {
        name: [
          { required: true, message: '请输入图鉴名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        library_type: [
          { required: true, message: '请选择图鉴类型', trigger: 'blur' }
        ],
        shop_id: [
          { required: true, message: '请选择店铺', trigger: 'blur' }
        ],
        main_style: [
          { required: true, message: '请选择主要风格', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择售卖状态', trigger: 'blur' }
        ],
        start_time: [
          { required: true, message: '请选择预约时间', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    console.log()
    if (this.$route.query && this.$route.query.library_id) {
      this.library_id = parseInt(this.$route.query.library_id)
      this.getLibraryById()
    }
    this.getMainStyle()
  },
  methods: {
    getLibraryById () {
      const { library_id } = this
      if (!library_id) {
        return false
      }
      this.loading = true
      const params = {
        library_id
      }
      getLibraryById(params)
        .then((res) => {
          this.loading = false
          const { data } = res
          const { name, library_type, state, shop_id, shop, main_style, parent, library_price, library_pattern, detail_image, color, size, pattern_elements, design_elements, cloth_elements, secondary_cloth, notes, sale_time, season, link, cover, end_time, start_time, size_image } = data
          this.library.name = name
          this.library.library_type = library_type
          this.library.state = state
          this.library.shop_id = shop_id
          this.shop_options = [{ label: shop.shop_name, value: shop_id }]
          if (main_style && main_style !== '') {
            this.library.main_style = main_style.split(',').map((item) => { return parseInt(item) })
          }
          if (library_price) {
            this.library.library_price = library_price
          }
          if (library_pattern) {
            this.library.library_pattern = library_pattern.split(',')
          }
          if (state === '预约中') {
            this.library.start_time = [formatDate(start_time), formatDate(end_time)]
          }
          if (color && color !== '') {
            this.library.color = color.split(',')
          }
          if (color) {
            this.library.size = size
          }
          if (pattern_elements && pattern_elements !== '') {
            this.library.pattern_elements = pattern_elements.split(',')
          }
          if (design_elements && design_elements !== '') {
            this.library.design_elements = design_elements.split(',')
          }
          if (cloth_elements && cloth_elements !== '') {
            this.library.cloth_elements = cloth_elements.split(',')
          }
          if (secondary_cloth && secondary_cloth !== '') {
            this.library.secondary_cloth = secondary_cloth.split(',')
          }
          if (notes && notes !== '') {
            this.library.notes = notes
          }
          if (sale_time && sale_time !== '') {
            this.library.sale_time = sale_time
          }
          if (season && season !== '') {
            this.library.season = season.split(',')
          }
          if (link && link !== '') {
            this.library.link = link
          }
          this.cover = [{ url: this.BASE_IMG + cover }]
          if (size_image) {
            this.size_image = [{ url: this.BASE_IMG + size_image }]
          }
          if (detail_image && detail_image !== '') {
            this.fileList = detail_image.split(',').map((item) => {
              return {
                url: this.BASE_IMG + item
              }
            })
          }
          if (parent && parent !== '') {
            this.library.parent_id = parent
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('获取图鉴失败5秒后重试')
          setTimeout(() => {
            this.getLibraryById()
          }, 5000)
        })
    },
    chooseLibrary (item) {
      console.log('选择的图鉴', item)
      this.library.parent_id = item
    },
    showSelectLibrary () {
      this.$refs.chooseLibrary.showModel()
    },
    init () {
      this.fileList = []
      this.cover = []
      this.size_image = []
      this.library = {
        name: '',
        shop_id: null,
        main_style: null,
        library_type: null,
        size: '',
        pattern_elements: null,
        design_elements: null,
        cloth_elements: null,
        state: null,
        start_time: null,
        secondary_cloth: null,
        sale_time: null,
        notes: '',
        season: null,
        library_price: null,
        color: null,
        link: null,
        parent_id: null,
        theme: null
      }
    },
    updateLibrary () {
      updateLibrary()
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
    // 获取主要风格
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
    async getPatternElements (queryString) {
      if (queryString === '') {
        return false
      }
      const options = await this.query(3, queryString)
      this.pattern_elements_options = options
    },
    async getLibraryPattern (queryString) {
      if (queryString === '') {
        return false
      }
      const options = await this.query(1, queryString)
      this.library_pattern_options = options
    },
    async getTheme (queryString) {
      if (queryString === '') {
        return false
      }
      const options = await this.query(14, queryString)
      this.theme_options = options
    },
    async getLibraryType (queryString) {
      if (queryString === '') {
        return false
      }
      const options = await this.query(10, queryString)
      this.library_type_options = options
    },
    async getDesignElements (queryString) {
      if (queryString === '') {
        return false
      }
      const options = await this.query(2, queryString)
      this.design_elements_options = options
    },
    async getClothElements (queryString) {
      if (queryString === '') {
        return false
      }
      const options = await this.query(5, queryString)
      this.cloth_elements_options = options
    },
    handleChange (file, fileList) {
      console.log(file)
      this.fileList = fileList
    },
    handleExceed () {
      this.$message.warning('最多选18张图片')
    },
    handleRemove (file) {
      const index = this.fileList.findIndex((value) => {
        return file.uid === value.uid
      })
      if (index !== -1) {
        this.fileList.splice(index, 1)
      }
      console.log(this.fileList, index)
    },
    sizeChange (file, fileList) {
      console.log(file)
      this.size_image = fileList
    },
    coverChange (file, fileList) {
      console.log(file)
      this.cover = fileList
    },
    coverExceed () {
      this.$message.warning('最多选1张图片')
    },
    sizeRemove (file) {
      const index = this.size_image.findIndex((value) => {
        console.log(value)
        return file.uid === value.uid
      })
      if (index !== -1) {
        this.size_image.splice(index, 1)
      }
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
    add () {
      this.$refs.library.validate(async (valid) => {
        if (valid) {
          if (this.loading) {
            this.$message.warning('请求中，请稍后')
            return false
          }
          this.loading = true
          const {
            name,
            shop_id,
            main_style,
            library_type,
            size,
            color,
            pattern_elements,
            design_elements,
            cloth_elements,
            state,
            start_time,
            secondary_cloth,
            sale_time,
            notes,
            season,
            library_price,
            library_pattern,
            link,
            parent_id
          } = this.library
          let cover = null
          let square_cover = null
          if (this.cover.length > 0) {
            if (this.cover[0].raw) {
              const cover_file = await compressImage(this.cover[0].url, 300, 300)
              cover = await uploadImage(this, this.cover[0].raw, 'static/skirt_cover/' + shop_id + '_')
              square_cover = await uploadImage(this, cover_file, 'static/square_cover/' + shop_id + '_')
            } else {
              cover = this.cover[0].url.replace(this.BASE_IMG, '')
            }
          }

          let size_image = null
          if (this.size_image.length > 0) {
            if (this.size_image[0].raw) {
              const file = await compressImage(this.size_image[0].url, 1200)
              size_image = await uploadImage(this, file)
            } else {
              size_image = this.size_image[0].url.replace(this.BASE_IMG, '')
            }
          }

          const detail_image = []
          if (this.fileList.length > 0) {
            for (let i = 0; i < this.fileList.length; i++) {
              if (this.fileList[i].raw) {
                const file = await compressImage(this.fileList[i].url, 1200)
                const file_name = await uploadImage(this, file)
                detail_image.push(file_name)
              } else {
                detail_image.push(this.fileList[i].url.replace(this.BASE_IMG, ''))
              }
            }
          }
          const params = {
            name,
            shop_id,
            size,
            state,
            sale_time,
            library_price,
            library_type,
            link
          }
          if (cover) {
            params.cover = cover
          }
          if (size_image) {
            params.size_image = size_image
          }
          if (notes && notes !== '') {
            params.notes = notes
          } else {
            params.notes = null
          }
          if (parent_id) {
            params.parent_id = parent_id.library_id
          } else {
            params.parent_id = null
          }
          if (square_cover) {
            params.square_cover = square_cover
          }
          if (detail_image.length > 0) {
            params.detail_image = detail_image.join()
          } else {
            params.detail_image = null
          }
          if (cloth_elements.length > 0) {
            params.cloth_elements = cloth_elements.join()
          } else {
            params.cloth_elements = null
          }
          if (design_elements.length > 0) {
            params.design_elements = design_elements.join()
          } else {
            params.design_elements = null
          }
          if (color.length > 0) {
            params.color = color.join()
          } else {
            params.color = null
          }
          if (main_style.length > 0) {
            params.main_style = main_style.join()
          } else {
            params.main_style = null
          }
          if (pattern_elements.length > 0) {
            params.pattern_elements = pattern_elements.join()
          } else {
            params.pattern_elements = null
          }
          if (season.length > 0) {
            params.season = season.join()
          } else {
            params.season = null
          }
          if (secondary_cloth.length > 0) {
            params.secondary_cloth = secondary_cloth.join()
          } else {
            params.secondary_cloth = null
          }
          if (start_time) {
            params.start_time = start_time[0]
            params.end_time = start_time[1]
          } else {
            params.start_time = null
            params.end_time = null
          }
          if (library_pattern.length > 0) {
            params.library_pattern = library_pattern.join()
          } else {
            params.library_pattern = null
          }
          console.log(params, main_style, '最终参数')
          if (this.library_id !== null) {
            params.library_id = this.library_id
            updateLibrary(params)
              .then(() => {
                this.$message.success('修改成功')
                this.init()
                this.$router.go(-1)
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            insertLibrary(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success('上传成功')
                  this.init()
                }
              })
              .finally(() => {
                this.loading = false
              })
          }
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
.add-library {
  max-width: 1040px;
  padding: 20px;
  margin: 20px auto;
  background: #fff;
  box-shadow: 1px 1px 10px #ccc;
  border-radius: 4px;

  .add-select {
    width: 50%;
    min-width: 200px;
  }
}
.add-wrap{
  margin: 0 10px;
  .add-new-options{
    display: flex;
    align-items: center;
    margin: 10px 0;
    justify-content: center;
    cursor: pointer;
    .el-icon-plus{
      background: #409EFF;
      color: #fff;
      border-radius: 50%;
      padding: 5px;
    }
  }
  .add-options{
    display: flex;
    align-items: center;
    margin: 10px 0;
    .delete-options{
      margin-left: 10px;
      cursor: pointer;
      background: #409EFF;
      color: #fff;
      border-radius: 50%;
      padding: 5px;
    }
  }
}
</style>
