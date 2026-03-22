import type { UserInfo } from '@/api'
import { defineStore } from 'pinia'
import { loginApi } from '@/api/login'

export interface TabItem {
  name: string
  label: string
  path: string
}

interface IState {
  userInfo: UserInfo
  tabs: TabItem[]
  activeTab: string
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
    tabs: [],
    activeTab: '',
  }),
  actions: {
    addTab(tab: TabItem) {
      const exists = this.tabs.some(t => t.name === tab.name)
      if (!exists) {
        this.tabs.push(tab)
      }
      this.activeTab = tab.name
    },
    removeTab(name: string) {
      const index = this.tabs.findIndex(t => t.name === name)
      if (index > -1) {
        this.tabs.splice(index, 1)
        // 如果关闭的是当前激活的 tab，切换到上一个
        if (this.activeTab === name) {
          const newIndex = Math.min(index, this.tabs.length - 1)
          this.activeTab = this.tabs[newIndex]?.name ?? ''
        }
      }
    },

    async login(username: string, password: string) {
      const { data: { access_token, user: userInfo } } = await loginApi({ username, password })
      // 存储 token 到 sessionStorage（关闭浏览器即失效）
      sessionStorage.setItem('token', access_token)
      // 存储用户信息到 sessionStorage
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      // 更新 store
      this.userInfo = userInfo as UserInfo
    },

    // 初始化用户信息（从 sessionStorage 恢复）
    initUserInfo() {
      const userInfoStr = sessionStorage.getItem('userInfo')
      if (userInfoStr) {
        try {
          this.userInfo = JSON.parse(userInfoStr)
        }
        catch (e) {
          console.error('解析用户信息失败', e)
        }
      }
    },

    // 登出
    logout() {
      this.userInfo = {
        id: '',
        username: '',
        email: '',
        phone: '',
        avatar: '',
      }
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
    },
  },
})
