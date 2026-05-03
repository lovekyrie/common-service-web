import type { ApiResponse, ListResponseData } from '@/api/index'
import type { Service } from '@/utils/types/service'
import request from '@/utils/request'

/**
 * 管理列表相关API
 */

// 获取管理记录列表
export function queryServiceList(params: Record<string, any> = {}): Promise<ApiResponse<ListResponseData<Service>>> {
  return request.get('/api/services', params)
}
