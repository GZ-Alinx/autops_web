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
 * @param {string} data.role - 角色名称 (必填)
 * @param {string} data.path - 资源路径 (必填)
 * @param {string} data.method - HTTP方法 (必填，只能是GET, POST, PUT, DELETE, PATCH之一)
 * @param {string} data.description - 权限描述 (可选)
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
 * @param {string} [data.id] - 权限ID (与role、path、method三选一)
 * @param {string} [data.role] - 角色名称 (与id二选一，需配合path和method使用)
 * @param {string} [data.path] - 资源路径 (与id二选一，需配合role和method使用)
 * @param {string} [data.method] - HTTP方法 (与id二选一，需配合role和path使用)
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