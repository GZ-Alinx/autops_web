<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>用户列表</span>
        <el-button type="primary" size="small" @click="handleAddUser">添加用户</el-button>
      </div>
    </template>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="角色" width="480">
        <template #default="scope">
          <span v-for="(role, index) in scope.row.roles" :key="index">
            {{ role.name }}{{ index < scope.row.roles.length - 1 ? ', ' : '' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="420" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEditUser(scope.row)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleChangePassword(scope.row)">修改密码</el-button>
          <el-button type="success" size="small" @click="handleAssignRole(scope.row)">分配角色</el-button>
          <el-button type="danger" size="small" @click="handleDeleteUser(scope.row.id)">删除</el-button>
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

    <!-- 修改密码模态框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="passwordForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="passwordForm.old_password" type="password" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="passwordForm.new_password" type="password" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPasswordForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色模态框 -->
    <el-dialog v-model="roleDialogVisible" title="分配角色" width="400px">
      <el-form :model="roleForm" :rules="roleRules" ref="roleFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="roleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择角色" prop="roles">
          <el-select v-model="roleForm.roles" multiple placeholder="请选择角色">
            <!-- 使用索引作为key，确保唯一性 -->
            <el-option v-for="(role, index) in roles" :key="index" :label="role" :value="role"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserList, deleteUser, changePassword } from '../api/user'
import { updateUserRole } from '../api/permission'
import { getRoles } from '../api/role'
import MessageUtil from '../utils/message.js'

// 用于跟踪是否已经显示权限提示
const permissionAlertShown = ref(false)


// 路由
const router = useRouter()

// 用户数据
const users = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 修改密码相关
const passwordDialogVisible = ref(false)
const passwordForm = reactive({
  user_id: '',
  username: '',
  old_password: '',
  new_password: ''
})
const passwordRules = {
  old_password: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度至少为6位', trigger: 'blur' }
  ]
}
const passwordFormRef = ref(null)

// 分配角色相关
const roleDialogVisible = ref(false)
const roleForm = reactive({
  user_id: '',
  username: '',
  roles: []
})
const roleRules = {
  roles: [
    { required: true, message: '请至少选择一个角色', trigger: 'blur' }
  ]
}
const roleFormRef = ref(null)
const roles = ref([])

// 获取角色列表
const getRolesList = async () => {
  try {
    const res = await getRoles() // 获取所有角色
    // 假设API返回格式为{ data: [{ id: 1, name: 'admin' }, ...] }
    // 只存储角色名称字符串
    roles.value = res.data.map(role => role.name)
  } catch (error) {
    if (error.response && error.response.status === 403) {
      if (!permissionAlertShown.value) {
        MessageUtil.warning('没有操作权限')
        permissionAlertShown.value = true
      }
      return Promise.reject(error)
    }else {
      MessageUtil.error('获取角色列表失败')
      console.error('获取统计数据失败:', error)
    }}
}

// 获取用户列表
const getUsers = async () => {
  try {
    const res = await getUserList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    console.log("userDATA:", res)
    users.value = res.data.list || []
    total.value = res.data.total || 0
  } catch (error) {
    if (error.response && error.response.status === 403) {
      if (!permissionAlertShown.value) {
        MessageUtil.warning('没有操作权限')
        permissionAlertShown.value = true
      }
      return Promise.reject(error)
    }else {
      MessageUtil.error('获取用户列表失败')
      console.error('获取用户列表失败:', error)
    }}
}

// 添加用户
const handleAddUser = () => {
  console.log('添加用户按钮被点击');
  router.push('/dashboard/users/add')
}

// 编辑用户
const handleEditUser = (user) => {
  router.push(`/dashboard/users/edit/${user.id}`)
}

// 删除用户
const handleDeleteUser = async (id) => {
  try {
    await deleteUser(id)
    MessageUtil.success('删除用户成功')
    getUsers()
  } catch (error) {
      MessageUtil.error('删除用户失败')
      console.error('删除用户失败:', error)
    }
}

// 打开修改密码模态框
const handleChangePassword = (user) => {
  passwordForm.user_id = user.id
  passwordForm.username = user.username
  passwordForm.old_password = ''
  passwordForm.new_password = ''
  passwordDialogVisible.value = true
}

// 提交密码修改表单
const submitPasswordForm = async () => {
  passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const userId = passwordForm.user_id
        const requestData = {
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password
        }
        await changePassword(userId, requestData)
        MessageUtil.success('密码修改成功')
        passwordDialogVisible.value = false
      } catch (error) {
        MessageUtil.error('密码修改失败')
        console.error('密码修改失败:', error)
      }
    }
  })
}

// 打开分配角色模态框
const handleAssignRole = (user) => {
  roleForm.user_id = user.id
  roleForm.username = user.username
  // 确保角色格式正确（字符串数组）
    roleForm.roles = user.roles ? 
      (Array.isArray(user.roles) ? 
        // 如果是对象数组，提取name属性
        user.roles.map(role => typeof role === 'object' ? role.name : role) : 
        // 如果是单个角色，转换为数组
        [user.roles] 
      ) : []
  roleDialogVisible.value = true
}

// 提交角色分配表单
const submitRoleForm = async () => {
  roleFormRef.value.validate(async (valid) => {
          if (valid) {
            try {
              // 直接发送角色名称数组
              const requestData = {
                // 确保user_id是数字类型
                user_id: Number(roleForm.user_id),
                roles: roleForm.roles
              }
              console.log('分配角色请求参数:', requestData)
              await updateUserRole(requestData)
              MessageUtil.success('分配角色成功')
              roleDialogVisible.value = false
              getUsers()
            } catch (error) {
              MessageUtil.error('分配角色失败')
              console.error('分配角色失败:', error)
              console.error('错误详情:', error.response?.data || error.message)
            }
          }
        })
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  getUsers()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  getUsers()
}

// 页面挂载时获取数据
onMounted(() => {
  getUsers()
  getRolesList()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>