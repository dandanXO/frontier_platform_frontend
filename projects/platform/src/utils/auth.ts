import { config } from 'vue-gtag'
import { resetTracker } from '@frontier/lib'

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  config({
    user_id: null,
  })
  resetTracker()
}

export const redirectAfterLogout = () =>
  window.location.replace('https://frontier.cool/')
