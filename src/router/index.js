import Vue from 'vue'
import VueRouter from 'vue-router'

//路由懒加载形式
// import Login from 'views/Login/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/Login/Login.vue')
// import Home from 'views/Home/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/Home/Home.vue')
// import Welcome from 'components/Welcome/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ 'components/Welcome/Welcome.vue')

// import Users from 'components/Users/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ 'components/Users/Users.vue')
// import Rights from 'components/Power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ 'components/Power/Rights.vue')
// import Roles from 'components/Power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ 'components/Power/Roles.vue')

// import Cate from 'components/Goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params_list_addgoods" */ 'components/Goods/Cate.vue')
// import Params from 'components/Goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params_list_addgoods" */ 'components/Goods/Params.vue')
// import List from 'components/Goods/List.vue'
const List = () => import(/* webpackChunkName: "cate_params_list_addgoods" */ 'components/Goods/List.vue')
// import AddGoods from 'components/Goods/AddGoods.vue'
const AddGoods = () => import(/* webpackChunkName: "cate_params_list_addgoods" */ 'components/Goods/AddGoods.vue')

// import Order from 'components/Order/Order.vue'
const Order = () => import(/* webpackChunkName: "order_report" */ 'components/Order/Order.vue')
// import Report from 'components/Report/Report.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ 'components/Report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/welcome',
    component: Home,
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
      },
      {
        path: '/users',
        name: 'Users',
        component: Users,
      },
      {
        path: '/rights',
        name: 'Rights',
        component: Rights,
      },
      {
        path: '/roles',
        name: 'Roles',
        component: Roles,
      },
      {
        path: '/categories',
        name: 'Cate',
        component: Cate,
      },
      {
        path: '/params',
        name: 'Params',
        component: Params,
      },
      {
        path: '/goods',
        name: 'List',
        component: List,
      },
      {
        path: '/goods/add',
        name: 'AddGoods',
        component: AddGoods,
      },
      {
        path: '/orders',
        name: 'Order',
        component: Order,
      },
      {
        path: '/reports',
        name: 'Report',
        component: Report,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫 ===> 来控制访问权限 ===> 如果用户没有登录，但是直接通过URL访问特定页面（比如后台管理页面），需要重新导航到登录页面
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 从哪个路径跳转过来
  //next 一个函数 表示放行 比如next('/login') 强制跳转到/login页面
  
  if (to.path == '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
