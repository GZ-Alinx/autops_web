import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 消息提示工具类
 * 封装Element Plus的ElMessage和ElMessageBox组件
 * 提供统一的消息提示接口，避免重复代码
 */
const MessageUtil = {
  /**
   * 成功消息
   * @param {string} message - 消息内容
   * @param {Object} options - 可选配置
   */
  success(message, options = {}) {
    return ElMessage({
      message,
      type: 'success',
      ...options
    })
  },

  /**
   * 警告消息
   * @param {string} message - 消息内容
   * @param {Object} options - 可选配置
   */
  warning(message, options = {}) {
    return ElMessage({
      message,
      type: 'warning',
      ...options
    })
  },

  /**
   * 错误消息
   * @param {string} message - 消息内容
   * @param {Object} options - 可选配置
   */
  error(message, options = {}) {
    return ElMessage({
      message,
      type: 'error',
      ...options
    })
  },

  /**
   * 信息消息
   * @param {string} message - 消息内容
   * @param {Object} options - 可选配置
   */
  info(message, options = {}) {
    return ElMessage({
      message,
      type: 'info',
      ...options
    })
  },

  /**
   * 确认对话框
   * @param {string} message - 消息内容
   * @param {string} title - 标题
   * @param {Object} options - 可选配置
   * @returns {Promise} - 返回Promise，resolve表示确认，reject表示取消
   */
  confirm(message, title = '确认', options = {}) {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      ...options
    })
  },

  /**
   * 封装API错误处理
   * @param {Error} error - 错误对象
   * @param {string} defaultMessage - 默认错误消息
   * @returns {string} - 返回处理后的错误消息
   */
  handleApiError(error, defaultMessage = '操作失败') {
    const errorMessage = error.message || defaultMessage
    this.error(errorMessage)
    console.error(error)
    return errorMessage
  },

  /**
   * 处理常见操作结果的消息提示
   * @param {boolean|Promise} result - 操作结果或Promise
   * @param {string} successMessage - 成功消息
   * @param {string} errorMessage - 失败消息
   * @returns {Promise} - 返回处理后的Promise
   */
  async handleOperationResult(result, successMessage, errorMessage) {
    try {
      const data = await result
      this.success(successMessage)
      return data
    } catch (error) {
      return this.handleApiError(error, errorMessage)
    }
  }
}

export default MessageUtil