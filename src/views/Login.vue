<template>
  <PageContainer>
      <div class="login-ui">
        <div class="login-container">
          <div class="login-form">
        <h2>权限管理平台开发底座登录</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
          <el-form-item label="用户" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
          </el-form-item>
        </el-form>
          </div>
        </div>
      </div>
  </PageContainer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import PageContainer from '../components/PageContainer.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import { login } from '../api/user'
import { ElMessage } from 'element-plus'

const loginFormRef = ref(null)
const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const router = useRouter()
const userStore = useUserStore()

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用登录接口
        const res = await login(loginForm)
        // 存储token和用户信息
        userStore.login(res.data.token, res.data.userInfo)
        ElMessage.success('登录成功')
        // 跳转到首页
        router.push('/dashboard')
      } catch (error) {
          // 检查是否是401错误
          if (error.response && error.response.status === 401) {
            ElMessage.error('密码错误')
          } else {
            ElMessage.error('登录失败: ' + (error.message || '用户名或密码错误'))
          }
        }
    }
  })
}
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  margin-left: 140%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.login-form h2, .el-form-item {
  word-wrap: break-word;
  white-space: normal;
}

.login-form:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #304156;
  font-size: 24px;
  font-weight: 600;
}
.login-ui {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 50px;
}

.login-container {
  width: 100%;
  max-width: 500px;
}
</style>