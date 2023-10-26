import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { OgType } from '@frontier/platform-web-sdk'
import type {
  DigitalThreadBase,
  Organization,
  Material,
} from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'

const useGotoMaterialDetail = () => {
  const store = useStore()
  const router = useRouter()
  const { parsePath } = useNavigation()
  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )

  return (
    material: Material,
    digitalThread: DigitalThreadBase,
    openNewPage: boolean = false
  ) => {
    if (digitalThread.hasMaterialDeleted || digitalThread.hasMaterialNoAccess) {
      return
    }
    const {
      isMaterialOwnerSide,
      materialId,
      materialOwnerOGId,
      materialOwnerOGType,
    } = material

    if (!isMaterialOwnerSide) {
      return store.dispatch('helper/openModalBehavior', {
        component: 'modal-sticker-material-detail',
        properties: { material },
      })
    }

    let unParsedPath
    if (materialOwnerOGType === OgType.ORG) {
      unParsedPath = `/${organization.value.orgNo}/assets/${materialId}`
    } else {
      unParsedPath = `/${organization.value.orgNo}/${materialOwnerOGId}/assets/${materialId}`
    }

    if (openNewPage) {
      window.open(parsePath(unParsedPath), '_blank')
    } else {
      router.push(parsePath(unParsedPath))
    }
  }
}

export default useGotoMaterialDetail
