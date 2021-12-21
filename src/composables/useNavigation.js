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

    if (route.query.verifyCode !== undefined) {
      return router.push({ path: '/verify-user', query: route.query })
    }

    await store.dispatch('user/getUser')

    const user = store.getters['user/user']

    if (!user.isVerify) {
      return goToLobby()
    }

    const organizationList = user.organizationList
    if (organizationList.length === 1) {
      return router.push({ name: 'PublicLibrary', params: { orgNo: organizationList[0].orgNo } })
    }

    goToLobby()
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

  const goToLobby = () => { router.push('/') }

  const goToAssets = async () => {
    await router.push(parsePath(`${prefixPath.value}/assets`))
  }

  const goToMaterialUpload = () => {
    router.push(parsePath(`${prefixPath.value}/assets/upload`))
  }

  const goToAssetMaterialDetail = (material) => {
    router.push(parsePath(`${prefixPath.value}/assets/${material.materialId}`))
  }

  const goToAssetMaterialEdit = (material) => {
    router.push(parsePath(`${prefixPath.value}/assets/${material.materialId}/edit`))
  }

  const goToOrgAssetMaterialEdit = (materialId) => {
    router.push(parsePath(`/:orgNo/assets/${materialId}/edit`))
  }
  const goToGroupAssetMaterialEdit = (materialId) => {
    router.push(parsePath(`/:orgNo/:groupId/assets/${materialId}/edit`))
  }

  const goToAssetsMaterialCreate = () => {
    router.push(parsePath(`${prefixPath.value}/assets/upload/manual`))
  }

  const goToAssetsMaterialMerge = () => {
    router.push(parsePath(`${prefixPath.value}/assets/merge`))
  }

  const goToAssetsMaterialMergePreview = () => {
    router.push(parsePath(`${prefixPath.value}/assets/merge/preview`))
  }

  const goToAssetsMaterialRecutImage = () => {
    router.push(parsePath(`${prefixPath.value}/assets/recut-image`))
  }

  const goToWorkspaceMaterialDetail = (nodeKey) => {
    router.push(parsePath(`${prefixPath.value}/workspace/${nodeKey}`))
  }

  const goToPublicLibraryMaterialDetail = (nodeKey) => {
    router.push(parsePath(`/:orgNo/public-library/${nodeKey}`))
  }

  return {
    nextAfterSignIn,
    parsePath,
    goToAssets,
    goToMaterialUpload,
    goToAssetMaterialDetail,
    goToAssetsMaterialCreate,
    goToAssetMaterialEdit,
    goToAssetsMaterialMerge,
    goToAssetsMaterialMergePreview,
    goToAssetsMaterialRecutImage,
    goToWorkspaceMaterialDetail,
    goToPublicLibraryMaterialDetail,
    goToOrgAssetMaterialEdit,
    goToGroupAssetMaterialEdit
  }
}
