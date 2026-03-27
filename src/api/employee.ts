import type { ApiResponse } from '@/api/index'
import request from '@/utils/request'

// ============ 员工相关类型 ============

// 基础信息
export interface EmployeeBasic {
  name: string
  gender?: string
  birthday?: string
  nation?: string
  idCard?: string
  maritalStatus?: string
  politicalStatus?: string
  birthPlace?: string
  household?: string
  bloodType?: string
  height?: string
  weight?: string
  healthStatus?: string
  phone?: string
  email?: string
  emergencyContact?: string
  emergencyPhone?: string
}

// 岗位信息
export interface EmployeeJob {
  employeeNo?: string
  department?: string
  position?: string
  jobLevel?: string
  employmentType?: string
  entryDate?: string
  workLocation?: string
  workProvince?: string
  workCity?: string
}

// 薪酬信息
export interface EmployeePayroll {
  salaryType?: string
  salaryCardBank?: string
  salaryCardNo?: string
  salaryCardName?: string
  socialSecurityNo?: string
  providentFundNo?: string
  taxType?: string
}

// 合同信息
export interface EmployeeContract {
  contractType?: string
  contractStart?: string
  contractEnd?: string
  contractPeriod?: string
  signingTimes?: string
  firstContractDate?: string
  probationPeriod?: string
  probationEndDate?: string
}

// 教育经历
export interface EmployeeEducation {
  school?: string
  major?: string
  degree?: string
  startDate?: string
  endDate?: string
}

// 工作经历
export interface EmployeeWorkExperience {
  company?: string
  position?: string
  startDate?: string
  endDate?: string
  leavingReason?: string
}

// 家庭信息
export interface EmployeeFamily {
  name?: string
  relation?: string
  phone?: string
  company?: string
}

// 附件信息
export interface EmployeeAttachments {
  idCardFront?: string
  idCardBack?: string
  degreeCert?: string
  graduationCert?: string
  healthCert?: string
  photos?: string[]
}

// 自定义字段
export interface EmployeeCustomFields {
  customField1?: string
  customField2?: string
  customField3?: string
}

// 完整员工创建 DTO
export interface CreateEmployeeDto {
  basic: EmployeeBasic
  job: EmployeeJob
  payroll: EmployeePayroll
  contract: EmployeeContract
  education: EmployeeEducation[]
  workExperience: EmployeeWorkExperience[]
  family: EmployeeFamily[]
  attachments: EmployeeAttachments
  customFields: EmployeeCustomFields
}

// 员工列表查询参数
export interface QueryEmployeeParams {
  name?: string
  employeeNo?: string
  department?: string
  position?: string
  employmentType?: string
  entryDateStart?: string
  entryDateEnd?: string
  page?: number
  limit?: number
}

// 员工列表项
export interface EmployeeListItem extends CreateEmployeeDto {
  id: number
  status: string
  created_at: string
  updated_at: string
}

// 员工列表响应
export type EmployeeListResponse = ApiResponse<{ total: number, list: EmployeeListItem[] }>

// ============ API 方法 ============

// 创建员工
export function createEmployee(data: CreateEmployeeDto): Promise<ApiResponse<EmployeeListItem>> {
  return request.post('/api/employee', data)
}

// 获取员工列表
export function getEmployeeList(params: QueryEmployeeParams): Promise<EmployeeListResponse> {
  return request.get('/api/employee', params)
}

// 获取单个员工
export function getEmployee(id: number): Promise<ApiResponse<EmployeeListItem>> {
  return request.get(`/api/employee/${id}`)
}

// 更新员工
export function updateEmployee(id: number, data: Partial<CreateEmployeeDto>): Promise<ApiResponse<EmployeeListItem>> {
  return request.patch(`/api/employee/${id}`, data)
}

// 删除员工
export function deleteEmployee(id: number): Promise<ApiResponse<void>> {
  return request.delete(`/api/employee/${id}`)
}

// 批量删除员工
export function batchDeleteEmployees(ids: number[]): Promise<ApiResponse<void>> {
  return request.delete('/api/employee/batch/delete', { ids })
}
