<template>
  <div>
    <!-- 新增图鉴 -->
    <div class="head-seat"></div>
    <div class="add-library">
      <el-form ref="library" :model="library" :rules="rules" label-width="80px">
        <el-form-item label="图鉴名字" prop="name">
          <el-input v-model="library.name" placeholder="请输入图鉴名"></el-input>
        </el-form-item>
        <el-form-item label="图鉴类型" prop="state">
          <el-select
              v-model="library.library_type"
              filterable
              remote
              reserve-keyword
              placeholder="请选择图鉴类型"
              :remote-method="getLibraryType"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in library_type_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="上级图鉴" prop="parent_id" v-if="library.library_type!=='系列'">
          <el-tag v-if="library.parent_id" closable @close="library.parent_id = null">{{ library.parent_id.name }}</el-tag>
          <el-button type="primary" size="mini" @click="showSelectLibrary()">选择图鉴</el-button>
        </el-form-item>
        <el-form-item label="售卖状态" prop="state">
          <el-select
            class="add-select"
            v-model="library.state"
            placeholder="请选择售卖状态">
              <el-option
                v-for="item in state_options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="预约时间" prop="start_time" v-if="library.state == '预约中'">
          <el-date-picker
            v-model="library.start_time"
            type="datetimerange"
            range-separator="至"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图鉴封面">
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
        <el-form-item label="所属店铺" prop="shop_id">
          <el-select
              v-model="library.shop_id"
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
        <el-form-item label="主要风格" prop="main_style">
            <el-select
              multiple
              v-model="library.main_style"
              placeholder="请选择主要风格"
              class="add-select">
                <el-option
                  v-for="item in main_style_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input style="width: 150px;"
            type="number"
            v-model="library.library_price"
            placeholder="请输入价格">
          </el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-select
              v-model="library.theme"
              filterable
              remote
              multiple
              reserve-keyword
              placeholder="请输入主题"
              :remote-method="getTheme"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in theme_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="版型/部位">
          <el-select
              v-model="library.library_pattern"
              filterable
              remote
              multiple
              reserve-keyword
              placeholder="请输入版型/部位"
              :remote-method="getLibraryPattern"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in library_pattern_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <el-select
              v-model="library.color"
              multiple
              filterable
              default-first-option
              placeholder="请选择颜色"
              class="add-select"
            >
              <el-option
                v-for="(item, index) in color_options"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="尺码表">
            <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="size_image"
            :on-change="sizeChange"
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
                    @click="sizeRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="尺码">
            <el-input v-model="library.size" placeholder="请输入尺码"></el-input>
        </el-form-item>
        <el-form-item label="柄图元素">
          <el-select
              v-model="library.pattern_elements"
              filterable
              remote
              multiple
              allow-create
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getPatternElements"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in pattern_elements_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设计元素">
          <el-select
              v-model="library.design_elements"
              filterable
              remote
              multiple
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getDesignElements"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in design_elements_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="面料成分">
          <el-tag v-for="(tag, index) in library.fabric_composition" closable @close="removeFabricComposition(index)" :key="index">{{ tag.value + '%' +tag.name }}</el-tag>
          <el-button type="primary" size="mini" @click="showComposition = true">选择成分</el-button>
        </el-form-item>
        <el-form-item label="布料/材质">
          <el-select
              v-model="library.cloth_elements"
              filterable
              remote
              multiple
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getClothElements"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in cloth_elements_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="辅料">
          <el-select
              v-model="library.secondary_cloth"
              filterable
              remote
              multiple
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getClothElements"
              :loading="loading"
              class="add-select">
              <el-option
                v-for="item in cloth_elements_options"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="笔记">
          <el-input v-model="library.notes" placeholder="笔记就是设计灵感,小故事什么的,想写什么写什么" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="贩售年份">
          <el-date-picker
            v-model="library.sale_time"
            type="year"
            placeholder="选择贩售年份"
            :value-format="'yyyy-MM-dd'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="适宜季节">
            <el-select
                v-model="library.season"
                multiple
                filterable
                default-first-option
                placeholder="请选择季节"
                class="add-select"
              >
                <el-option
                  v-for="item in season_options"
                  :key="item.value"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="淘宝连接">
          <el-input v-model="library.link" placeholder="直连淘宝电脑版的连接"></el-input>
        </el-form-item>
        <el-form-item label="详情图片">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="handleChange"
              :multiple="true"
              :limit="18"
              :on-exceed="handleExceed">
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
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
            </el-upload>
        </el-form-item>
        <el-form-item label="质检报告" v-if="library.library_type === '系列'">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="qualityList"
              :on-change="handleQualityChange"
              :multiple="true"
              :limit="18"
              :on-exceed="handleExceed">
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
                      @click="handleQualityRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
            </el-upload>
        </el-form-item>
        <chooseLibrary ref="chooseLibrary" @choose="chooseLibrary" :filter_list="[{field: 'library_type',value: '系列',op: 'and' }]"></chooseLibrary>
        <el-dialog title="添加成分" :close-on-click-modal="false" :visible.sync="showComposition" :width="'1040px'" >
          <el-form :model="fabric_composition">
            <el-form-item label="面料成分">
              <el-select
                  v-model="fabric_composition.name"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择图鉴类型"
                  :remote-method="getFabricComposition"
                  :loading="loading"
                  class="add-select">
                  <el-option
                    v-for="item in fabric_composition_options"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="面料占比">
              <div>
                <div style="display: flex; align-items: center; justify-content: center; width: 80%;"><el-slider style="flex: 1;" v-model="fabric_composition.value" :max="100"></el-slider></div>
                <div>{{ fabric_composition.value }}</div>
                <div>不知道含量的填0</div>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="showComposition = false">取 消</el-button>
            <el-button type="primary" @click="addFabricComposition()">确 定</el-button>
          </div>
        </el-dialog>
        <el-button @click="add()" type="primary" v-if="!loading">{{ library_id ? '修改图鉴' : '上传图鉴' }}</el-button>
        <el-button type="danger" v-else>请求中</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getShopOptionsByKeywords } from '@/api/shop.js'
import { getWikiOptions, getWikiOptionsByKeywords } from '@/api/wiki.js'
import { insertLibrary, updateLibrary, getLibraryById } from '@/api/library.js'
import compressImage from '@/utils/compressImage.js'
import chooseLibrary from '~/components/library/chooseLibrary.vue'
import uploadImage from '@/utils/uploadImage.js'
import { formatDate } from '@/plugins/public.js'

export default {
  layout: 'BaseLayout',
  data () {
    return {
      fabric_composition: {
        name: '',
        value: 0
      }, // 成分表格
      showComposition: false, // 显示选择布料
      library_id: null, // 初始化的图鉴ID用于修改
      loading: false,
      shop_options: [],
      library_type_options: [],
      fabric_composition_options: [],
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
      qualityList: [],
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
        theme: null,
        fabric_composition: [] // 成分
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
    if (this.$route.query && this.$route.query.library_id) {
      this.library_id = parseInt(this.$route.query.library_id)
      this.getLibraryById()
    }

    this.getLibraryType()
    this.getMainStyle()
  },
  components: {
    chooseLibrary
  },
  methods: {
    removeFabricComposition (index) {
      this.library.fabric_composition.splice(index, 1)
    },
    addFabricComposition () {
      const { name, value } = this.fabric_composition
      const index = this.library.fabric_composition.findIndex((item) => {
        return item.name === name
      })
      if (index === -1) {
        this.library.fabric_composition.push({
          name, value
        })
      }
      this.fabric_composition.name = ''
      this.fabric_composition.value = ''
      this.showComposition = false
    },
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
          const { name, library_type, state, shop_id, shop, main_style, parent, library_price, library_pattern, detail_image, color, size, pattern_elements, design_elements, cloth_elements, secondary_cloth, notes, sale_time, season, link, cover, end_time, start_time, size_image, fabric_composition, quality_test } = data
          this.library.name = name
          this.library.library_type = library_type
          this.library.state = state
          this.library.shop_id = shop_id
          this.shop_options = [{ label: shop.shop_name, value: shop_id }]
          if (main_style && main_style !== '') {
            this.library.main_style = main_style.split(',').map((item) => { return parseInt(item) })
          }
          if (fabric_composition && fabric_composition !== '') {
            this.library.fabric_composition = fabric_composition.split(',').map((item) => {
              const tem = item.split('%')
              if (tem.length === 1) {
                return { value: 0, name: tem[0] }
              } else {
                return { value: tem[0], name: tem[1] }
              }
            })
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
          if (quality_test && quality_test !== '') {
            this.qualityList = quality_test.split(',').map((item) => {
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
      this.qualityList = []
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
        theme: null,
        model_image: null,
        fabric_composition: []
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
    async getFabricComposition (queryString) {
      const options = await this.query(15, queryString)
      this.fabric_composition_options = options
    },
    async getLibraryType (queryString) {
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
    handleQualityChange (file, fileList) {
      this.qualityList = fileList
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
    handleQualityRemove (file) {
      const index = this.qualityList.findIndex((value) => {
        return file.uid === value.uid
      })
      if (index !== -1) {
        this.qualityList.splice(index, 1)
      }
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
            parent_id,
            fabric_composition
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

          const quality_test = []
          if (this.qualityList.length > 0) {
            for (let i = 0; i < this.qualityList.length; i++) {
              if (this.qualityList[i].raw) {
                const file = await compressImage(this.qualityList[i].url, 1200)
                const file_name = await uploadImage(this, file)
                quality_test.push(file_name)
              } else {
                quality_test.push(this.qualityList[i].url.replace(this.BASE_IMG, ''))
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
          if (quality_test.length > 0) {
            params.quality_test = quality_test.join()
          } else {
            params.quality_test = null
          }
          if (cloth_elements && cloth_elements.length > 0) {
            params.cloth_elements = cloth_elements.join()
          } else {
            params.cloth_elements = null
          }
          if (design_elements && design_elements.length > 0) {
            params.design_elements = design_elements.join()
          } else {
            params.design_elements = null
          }
          console.log('成分', fabric_composition)
          if (fabric_composition && fabric_composition.length > 0) {
            params.fabric_composition = fabric_composition.map((item) => {
              if (item.value === 0) {
                return item.name
              } else {
                return item.value + '%' + item.name
              }
            }).join()
          } else {
            params.fabric_composition = null
          }
          if (color && color.length > 0) {
            params.color = color.join()
          } else {
            params.color = null
          }
          if (main_style && main_style.length > 0) {
            params.main_style = main_style.join()
          } else {
            params.main_style = null
          }
          if (pattern_elements && pattern_elements.length > 0) {
            params.pattern_elements = pattern_elements.join()
          } else {
            params.pattern_elements = null
          }
          if (season && season.length > 0) {
            params.season = season.join()
          } else {
            params.season = null
          }
          if (secondary_cloth && secondary_cloth.length > 0) {
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
          if (library_pattern && library_pattern.length > 0) {
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
