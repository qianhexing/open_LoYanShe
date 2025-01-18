<template>
  <div>
    <div class="head-seat"></div>
    <div class="timeline">
      <el-calendar v-model="value"></el-calendar>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="上新" name="0">上新</el-tab-pane>
      <el-tab-pane label="尾款" name="1">尾款</el-tab-pane>
    </el-tabs>
    <el-button @click="downimage()">下载全部</el-button>
    <div v-if="result">
      <div class="library-list" v-for="(list, index) in result" style="display: flex; border: 1px solid #faa2ae; background: #f2e7e9; width: 902px; height: 1220px;" :key="index">
        <div v-for="(list2, index2) in list" :key="index2">
          <div v-for="item in list2" :key="item.library_id" style="width: calc(300px - 14px);margin: 5px; border-radius: 10px; border: 2px solid #faa2ae; overflow: hidden; position: relative">
            <!-- <img :src="BASE_IMG + item.cover" alt="" style="width: calc(300px - 14px);"> -->
            <img :src="'https://lolitalibrary.com/ali/' + item.cover" alt="" :style="{width: item.width + 'px', transform: `translateX(-${(item.width - 290) / 2}px)`}">
            <h1 class="library-name">
              <div size="mini" style="background: #faa2ae; color: #000; position: absolute; top: 0; left: 0; border: none; padding: 0 15px; font-size: 14px; line-height: 25px;">
                <span>编号{{ item.library_id }} </span>
                <span v-for="(child, child_index) in item.child" :key="child_index">{{ child.library_type }} 🥕 {{ child.library_price }} | </span>
              </div>
              <!-- <el-tag size="mini" style="background: #faa2ae; color: #000; position: absolute; top: 0; left: 0; border: none; padding: 0 15px; height: 25px; line-height: 25px;">{{item.shop_country == 0 ? '国牌' : '日牌'}}</el-tag> -->
              <el-tag size="mini" v-show="item.library_type !== '系列'" style="background: #faa2ae; color: #000; position: absolute; top: 28px; left: 0; border: none; padding: 0 15px; height: 25px; line-height: 25px;">{{ item.library_type }}</el-tag>
              <nobr v-show="item.library_price" style="color: #faa2ae;">￥{{item.library_price}} {{item.shop_country == 0 ? '' : '日元'}}</nobr>
              {{item.name}}
            </h1>
            <div class="shop-info">
              <div class="shop-logo">
                <img :src="'https://lolitalibrary.com/ali/' + item.shop.shop_logo" :title="item.shop_name" />
              </div>
              <div class="shop-name">
                {{item.shop.shop_name}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="library-list-text" v-for="(list, index) in result" :key="index">
        <div v-for="(list2, index2) in list" :key="index2">
          <div v-for="item in list2" :key="item.library_id">
            <!-- <img :src="BASE_IMG + item.cover" alt="" style="width: calc(300px - 14px);"> -->
            <div>
              <div>编号: {{ item.library_id }}</div>
              <div>
                {{ (item.library_price && item.library_price !== 0 && item.library_price !== '') ? '🥕' + item.library_price : '' }} {{ item.name }}
              </div>
              <div v-if="item.child">
                <div v-for="(text, text_index) in item.child" :key="text_index">
                  {{text.library_type}} {{ (text.library_price && text.library_price !== 0 && text.library_price !== '') ? '🥕' + text.library_price : '' }}
                </div>
              </div>
              <div class="shop-name">
                店铺：{{item.shop.shop_name}}
              </div>
              <div>
                ----------
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { setLoginType, loginIn } from '../../api/user.js'
import html2canvas from 'html2canvas'
import { getLibraryList } from '@/api/library'
import { getImageInfo } from '@/api/file'
export default {
  data () {
    return {
      activeName: '0',
      value: new Date(),
      checked: true,
      page: 0,
      pageSize: 400,
      loading: false,
      total: 0,
      // list: [],
      result: null
    }
  },

  layout: 'BaseLayout',
  watch: {
    value () {
      if (this.loading) {
        this.$message.warning('加载中请稍后重试')
      } else {
        this.page = 0
        this.list = []
        // this.getLibraryList()
      }
    }
  },
  mounted () {
    // this.getLibraryList()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event, this.activeName)
      this.page = 0
      this.list = []
      this.getLibraryList()
    },
    downimage () {
      const dom = document.getElementsByClassName('library-list')
      Object.keys(dom).forEach((keyName, index) => { this.downloadDomAsImage(dom[keyName], index + '.jpg') })
      console.log(dom, '列表')
    },
    /**
     * 将指定的 DOM 元素转换为图片并下载
     * @param {HTMLElement} element - 需要转换的 DOM 元素
     * @param {String} fileName - 下载图片的文件名
     */
    downloadDomAsImage (element, fileName = 'download.png') {
      // 使用 html2canvas 渲染 DOM 为 Canvas
      html2canvas(element, {
        scale: 2
        // useCORS: true, // 启用 CORS 支持
        // allowTaint: false // 防止污染 Canvas
      }) // scale 参数增加分辨率
        .then((canvas) => {
          // 将 Canvas 转换为图片数据 URL
          const imageDataUrl = canvas.toDataURL('image/png')
          // 创建一个临时的 <a> 标签用于下载
          const link = document.createElement('a')
          link.href = imageDataUrl
          link.download = fileName // 设置下载文件名
          // 触发下载
          link.click()
        })
        .catch((error) => {
          console.error('图片生成失败:', error)
        })
    },
    changeChecked () {
      this.page = 0
      this.list = []
      this.getLibraryList()
    },
    /**
     * 将图片分配到多个容器中，每个大容器的高度受限于 containerHeight
     * @param {Array} list - 包含高度的元素数组 [{ width: 600, height: 500 }, ...]
     * @param {Number} columnCount - 每个大容器的列数
     * @param {Number} containerHeight - 每个大容器的最大高度
     * @returns {Array} - 大容器数组，每个大容器包含多列元素
     */
    arrangeImagesInContainers (list, columnCount, containerHeight) {
      const containers = [] // 存储所有大容器
      let index = 1
      let currentContainer = Array.from({ length: columnCount }, () => []) // 当前大容器的列
      let columnHeights = new Array(columnCount).fill(0) // 每列当前高度
      const unplacedItems = [...list] // 未放置的元素列表

      while (unplacedItems.length > 0) {
        let itemPlaced = false

        for (let i = 0; i < unplacedItems.length; i++) {
          const item = unplacedItems[i]
          // 找到当前高度最小的列
          const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
          // 检查当前元素是否可以放入该列
          if (columnHeights[minColumnIndex] + item.height <= containerHeight) {
            // 放入当前列
            currentContainer[minColumnIndex].push({ ...item, i: index })
            index += 1
            columnHeights[minColumnIndex] += item.height
            // 从未放置元素中移除
            unplacedItems.splice(i, 1)
            itemPlaced = true
            break // 重新开始检查未放置元素
          }
        }

        // 如果没有元素能放入当前容器，生成新的大容器
        if (!itemPlaced) {
          containers.push(currentContainer) // 保存当前容器
          // 初始化新的容器
          currentContainer = Array.from({ length: columnCount }, () => [])
          columnHeights = new Array(columnCount).fill(0)
        }
      }

      // 添加最后一个大容器（如果非空）
      if (currentContainer.some(column => column.length > 0)) {
        containers.push(currentContainer)
      }

      return containers
    },
    adjustContainersToFillHeight (containers, containerHeight) {
      return containers.map((container) => {
        return container.map((column) => {
          // 计算当前列的总高度
          const columnTotalHeight = column.reduce((sum, item) => sum + item.height, 0)
          // 计算缩放比例
          const scale = columnTotalHeight > 0 ? (containerHeight - column.length * 72) / (columnTotalHeight - column.length * 72) : 1
          // 调整当前列内的每个元素的高度和宽度
          return column.map(item => ({
            ...item,
            width: column.length > 1 ? (item.width) * scale : (item.width) * 1,
            scale: column.length > 1 ? scale : 1
          }))
        })
      })
    },
    /**
     * 将图片分配到多个容器中，每个大容器的高度受限于 containerHeight
     * @param {Array} list - 包含高度的元素数组 [{ width: 600, height: 500 }, { width: 600, height: 300 }, ...]
     * @param {Number} columnCount - 每个大容器的列数
     * @param {Number} containerHeight - 大容器的总高度
     * @returns {Array} - 大容器数组，每个大容器包含多列元素
     */
    arrangeImagesInContainers1 (list, columnCount, containerHeight) {
      const containers = [] // 存储所有大容器
      let currentContainer = Array.from({ length: columnCount }, () => []) // 当前大容器的列
      let columnHeights = new Array(columnCount).fill(0) // 每列当前高度
      list.forEach((item) => {
        // 尝试将元素分配到高度最小的列
        let minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

        // 如果该列加入当前元素后会超过 containerHeight
        if (columnHeights[minColumnIndex] + item.height > containerHeight) {
          // 保存当前大容器
          containers.push(currentContainer)

          // 开始新的大容器
          currentContainer = Array.from({ length: columnCount }, () => [])
          columnHeights = new Array(columnCount).fill(0)

          // 重新设置最小列索引
          minColumnIndex = 0
        }

        // 将元素加入当前最小高度的列
        currentContainer[minColumnIndex].push(item)
        columnHeights[minColumnIndex] += item.height
      })
      // 添加最后一个大容器（如果非空）
      if (currentContainer.some(column => column.length > 0)) {
        containers.push(currentContainer)
      }

      return containers
    },
    getLibraryList (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      const params = {
        page: page || this.page,
        pageSize: pageSize || this.pageSize,
        filter_list: [
          {
            value: this.value,
            op: 'and',
            field: 'appointment_time'
          }
        ],
        mode: 1
      }
      if (this.activeName === '0') {
        params.filter_list = [
          {
            value: this.value,
            op: 'and',
            field: 'appointment_time'
          }
        ]
      } else {
        params.filter_list = [
          {
            value: this.value,
            op: 'and',
            field: 'arrears_time'
          }
        ]
      }
      if (this.checked) {
        params.filter_list.push({
          field: 'parent_id',
          op: 'and',
          value: 0
        })
      }
      getLibraryList(params)
        .then(async (res) => {
          if (res.code === 200) {
            const data = res.data
            if (data.rows.length > 0) {
              const rows = []
              for (let i = 0; i < data.rows.length; i++) {
                const item = data.rows[i]
                try {
                  const image_info = await getImageInfo({
                    url: item.cover
                  })
                  item.width = 300 - 14
                  item.height = (item.width * image_info.data.ImageHeight.value / image_info.data.ImageWidth.value) + 67
                  console.log(item.height, '高度')
                } catch (error) {
                }
                rows.push(item)
              }
              const result = this.adjustContainersToFillHeight(this.arrangeImagesInContainers(rows, 3, 1200), 1200)
              this.result = result
              console.log(result, '排序结果')
              // if (page === 1) {
              //   this.list = rows
              // } else {
              //   this.list.push(...rows)
              // }
            }
            this.total = data.count
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less">
.timeline{
  max-width: 800px;
  margin: 0 auto;
  margin-top: 10px;
}
.library-wrap{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 10px auto;
  padding: 10px 0;
  // background: #fff;
  border-radius: 5px;
  justify-content: center;
}
.library-name{
  font-size: 16px;
  font-weight: bolder;
  color: #000000;
  margin: 0px 0;
  font-size: 18px;
  transition: 0.3s;
  text-align: center;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-top: 0px;
}
.shop-info{
  display: flex;
  align-items: center;
  margin: 0px 5px 5px 5px;
  color: #000000;
  transition: 0.3s;
  .shop-logo{
    width: 30px;
    height: 30px;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: 1px 8px 8px #ccc;
    img{
      width: 100%;
    }
  }
  .shop-name{
    flex: 1;
    margin-left: 10px;
    font-weight: bold;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
.library-list-wrap{
    transition: 0.3s;
    .library-list{
      padding: 20px 10px;
      box-shadow: 2px 2px 10px #CCCCCC;
      background: #fff;
      border-radius: 10px;
      .library-cover{
        cursor: pointer;
        overflow: hidden;
        margin: 0px 10px;
        img{
          width: 100%;
        }
      }
      .library-info{
        flex: 1;
        margin: 0 10px;
        .library-name:hover{
          color: #ffaa7f;
        }
        .library-money{
          color: #ffaa7f;
          font-size: 16px;
          font-weight: bolder;
        }
        // 信息列表
        .info-list{
          display: flex;
          margin: 8px 0;
        }
      }
    }
    .library-data{
      display: flex;
      justify-content: center;
      margin-top: 10px;
      color: #999999;
      .data-list{
        text-align: center;
        width: 25%;
        .icon{
          font-size: 25px;
        }
        .number{
          margin-top: 4px;
          font-size: 12px;
        }
        .collect-icon{
          transition: 0.3;
          cursor: pointer;
        }
        .collect-icon:hover{
          color: #FFAA7F;
        }
        .collect-active{
          color: #FFAA7F;
        }
      }
    }
  }
@media screen and (min-width: 750px) {
  .timeline{
    .el-calendar-day{
      height: 70px;
    }
  }
  .library-head{
    display: flex;
  }
  .library-list-wrap{
    width: 33%;
    min-width: 400px;
    .library-list{
      margin: 10px 8px;
      .library-cover{
        width: 150px;
        height: 150px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .timeline{
    .el-calendar-day{
      height: 50px;
    }
  }
  .library-head{
    text-align: center;
  }
  .library-list-wrap{
    width: 100%;
    .library-list{
      margin: 10px 0;
      .library-cover{
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
