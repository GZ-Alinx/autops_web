<template>
  <div class="add-user">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>添加用户</span>
        </div>
      </template>
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
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
import { ref, reactive } from 'vue'
import MessageUtil from '../utils/message.js'
import { addUser } from '../api/user'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户表单数据
const userForm = reactive({
  username: '',
  password: '',
  email: '',
  phone: '',
  nickname: '',
  status: 1
})

// 表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const userFormRef = ref(null)

// 提交表单
const submitForm = async () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await addUser(userForm)
        MessageUtil.success('添加用户成功')
        router.push('/dashboard/users')
      } catch (error) {
        MessageUtil.error('添加用户失败')
        console.error('Failed to add user:', error)
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  userFormRef.value.resetFields()
}

// 取消操作
const handleCancel = () => {
  router.push('/dashboard/users')
}
</script>

<style scoped>
.add-user {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>