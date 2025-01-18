/**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 custom
 */
export default {
  inserted (el, binding, vnode) {
    setTimeout(() => {
      const { value } = binding
      const all_permission = '*:*:*'
      const permissions = vnode.context.$store.getters && vnode.context.$store.getters.permissions
      console.log(vnode.context.$store.getters, vnode.context.$store.getters.permissions, permissions)
      if (value && value instanceof Array && value.length > 0) {
        const permissionFlag = value
        if (permissions === undefined || permissions === null) {
          el.parentNode && el.parentNode.removeChild(el)
        }
        const hasPermissions = permissions.some((permission) => {
          return all_permission === permission || permissionFlag.includes(permission)
        })

        if (!hasPermissions) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error('请设置操作权限标签值')
      }
    })
  }
}
