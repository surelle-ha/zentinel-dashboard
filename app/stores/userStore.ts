import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | Record<string, any>,
    accessToken: null as null | string,
    refreshToken: null as null | string,
    expiresAt: null as null | number,
    isAuthenticated: false
  }),
  actions: {
    setUser(authPayload: Record<string, any>) {
      this.user = authPayload.user
      this.accessToken = authPayload.access_token
      this.refreshToken = authPayload.refresh_token
      this.expiresAt = authPayload.expires_at
      this.isAuthenticated = !!authPayload.user
    },
    getDisplayName() {
      return `${this.user?.first_name} ${this.user?.last_name}` || this.user?.email || 'Something went wrong!';
    },
    getDisplayAvatar() {
      const name = encodeURIComponent(this.getDisplayName())
      return `https://ui-avatars.com/api/?name=${name}&background=random`
    },
    clearUser() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.expiresAt = null
      this.isAuthenticated = false

      return navigateTo('/auth/login')
    },
  },
  persist: true,
})
