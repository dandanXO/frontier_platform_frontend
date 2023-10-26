import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { MOODBOARD_TAB, SIGNUP_SOURCE } from '@/utils/constants'
import {
  OgType,
  type Organization,
  type Group,
} from '@frontier/platform-web-sdk'

export default function useNavigation() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const routeLocation = computed(() =>
    router.currentRoute.value.params.groupId ? 'group' : 'org'
  )
  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )
  const group = computed<Group>(() => store.getters['group/group'])
  const isGroup = computed(() => routeLocation.value === 'group')
  const ogId = computed(() =>
    isGroup.value ? group.value.groupId : organization.value.orgId
  )
  const ogType = computed<OgType>(() =>
    isGroup.value ? OgType.GROUP : OgType.ORG
  )
  const isInInnerApp = computed(() =>
    route.matched.some((r) => r.name === 'InnerAppRoot')
  )
  const prefixPath = computed(() =>
    routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
  )

  const nextAfterSignIn = async () => {
    const user = store.getters['user/user']
    const organizationList = user.organizationList
    const redirect = route.query.redirect

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

  const parsePath = (path: string, orgNo?: string, groupId?: number) => {
    let temp = path
    if (!orgNo) {
      orgNo = organization.value.orgNo
    }
    if (!groupId) {
      groupId = group.value?.groupId
    }
    temp = temp.replace(new RegExp(':orgNo'), orgNo)
    temp = temp.replace(new RegExp(':groupId'), String(groupId))
    temp = temp.replace(/\(\\d\+\)/, '')
    return temp
  }

  const goToLobby = async () => {
    await store.dispatch('sticker/closeStickerDrawer')
    await router.push('/')
  }

  const goToBillings = async () => {
    await store.dispatch('sticker/closeStickerDrawer')
    router.push(parsePath('/:orgNo/billings/plan'))
  }

  const goToProgress = async (tabName = 'material') => {
    await router.push(parsePath(`${prefixPath.value}/progress/${tabName}`))
  }

  const goToPaymentDetail = () => {
    router.push(parsePath('/:orgNo/billings/payment'))
  }

  const goToAssets = async (orgNo?: string, groupId?: number) => {
    await router.push(parsePath(`${prefixPath.value}/assets`, orgNo, groupId))
  }

  const goToMaterialUpload = () => {
    router.push(parsePath(`${prefixPath.value}/assets/upload`))
  }

  const goToAssetMaterialDetail = async (
    materialId: number,
    orgNo?: string,
    groupId?: number
  ) => {
    if (materialId !== store.getters['sticker/currentMaterialId']) {
      await store.dispatch('sticker/closeStickerDrawer')
    }
    router.push(
      parsePath(`${prefixPath.value}/assets/${materialId}`, orgNo, groupId)
    )
  }

  const goToAssetMaterialEdit = (materialId, ogType) => {
    if (ogType === OgType.ORG) {
      router.push(parsePath(`/:orgNo/assets/${materialId}/edit`))
    } else {
      router.push(parsePath(`/:orgNo/:groupId/assets/${materialId}/edit`))
    }
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

  const goToPublicLibrary = async () => {
    await store.dispatch('sticker/closeStickerDrawer')
    router.push(parsePath(`/:orgNo/public-library`))
  }

  const goToPublicLibraryMaterialDetail = (nodeKey, rank) => {
    router.push(
      parsePath(`/:orgNo/public-library/material/${nodeKey}?rank=${rank}`)
    )
  }

  const goShowroom = async (showroomId) => {
    await store.dispatch('sticker/closeStickerDrawer')
    router.push(parsePath(`/:orgNo/showroom/${showroomId}`))
  }

  const goShowroomMaterialDetail = (nodeKey, showroomId, rank) => {
    router.push(
      parsePath(
        `/:orgNo/showroom/${showroomId}/material/${nodeKey}?&rank=${rank}`
      )
    )
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

  const gotoThreadBoard = async () => {
    if (isInInnerApp.value) {
      await router.push(parsePath(`${prefixPath.value}/thread-board`))
    } else {
      // from received share sticker drawer
      await router.push(`/${organization.value.orgNo}/thread-board`)
    }
  }

  return {
    routeLocation,
    isGroup,
    ogId,
    ogType,
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
    goShowroom,
    goShowroomMaterialDetail,
    goToReceivedShareMaterial,
    goToShareToMeMaterial,
    goToBillings,
    goToProgress,
    goToPaymentDetail,
    goToEmbedMaterialDetail,
    goToMoodboard,
    goToMoodboardDetail,
    goToMoodboardPickedList,
    gotoThreadBoard,
    prefixPath,
    isInInnerApp,
  }
}
