import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default function useNavigation () {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const nextAfterSignIn = async () => {
    if (route.query.inviteCode !== undefined) {
      return router.push({ path: '/invite-link', query: route.query })
    }
    await store.dispatch('user/getUser')
    const organizationList = store.getters['user/organizationList']

    if (organizationList.length === 1) {
      return router.push({ name: 'PublicLibrary', params: { orgNo: organizationList[0].orgNo } })
    }

    router.push('/')
  }

  return {
    nextAfterSignIn
  }
}
