<template>
  <div class="role-permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" size="small" class="add-permission-btn" @click="handleAddPermission">
            <el-icon><plus /></el-icon> 新增角色权限
          </el-button>
        </div>
      </template>
      <div class="search-container">
        <el-input
          v-model="searchRole"
          placeholder="请输入角色名称"
          class="search-input"
        />
        <el-select
          v-model="searchMethod"
          placeholder="请选择HTTP方法"
          class="search-select"
        >
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
      <el-table :data="pagedRolePermissions" style="width: 100%">
        <el-table-column prop="role" label="角色名称" width="180" />
        <el-table-column prop="path" label="资源路径" width="250" />
        <el-table-column prop="method" label="HTTP方法" width="120" />
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
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="rolePermissions.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑角色权限模态框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="permissionFormRef" :model="permissionForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="role">
          <el-select v-model="permissionForm.role" placeholder="请选择角色名称">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
          <el-select v-model="permissionForm.permissionName" placeholder="请选择权限名称" @change="handlePermissionNameChange">
            <el-option v-for="name in permissionNames" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getPermissions, addPermission, deletePermission } from '../api/permission'
import { getRoles } from '../api/role'

// 角色权限列表数据
const rolePermissions = ref([])
const allRolePermissions = ref([])
const roles = ref([])

// 搜索和筛选条件
const searchRole = ref('')
const searchMethod = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const pagedRolePermissions = ref([])

// 模态框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = ref('新增角色权限')
const permissionForm = reactive({
  role: '',
  permissionName: ''
})

// 权限名称列表
const permissionNames = ref([])
const permissionFormRef = ref(null)

// 表单验证规则
const rules = {
  role: [
    { required: true, message: '请选择角色名称', trigger: 'change' }
  ],
  permissionName: [
    { required: true, message: '请选择权限名称', trigger: 'change' }
  ]
}

// 获取角色权限列表
const getRolePermissions = async () => {
  try {
    const res = await getPermissions()
    // 处理新的数据结构
    const permissions = []
    res.data.forEach(permission => {
      // 遍历每个权限的角色列表
      permission.roles.forEach(role => {
        permissions.push({
          id: permission.id,
          role: role.name,
          path: permission.resource,
          method: permission.action,
          name: permission.description,
          description: permission.description
        })
      })
    })
    
    allRolePermissions.value = permissions
    rolePermissions.value = permissions
    
    // 生成权限名称列表（去重）
    const names = [...new Set(permissions.map(perm => perm.name))]
    permissionNames.value = names
    
    currentPage.value = 1
    updatePagedData()
  } catch (error) {
    ElMessage.error('获取角色权限列表失败')
    console.error('Failed to get role permissions:', error)
  }
}

// 获取角色列表
const getRolesList = async () => {
  try {
    const res = await getRoles()
    roles.value = res.data || []
  } catch (error) {
    ElMessage.error('获取角色列表失败')
    console.error('Failed to get roles list:', error)
  }
}

// 处理权限名称变化
const handlePermissionNameChange = (value) => {
  permissionForm.permissionName = value
  // 根据选择的权限名称查找对应的path和method
  const permission = allRolePermissions.value.find(perm => perm.name === value)
  if (permission) {
    permissionForm.path = permission.path
    permissionForm.method = permission.method
  }
}

// 打开新增角色权限模态框
const handleAddPermission = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增角色权限'
  Object.keys(permissionForm).forEach(key => {
    permissionForm[key] = ''
  })
  dialogVisible.value = true
}

// 打开编辑角色权限模态框
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑角色权限'
  permissionForm.role = row.role
  permissionForm.permissionName = row.name
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    await permissionFormRef.value.validate()
    
    // 查找对应的权限信息
    const permission = allRolePermissions.value.find(perm => perm.name === permissionForm.permissionName)
    if (!permission) {
      ElMessage.error('未找到对应的权限信息')
      return
    }
    
    // 构建权限数据
    const permissionData = {
      role: permissionForm.role,
      path: permission.path,
      method: permission.method
    }
    
    if (dialogType.value === 'add') {
      await addPermission(permissionData)
      ElMessage.success('新增角色权限成功')
    } else {
      // 编辑角色权限（实际上是先删除再添加）
      // 查找原始权限信息
      const originalPermission = allRolePermissions.value.find(
        p => p.role === permissionForm.role && p.id === permission.id
      )
      
      if (originalPermission) {
        await deletePermission({
          role: originalPermission.role,
          path: originalPermission.path,
          method: originalPermission.method
        })
      }
      
      await addPermission(permissionData)
      ElMessage.success('更新角色权限成功')
    }
    
    dialogVisible.value = false
    getRolePermissions()
  } catch (error) {
    if (error.name === 'ValidationError') {
      return
    }
    ElMessage.error(dialogType.value === 'add' ? '新增角色权限失败' : '更新角色权限失败')
    console.error(`Failed to ${dialogType.value} role permission:`, error)
  }
}

// 删除角色权限
const handleDelete = async (row) => {
  try {
    await deletePermission({
      role: row.role,
      path: row.path,
      method: row.method
    })
    ElMessage.success('删除角色权限成功')
    getRolePermissions()
  } catch (error) {
    ElMessage.error('删除角色权限失败')
    console.error('Failed to delete role permission:', error)
  }
}

// 更新分页数据
const updatePagedData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  pagedRolePermissions.value = rolePermissions.value.slice(startIndex, endIndex)
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

// 搜索和筛选角色权限
const handleSearch = () => {
  if (!searchRole.value && !searchMethod.value) {
    rolePermissions.value = allRolePermissions.value
  } else {
    rolePermissions.value = allRolePermissions.value.filter(permission => {
      const roleMatch = searchRole.value ? permission.role.includes(searchRole.value) : true
      const methodMatch = searchMethod.value ? permission.method === searchMethod.value : true
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
  rolePermissions.value = allRolePermissions.value
  currentPage.value = 1
  updatePagedData()
}

// 页面挂载时获取数据
onMounted(() => {
  getRolePermissions()
  getRolesList()
})
</script>

<style scoped>
.role-permission-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-permission-btn {
  margin-top: 0;
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
</style>