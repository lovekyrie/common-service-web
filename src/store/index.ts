import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null,
  },
  getters: {
  },
  mutations: {
    setUserInfo(state, info) {
      state.userInfo = info
    },
  },
  actions: {
  },
  modules: {
  },
})
