import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../components/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../components/Home')
  },
  {
    path: '/department',
    name: 'Department',
    component: () => import('../components/Department')
  }
]

const router = new VueRouter({
  routes
})

export default router
