const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: null,
    permissions: []
  },
  mutations: {
    setToken (state, payload) {
      state.token = payload
      localStorage.setItem('javaToken', JSON.stringify(payload))
    },
    setPermissions (state, payload) {
      state.permissions = payload
      localStorage.setItem('permissions', JSON.stringify(payload))
    },
    setUserInfo (state, payload) {
      state.info = payload
      localStorage.setItem('userInfo', JSON.stringify(payload))
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name
    }) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  getters: {
    getToken: (state) => {
      return state.token
    },
    getUserInfo: (state) => {
      return state.info
    },
    permissions: (state) => {
      return state.permissions
    }
  },
  actions: {
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('setToken', null)
        commit('setUserInfo', null)
        commit('setPermissions', [])
        localStorage.removeItem('javaToken')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('permissions')
        resolve()
      })
    }
  }
}

export default user
