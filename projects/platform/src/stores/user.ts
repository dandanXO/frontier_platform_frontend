import { defineStore } from 'pinia'
import { ref } from 'vue'
import generalApi from '@/apis/general'
import { useStore } from 'vuex'
import { accessToken } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const store = useStore()

  const hasLogin = ref(false)
  const checkHasLogin = async () => {
    if (!accessToken.value) {
      hasLogin.value = false
      return
    }
    const { data } = await generalApi.checkTokenStatus({
      accessToken: accessToken.value,
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
