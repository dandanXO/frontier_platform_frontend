import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { MOODBOARD_TAB, SIGNUP_SOURCE } from '@/utils/constants'

export default function useNavigation() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const routeLocation = computed(() => store.getters['helper/routeLocation'])
  const prefixPath = computed(() =>
    routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
  )

  const nextAfterSignIn = async () => {
    const user = store.getters['user/user']
    const organizationList = user.organizationList

    if (route.query.redirect !== undefined) {
      if (
        'signupSourceType' in route.query &&
        Number(route.query.signupSourceType) === SIGNUP_SOURCE.RECEIVED_SHARE &&
        organizationList.length === 0
      ) {
        // 來自 received share add sticker
        return router.push({
          name: 'Lobby',
          query: route.query,
        })
      }
      return router.push(route.query.redirect)
    }

    if (organizationList.length === 1) {
      return router.push({
        name: 'PublicLibrary',
        params: { orgNo: organizationList[0].orgNo },
      })
    }

    await goToLobby()
  }

  const parsePath = (path) => {
    let temp = path
    Object.keys(route.params).forEach((key) => {
      const regex = new RegExp(':' + key)
      temp = temp.replace(regex, route.params[key])
    })
    temp = temp.replace(/\(\\d\+\)/, '')
    return temp
  }

  const goToLobby = async () => {
    await router.push('/')
  }

  const goToBillings = () => {
    router.push(parsePath('/:orgNo/billings/plan'))
  }

  const goToProgress = async (tabName = 'material') => {
    await router.push(parsePath(`${prefixPath.value}/progress/${tabName}`))
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
    router.push(
      parsePath(`${prefixPath.value}/assets/${material.materialId}/edit`)
    )
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

  const goToWorkspaceMaterialDetail = (nodeKey, rank) => {
    router.push(
      parsePath(
        `${prefixPath.value}/workspace/material/${nodeKey}?rank=${rank}`
      )
    )
  }

  const goToPublicLibrary = () => {
    router.push(parsePath(`/:orgNo/public-library`))
  }

  const goToPublicLibraryMaterialDetail = (nodeKey, rank) => {
    router.push(
      parsePath(`/:orgNo/public-library/material/${nodeKey}?rank=${rank}`)
    )
  }

  const goToTitasShowroom = () => {
    router.push(parsePath(`/:orgNo/titas`))
  }

  const goToTitasShowroomMaterialDetail = (nodeKey, rank) => {
    router.push(parsePath(`/:orgNo/titas/material/${nodeKey}?&rank=${rank}`))
  }

  const goToReceivedShareMaterial = (nodeKey, sharingKey, rank) => {
    router.push(
      `/received-share/${sharingKey}/material/${nodeKey}?rank=${rank}`
    )
  }

  const goToEmbedMaterialDetail = (nodeKey, sharingKey, rank) => {
    router.push(`/embed/${sharingKey}/material/${nodeKey}?rank=${rank}`)
  }

  const goToShareToMeMaterial = (nodeKey, sharingId, rank) => {
    router.push(
      parsePath(
        `${prefixPath.value}/share-to-me/material/${nodeKey}?sharingId=${sharingId}&rank=${rank}`
      )
    )
  }

  const goToMoodboard = () => {
    router.push(parsePath(`${prefixPath.value}/moodboard`))
  }

  const goToMoodboardDetail = (moodboardId) => {
    router.push(
      parsePath(
        `${prefixPath.value}/moodboard/${moodboardId}?tab=${MOODBOARD_TAB.OFFER}`
      )
    )
  }

  const goToMoodboardPickedList = (moodboardId) => {
    router.push(
      parsePath(`${prefixPath.value}/moodboard/${moodboardId}/picked-list`)
    )
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
    goToPublicLibrary,
    goToPublicLibraryMaterialDetail,
    goToTitasShowroom,
    goToTitasShowroomMaterialDetail,
    goToOrgAssetMaterialEdit,
    goToGroupAssetMaterialEdit,
    goToReceivedShareMaterial,
    goToShareToMeMaterial,
    goToBillings,
    goToProgress,
    goToPaymentDetail,
    goToEmbedMaterialDetail,
    goToMoodboard,
    goToMoodboardDetail,
    goToMoodboardPickedList,
    prefixPath,
  }
}
