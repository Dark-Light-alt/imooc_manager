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
      },
      {
        path: '/accountNumber',
        name: 'AccountNumber',
        component: () => import('../components/accountNumber/AccountNumber')
      }
      ,
      {
        path: '/position',
        name: 'Position',
        component: () => import('../components/position/Position')
      },
      {
        path: '/department',
        name: 'Department',
        component: () => import('../components/department/Department')
      },
      {
        path: '/customer',
        name: 'Customer',
        component: () => import('../components/customer/Customer')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
