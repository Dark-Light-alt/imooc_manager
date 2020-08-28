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
        path: '/rights',
        name: 'Rights',
        component: () => import('../components/rights/Rights')
      },
      {
        path: '/direction',
        name: 'Direction',
        component: () => import('../components/direction/Direction')
      },
      {
        path: '/type',
        name: 'Type',
        component: () => import('../components/type/Type')
      },
      {
        path: '/customer',
        name: 'Customer',
        component: () => import('../components/customer/Customer')
      },
      {
        path: '/courseBuild',
        name: 'CourseBuild',
        component: () => import('../components/course/CourseBuild')
      },
      {
        path: '/courseChapterManage',
        name: 'CourseChapterManage',
        component: () => import('../components/chapter/CourseChapterManage')
      },
      {
        path: '/video',
        name: 'Video',
        component: () => import('../components/video/Video')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
