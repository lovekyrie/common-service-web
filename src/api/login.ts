import type { LoginResponse } from '@/api/index'
import type { LoginParams } from '@/utils/types/user'

import request from '@/utils/request'

// 登录
export function loginApi(data: LoginParams): Promise<LoginResponse> {
  return request.post('/api/auth/login', data)
}
