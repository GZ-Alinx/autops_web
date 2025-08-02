<template>
  <div class="edit-user">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑用户</span>
        </div>
      </template>
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserDetail, updateUser } from '../api/user'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userId = route.params.id

// 用户表单数据
const userForm = reactive({
  username: '',
  email: '',
  phone: '',
  nickname: '',
  status: 1
})

// 表单规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const userFormRef = ref(null)

// 获取用户详情
const getUserInfo = async () => {
  try {
    const res = await getUserDetail(userId)
    userForm.username = res.data.username
    userForm.email = res.data.email
    userForm.phone = res.data.phone || ''
    userForm.nickname = res.data.nickname || ''
    userForm.status = res.data.status || 1
  } catch (error) {
    ElMessage.error('获取用户详情失败')
    console.error('Failed to get user detail:', error)
  }
}

// 提交表单
const submitForm = async () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateUser(userId, userForm)
        ElMessage.success('更新用户成功')
        router.push('/dashboard/users')
      } catch (error) {
        ElMessage.error('更新用户失败')
        console.error('Failed to update user:', error)
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  getUserInfo()
}

// 取消操作
const handleCancel = () => {
  router.push('/dashboard/users')
}

// 页面挂载时获取用户详情
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.edit-user {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>