import request from '../utils/request'

/**
 * API 响应类型
 */
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

/**
 * 记账记录类型（从服务器返回）
 */
interface AccountingRecord {
  id: number | string
  type: 'income' | 'expense'
  amount: string
  category: string
  description?: string
  transaction_date: string
  payment_method: string
  created_at?: string
  updated_at?: string
}

/**
 * 创建/更新记账记录请求类型（amount 为 number）
 */
interface CreateAccountingInput {
  id?: number | string
  type: 'income' | 'expense'
  amount: number // 创建/更新时需要传数字
  category: string
  description?: string
  transaction_date: string
  payment_method: string
  created_at?: string
  updated_at?: string
}

/**
 * 记账管理相关API
 */

// 获取记账记录列表
export function queryAccountingList(params: Record<string, any> = {}): Promise<ApiResponse<AccountingRecord[]>> {
  return request.get('/api/accounting', params)
}

// 创建记账记录
export function createAccounting(data: Partial<CreateAccountingInput>): Promise<ApiResponse<AccountingRecord>> {
  return request.post('/api/accounting', data)
}

// 更新记账记录
export function updateAccounting(id: number | string, data: Partial<CreateAccountingInput>): Promise<ApiResponse<AccountingRecord>> {
  return request.put(`/api/accounting/${id}`, data)
}

// 删除记账记录
export function deleteAccounting(id: number | string): Promise<ApiResponse<void>> {
  return request.delete(`/api/accounting/${id}`)
}

// 获取记账统计信息
export function getAccountingStats(params: Record<string, any> = {}): Promise<ApiResponse<any>> {
  return request.get('/api/accounting/stats', params)
}

/**
 * 费用类型
 */
interface ExpenseType {
  id: number | string
  name: string
  description?: string
  code?: string
  parent_id?: number | string
  created_at?: string
  updated_at?: string
}

/**
 * 费用类型管理相关API
 */
export const expenseTypeApi = {
  // 获取费用类型列表
  getExpenseTypeList(params: Record<string, any> = {}): Promise<ApiResponse<ExpenseType[]>> {
    return request.get('/api/expense-types', params)
  },

  // 创建费用类型
  createExpenseType(data: Partial<ExpenseType>): Promise<ApiResponse<ExpenseType>> {
    return request.post('/api/expense-types', data)
  },

  // 更新费用类型
  updateExpenseType(id: number | string, data: Partial<ExpenseType>): Promise<ApiResponse<ExpenseType>> {
    return request.put(`/api/expense-types/${id}`, data)
  },

  // 删除费用类型
  deleteExpenseType(id: number | string): Promise<ApiResponse<void>> {
    return request.delete(`/api/expense-types/${id}`)
  },
}

/**
 * 用户登录/注册数据类型
 */
interface LoginData {
  username: string
  password: string
}

interface RegisterData extends LoginData {
  email?: string
  phone?: string
}

/**
 * 用户信息
 */
interface UserInfo {
  id: number | string
  username: string
  email?: string
  phone?: string
  avatar?: string
}

/**
 * 用户认证相关API
 */
export const authApi = {
  // 用户登录
  login(data: LoginData): Promise<ApiResponse<{ token: string, user: UserInfo }>> {
    return request.post('/api/auth/login', data)
  },

  // 用户注册
  register(data: RegisterData): Promise<ApiResponse<UserInfo>> {
    return request.post('/api/auth/register', data)
  },

  // 获取用户信息
  getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return request.get('/api/auth/user')
  },

  // 刷新token
  refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return request.post('/api/auth/refresh')
  },

  // 用户登出
  logout(): Promise<ApiResponse<void>> {
    return request.post('/api/auth/logout')
  },
}

/**
 * 文件上传响应
 */
interface UploadResponse {
  url: string
  filename: string
  size: number
}

/**
 * 文件上传相关API
 */
export const uploadApi = {
  // 上传单个文件
  uploadFile(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload('/api/upload', formData)
  },

  // 上传多个文件
  uploadFiles(files: File[]): Promise<ApiResponse<UploadResponse[]>> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    return request.upload('/api/upload/multiple', formData)
  },
}

// 导出类型
export type { AccountingRecord, ApiResponse, CreateAccountingInput, ExpenseType, LoginData, RegisterData, UploadResponse, UserInfo }

// 默认导出所有API
export default {
  expenseType: expenseTypeApi,
  auth: authApi,
  upload: uploadApi,
}
