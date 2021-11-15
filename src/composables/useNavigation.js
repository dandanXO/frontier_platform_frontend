import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default function useNavigation () {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const routeLocation = computed(() => store.getters['helper/routeLocation'])
  const prefixPath = computed(() => routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId')

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

  const goToAssets = () => {
    router.push(parsePath(`${prefixPath.value}/assets`))
  }

  const goToMaterialUpload = () => {
    router.push(parsePath(`${prefixPath.value}/assets/upload`))
  }

  const goToAssetMaterialDetail = (material) => {
    store.dispatch('material/setMaterial', material)
    router.push(parsePath(`${prefixPath.value}/assets/${material.materialId}`))
  }

  const goToAssetMaterialEdit = (material) => {
    store.dispatch('material/setMaterial', material)
    router.push(parsePath(`${prefixPath.value}/assets/${material.materialId}/edit`))
  }

  const goToAssetsMaterialCreate = () => {
    router.push(parsePath(`${prefixPath.value}/assets/upload/manual`))
  }

  return {
    nextAfterSignIn,
    parsePath,
    goToAssets,
    goToMaterialUpload,
    goToAssetMaterialDetail,
    goToAssetsMaterialCreate,
    goToAssetMaterialEdit
  }
}
