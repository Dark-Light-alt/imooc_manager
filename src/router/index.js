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
        path: '/allMonograph',
        name: 'AllMonograph',
        component: () => import('../components/monograph/AllMonograph')
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
        path: '/videoManage',
        name: 'VideoManage',
        component: () => import('../components/video/VideoManage')
      },
      {
        path: '/previewCourse',
        name: 'PreviewCourse',
        component: () => import('../components/course/PreviewCourse')
      },
      {
        path: '/myMonograph',
        name: 'MyMonograph',
        component: () => import('../components/monograph/MyMonograph')
      },
      {
        path: '/videoView',
        name: 'VideoView',
        component: () => import('../components/video/VideoView')
      },
      {
        path: '/courseManage',
        name: 'CourseManage',
        component: () => import('../components/course/CourseManage')
      },
      {
        path: '/datasManage',
        name: 'DatasManage',
        component: () => import('../components/datas/DatasManage')
      },
      {
        path: '/carousel',
        name: 'Carousel',
        component: () => import('../components/carousel/Carousel')
      }
      ,
      {
        path: '/monographChapters',
        name: 'MonographChapters',
        component: () => import('../components/monograph/MonographChapters')
      },
      {
        path: '/monogrphChapterManage',
        name: 'MonogrphChapterManage',
        component: () => import('../components/chapter/MonogrphChapterManage')
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
        path: '/article',
        name: 'Article',
        component: () => import('../components/article/Article')
      },
      {
        path: '/writeArticle',
        name: 'WriteArticle',
        component: () => import('../components/article/WriteArticle')
      },
      {
        path: '/updateArticle',
        name: 'UpdateArticle',
        component: () => import('../components/article/UpdateArticle')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
