<template>
  <div class="role-permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色权限关联管理</span>
          <el-button type="primary" size="small" class="add-permission-btn" @click="handleAddPermission">
            <el-icon><plus /></el-icon> 新增角色关联权限
          </el-button>
        </div>
      </template>
      <div class="search-container">
        <el-input
          v-model="searchRole"
          placeholder="请输入角色名称"
          class="search-input"
          @input="debouncedSearch"
        />
        <el-select
          v-model="searchMethod"
          placeholder="请选择HTTP方法"
          class="search-select"
          @change="debouncedSearch"
        >
          <el-option label="全部" value="" />
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
          <el-option label="PATCH" value="PATCH" />
        </el-select>
        <el-button type="primary" @click="handleSearch" :loading="loading">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <el-table :data="pagedRolePermissions" style="width: 100%" v-loading="loading">
        <el-table-column prop="role_name" label="角色名称" width="180" />
        <el-table-column prop="permission_name" label="权限名称" width="250" />
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
        <el-form-item label="角色名称" prop="role_id">
          <el-select v-model="permissionForm.role_id" placeholder="请选择角色名称" @change="handleRoleChange">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称" prop="permission_id">
          <el-select v-model="permissionForm.permission_id" placeholder="请选择权限名称" @change="handlePermissionChange">
            <el-option v-for="perm in permissions" :key="perm.id" :label="perm.description" :value="perm.id" />
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
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { ElForm } from 'element-plus'
import MessageUtil from '../utils/message.js'
import { Plus } from '@element-plus/icons-vue'
import { getPermissions } from '../api/permission'
import { getRoles } from '../api/role'
import { addRolePermission, deleteRolePermission } from '../api/permission'

// 角色权限列表数据
const rolePermissions = ref([])
const allRolePermissions = ref([])
const roles = ref([])
const roleNames = ref([])
// 搜索和筛选条件
const searchRole = ref('')
const searchMethod = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 模态框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = ref('新增角色权限')
const permissionForm = reactive({
  role_id: '',
  permission_id: ''
})

// 权限列表
const permissions = ref([])
const permissionFormRef = ref(null)

// 角色和权限的映射关系
const roleIdToName = ref({})
const roleNameToId = ref({})
const permissionIdToName = ref({})
const permissionNameToId = ref({})

// 构建角色和权限的映射关系
const buildMappings = () => {
  // 角色ID到名称的映射
  const roleIdMap = {}
  roles.value.forEach(role => {
    roleIdMap[role.id] = role.name
  })
  roleIdToName.value = roleIdMap
  
  // 角色名称到ID的映射
  const roleNameMap = {}
  roles.value.forEach(role => {
    roleNameMap[role.name] = role.id
  })
  roleNameToId.value = roleNameMap
  
  // 权限ID到名称的映射
  const permissionIdMap = {}
  permissions.value.forEach(permission => {
    permissionIdMap[permission.id] = permission.description
  })
  permissionIdToName.value = permissionIdMap
  
  // 权限名称到ID的映射
  const permissionNameMap = {}
  permissions.value.forEach(permission => {
    permissionNameMap[permission.description] = permission.id
  })
  permissionNameToId.value = permissionNameMap
}

// 在获取数据后构建映射
watch([roles, permissions], () => {
  if (roles.value.length && permissions.value.length) {
    buildMappings()
  }
}, { immediate: true })

// 表单验证规则
const rules = {
  role_id: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  permission_id: [
    { required: true, message: '请选择权限', trigger: 'change' }
  ]
}

// 加载状态
const loading = ref(false)

// 获取角色权限列表
const getRolePermissions = async () => {
  loading.value = true
  try {
    // 分别获取权限和角色数据
    const [permissionsRes, rolesRes] = await Promise.all([
      getPermissions(),
      getRoles()
    ])
    
    console.log('Permissions API response:', permissionsRes)
    console.log('Roles API response:', rolesRes)
    
    // 检查响应格式
    if (!permissionsRes || typeof permissionsRes.data === 'undefined') {
      throw new Error('权限API响应格式不正确，缺少data字段')
    }
    if (!rolesRes || typeof rolesRes.data === 'undefined') {
      throw new Error('角色API响应格式不正确，缺少data字段')
    }
    
    permissions.value = permissionsRes.data || []
    roles.value = rolesRes.data || []
    
    // 检查数据格式
    if (!Array.isArray(permissions.value)) {
      throw new Error('权限数据不是数组格式')
    }
    
    if (!Array.isArray(roles.value)) {
      throw new Error('角色数据不是数组格式')
    }
    
    // 处理角色权限数据
    const rolePermissionsData = []
    permissions.value.forEach(permission => {
      // 检查权限对象是否包含必要的字段
      if (!permission.id || !permission.description || !permission.resource || !permission.action) {
        console.warn('权限对象缺少必要字段:', permission)
        return
      }
      
      // 检查roles字段
      if (!permission.roles || !Array.isArray(permission.roles)) {
        console.warn('权限对象的roles字段不存在或不是数组:', permission)
        return
      }
      
      permission.roles.forEach(role => {
        // 检查角色对象是否包含必要的字段
        if (!role.id || !role.name) {
          console.warn('角色对象缺少必要字段:', role)
          return
        }
        
        rolePermissionsData.push({
          id: `${permission.id}-${role.id}`, // 创建复合ID
          permission_id: permission.id,
          permission_name: permission.description,
          role_id: role.id,
          role_name: role.name,
          path: permission.resource,
          method: permission.action
        })
      })
    })
    
    console.log('Processed role permissions data:', rolePermissionsData)
    
    allRolePermissions.value = rolePermissionsData
    rolePermissions.value = rolePermissionsData
    
    // 生成角色名称列表
    const roleNamesSet = new Set()
    rolePermissionsData.forEach(item => {
      roleNamesSet.add(item.role_name)
    })
    roleNames.value = Array.from(roleNamesSet)
    
    currentPage.value = 1
    // updatePagedData() 已删除，使用computed属性代替
  } catch (error) {
    console.error('Failed to get role permissions:', error)
    // 检查是否是403权限错误
    if (error.response && error.response.status === 403) {
      MessageUtil.warning('没有操作权限')
    } else {
      // 其他错误
      const errorMessage = import.meta.env.DEV
        ? `获取角色权限列表失败: ${error.message}`
        : '获取角色权限列表失败，请重试'
      MessageUtil.error(errorMessage)
    }
  } finally {
    loading.value = false
  }
}



// 获取角色列表已在getRolePermissions中实现，此函数不再需要
// const getRolesList = async () => {
//   try {
//     const res = await getRoles()
//     roles.value = res.data || []
//   } catch (error) {
//     MessageUtil.error('获取角色列表失败')
//     console.error('Failed to get roles list:', error)
//   }
// }

// 处理角色变化
const handleRoleChange = (value) => {
  permissionForm.role_id = value
}

// 处理权限变化
const handlePermissionChange = (value) => {
  permissionForm.permission_id = value
}

// 打开新增角色权限模态框
const handleAddPermission = () => {
  dialogType.value = 'add'
  dialogTitle.value = '新增角色权限'
  currentEditingId.value = null
  // 使用表单重置方法
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields()
  }
  dialogVisible.value = true
}

// 当前编辑的ID
const currentEditingId = ref(null)

// 打开编辑角色权限模态框
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogTitle.value = '编辑角色权限'
  currentEditingId.value = row.id
  permissionForm.role_id = row.role_id
  permissionForm.permission_id = row.permission_id
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    await permissionFormRef.value.validate()
    
    // 构建角色权限关联数据
    const rolePermissionData = {
      role_id: parseInt(permissionForm.role_id),
      permission_id: parseInt(permissionForm.permission_id)
    }
    
    if (dialogType.value === 'add') {
      await addRolePermission(rolePermissionData)
      MessageUtil.success('新增角色权限关联成功')
    } else {
      // 编辑角色权限关联 - 直接更新（如果API支持）
      // 注意：此处假设API支持更新操作，如果不支持则需要先删除再添加
      // 但为了避免不必要的操作，我们先检查是否有实际变化
      const originalItem = allRolePermissions.value.find(
        item => item.id === currentEditingId.value
      )
      
      // 检查角色ID或权限ID是否有变更
      if (originalItem && 
          (originalItem.role_id !== rolePermissionData.role_id || 
           originalItem.permission_id !== rolePermissionData.permission_id)) {
        // 先删除原关联
        await deleteRolePermission({
          role_id: originalItem.role_id,
          permission_id: originalItem.permission_id
        })
        
        // 再添加新关联
        await addRolePermission(rolePermissionData)
        MessageUtil.success('更新角色权限关联成功')
      } else {
        MessageUtil.info('未检测到变更')
      }
    }
    
    dialogVisible.value = false
    getRolePermissions()
  } catch (error) {
    if (error.name === 'ValidationError') {
      return
    }
    MessageUtil.error(`${dialogType.value === 'add' ? '新增' : '更新'}角色权限关联失败: ${error.message || '未知错误'}`)
    console.error(`Failed to ${dialogType.value} role permission association:`, error)
  }
}

// 删除角色权限关联
const handleDelete = async (row) => {
  try {
    await MessageUtil.confirm(
      `确定要删除角色 ${row.role_name} 的权限 ${row.permission_name}?`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteRolePermission({
      role_id: row.role_id,
      permission_id: row.permission_id
    })
    MessageUtil.success('删除角色权限关联成功')
    getRolePermissions()
  } catch (error) {
    // 如果是用户取消操作，不显示错误消息
    if (error.name !== 'Error') {
      MessageUtil.error('删除角色权限关联失败')
      console.error('Failed to delete role permission association:', error)
    }
  }
}

// 计算分页数据
const pagedRolePermissions = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return rolePermissions.value.slice(startIndex, endIndex)
})

// 处理每页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理当前页码变化
const handleCurrentChange = (current) => {
  currentPage.value = current
}

// 防抖函数
const debounce = (fn, delay = 500) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 搜索和筛选角色权限
const handleSearch = () => {
  if (!searchRole.value && !searchMethod.value) {
    rolePermissions.value = allRolePermissions.value
  } else {
    rolePermissions.value = allRolePermissions.value.filter(item => {
      const roleMatch = searchRole.value ? item.role_name.toLowerCase().includes(searchRole.value.toLowerCase()) : true
      const methodMatch = searchMethod.value ? item.method === searchMethod.value : true
      return roleMatch && methodMatch
    })
  }
  currentPage.value = 1
}

// 防抖搜索
const debouncedSearch = debounce(handleSearch, 300)

// 重置搜索和筛选条件
const resetSearch = () => {
  searchRole.value = ''
  searchMethod.value = ''
  rolePermissions.value = allRolePermissions.value
  currentPage.value = 1
}

// 页面挂载时获取角色权限列表
onMounted(() => {
  getRolePermissions()
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