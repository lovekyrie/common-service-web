import type { ApiResponse, ListResponseData } from '@/api/index'
import request from '@/utils/request'

/**
 * 部门信息
 */
export interface Department {
  id: number | string
  name: string
  code?: string
  parent_id?: number | string | null
  leader?: string
  phone?: string
  sort?: number
  status?: number
  children?: Department[]
  created_at?: string
  updated_at?: string
}

export interface CreateDepartmentInput {
  name: string
  code?: string
  parent_id?: number | string | null
  leader?: string
  phone?: string
  sort?: number
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  status?: number
}

/**
 * 部门管理相关API
 */
export const departmentApi = {
  // 获取部门列表(树形)
  getDepartmentList(params: Record<string, any> = {}): Promise<ApiResponse<ListResponseData<Department>>> {
    return request.get('/api/department', params)
  },

  // 获取单个部门
  getDepartment(id: number | string): Promise<ApiResponse<Department>> {
    return request.get(`/api/department/${id}`)
  },

  // 创建部门
  createDepartment(data: CreateDepartmentInput): Promise<ApiResponse<Department>> {
    return request.post('/api/department', data)
  },

  // 更新部门
  updateDepartment(id: number | string, data: UpdateDepartmentInput): Promise<ApiResponse<Department>> {
    return request.patch(`/api/department/${id}`, data)
  },

  // 删除部门
  deleteDepartment(id: number | string): Promise<ApiResponse<void>> {
    return request.delete(`/api/department/${id}`)
  },

  // 批量删除部门
  batchDeleteDepartment(ids: (number | string)[]): Promise<ApiResponse<void>> {
    return request.delete('/api/department/batch/delete', { ids })
  },
}
