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
    if (route.query.redirect !== undefined) {
      return router.push(route.query.redirect)
    }

    await store.dispatch('user/getUser')

    const user = store.getters['user/user']
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

  const goToBillings = () => {
    router.push(parsePath('/:orgNo/billings/plan'))
  }

  const goToProgress = (tabName = 'material') => {
    router.push(parsePath(`${prefixPath.value}/progress/${tabName}`))
  }

  const goToPaymentDetail = () => {
    router.push(parsePath('/:orgNo/billings/payment'))
  }

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

  const goToWorkspaceMaterialDetail = (nodeKey) => {
    router.push(parsePath(`${prefixPath.value}/workspace/material/${nodeKey}`))
  }

  const goToPublicLibraryMaterialDetail = (nodeKey) => {
    router.push(parsePath(`/:orgNo/public-library/material/${nodeKey}`))
  }

  const goToReceivedShareMaterial = (nodeKey, sharingKey) => {
    router.push(`/received-share/${sharingKey}/material/${nodeKey}`)
  }

  const goToEmbedMaterialDetail = (nodeKey, sharingKey) => {
    router.push(`/embed/${sharingKey}/material/${nodeKey}`)
  }

  const goToShareToMeMaterial = (nodeKey, sharingId) => {
    router.push(parsePath(`${prefixPath.value}/share-to-me/material/${nodeKey}?sharingId=${sharingId}`))
  }

  const goToMoodboardDetail = (moodboardId) => {
    router.push(parsePath(`${prefixPath.value}/moodboard/${moodboardId}`))
  }

  return {
    nextAfterSignIn,
    parsePath,
    goToLobby,
    goToAssets,
    goToMaterialUpload,
    goToAssetMaterialDetail,
    goToAssetsMaterialCreate,
    goToAssetMaterialEdit,
    goToWorkspaceMaterialDetail,
    goToPublicLibraryMaterialDetail,
    goToOrgAssetMaterialEdit,
    goToGroupAssetMaterialEdit,
    goToReceivedShareMaterial,
    goToShareToMeMaterial,
    goToBillings,
    goToProgress,
    goToPaymentDetail,
    goToEmbedMaterialDetail,
    goToMoodboardDetail,
    prefixPath
  }
}
