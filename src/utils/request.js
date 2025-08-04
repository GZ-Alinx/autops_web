import axios from 'axios'
import { useUserStore } from '../store'
import router from '../router'
import MessageUtil from './message.js'
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    // 添加请求日志
    console.log('请求URL:', config.url)
    console.log('请求方法:', config.method)
    console.log('请求参数:', config.data || '无')
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 处理空响应体的情况（如204 No Content）
    if (response.status === 204) {
      return { code: 200, message: '操作成功' }
    }
    // 这里可以根据后端返回的状态码进行统一处理
    // 这里可以根据后端返回的状态码进行统一处理
    if (res.code !== 200) {
        console.error('接口错误:', res.message || '请求失败')
        return Promise.reject(new Error(res.message || '请求失败'))
    } else {
        // 添加响应日志
        console.log('响应数据:', res)
        return res
    }
  },
  error => {
    console.error('响应错误:', error)
    // 打印更详细的错误信息，特别是400错误
    if (error.response) {
          console.error('错误状态码:', error.response.status)
          console.error('错误响应数据:', JSON.stringify(error.response.data))
          if (error.response.status === 400) {
            console.error('400错误详情:', JSON.stringify(error.response.data))
          }
        }
    // 处理401认证失败
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    // 处理403权限错误
    else if (error.response && error.response.status === 403) {
      // 传递错误以便组件处理，不在此处弹出提示
      return Promise.reject(error)
    }
    // 特殊处理删除权限的404错误
    // 我们已经在响应拦截器中处理了404错误，这里不再重复处理
    // else if (error.response && error.response.status === 404 && error.config.method === 'delete') {
    //   console.log('删除操作可能已成功，但返回404错误')
    //   return { code: 200, message: '删除成功' }
    // }
    return Promise.reject(error)
  }
)

export default service