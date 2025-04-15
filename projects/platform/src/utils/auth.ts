import { config } from 'vue-gtag'
import { resetTracker } from '@frontier/lib'
import { accessToken, refreshToken } from '@/utils/storage'

export const logout = () => {
  accessToken.value = null
  refreshToken.value = null
  config({
    user_id: null,
  })
  resetTracker()
}

export const redirectAfterLogout = () =>
  window.location.replace('https://frontier.cool/')
