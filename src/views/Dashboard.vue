<template>
  <PageContainer>
    <div class="dashboard-layout">
      <!-- 顶部 header -->
      <Header :user-info="userInfo" @logout="handleLogout" />

      <!-- 中间主体：左侧 sidebar + 右侧内容 -->
      <div class="layout-body">
        <Sidebar />
        <main class="layout-main">
          <router-view />
        </main>
      </div>
      <Footer />
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageContainer from '../components/PageContainer.vue'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'
// 组件通过路由懒加载，不需要在此处导入
// 导入其他业务页面组件
// import UserList from './UserList.vue'
// import RolePermission from './RolePermission.vue'
// import BasicSettings from './BasicSettings.vue'
// import LogManagement from './LogManagement.vue'

import { useRouter } from 'vue-router'
import { useUserStore } from '../store'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref(userStore.userInfo)

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部 Header 宽度100% */
.dashboard-layout > :first-child {
  flex-shrink: 0;
  width: 100%;
}

/* 主体部分：左右结构 */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧菜单栏保持 200px 宽度，高度自适应 */
.layout-body > :first-child {
  width: 200px;
  background: #2d3a4b;
  overflow-y: auto;
  flex-shrink: 0;
}

/* 右侧主内容 */
.layout-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

/* 底部 Footer 吸底显示 */
.dashboard-layout > :last-child {
  flex-shrink: 0;
  height: 40px;
  width: 100%;
  background-color: #f5f7fa;
  text-align: center;
  line-height: 40px;
  font-size: 13px;
  color: #999;
  border-top: 1px solid #e0e0e0;
}
</style>