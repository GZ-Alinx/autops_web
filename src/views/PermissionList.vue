<template>
  <div class="permission-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon><Lock /></el-icon>
          <span>权限管理</span>
          <el-button type="primary" size="small" class="add-permission-btn" @click="handleAddPermission">
            <el-icon><Plus /></el-icon> 新增权限
          </el-button>
        </div>
      </template>
      <el-table :data="permissions" style="width: 100%">
        <el-table-column prop="description" label="权限描述" width="450" />
        <el-table-column prop="resource" label="资源路径" width="250" />
        <el-table-column prop="action" label="HTTP方法" width="120" />
        <el-table-column prop="roles" label="已对接角色" width="300">
          <template #default="scope">
            <span v-for="(role, index) in scope.row.roles" :key="role.id">
              {{ role.name }}{{ index < scope.row.roles.length - 1 ? ', ' : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑权限模态框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="permissionForm" :rules="rules" ref="permissionFormRef" label-width="100px">
        <el-form-item label="权限ID" prop="id" v-if="dialogType === 'view'">
          <el-input v-model="permissionForm.id" placeholder="权限ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="describe">
          <el-input v-model="permissionForm.describe" placeholder="请输入权限描述" :disabled="dialogType === 'view'" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="resource">
          <el-input v-model="permissionForm.resource" placeholder="请输入资源路径" :disabled="dialogType === 'view'"></el-input>
        </el-form-item>
        <el-form-item label="HTTP方法" prop="action">
          <el-select v-model="permissionForm.action" placeholder="请选择HTTP方法" :disabled="dialogType === 'view'">
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
          <el-button type="primary" @click="submitForm" v-if="dialogType === 'add'">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import MessageUtil from '../utils/message.js'
import { Plus, Lock } from '@element-plus/icons-vue'
import { getPermissions, addPermission, updateUserRole, deletePermission } from '../api/permission'

// 权限列表数据
const permissions = ref([])

// 模态框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增权限')
const dialogType = ref('add') // add, view
const permissionForm = reactive({
  id: '',
  resource: '',
  action: '',
  description: ''
})
const rules = {
  resource: [
    { required: true, message: '请输入资源路径', trigger: 'blur' }
  ],
  action: [
    { required: true, message: '请选择HTTP方法', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入权限描述', trigger: 'blur' }
  ]
}
const permissionFormRef = ref(null)

// 获取权限列表
const getPermissionList = async () => {
  try {
    const res = await getPermissions()
    // 直接使用API返回的对象数组
    permissions.value = res.data.map(permission => {
      // 检查describe字段是否存在，如果不存在，使用'无描述'
      const desc = permission.description || '无描述';
      return {
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        description: desc,
        roles: permission.roles,
        created_at: permission.created_at,
        updated_at: permission.updated_at
      }
    })
  } catch (error) {
    handleError(error, '获取权限列表失败')
  }
}

// 统一错误处理函数
const handleError = (error, defaultMessage) => {
    if (error.response && error.response.status === 403) {
      MessageUtil.warning('没有操作权限')
    } else {
      MessageUtil.error(defaultMessage)
      console.error(defaultMessage + ':', error)
    }
    return Promise.reject(error)
  }

// 新增权限
const handleAddPermission = () => {
  dialogTitle.value = '新增权限'
  dialogType.value = 'add'
  // 重置表单
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields()
  }
  permissionForm.resource = ''
  permissionForm.action = ''
  permissionForm.description = ''
  dialogVisible.value = true
}

// 查看权限详情
const handleView = (row) => {
  dialogTitle.value = '权限详情'
  dialogType.value = 'view'
  permissionForm.id = row.id
  permissionForm.resource = row.resource
  permissionForm.action = row.action
  permissionForm.description = row.description
  dialogVisible.value = true
}

// 删除权限
const handleDelete = async (row) => {
  try {
    // 直接调用删除权限API，让后端处理复杂的关联关系
    const deleteData = {
        path: row.resource,
        method: row.action,
        description: row.description
      };
    console.log('删除权限请求参数:', deleteData);
    const response = await deletePermission(deleteData);
    console.log('删除权限响应结果:', response);
    MessageUtil.success('删除权限成功');
    getPermissionList();
  } catch (error) {
    console.error('删除权限失败详细信息:', error);
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误响应数据:', error.response.data);
    }
    handleError(error, '删除权限失败')
  }
}

// 测试删除权限的函数
window.testDeletePermission = async (path, method, description) => {
  try {
    const testData = {
      describe: description || '测试权限',
      path: path || '/api/v1/test/*',
      method: method || 'GET'
    };
    console.log('测试删除权限参数:', testData);
    await deletePermission(testData);
    MessageUtil.success('测试权限删除成功');
    getPermissionList();
  } catch (error) {
    handleError(error, '测试权限删除失败');
  }
}

// 测试删除权限函数 - 使用最新参数格式
window.testDeletePermissionV2 = async function(description = '测试权限', path = '/api/v1/users/*', method = 'POST') {
  try {
    console.log('测试删除权限参数:', { description, path, method });
    const response = await deletePermission({
      description,
      path,
      method
    });
    console.log('删除权限成功:', response);
    MessageUtil.success('删除权限成功');
    // 刷新权限列表
    getPermissionList();
  } catch (error) {
    console.error('删除权限失败:', error);
    MessageUtil.error(`删除权限失败: ${error.message || '未知错误'}`);
  }
};

// 提交表单
const submitForm = async () => {
  // 添加调试日志，查看表单验证状态
  console.log('表单验证前数据:', permissionForm)
  permissionFormRef.value.validate(async (valid) => {
    console.log('表单验证结果:', valid)
    if (valid) {
      try {
        // 确保 describe 字段存在且不为空字符串
        const description = permissionForm.describe || '无描述';
        // 添加日志以调试请求参数
        const requestData = {
          path: permissionForm.resource,
          method: permissionForm.action,
          description
        }
        console.log('添加权限请求参数:', requestData)
        await addPermission(requestData)
        MessageUtil.success('添加权限成功')
        dialogVisible.value = false
        getPermissionList()
      } catch (error) {
        handleError(error, '添加权限失败')
      }
    }
  })
}

// 页面挂载时获取权限列表
onMounted(() => {
  getPermissionList()
})

</script>

<style scoped>
.permission-list {
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