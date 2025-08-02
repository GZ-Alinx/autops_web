import request from '../utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} [data.phone] - 电话
 * @param {string} [data.nickname] - 昵称
 * @returns {Promise}
 */
export function register(data) {
  return request({
    url: '/users/register',
    method: 'POST',
    data
  })
}

/**
 * 获取用户详情
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export function getUserDetail(id) {
  return request({
    url: `/users/${id}`,
    method: 'GET'
  })
}

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {Object} data - 更新参数
 * @param {string} [data.email] - 邮箱
 * @param {string} [data.phone] - 电话
 * @param {string} [data.nickname] - 昵称
 * @param {string} [data.avatar] - 头像URL
 * @param {number} [data.status] - 状态(0或1)
 * @returns {Promise}
 */
export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'DELETE'
  })
}

/**
 * 修改密码
 * @param {number} id - 用户ID
 * @param {Object} data - 密码参数
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 * @returns {Promise}
 */
export function changePassword(id, data) {
  return request({
    url: `/users/${id}/password`,
    method: 'PUT',
    data
  })
}

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=10] - 每页数量
 * @returns {Promise}
 */
export function getUserList(params) {
  return request({
    url: '/users/',
    method: 'GET',
    params
  })
}

/**
 * 添加用户
 * @param {Object} data - 用户数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @param {string} [data.phone] - 电话
 * @param {string} [data.nickname] - 昵称
 * @param {number} [data.status] - 状态(0或1)
 * @returns {Promise}
 */
export function addUser(data) {
  return request({
    url: '/users/register',
    method: 'POST',
    data
  })
}