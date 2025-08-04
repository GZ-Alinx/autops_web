<template>
  <el-aside width="200px" class="sidebar">
    <el-menu :default-openeds="['1', '5']" :default-active="currentRoute" @select="handleMenuSelect" router>
      <el-menu-item index="/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <span>用户概览</span>
      </el-menu-item>
      <el-menu-item index="/dashboard/users">
        <el-icon><user /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-sub-menu index="5">
        <template #title>
          <el-icon><Lock /></el-icon>
          <span>权限与角色管理</span>
        </template>
        <el-menu-item index="/dashboard/roles">
          <el-icon><user /></el-icon>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/permissions/policy">
          <el-icon><Key /></el-icon>
          <span>权限管理</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/roles/permissions">
          <el-icon><Lock /></el-icon>
          <span>角色权限关联</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const currentRoute = ref(route.path)

// 监听路由变化更新当前选中项
watch(
  () => route.path,
  (newPath) => {
    currentRoute.value = newPath
  }
)

const handleMenuSelect = (index) => {
  router.push(index)
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

/* 导航文字和图标颜色设置 */
.sidebar .el-menu-item,
.sidebar .el-sub-menu__title,
.sidebar .el-menu-item span,
.sidebar .el-sub-menu__title span,
.sidebar .el-icon {
  color: #ffffff !important;
  --el-menu-text-color: #ffffff !important;
}

/* 统一图标颜色 */
.sidebar .el-icon {
  color: #409eff !important;
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