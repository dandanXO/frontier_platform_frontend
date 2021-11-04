import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { inject } from 'vue'

export default function useNavigation () {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const reloadRootRoute = inject('reloadRootRoute')

  const location = computed(() => Object.prototype.hasOwnProperty.call(route.params, 'groupId') ? 'group' : 'org')

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

  const parsePath = (path) => {
    let temp = path
    Object.keys(route.params).forEach(key => {
      const regex = new RegExp(':' + key)
      temp = temp.replace(regex, route.params[key])
    })
    temp = temp.replace(/\(\\d\+\)/, '')
    return temp
  }

  const prefixPath = computed(() => location.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId')

  const goToAssets = () => {
    router.push(parsePath(`${prefixPath.value}/assets`))
    reloadRootRoute()
  }

  const goToMaterialUpload = () => {
    router.push(parsePath(`${prefixPath.value}/assets/upload`))
  }

  return {
    location,
    nextAfterSignIn,
    parsePath,
    goToAssets,
    goToMaterialUpload
  }
}
