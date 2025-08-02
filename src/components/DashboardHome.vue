<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-icon class="header-icon"><users /></el-icon>
        <span>用户管理</span>
      </div>
    </template>
    <div class="dashboard-content">
      <div class="statistics">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-label-with-icon">
            <el-icon class="stat-icon"><user /></el-icon>
            <p class="stat-label">总用户数</p>
          </div>
                <p class="stat-value">{{ totalUsers }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-label-with-icon">
            <el-icon class="stat-icon"><user-plus /></el-icon>
            <p class="stat-label">今日新增</p>
          </div>
                <p class="stat-value">{{ todayNewUsers }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-label-with-icon">
            <el-icon class="stat-icon"><key /></el-icon>
            <p class="stat-label">登录用户数</p>
          </div>
                <p class="stat-value">{{ loginUsers }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-label-with-icon">
            <el-icon class="stat-icon"><monitor /></el-icon>
            <p class="stat-label">系统状态</p>
          </div>
                <p :class="['stat-value', systemStatus === 'online' ? 'online' : 'offline']">{{ systemStatusText }}</p>
                <el-button size="small" @click="testSystemHealth" style="margin-top: 10px;">测试连接</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="recent-activities">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
            </div>
          </template>
          <el-table :data="recentActivities">
            <el-table-column prop="time" label="时间" width="180"></el-table-column>
            <el-table-column prop="action" label="操作"></el-table-column>
            <el-table-column prop="user" label="用户"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <span :class="scope.row.status === 'success' ? 'status-success' : 'status-fail'">{{ scope.row.status }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// import { Users, User, UserPlus, Key, Monitor } from '@element-plus/icons-vue'
import request from '../utils/request'
import { ElMessage } from 'element-plus'

// 统计数据
const totalUsers = ref(0)
const todayNewUsers = ref(0)
const loginUsers = ref(0)
const recentActivities = ref([])
const systemStatus = ref('online')
const systemStatusText = ref('正常运行')

// 获取统计数据
const getStatistics = async () => {
  try {
    const res = await request.get('/users/')
    
    // 总用户数
    totalUsers.value = res.data.total
    
    // 今日新增用户数 - 筛选今天创建的用户
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    todayNewUsers.value = res.data.list.filter(user => {
      const createdAt = new Date(user.created_at)
      return createdAt >= today
    }).length
    
    // 登录用户数 - 这里假设所有状态为1的用户都是登录用户
    // 实际应用中可能需要从其他接口获取
    loginUsers.value = res.data.list.filter(user => user.status === 1).length
    
    // 最近活动 - 简单模拟，实际应用中可能需要从其他接口获取
    recentActivities.value = [
      {
        time: '刚刚',
        action: '登录系统',
        user: res.data.list[0].username,
        status: 'success'
      },
      {
        time: '5分钟前',
        action: '查看用户列表',
        user: res.data.list[0].username,
        status: 'success'
      }
    ]
  } catch (error) {
    if (error.response && error.response.status === 403) {
      ElMessage.warning('没有操作权限')
      return Promise.reject(error)
    }else {
      ElMessage.error('获取统计数据失败')
      console.error('获取统计数据失败:', error)
    }
  }
}

// 测试系统健康状态连接
const testSystemHealth = async () => {
  ElMessage.info('正在测试系统健康状态连接...')
  await getSystemHealth()
  ElMessage({ message: `测试结果: ${systemStatusText.value}`, type: systemStatus.value === 'online' ? 'success' : 'error' })
}

// 获取系统健康状态
const getSystemHealth = async () => {
  try {
    // console.log('开始请求系统健康状态API...')
    // 确保使用完整的绝对路径，避免与request.js中的baseURL冲突
    const res = await request.get('http://localhost:8888/health', { baseURL: '' })
    // console.log('系统健康状态API响应成功:', res)
    systemStatus.value = 'online'
    systemStatusText.value = '正常运行'
  } catch (error) {
      console.error('获取系统健康状态失败:', error)
      // 打印错误详情，帮助排查问题
      if (error.response) {
        console.error('错误响应状态:', error.response.status)
        console.error('错误响应数据:', error.response.data)
      } else if (error.request) {
        console.error('请求已发送但未收到响应:', error.request)
      } else {
        console.error('请求配置错误:', error.message)
      }
      systemStatus.value = 'offline'
      systemStatusText.value = '运行异常'
  }
}

// 定义刷新间隔时间(毫秒)
const REFRESH_INTERVAL = 30000 // 30秒

// 定时器引用
let refreshTimer = null

// 刷新所有数据
const refreshAllData = async () => {
  try {
    await Promise.all([
      getStatistics(),
      getSystemHealth()
    ])
  } catch (error) {
    console.error('刷新数据失败:', error)
  }
}

// 页面挂载时获取数据并启动定时器
onMounted(() => {
  refreshAllData()
  // 启动定时器
  refreshTimer = setInterval(refreshAllData, REFRESH_INTERVAL)
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.stat-label-with-icon {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.stat-icon {
  margin-right: 5px;
  font-size: 16px;
  color: #67c23a;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.online {
  color: #67c23a;
}

.offline {
  color: #f56c6c;
}

.status-success {
  color: #67c23a;
}

.status-fail {
  color: #f56c6c;
}

.recent-activities {
  margin-top: 20px;
}
</style>