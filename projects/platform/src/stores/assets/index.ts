import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type {
  Material,
  PaginationReq,
  Search,
  AssetsFilter,
} from '@frontier/platform-web-sdk'
import { NOTIFY_TYPE } from '@frontier/constants'
import assetsApi from '@/apis/assets'
import { useSearchStore } from '@/stores/search'
import { useNotifyStore } from '@/stores/notify'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'

export const useAssetsStore = defineStore('assets', () => {
  const { t } = useI18n()
  const store = useStore()
  const { showNotifyBanner, closeNotifyBanner } = useNotifyStore()
  const searchStore = useSearchStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

  const material = ref<Material>()
  const uploadingU3mMaterialIdList = ref<number[]>([])

  const getAssetsMaterial = async (materialId: number) => {
    const { data } = await ogBaseAssetsApi(assetsApi.getAssetsMaterial)({
      materialId,
    })
    material.value = data.result.material
  }

  const materialList = ref<Material[]>([])
  const getAssetsMaterialList = async (payload: {
    pagination: PaginationReq
    search: Search | null
    filter: AssetsFilter | null
  }) => {
    const { data } = await ogBaseAssetsApi(assetsApi.getAssetMaterialList)(
      payload
    )
    materialList.value = data.result.materialList
    searchStore.setPaginationRes(data.result.pagination)
  }

  const uploadCustomU3m = async (payload: {
    materialId: number
    u3mFile: File
    needToGeneratePhysical: boolean
  }) => {
    const { materialId, u3mFile, needToGeneratePhysical } = payload

    showNotifyBanner({
      notifyType: NOTIFY_TYPE.INFO,
      title: t('EE0176'),
      messageText: t('EE0177'),
    })

    const cancelCustomU3mUpload = () =>
      cancelCustomU3mUploadByMaterialId(materialId)

    if (uploadingU3mMaterialIdList.value.length === 0) {
      window.addEventListener('unload', cancelCustomU3mUpload)
    }

    uploadingU3mMaterialIdList.value.push(materialId)

    const { s3UploadId, fileName } = await uploadFileToS3(u3mFile, u3mFile.name)
    await ogBaseAssetsApi(assetsApi.uploadAssetsMaterialCustomU3m)({
      materialId,
      s3UploadId,
      fileName,
      needToGeneratePhysical,
    })

    uploadingU3mMaterialIdList.value = uploadingU3mMaterialIdList.value.filter(
      (mId) => mId !== materialId
    )

    if (uploadingU3mMaterialIdList.value.length === 0) {
      closeNotifyBanner()
      window.removeEventListener('unload', cancelCustomU3mUpload)
    }
  }

  const cancelCustomU3mUploadByMaterialId = (materialId: number) => {
    const type = store.getters['helper/routeLocation']
    const id = store.getters['helper/routeLocationId']
    const prefixPath = type === 'org' ? '/org' : '/org/group'
    const path = `${
      import.meta.env.VITE_APP_API_ENDPOINT
    }${prefixPath}/assets/material/custom-u3m-upload/cancel`

    const headers = {
      type: 'application/json',
    }
    const data = {
      materialId,
      accessToken: localStorage.getItem('accessToken'),
    }
    if (type === 'org') {
      data['orgId'] = id
    } else {
      data['groupId'] = id
    }
    const blob = new Blob([JSON.stringify(data)], headers)

    return navigator.sendBeacon(path, blob)
  }

  return {
    material,
    getAssetsMaterial,
    materialList,
    getAssetsMaterialList,
    uploadingU3mMaterialIdList,
    uploadCustomU3m,
  }
})
