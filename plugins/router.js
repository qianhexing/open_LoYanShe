export default ({ app, store, route, redirect, params, query }) => {
  // 前 置
  app.router.beforeEach((to, from, next) => {
    // 这里的写法就和 Vue 的写法一样了
    // console.log('触发前置守卫', to)
    next()
  })
  // 后 置
  app.router.afterEach((to, from) => {
    // 这里的写法就和 Vue 的写法一样了
    // console.log('触发后置守卫', to)
  })
}
