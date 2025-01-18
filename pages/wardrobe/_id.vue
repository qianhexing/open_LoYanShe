<template>
  <div>
    <div class="head-seat"></div>
    <div v-if="!$store.state.app.isMobile" class="wardrobe-pc">
      <div class="wardrobe-wrap">
        <div class="wardrobe-left">
          <div class="wardrobe-left-scroll"
          @scroll="scrolle"
          ref="leftScrollWrap">
            <div ref="leftScroll">
              <div class="clothes-wrap" :style="{ height: max_height + 'px' }">
                <div class="clothes-list-wrap"
                v-for="(list, index) in list"
                :key="list.clothes_id"
                :style="{ transform: 'translate('+ (style_list[index] ? style_list[index].left + 'px' : '0px') + ',' + (style_list[index] ? style_list[index].top + 'px' : '0px') + ')' }">
                  <div :class="clothes_id === list.clothes_id ? 'clothes-list active' : 'clothes-list'"
                  @click="chooseClothes(list.clothes_id, list)">
                    <div class="clothes-cover">
                      <img :src="BASE_IMG + list.clothes_img" @load="waterfall()">
                    </div>
                    <div class="clothes-note">
                      <span v-html="list.clothes_note"></span>
                    </div>
                    <div class="qhx-tip">
                      <div class="qhx-date">
                        {{formatDate(list.date)}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <el-empty :image-size="100"
              v-show="total === 0 && !loading"
              description="暂无数据"
              style="padding-top: calc(50vh - 120px);"></el-empty>
              <LoadMore :page="page"
              :pageSize="pageSize"
              :loading="loading"
              :total="total"
              ref="loadMore"
              @loadMore="getWardrobeClothes()"></LoadMore>
            </div>
          </div>
        </div>
        <div class="wardrobe-right">
          <div class="wardrobe-right-scroll">
            <div v-if="info && !clothes_id">
              <div class="wardrobe-info-wrap">
                <div class="wardrobe-cover">
                  <img :src="BASE_IMG + (info.wardrobe_cover ? info.wardrobe_cover : '/static/plan_cover/default.jpg')">
                </div>
                <div class="wardrobe-info">
                  <div class="wardrobe-name">
                    <el-tag size="mini" type="danger" effect="dark">
                      {{info.is_private == 0 ? '公开' : '私有'}}
                    </el-tag>
                    {{info.wardrobe_name}}
                  </div>
                  <div class="wardrobe-desc">{{info.wardrobe_desc}}</div>
                  <el-switch
                  v-if="$store.state.user.info && $store.state.user.info.user_id === info.user_id"
                  v-model="info.is_private"
                  active-text="私有"
                  inactive-text="公开"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changePrivate"
                  :disabled="loading_private">
                  </el-switch>
                  <div class="qhx-tip">
                    <div class="qhx-date">
                      {{formatDate(info.create_date)}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="fun-list" v-if="$store.getters.getUserInfo && (info.user_id == $store.getters.getUserInfo.user_id)">
                <el-button type="primary" @click="showEditWardrobe()" size="medium">
                  <i class="el-icon-edit" style="margin-right: 5px;"></i>
                  修改衣柜
                </el-button>
                <el-button type="primary" size="medium" @click="showAddClothes()">
                  <i class="el-icon-plus" style="margin-right: 5px;"></i>
                  添加进衣柜
                </el-button>
              </div>
            </div>
            <div v-else>
              <div>
                <div class="clothes-info" v-if="clothes_info">
                  <div class="clothes-cover">
                    <img :src="BASE_IMG + clothes_info.clothes_img" alt="">
                  </div>
                  <div class="clothes-right">
                    <div class="clothes-name">{{clothes_info.clothes_note}}</div>
                    <div class="qhx-tip">
                      <div class="qhx-date">{{formatDate(clothes_info.date)}}</div>
                    </div>
                  </div>
                </div>
                <div v-if="info">
                  <div class="fun-list" v-if="$store.getters.getUserInfo && (info.user_id == $store.getters.getUserInfo.user_id)">
                    <el-button type="primary" @click="showAddNemory()" size="medium">
                      <i class="el-icon-plus" style="margin-right: 5px;"></i>
                      新增记忆
                    </el-button>
                  </div>
                </div>
                <wardrobeMemory ref="wardrobeMemory" :clothes_id="clothes_id" v-if="clothes_id"></wardrobeMemory>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="wardrobe-wrap-m">
        <div class="wardrobe-info-wrap" v-if="info && !clothes_id">
          <div class="wardrobe-cover">
            <img :src="BASE_IMG + (info.wardrobe_cover ? info.wardrobe_cover : '/static/plan_cover/default.jpg')">
          </div>
          <div class="wardrobe-info">
            <div class="wardrobe-name">
              <el-tag size="mini" type="danger" effect="dark">
                {{info.is_private == 0 ? '公开' : '私有'}}
              </el-tag>
              {{info.wardrobe_name}}
            </div>
            <div class="wardrobe-desc">{{info.wardrobe_desc}}</div>
            <el-switch
            v-if="$store.state.user.info && $store.state.user.info.user_id === info.user_id"
            v-model="info.is_private"
            active-text="私有"
            inactive-text="公开"
            :active-value="1"
            :inactive-value="0"
            @change="changePrivate"
            :disabled="loading_private">
            </el-switch>
            <div class="qhx-tip">
              <div class="qhx-date">
                {{formatDate(info.create_date)}}
              </div>
            </div>
          </div>
        </div>
        <div class="fun-list" v-if="$store.getters.getUserInfo && (info.user_id == $store.getters.getUserInfo.user_id)" style="display: flex; justify-content: center;">
          <el-button type="primary" @click="showEditWardrobe()" size="medium">
            <i class="el-icon-edit" style="margin-right: 5px;"></i>
            修改衣柜
          </el-button>
          <el-button type="primary" size="medium" @click="showAddClothes()">
            <i class="el-icon-plus" style="margin-right: 5px;"></i>
            添加进衣柜
          </el-button>
        </div>
        <div class="clothes-wrap" :style="{ height: max_height + 'px' }">
          <div class="clothes-list-wrap"
          v-for="(list, index) in list"
          :key="list.clothes_id"
          :style="{ transform: 'translate('+ (style_list[index] ? style_list[index].left + 'px' : '0px') + ',' + (style_list[index] ? style_list[index].top + 'px' : '0px') + ')' }">
            <div :class="clothes_id === list.clothes_id ? 'clothes-list active' : 'clothes-list'">
              <div class="clothes-cover">
                <img :src="BASE_IMG + list.clothes_img" @load="waterfall()">
              </div>
              <div class="clothes-note">
                <span v-html="list.clothes_note"></span>
              </div>
              <div class="qhx-tip">
                <div class="qhx-date">
                  {{formatDate(list.date)}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-empty :image-size="100"
        v-show="total === 0 && !loading"
        description="暂无数据"
        style="padding-top: calc(50vh - 300px);"></el-empty>
        <LoadMore :page="page"
        :pageSize="pageSize"
        :loading="loading"
        :total="total"
        ref="loadMore"
        @loadMore="getWardrobeClothes()"></LoadMore>
      </div>
    </div>
    <editWardrobe
    ref="editWardrobe"
    :wardrobe_id="id"
    :wardrobe_info="info"
    @success="changeWardrobe">
    </editWardrobe>
    <addMemory ref="addMemory"
    :clothes_id="clothes_id"
    @success="reladMemory">
    </addMemory>
    <addClothes ref="addClothes"
    :wardrobe_id="id"
    @success="reload"></addClothes>
  </div>
</template>

<script>
import { getWardrobeClothesById, updataWardrobe } from '../../api/wardrobe.js'
import { formatDate, _debounce } from '../../plugins/public.js'
import { waterfall } from '../../utils/waterfall.js'
import wardrobeMemory from '../../components/wardrobe/wardrobeMemory.vue'
import editWardrobe from '../../components/wardrobe/addWardrobe.vue'
import addClothes from '../../components/wardrobe/addClothes.vue'
import addMemory from '@/components/wardrobe/addMemory.vue'
export default {
  data () {
    return {
      list: [],
      info: null,
      style_list: [],
      max_height: 0,
      page: 0,
      pageSize: 10,
      total: 0,
      loading: false,
      loading_private: false,
      clothes_id: null,
      clothes_info: null
    }
  },
  components: {
    wardrobeMemory,
    editWardrobe,
    addClothes,
    addMemory
  },
  layout: 'UserLayout',
  mounted () {
    this.getWardrobeClothes()
  },
  methods: {
    formatDate,
    getWardrobeClothes (page, pageSize) {
      if (!page) {
        this.page += 1
      }
      this.loading = true
      getWardrobeClothesById({
        wardrobe_id: this.id,
        page: this.page,
        pageSize: this.pageSize
      })
        .then((res) => {
          if (res.code === 200) {
            if (page === 1) {
              this.list = res.data.rows
            } else {
              this.list.push(...res.data.rows)
            }
            this.total = res.data.count
            if (res.data.info) {
              const info = res.data.info
              this.info = info
            }
            this.$nextTick(() => {
              this.waterfall()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    reload () {
      const size = this.page * this.pageSize
      this.getWardrobeClothes(1, size)
    },
    reladMemory () {
      if (this.$refs.wardrobeMemory) {
        this.$refs.wardrobeMemory.reload()
      }
    },
    changeWardrobe (e) {
      this.info = e
    },
    waterfall () {
      const dom = document.getElementsByClassName('clothes-list-wrap')
      // const obj = waterfall(dom, 2)
      const water = waterfall(dom, 2)
      this.max_height = water.max_height
      this.style_list = water.style_list
    },
    scrolle: _debounce(function (e) {
      const scorll = this.$refs.leftScroll
      const scroll_wrap = this.$refs.leftScrollWrap
      const distance = scorll.offsetHeight - (scroll_wrap.scrollTop + scroll_wrap.offsetHeight)
      console.log(distance)
      if (!this.loading && distance < 70) {
        if (this.page < Math.ceil(this.total / this.pageSize)) {
          this.$refs.loadMore.loadMore()
        }
      }
    }, 300),
    chooseClothes (id, item) {
      if (this.clothes_id === id) {
        this.clothes_id = null
        this.clothes_info = null
      } else {
        this.clothes_id = id
        this.clothes_info = item
      }
    },
    // 改变是否私有
    changePrivate (e) {
      if (this.loading_private) {
        this.$message.warning('请求中请稍后')
        return false
      }
      this.loading_private = true
      updataWardrobe({
        is_private: e,
        wardrobe_id: this.id
      })
        .then((res) => {
          if (res.code === 200) {
            this.info.is_private = e
          } else {
            this.info.is_private = !e
          }
        })
        .finally(() => {
          this.loading_private = false
        })
    },
    showEditWardrobe () {
      this.$refs.editWardrobe.showModel()
    },
    showAddClothes () {
      this.$refs.addClothes.showModel()
    },
    showAddNemory () {
      this.$refs.addMemory.showModel()
    }
  },
  asyncData ({ params }) {
    return {
      id: parseInt(params.id)
    }
  }
}
</script>

<style scoped lang="less">
  .wardrobe-wrap{
    display: flex;
    min-width: 1000px;
    .wardrobe-left{
      overflow: hidden;
      width: 480px;
      height: calc(100vh - 70px);
      background: #f1f1f1;
      .wardrobe-left-scroll::-webkit-scrollbar {
        width: 4px;
      }
      .wardrobe-left-scroll::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.2);
      }
      .wardrobe-left-scroll::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0.1);
      }
      .wardrobe-left-scroll{
        overflow-y: scroll;
        height: 100%;
        .clothes-wrap{
          position: relative;
          .clothes-list-wrap{
            width: 50%;
            min-width: 230px;
            position: absolute;
            transition: 0.3s;
            .clothes-list{
              margin: 10px 5px;
              background: #FFFFFF;
              box-shadow: 1px 1px 10px #CCCCCC;
              border-radius: 5px;
              overflow: hidden;
              padding: 5px;
              cursor: pointer;
              transition: 0.3s;
              .clothes-cover{
                width: 100%;
                img{
                  width: 100%;
                }
              }
              .clothes-note{
                word-break: break-all;
              }
            }
            .active{
              background: #ffdac7;
            }
          }
        }
      }
    }
    .wardrobe-right{
      flex: 1;
      margin-left: 10px;
      height: calc(100vh - 70px);
      overflow: hidden;
      .wardrobe-right-scroll{
        height: 100%;
        overflow-y: scroll;
        .clothes-info{
          margin: 20px 5px 10px 5px;
          display: flex;
          .clothes-cover{
            width: 150px;
            img{
              width: 100%;
            }
          }
          .clothes-right{
            flex: 1;
            margin-left: 10px;
          }
        }
      }
      .wardrobe-info-wrap{
        display: flex;
        margin: 20px 5px 10px 5px;
        .wardrobe-cover{
          width: 150px;
          border-radius: 3px;
          overflow: hidden;
          img{
            width: 100%;
          }
        }
        .wardrobe-info{
          margin-left: 10px;
          flex: 1;
          .wardrobe-name{
            font-size: 18px;
            font-weight: bolder;
            margin: 10px 0;
          }
          .wardrobe-desc{
            min-height: 80px;
          }
        }
      }
    }
  }
  // 手机
  .wardrobe-wrap-m{
    position: relative;
    .wardrobe-info-wrap{
      display: flex;
      margin: 20px 5px 10px 5px;
      .wardrobe-cover{
        width: 120px;
        border-radius: 3px;
        overflow: hidden;
        img{
          width: 100%;
        }
      }
      .wardrobe-info{
        margin-left: 10px;
        flex: 1;
        .wardrobe-name{
          font-size: 18px;
          font-weight: bolder;
          margin: 10px 0;
        }
        .wardrobe-desc{
          min-height: 80px;
        }
      }
    }
    .clothes-wrap{
      position: relative;
      .clothes-list-wrap{
        width: 50%;
        position: absolute;
        transition: 0.3s;
        .clothes-list{
          margin: 10px 5px;
          background: #FFFFFF;
          box-shadow: 1px 1px 10px #CCCCCC;
          border-radius: 5px;
          overflow: hidden;
          padding: 5px;
          cursor: pointer;
          transition: 0.3s;
          .clothes-cover{
            width: 100%;
            img{
              width: 100%;
            }
          }
          .clothes-note{
            word-break: break-all;
          }
        }
        .active{
          background: #ffdac7;
        }
      }
    }
  }
</style>
