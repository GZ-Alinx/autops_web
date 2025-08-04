<template>
  <div class="edit-role">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>编辑角色</span>
        </div>
      </template>
      <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" type="textarea" placeholder="请输入角色描述"></el-input>
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
import { ref, reactive, onMounted } from 'vue'
import MessageUtil from '../utils/message.js'
import { useRouter, useRoute } from 'vue-router'
import { getRoleDetail, updateRole } from '../api/role'

const router = useRouter()
const route = useRoute()
// 确保角色ID是数字类型
const roleId = Number(route.params.id)

// 角色表单数据
const roleForm = reactive({
    ID: '',
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

// 获取角色详情
const getRoleInfo = async () => {
  try {
    const res = await getRoleDetail(roleId)
    // 始终使用路由参数中的roleId作为更新时的ID
    roleForm.ID = roleId
    roleForm.name = res.data.name
    roleForm.description = res.data.description || ''
  } catch (error) {
    MessageUtil.error('获取角色详情失败')
    console.error('Failed to get role detail:', error)
    router.push('/dashboard/roles')
  }
}

// 提交表单
const submitForm = async () => {
  roleFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
          // 构造完整的角色数据对象，确保与API要求的字段结构匹配
          const roleData = { ID: roleForm.ID, name: roleForm.name, description: roleForm.description }
          console.log('更新角色参数:', roleData)
          const response = await updateRole(roleData)
          console.log('更新角色响应:', response)
          MessageUtil.success('更新角色成功')
          router.push('/dashboard/roles')
        } catch (error) {
          // 输出详细错误信息
          console.error('Failed to update role:', error);
          console.error('错误状态:', error.response?.status);
          console.error('错误URL:', error.config?.url);
          console.error('错误请求参数:', error.config?.data);
          console.error('错误响应数据:', error.response?.data);
          
          // 根据错误类型显示不同的提示
          let errorMessage = '更新角色失败';
          if (error.response && error.response.status === 404) {
            errorMessage = `未找到该角色(ID: ${roleId})，请确认角色ID是否存在`;
          } else if (error.response && error.response.status === 400) {
            errorMessage = '请求参数错误: ' + (error.response.data.message || '无效的请求');
          } else if (error.message === '无效的角色ID') {
            errorMessage = `无效的角色ID: ${roleId}`;
          } else if (error.response) {
            errorMessage += ': ' + (error.response.data.message || error.message);
          }
          
          MessageUtil.error(errorMessage)
      }
    }
  })
}

// 取消操作
const handleCancel = () => {
  router.push('/dashboard/roles')
}

// 页面挂载时获取角色详情
onMounted(() => {
  getRoleInfo()
})
</script>

<style scoped>
.edit-role {
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