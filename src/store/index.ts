import { defineStore } from 'pinia'

function loginApi(name: string, pwd: string) {
  if (name && pwd)
    return Promise.resolve({ userName: name })
  else if (!name || !pwd)
    return Promise.reject(new Error('invalid credentials'))
}

interface IState {
  userName: string | undefined
}
export const useUserStore = defineStore('user', {
  state: (): IState => ({
    userName: '',
  }),
  actions: {
    async login(user: string, password: string) {
      const userData = await loginApi(user, password)
      this.userName = userData?.userName
    },
  },
})
