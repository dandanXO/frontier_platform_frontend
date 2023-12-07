import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { DigitalThreadBase, Material } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'

const useGoToStickerMaterialDetail = () => {
  const store = useStore()
  const router = useRouter()
  const { parsePath } = useNavigation()

  return (
    material: Material,
    digitalThread: DigitalThreadBase,
    openNewPage: boolean = false
  ) => {
    if (digitalThread.hasMaterialDeleted || digitalThread.hasMaterialNoAccess) {
      return
    }
    const {
      materialId,
      metaData: { isMaterialOwnerSide, materialOwnerOGId, materialOwnerOGType },
    } = material

    if (!isMaterialOwnerSide) {
      return store.dispatch('helper/openModalBehavior', {
        component: 'modal-sticker-material-detail',
        properties: { material },
      })
    }

    const unParsedPath = `/:orgNo/:ogKey/assets/${materialId}`
    const path = parsePath(unParsedPath, {
      ogKey: `${materialOwnerOGType}-${materialOwnerOGId}`,
    })

    if (openNewPage) {
      window.open(path, '_blank')
    } else {
      router.push(path)
    }
  }
}

export default useGoToStickerMaterialDetail
