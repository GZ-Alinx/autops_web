<template>
  <el-aside width="200px" class="sidebar">
    <el-menu :default-openeds="['1']" @select="handleMenuSelect">
      <el-menu-item index="1">
        <el-icon><HomeFilled /></el-icon>
        <span>活动概览</span>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><user /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><key /></el-icon>
        <span>角色管理</span>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><lock /></el-icon>
        <span>权限管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Menu, User, Key, Lock } from '@element-plus/icons-vue'

const router = useRouter()

const handleMenuSelect = (index) => {
  if (index === '1') {
    router.push('/dashboard')
  } else if (index === '2') {
    router.push('/dashboard/users')
  } else if (index === '3') {
    router.push('/dashboard/roles')
  } else if (index === '4') {
    router.push('/dashboard/permissions')
  }
}
</script>

<style scoped>
.sidebar {
  background: #2d3a4b;
  height: 100%;
}

/* 确保所有导航元素背景色统一为#2d3a4b */
.sidebar .el-menu,
.sidebar .el-sub-menu,
.sidebar .el-menu-item,
.sidebar .el-sub-menu__title,
.sidebar .el-menu .el-menu,
.sidebar .el-menu .el-sub-menu {
  background: #2d3a4b !important;
  border-right: none !important;
}

/* 导航文字颜色设置为白色 */
.sidebar .el-menu-item,
.sidebar .el-sub-menu__title,
.sidebar .el-menu-item span,
.sidebar .el-sub-menu__title span {
  color: #ffffff !important;
  --el-menu-text-color: #ffffff !important;
}

/* 所有选中状态样式 - 采用更深的蓝色突出选中状态 */
.sidebar .el-menu-item.is-active,
.sidebar .el-sub-menu__title.is-active,
.sidebar .el-menu-item:focus,
.sidebar .el-sub-menu__title:focus,
.sidebar .el-sub-menu.is-opened .el-sub-menu__title {
  background: #1a2533 !important;
  color: #fff !important;
  /* 添加过渡效果使交互更丝滑 */
  transition: background-color 0.2s ease-in-out;
}

/* 确保所有子菜单层级背景色一致 */
.sidebar .el-sub-menu .el-menu-item,
.sidebar .el-sub-menu .el-sub-menu__title {
  background: #2d3a4b !important;
}

/* 所有悬停状态样式 - 使用稍亮的蓝色并添加过渡效果 */
.sidebar .el-menu-item:hover,
.sidebar .el-sub-menu__title:hover,
.sidebar .el-menu-item:focus:hover,
.sidebar .el-sub-menu__title:focus:hover {
  background: #35475e !important;
  /* 添加过渡效果使交互更丝滑 */
  transition: background-color 0.2s ease-in-out;
}
</style>