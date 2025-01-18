import Vue from 'vue'
import VueAMap from 'vue-amap'
import AMapLoader from '@amap/amap-jsapi-loader'
Vue.use(VueAMap)

// 初始化vue-amap
// if (!Vue.prototype.$isServer) {
//   VueAMap.initAMapApiLoader({
//     // 高德的key
//     key: '7b338377f1d1b4b6519bf8e913c5a482',
//     // 插件集合
//     plugin: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Marker', 'AMap.ToolBar', 'AMap.Circle', 'AMap.PolyLine'],
//     uiVersion: '1.0',
//     // 高德 sdk 版本，默认为 1.4.4
//     v: '1.4.8',
//   })
// }
export default async (context, inject) => {
  window._AMapSecurityConfig = {
    securityJsCode: '627969390a1096484f1f71d87cf1b42d'
  }
  const AMap = await AMapLoader.load({
    key: '7b338377f1d1b4b6519bf8e913c5a482',
    // version: '2.0', // 选择合适的版本号
    plugin: ['AMap.Geocoder', 'AMap.PlaceSearch'], // 需要的插件
    securityJsCode: '627969390a1096484f1f71d87cf1b42d'
  })
  inject('AMap', AMap)
}
