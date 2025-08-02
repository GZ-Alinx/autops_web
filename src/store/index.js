import { createPinia } from 'pinia'
import { defineStore } from 'pinia'

// 创建pinia实例
const pinia = createPinia()

export default pinia

// 用户store
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isLoggedIn() {
      return !!this.token
    }
  },
  actions: {
    // 登录
    login(token, userInfo) {
      this.token = token
      this.userInfo = userInfo
      localStorage.setItem('token', token)
    },
    // 登出
    logout() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})

// 应用store
export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true
    },
    theme: 'light'
  }),
  actions: {
    // 切换侧边栏
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
    },
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  }
})