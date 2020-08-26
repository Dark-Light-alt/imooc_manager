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
      },
      {
        path: '/monograph',
        name: 'Monograph',
        component: () => import('../components/monograph/Monograph')
      },
      {
        path: '/buildMonograph',
        name: 'BuildMonograph',
        component: () => import('../components/monograph/BuildMonograph')
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
        path: '/rights',
        name: 'Rights',
        component: () => import('../components/rights/Rights')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
