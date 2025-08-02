import request from '../utils/request'

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
 * 添加权限策略
 * @param {Object} data - 请求参数
 * @param {string} data.role - 角色名称
 * @param {string} data.path - 资源路径
 * @param {string} data.method - HTTP方法 (GET, POST, PUT, DELETE, PATCH之一)
 * @returns {Promise}
 */
export function addPermissionPolicy(data) {
  return request({
    url: '/permissions/policy',
    method: 'POST',
    data
  })
}

/**
 * 删除权限策略
 * @param {Object} data - 请求参数
 * @param {string} data.role - 角色名称
 * @param {string} data.path - 资源路径
 * @param {string} data.method - HTTP方法
 * @returns {Promise}
 */
export function deletePermissionPolicy(data) {
  return request({
    url: '/permissions/policy',
    method: 'DELETE',
    data
  })
}

/**
 * 获取所有权限策略
 * @returns {Promise}
 */
export function getAllPermissionPolicies() {
  return request({
    url: '/permissions/policies',
    method: 'GET'
  })
}

/**
 * 获取权限列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @returns {Promise}
 */
export function getPermissions(params) {
  return request({
    url: '/permissions',
    method: 'GET',
    params
  })
}