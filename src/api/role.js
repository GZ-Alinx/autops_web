import request from '../utils/request'

/**
 * 创建角色
 * @param {Object} data - 角色参数
 * @param {string} data.name - 角色名称
 * @param {string} [data.description] - 角色描述
 * @returns {Promise}
 */
export function createRole(data) {
  return request({
    url: '/roles/',
    method: 'POST',
    data
  })
}

/**
 * 获取角色列表
 * @returns {Promise}
 */
export function getRoles() {
  return request({
    url: '/roles/',
    method: 'GET'
  })
}

/**
 * 获取角色详情
 * @param {number} id - 角色ID
 * @returns {Promise}
 */
export function getRoleDetail(id) {
  return request({
    url: `/roles/${id}`,
    method: 'GET'
  })
}

/**
 * 更新角色
 * @param {number} id - 角色ID
 * @param {Object} data - 更新参数
 * @param {string} [data.name] - 角色名称
 * @param {string} [data.description] - 角色描述
 * @returns {Promise}
 */
export function updateRole(id, data) {
  // 确保请求体中包含ID字段
  return request({
    url: `/roles/${id}`,
    method: 'PUT',
    data: {
      ID: id,
      ...data
    }
  })
}

/**
 * 删除角色
 * @param {number} id - 角色ID
 * @returns {Promise}
 */
export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'DELETE'
  })
}