import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Welcome from './components/welcome/Welcome.vue'
import Users from './components/user/Users.vue'
import Rights from './components/power/Rights.vue'
import Roles from './components/roles/Roles.vue'
import Categories from './components/categories/Categories.vue'
import Params from './components/params/Params.vue'
import Goods from './components/goods/Goods.vue'
import Add from './components/goods/Add.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [{
      path: '/home/welcome',
      component: Welcome
    },
    {
      path: '/home/users',
      component: Users
    },
    {
      path: '/home/rights',
      component: Rights
    },
    {
      path: '/home/roles',
      component: Roles
    },
    {
      path: '/home/categories',
      component: Categories
    },
    {
      path: '/home/params',
      component: Params
    },
    {
      path: '/home/goods',
      component: Goods
    },
    {
      path: '/home/goods/add',
      component: Add
    }
    ]
  }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from代表从哪个路径跳转来
  // next是一个函数，表示放行
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
