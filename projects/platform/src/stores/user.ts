import { defineStore } from 'pinia'
import { ref } from 'vue'
import generalApi from '@/apis/general'
import { useStore } from 'vuex'

export const useUserStore = defineStore('user', () => {
  const store = useStore()

  const hasLogin = ref(false)
  const checkHasLogin = async () => {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      hasLogin.value = false
      return
    }

    const { data } = await generalApi.checkTokenStatus({
      accessToken,
    })
    hasLogin.value = data.result.status !== 1

    if (hasLogin.value) {
      await store.dispatch('user/getUser')
    }
  }

  return {
    hasLogin,
    checkHasLogin,
  }
})
