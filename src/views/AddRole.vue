<template>
  <div class="add-role">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>创建角色</span>
        </div>
      </template>
      <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.describe" type="textarea" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-container">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import MessageUtil from '../utils/message.js'
import { useRouter } from 'vue-router'
import { createRole } from '../api/role'

const router = useRouter()

// 角色表单数据
const roleForm = reactive({
  name: '',
  description: ''
})

// 表单规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '角色名称长度在2-50个字符之间', trigger: 'blur' }
  ],
  description: [
    { max: 255, message: '角色描述不能超过255个字符', trigger: 'blur' }
  ]
}

const roleFormRef = ref(null)

// 提交表单
const submitForm = async () => {
  roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await createRole({
          name: roleForm.name,
          description: roleForm.description
        })
        MessageUtil.success('创建角色成功')
        router.push('/dashboard/roles')
      } catch (error) {
        MessageUtil.error('创建角色失败')
        console.error('Failed to create role:', error)
      }
    }
  })
}

// 取消操作
const handleCancel = () => {
  router.push('/dashboard/roles')
}
</script>

<style scoped>
.add-role {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>