import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存放数据
  state: {
    userInfo: {
      headImg: '../../static/img/default_tx.png'
    },
    userLogin: false,
    socketId: ''
  },
  mutations: {
    saveUserInfo(state, obj) {
      state.userInfo.id = obj.id
      state.userInfo.username = obj.username
      state.userInfo.headImg = obj.headImg
    },
    saveUserLogin(state, isLogin) {
      state.userLogin = isLogin
    },
    saveSocketId(state, str) {
      state.socketId = str
    }
  }
})
