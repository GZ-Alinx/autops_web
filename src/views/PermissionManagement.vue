<template>
  <div class="permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色权限管理</span>
          <el-button type="primary" size="small" class="add-permission-btn" @click="handleAddPermission">
            <el-icon><plus /></el-icon> 新增角色权限策略
          </el-button>
        </div>
      </template>
      <el-table :data="permissionPolicies" style="width: 100%">
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
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑权限策略模态框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="permissionForm" :rules="rules" ref="permissionFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="role">
          <el-input v-model="permissionForm.role" placeholder="请输入角色名称"></el-input>
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
import { Plus } from '@element-plus/icons-vue'
import { addPermissionPolicy, deletePermissionPolicy, getAllPermissionPolicies } from '../api/permission'

// 权限策略列表数据
const permissionPolicies = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 模态框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增权限策略')
const permissionForm = reactive({
  role: '',
  path: '',
  method: ''
})
const rules = {
  role: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入资源路径', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择HTTP方法', trigger: 'change' }
  ]
}
const permissionFormRef = ref(null)

// 获取所有权限策略
const getPermissionPolicies = async () => {
  try {
    const res = await getAllPermissionPolicies()
    // 格式化数据，将字符串转换为对象
    permissionPolicies.value = res.data.map(item => {
      const [role, path, method] = item.split(',')
      return {
        role,
        path,
        method
      }
    })
    total.value = permissionPolicies.value.length
  } catch (error) {
    // 根据错误状态码显示不同提示
    if (error.response && error.response.status === 403) {
      ElMessage.warning('没有操作权限')
      return Promise.reject(error)
    }else {
      ElMessage.error('获取权限策略列表失败')
      console.error('Failed to delete role:', error)
    }}
}

// 新增权限策略
const handleAddPermission = () => {
  dialogTitle.value = '新增权限策略'
  // 重置表单
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields()
  }
  permissionForm.role = ''
  permissionForm.path = ''
  permissionForm.method = ''
  dialogVisible.value = true
}

// 编辑权限策略
const handleEdit = (row) => {
  dialogTitle.value = '编辑权限策略'
  permissionForm.role = row.role
  permissionForm.path = row.path
  permissionForm.method = row.method
  dialogVisible.value = true
}

// 删除权限策略
const handleDelete = async (row) => {
  try {
    await deletePermissionPolicy({
      role: row.role,
      path: row.path,
      method: row.method
    })
    ElMessage.success('删除权限策略成功')
    getPermissionPolicies()
  } catch (error) {
    if (error.response && error.response.status === 403) {
      ElMessage.warning('没有操作权限')
      return Promise.reject(error)
    }else {
    ElMessage.error('删除权限策略失败')
    console.error('Failed to delete permission policy:', error)
    }}
}

// 提交表单
const submitForm = async () => {
  permissionFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
          await addPermissionPolicy(permissionForm)
          ElMessage.success('添加权限策略成功')
          dialogVisible.value = false
          getPermissionPolicies()
        } catch (error) {
          if (error.response && error.response.status === 403) {
            ElMessage.warning('没有操作权限')
            return Promise.reject(error)
          }else {
            ElMessage.error('添加权限策略失败')
            return Promise.reject(error)
          }}
        }
  })
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  // 由于没有分页API，这里不需要重新获取数据
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  // 由于没有分页API，这里不需要重新获取数据
}

// 页面挂载时获取权限策略列表
onMounted(() => {
  getPermissionPolicies()
})
</script>

<style scoped>
.permission-management {
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>