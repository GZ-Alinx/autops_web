import request from '../utils/request'

/**
 * 创建角色
 * @param {Object} data - 角色参数
 * @param {string} data.name - 角色名称
 * @param {string} [data.description] - 角色描述
 * @returns {Promise}
 */
export function createRole(data) {
  console.log('创建角色参数:', data)
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
  // 确保id是数字类型
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return Promise.reject(new Error('无效的角色ID'));
  }
  
  return request({
    url: `/roles/${numericId}`,
    method: 'GET'
  })
}

/**
 * 更新角色
 * @param {Object} data - 更新参数
 * @param {number} [data.ID] - 角色ID
 * @param {string} [data.name] - 角色名称
 * @param {string} [data.description] - 角色描述
 * @returns {Promise}
 */
export function updateRole(data) {
  // 确保id是数字类型
  if (isNaN(data.ID)) {
    console.error('无效的角色ID:', id);
    return Promise.reject(new Error('无效的角色ID'));
  }
  
  const requestData = {
    ...data
  };
  
  console.log('updateRole - data:', data);
  console.log('updateRole - 请求数据:', requestData);
  
  // 确保请求体中包含ID字段
  return request({
    url: `/roles/`,
    method: 'PUT',
    data: requestData
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