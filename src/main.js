import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 手动配置Element-ui
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.prototype.$http = axios

// Vue.use(ElementUI)
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', (oringinVal) => {
  const dt = new Date(oringinVal * 1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
