<template>
  <el-header class="header">
    <router-link to="/dashboard" class="logo">{{ title }}</router-link>
    <div class="user-info">
      <span>{{ userInfo?.username }}</span>
      <el-button type="text" @click="handleLogout">退出登录</el-button>
    </div>
  </el-header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import MessageUtil from '../utils/message.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'

const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  title: {
    type: String,
    default: '权限管理平台开发底座'
  },
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['logout'])

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  MessageUtil.success('退出登录成功')
  emit('logout')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>