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
    component: () => import('../components/Home'),
    children: [
      {
        path: '/employeeInfo',
        name: 'EmployeeInfo',
        component: () => import('../components/employeeInfo/EmployeeInfo')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
