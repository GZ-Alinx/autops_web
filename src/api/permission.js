import request from '../utils/request'

/**
 * 获取所有权限策略
 * @returns {Promise}
 */
export function getPermissions() {
  return request({
    url: '/permissions/policies',
    method: 'GET'
  })
}

/**
 * 添加权限策略
 * @param {Object} data - 权限策略数据
 * @param {string} data.description - 权限描述 (必填)
 * @param {string} data.path - 资源路径 (必填)
 * @param {string} data.method - HTTP方法 (必填，只能是GET, POST, PUT, DELETE, PATCH之一)
 * @returns {Promise}
 */
export function addPermission(data) {
  return request({
    url: '/permissions/policy',
    method: 'POST',
    data
  })
}

/**
 * 删除权限策略
 * @param {Object} data - 请求参数
 * @param {string} [data.describe] - 权限描述
 * @param {string} [data.path] - 资源路径
 * @param {string} [data.method] - HTTP方法 
 * @returns {Promise}
 */
export function deletePermission(data) {
  return request({
    url: '/permissions/policy',
    method: 'DELETE',
    data
  })
} 

/**
 * 更新用户角色
 * @param {Object} data - 请求参数
 * @param {number} data.user_id - 用户ID
 * @param {string[]} data.roles - 角色名称列表
 * @returns {Promise}
 */
export function updateUserRole(data) {
  return request({
    url: '/permissions/user-role',
    method: 'PUT',
    data
  })
}

/**
 * 添加角色权限关联
 * @param {Object} data - 请求参数
 * @param {number} data.role_id - 角色ID
 * @param {number} data.permission_id - 权限ID
 * @returns {Promise}
 */
export function addRolePermission(data) {
  return request({
    url: '/permissions/role-permission',
    method: 'POST',
    data
  })
}

/**
 * 删除角色权限关联
 * @param {Object} data - 请求参数
 * @param {number} data.role_id - 角色ID
 * @param {number} data.permission_id - 权限ID
 * @returns {Promise}
 */
export function deleteRolePermission(data) {
  return request({
    url: '/permissions/role-permission',
    method: 'DELETE',
    data
  })
}