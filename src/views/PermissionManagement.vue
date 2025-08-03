<template>
  <div class="permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon><Key /></el-icon>
          <span>角色权限管理</span>
          <el-button type="primary" size="small" class="add-permission-btn" @click="handleAddPermission">
            <el-icon><Plus /></el-icon> 新增角色权限
          </el-button>
        </div>
      </template>
      <div class="search-container">
        <el-input v-model="searchRole" placeholder="输入角色名称搜索" class="search-input" />
        <el-select v-model="searchMethod" placeholder="选择HTTP方法筛选" class="search-select">
          <el-option label="全部" value="" />
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
          <el-option label="PATCH" value="PATCH" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <el-table :data="pagedPermissionPolicies" style="width: 100%">
        <el-table-column prop="role" label="角色名称" width="180" />
        <el-table-column prop="path" label="资源路径" width="250" />
        <el-table-column prop="method" label="HTTP方法" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="permissionPolicies.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑角色权限模态框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="permissionForm" :rules="rules" ref="permissionFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="role">
          <el-select v-model="permissionForm.role" placeholder="请选择角色名称">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源路径" prop="path">
          <el-input v-model="permissionForm.path" placeholder="请输入资源路径"></el-input>
        </el-form-item>
        <el-form-item label="HTTP方法" prop="method">
          <el-select v-model="permissionForm.method" placeholder="请选择HTTP方法">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
            <el-option label="PATCH" value="PATCH"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Key } from '@element-plus/icons-vue'
import { addPermission, deletePermission, getPermissions } from '../api/permission'
import { getRoles } from '../api/role'

// 权限策略列表数据
const permissionPolicies = ref([])
// 原始权限策略列表，用于搜索和筛选
const allPermissionPolicies = ref([])

// 角色列表
const roles = ref([])

// 搜索和筛选条件
const searchRole = ref('')
const searchMethod = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const pagedPermissionPolicies = ref([])

// 模态框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色权限')
const permissionForm = reactive({
  role: '',
  path: '',
  method: ''
})
const rules = {
  role: [
    { required: true, message: '请选择角色名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入资源路径', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择HTTP方法', trigger: 'blur' }
  ]
}
const permissionFormRef = ref(null)
// 获取权限策略列表
const fetchPermissionPolicies = async () => {
    try {
      const res = await getPermissions()
      // 将字符串数组转换为对象数组
      const policies = res.data.map(policyStr => {
        const [role, path, method] = policyStr.split(',')
        return {
          role,
          path,
          method
        }
      })
      allPermissionPolicies.value = policies
      permissionPolicies.value = policies
      currentPage.value = 1
      updatePagedData()
    } catch (error) {
      handleError(error, '获取权限列表失败')
    }
  }

// 搜索和筛选权限策略
const handleSearch = () => {
  if (!searchRole.value && !searchMethod.value) {
    permissionPolicies.value = allPermissionPolicies.value
  } else {
    permissionPolicies.value = allPermissionPolicies.value.filter(policy => {
      const roleMatch = searchRole.value ? policy.role.includes(searchRole.value) : true
      const methodMatch = searchMethod.value ? policy.method === searchMethod.value : true
      return roleMatch && methodMatch
    })
  }
  currentPage.value = 1
  updatePagedData()
}

// 重置搜索和筛选条件
const resetSearch = () => {
  searchRole.value = ''
  searchMethod.value = ''
  permissionPolicies.value = allPermissionPolicies.value
  currentPage.value = 1
  updatePagedData()
}

// 更新分页数据
const updatePagedData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  pagedPermissionPolicies.value = permissionPolicies.value.slice(startIndex, endIndex)
}

// 处理每页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  updatePagedData()
}

// 处理当前页码变化
const handleCurrentChange = (current) => {
  currentPage.value = current
  updatePagedData()
}

// 统一错误处理函数
const handleError = (error, defaultMessage) => {
  if (error.response && error.response.status === 403) {
    ElMessage.warning('没有操作权限')
  } else {
    ElMessage.error(defaultMessage)
    console.error(defaultMessage + ':', error)
  }
  return Promise.reject(error)
}

// 新增角色权限
const handleAddPermission = () => {
  dialogTitle.value = '新增角色权限'
  // 重置表单
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields()
  }
  permissionForm.role = ''
  permissionForm.path = ''
  permissionForm.method = ''
  dialogVisible.value = true
}

// 删除角色权限
const handleDelete = async (row) => {
  try {
    await deletePermission({
        role: row.role,
        path: row.path,
        method: row.method
      })
    ElMessage.success('删除权限成功')
    fetchPermissionPolicies()
  } catch (error) {
    handleError(error, '删除权限失败')
  }
}

// 提交表单
const submitForm = async () => {
  permissionFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 构建权限策略数据
        const policyData = {
          role: permissionForm.role,
          path: permissionForm.path,
          method: permissionForm.method
        }

        await addPermission(policyData)
        ElMessage.success('添加权限成功')
        dialogVisible.value = false
        fetchPermissionPolicies()
      } catch (error) {
        handleError(error, '添加权限失败')
      }
    }
  })
}

// 无分页处理，删除相关函数

// 获取角色列表
const getRoleList = async () => {
  try {
    const res = await getRoles()
    roles.value = res.data
  } catch (error) {
    if (error.response && error.response.status === 403) {
      ElMessage.warning('没有操作权限')
    } else {
      ElMessage.error('获取角色列表失败')
      console.error('Failed to get roles:', error)
    }
  }
}

// 页面挂载时获取权限策略列表和角色列表
onMounted(() => {
  fetchPermissionPolicies()
  getRoleList()
})
</script>

<style scoped>
.permission-management {
  padding: 20px;
  --el-primary-color: #409eff;
}

/* 统一图标颜色 */
.el-icon {
  color: #409eff;
}

/* 按钮样式统一 */
.el-button {
  border-radius: 4px;
  transition: all 0.2s ease;
}

.el-button:hover {
  opacity: 0.9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-container {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
}

.search-input {
  width: 200px;
}

.search-select {
  width: 150px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.add-permission-btn {
  margin-top: 0;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>