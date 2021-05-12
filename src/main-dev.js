import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'

//导入全局样式表
import 'assets/css/global.css'

//导入进度条d的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//配置axios 
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//由于请求接口文档其他接口时 需要授权（登录后才能查看）的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌，所以需要用axios拦截到数据中的token值
axios.interceptors.request.use(config => {
  //在request拦截器中展示进度条
  NProgress.start();
  //获取拦截到的token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  //response拦截器中结束进度条
  NProgress.done();
  return config
})


import './plugins/element.js'
//导入树形表格组件
import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器以及对应样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$http = axios

Vue.config.productionTip = false
//全局注册树形表格组件
Vue.component('tree-table', TreeTable)
//注册全局富文本编辑器组件
Vue.use(VueQuillEditor)

//过滤器
Vue.filter('dateFormat', function (orginVal) {
  const dt = new Date(orginVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const s = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')