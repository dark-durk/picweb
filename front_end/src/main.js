import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import store from './store/store'
import './assets/css/common.css'
// 引入elementui
import ElementUI from 'element-ui'
// 样式需要单独引入
import 'element-ui/lib/theme-chalk/index.css'
// 挂载
Vue.use(ElementUI)
// 它会阻止你显示显示生产模式的消息
Vue.config.productionTip = false

axios.defaults.withCredentials = true // 跨域保存session有用
// axios.defaults.baseURL = 'http://192.168.31.41:8888'
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
Vue.prototype.$host = 'http://localhost:8888'
Vue.prototype.$global = global

// 请求拦截器
axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token')
    token && (config.headers.Authorization = 'Bearer ' + token)
    return config
  },
  error => Promise.error(error)
)
// 处理响应拦截
// axios.interceptors.response.use(
//   response => {
//     if (response.data.msg == 'token无效') {
//       Vue.$messageTips(response.data.msg, 'warning', 2000)
//       Vue.$router.push({
//         name: 'login'
//       })
//     }
//     return response.data
//   },
// )

/* eslint-disable no-new */
new Vue({
  el: '#app', // 挂载到index.html上,但随后正文部分会被app.vue取代
  router,
  store,
  components: { App },
  template: '<App/>'
})
