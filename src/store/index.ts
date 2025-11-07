import type { UserInfo } from '@/api'
import { defineStore } from 'pinia'
import { loginApi } from '@/api/login'

interface IState {
  userInfo: UserInfo
}
export const useUserStore = defineStore('user', {
  state: (): IState => ({
    userInfo: {
      id: '',
      username: '',
      email: '',
      phone: '',
      avatar: '',
    },
  }),
  actions: {
    async login(username: string, password: string) {
      const userData = await loginApi({ username, password })
      // 存储 token
      localStorage.setItem('token', userData.data.access_token)
      // 存储用户信息
      this.userInfo = userData.data.user as UserInfo
    },
  },
})
