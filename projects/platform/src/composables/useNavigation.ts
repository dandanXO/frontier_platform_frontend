import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { MOODBOARD_TAB, SIGNUP_SOURCE } from '@/utils/constants'
import { OgType, type Organization } from '@frontier/platform-web-sdk'

export interface NavigationReq {
  orgNo?: string
  ogKey?: string
}

export default function useNavigation() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )
  const ogKey = computed(() =>
    router.currentRoute.value.params.ogKey
      ? (router.currentRoute.value.params.ogKey as string)
      : `${OgType.ORG}-${organization.value.orgId}`
  )
  const ogType = computed<OgType>(
    () => Number(ogKey.value.split('-')[0]) as unknown as OgType
  )
  const ogId = computed(() => Number(ogKey.value.split('-')[1]))
  const isGroup = computed(() => ogType.value === OgType.GROUP)
  const isInInnerApp = computed(() =>
    route.matched.some((r) => r.name === 'InnerAppRoot')
  )
  const prefixPath = '/:orgNo/:ogKey'

  const nextAfterSignIn = async () => {
    const user = store.getters['user/user']
    const organizationList = user.organizationList
    const redirect = route.query.redirect as string | undefined

    if (redirect !== undefined) {
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
      return redirect.includes('/sign-in')
        ? router.push('/')
        : router.push(redirect)
    }

    if (organizationList.length === 1) {
      return router.push({
        name: 'PublicLibrary',
        params: { orgNo: organizationList[0].orgNo },
      })
    }

    await goToLobby()
  }

  const parsePath = (path: string, { orgNo, ogKey }: NavigationReq = {}) => {
    let temp = path
    if (!orgNo) {
      orgNo = organization.value.orgNo
    }
    if (!ogKey) {
      ogKey = `${ogType.value}-${ogId.value}`
    }
    temp = temp.replace(new RegExp(':orgNo'), orgNo)
    temp = temp.replace(new RegExp(':ogKey'), ogKey)
    temp = temp.replace(/\(\\d\+\)/, '')
    return temp
  }

  const goToLobby = async () => {
    await store.dispatch('sticker/closeStickerDrawer')
    await router.push('/')
  }

  const goToDashboard = async (navReq: NavigationReq = {}) => {
    router.push(parsePath(`${prefixPath}/dashboard`, navReq))
  }

  const goToManagement = async (
    navReq: NavigationReq = {},
    tabName = 'about'
  ) => {
    router.push(parsePath(`${prefixPath}/management/${tabName}`, navReq))
  }

  const goToBillings = async (navReq: NavigationReq = {}) => {
    await store.dispatch('sticker/closeStickerDrawer')
    router.push(parsePath('/:orgNo/billings/plan', navReq))
  }

  const goToProgress = async (
    navReq: NavigationReq = {},
    tabName = 'material'
  ) => {
    await router.push(parsePath(`${prefixPath}/progress/${tabName}`, navReq))
  }

  const goToPaymentDetail = (navReq: NavigationReq = {}) => {
    router.push(parsePath('/:orgNo/billings/payment', navReq))
  }

  const goToAssets = async (navReq: NavigationReq = {}) => {
    await router.push(parsePath(`${prefixPath}/assets`, navReq))
  }

  const goToMaterialUpload = async (navReq: NavigationReq = {}) => {
    await store.dispatch('sticker/closeStickerDrawer')
    router.push(parsePath(`${prefixPath}/assets/upload`, navReq))
  }

  const goToAssetMaterialDetail = async (
    navReq: NavigationReq = {},
    materialId: number
  ) => {
    if (materialId !== (store.getters['sticker/currentMaterialId'] as number)) {
      await store.dispatch('sticker/closeStickerDrawer')
    }
    router.push(parsePath(`${prefixPath}/assets/${materialId}`, navReq))
  }

  const goToAssetMaterialEdit = (materialId: number, ogType: OgType) => {
    if (ogType === OgType.ORG) {
      router.push(
        parsePath(`${prefixPath}/assets/${materialId}/edit`, {
          ogKey: `${OgType.ORG}-${organization.value.orgId}`,
        })
      )
    } else {
      router.push(parsePath(`${prefixPath}/assets/${materialId}/edit`))
    }
  }

  const goToAssetsMaterialCreate = () => {
    router.push(parsePath(`${prefixPath}/assets/upload/manual`))
  }

  const goToWorkspace = (navReq: NavigationReq = {}, nodeId: number) => {
    router.push(parsePath(`${prefixPath}/workspace/${nodeId}`, navReq))
  }

  const goToWorkspaceMaterialDetail = (
    navReq: NavigationReq = {},
    nodeId: number,
    rank?: number
  ) => {
    const basePath = `${prefixPath}/workspace/material/${nodeId}`
    const path = rank ? `${basePath}?rank=${rank}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToShareToMe = (
    navReq: NavigationReq = {},
    sharingId?: number,
    nodeId?: number
  ) => {
    const basePath = `${prefixPath}/share-to-me`
    const path = sharingId ? `${basePath}/${sharingId}/${nodeId}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToShareToMeMaterial = (
    navReq: NavigationReq = {},
    sharingId: number,
    nodeId: number,
    rank?: number
  ) => {
    const basePath = `${prefixPath}/share-to-me/${sharingId}/material/${nodeId}`
    const path = rank ? `${basePath}?rank=${rank}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToPublicLibrary = async (
    navReq: NavigationReq = {},
    nodeId?: number
  ) => {
    await store.dispatch('sticker/closeStickerDrawer')
    const basePath = `/:orgNo/public-library`
    const path = nodeId ? `${basePath}/${nodeId}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToPublicLibraryMaterialDetail = (
    navReq: NavigationReq = {},
    nodeId: number,
    rank?: number
  ) => {
    const basePath = `/:orgNo/public-library/material/${nodeId}`
    const path = rank ? `${basePath}?rank=${rank}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToShowroom = async (
    navReq: NavigationReq = {},
    showroomId: number,
    nodeId?: number
  ) => {
    await store.dispatch('sticker/closeStickerDrawer')
    const basePath = `/:orgNo/showroom/${showroomId}`
    const path = nodeId ? `${basePath}/${nodeId}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToShowroomMaterialDetail = (
    navReq: NavigationReq = {},
    showroomId: number,
    nodeId: number,
    rank?: number
  ) => {
    const basePath = `/:orgNo/showroom/${showroomId}/material/${nodeId}`
    const path = rank ? `${basePath}?rank=${rank}` : basePath
    router.push(parsePath(path, navReq))
  }

  const goToReceivedShare = (sharingKey: string, nodeId?: number) => {
    const basePath = `/received-share/${sharingKey}`
    const path = nodeId ? `${basePath}/${nodeId}` : basePath
    router.push(path)
  }

  const goToReceivedShareMaterial = (
    sharingKey: string,
    nodeId: number,
    rank?: number
  ) => {
    const basePath = `/received-share/${sharingKey}/material/${nodeId}`
    const path = rank ? `${basePath}?rank=${rank}` : basePath
    router.push(path)
  }

  const goToEmbed = (sharingKey: string, nodeId?: number) => {
    const basePath = `/embed/${sharingKey}`
    const path = nodeId ? `${basePath}/${nodeId}` : basePath
    router.push(path)
  }

  const goToEmbedMaterialDetail = (
    sharingKey: string,
    nodeId: number,
    rank?: number
  ) => {
    const basePath = `/embed/${sharingKey}/material/${nodeId}`
    const path = rank ? `${basePath}?rank=${rank}` : basePath
    router.push(path)
  }

  const goToMoodboard = (navReq: NavigationReq = {}) => {
    router.push(parsePath(`${prefixPath}/moodboard`, navReq))
  }

  // const goToMoodboardDetail = (moodboardId) => {
  //   router.push(
  //     parsePath(
  //       `${prefixPath}/moodboard/${moodboardId}?tab=${MOODBOARD_TAB.OFFER}`
  //     )
  //   )
  // }

  // const goToMoodboardPickedList = (moodboardId) => {
  //   router.push(parsePath(`${prefixPath}/moodboard/${moodboardId}/picked-list`))
  // }

  const goToThreadBoard = async (navReq: NavigationReq = {}) => {
    await router.push(parsePath(`${prefixPath}/thread-board`, navReq))
  }

  return {
    ogKey,
    isGroup,
    ogId,
    ogType,
    nextAfterSignIn,
    parsePath,
    goToDashboard,
    goToManagement,
    goToLobby,
    goToAssets,
    goToMaterialUpload,
    goToAssetMaterialDetail,
    goToAssetsMaterialCreate,
    goToAssetMaterialEdit,
    goToWorkspace,
    goToShareToMe,
    goToWorkspaceMaterialDetail,
    goToPublicLibrary,
    goToPublicLibraryMaterialDetail,
    goToShowroom,
    goToShowroomMaterialDetail,
    goToShareToMeMaterial,
    goToBillings,
    goToProgress,
    goToPaymentDetail,
    goToReceivedShare,
    goToReceivedShareMaterial,
    goToEmbed,
    goToEmbedMaterialDetail,
    goToMoodboard,
    // goToMoodboardDetail,
    // goToMoodboardPickedList,
    goToThreadBoard,
    prefixPath,
    isInInnerApp,
  }
}
