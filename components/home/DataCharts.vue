<template>
  <div class="home-data-wrap">
    <div ref="dataCharts" id="dataCharts" class="library-data"></div>
    <div class="home-ind">
      <div style="margin: 15px;"><a href="https://a.app.qq.com/o/simple.jsp?pkgname=uni.lolita" title="Lo研社APP" target="_blank"><el-button type="primary">Lo研社APP</el-button></a></div>
      <div>网站已运行 {{dateDifference('2019-04-09', new Date())}} 天</div>
      <div>共有 {{item.user_count}} 个用户</div>
      <div>已收录 {{item.shop_count}} 家Lolita店铺</div>
      <div>已收录 {{item.library_count}} 个图鉴</div>
      <div>感谢大家对Lo研社图书馆的贡献！</div>
    </div>
  </div>
</template>

<script>
import { dateDifference } from '@/plugins/public.js'
export default {
  data () {
    return {
      library_chart: null
    }
  },
  props: [
    'item'
  ],
  mounted () {
    this.chart()
  },
  methods: {
    dateDifference,
    chart () {
      const chartDom = document.getElementById('dataCharts')
      this.library_chart = this.$echarts.init(chartDom)
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '收录统计',
            type: 'pie',
            radius: ['40', '90'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.item.data.length > 0 ? this.item.data.map((v) => { return { value: v.count, name: v.library_type } }) : []
          }
        ]
      }
      // this.library_option = []
      this.library_chart.setOption(option)
    }
  }
}
</script>

<style scoped lang="less">
  .home-data-wrap{
    text-align: center;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    .library-data{
      width:300px;
      height:400px
    }
    .home-ind{
      flex: 1;
      margin: 10px;
      line-height: 26px;
      letter-spacing: 2px;
    }
  }
  @media screen and (max-width: 750px) {
    .home-data-wrap{
      .library-data{
        width: 100%;
        height:400px
      }
    }
  }
  @media screen and (min-width: 750px) {
    .home-data-wrap{
      display: flex;
    }
  }
</style>
