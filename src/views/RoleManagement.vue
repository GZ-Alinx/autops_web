<template>
  <div class="role-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" size="small" class="add-role-btn" @click="handleAddRole">
            <el-icon><plus /></el-icon> 新增角色
          </el-button>
        </div>
      </template>
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column prop="id" label="角色ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="180" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import MessageUtil from '../utils/message.js'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getRoles, deleteRole } from '../api/role'

const router = useRouter()

// 角色列表数据
const rolesList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 获取角色列表
const getRolesList = async () => {
  try {
    const res = await getRoles({
    })
    console.log("roles:", res)
    rolesList.value = res.data || []
    total.value = res.data.total || 0
  } catch (error) {
    if (error.response && error.response.status === 403) {
      MessageUtil.warning('没有操作权限')
      return Promise.reject(error)
    }else {
      MessageUtil.error('获取角色列表失败')
      console.error('Failed to get roles list:', error)
    }}
}

// 跳转到添加角色页面
const handleAddRole = () => {
  router.push('/dashboard/roles/add')
}

// 跳转到编辑角色页面
const handleEdit = (row) => {
  router.push(`/dashboard/roles/edit/${row.id}`)
}

// 删除角色
const handleDelete = async (row) => {
  try {
    await deleteRole(row.id)
    MessageUtil.success('删除角色成功')
    getRolesList()
  } catch (error) {
    if (error.response && error.response.status === 403) {
      MessageUtil.warning('没有操作权限')
      return Promise.reject(error)
    }else {
      MessageUtil.error('删除角色失败')
      console.error('Failed to delete role:', error)
    }}
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  getRolesList()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  getRolesList()
}

// 页面挂载时获取角色列表
onMounted(() => {
  getRolesList()
})
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-role-btn {
  margin-top: 0;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>