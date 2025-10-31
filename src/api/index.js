import request from '../utils/request'

/**
 * 记账管理相关API
 */
export const accountingApi = {
  // 获取记账记录列表
  getAccountingList(params = {}) {
    return request.get('/api/accounting', params)
  },

  // 创建记账记录
  createAccounting(data) {
    return request.post('/api/accounting', data)
  },

  // 更新记账记录
  updateAccounting(id, data) {
    return request.put(`/api/accounting/${id}`, data)
  },

  // 删除记账记录
  deleteAccounting(id) {
    return request.delete(`/api/accounting/${id}`)
  },

  // 获取记账统计信息
  getAccountingStats(params = {}) {
    return request.get('/api/accounting/stats', params)
  },
}

/**
 * 费用类型管理相关API
 */
export const expenseTypeApi = {
  // 获取费用类型列表
  getExpenseTypeList(params = {}) {
    return request.get('/api/expense-types', params)
  },

  // 创建费用类型
  createExpenseType(data) {
    return request.post('/api/expense-types', data)
  },

  // 更新费用类型
  updateExpenseType(id, data) {
    return request.put(`/api/expense-types/${id}`, data)
  },

  // 删除费用类型
  deleteExpenseType(id) {
    return request.delete(`/api/expense-types/${id}`)
  },
}

/**
 * 用户认证相关API
 */
export const authApi = {
  // 用户登录
  login(data) {
    return request.post('/api/auth/login', data)
  },

  // 用户注册
  register(data) {
    return request.post('/api/auth/register', data)
  },

  // 获取用户信息
  getUserInfo() {
    return request.get('/api/auth/user')
  },

  // 刷新token
  refreshToken() {
    return request.post('/api/auth/refresh')
  },

  // 用户登出
  logout() {
    return request.post('/api/auth/logout')
  },
}

/**
 * 文件上传相关API
 */
export const uploadApi = {
  // 上传单个文件
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload('/api/upload', formData)
  },

  // 上传多个文件
  uploadFiles(files) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return request.upload('/api/upload/multiple', formData)
  },
}

// 默认导出所有API
export default {
  accounting: accountingApi,
  expenseType: expenseTypeApi,
  auth: authApi,
  upload: uploadApi,
}
