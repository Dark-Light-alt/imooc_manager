import axios from 'axios'
import nprogress from 'nprogress'

import 'nprogress/nprogress.css'
import router from '@/router'

nprogress.inc(0.2)
nprogress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false
})

axios.defaults.baseURL = 'http://localhost:8081/'

axios.defaults.withCredentials = true

// axios 的请求拦截器
axios.interceptors.request.use(
  config => {
    nprogress.start()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// axios 的响应拦截器
axios.interceptors.response.use(
  response => {
    nprogress.done()
    console.log(response)
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

// router 跳转之前
router.beforeEach((to, from, next) => {
  nprogress.start()
  next()
})

// router 跳转之后
router.afterEach((to, from) => {
  nprogress.done()
})

export default axios
