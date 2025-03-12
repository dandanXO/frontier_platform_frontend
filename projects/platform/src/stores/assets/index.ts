import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import axios, { type CancelTokenSource } from 'axios'
import type {
  Material,
  PaginationReq,
  Search,
  AssetsFilter,
  SmartUploadAssetsMaterialV2U3MRequestAllOfU3MListInner,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import { useSearchStore } from '@/stores/search'
import { useNotifyStore } from '@/stores/notify'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'
import useNavigation from '@/composables/useNavigation'
import assignCarbonEmissionValue from '@/utils/material/assignCarbonEmissionValue'
import {
  CREATE_MATERIAL_MODE,
  TRACKER_ADDITIONAL_PROPERTIES,
  track,
} from '@frontier/lib'

export const useAssetsStore = defineStore('assets', () => {
  const store = useStore()
  let cancelTokenSource: CancelTokenSource | null = null
  const { goToAssetMaterialSpreadSheet } = useNavigation()
  const { closeNotifyBanner } = useNotifyStore()
  const searchStore = useSearchStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
  const uploadingU3mMaterialIdList = ref<number[]>([])
  const spreadsheetInitialMaterial = ref<Material[]>([])
  const useNewAssetsView = ref<boolean>(false)
  const spreadsheetInputFile = ref<File | null>(null)
  const uploadPageUseBothUi = computed(
    () => store.getters['permission/uploadPageUseBothUi']
  )
  const uploadPageUseNewUi = computed(
    () => store.getters['permission/uploadPageUseNewUi']
  )

  const materialList = ref<Material[]>([])

  const viewMode = computed(() => {
    if (uploadPageUseBothUi.value) {
      return CREATE_MATERIAL_MODE.BOTH
    }
    if (uploadPageUseNewUi.value) {
      return CREATE_MATERIAL_MODE.ADVANCED
    }

    return CREATE_MATERIAL_MODE.OLD
  })

  const getAssetsMaterialList = async (payload: {
    pagination: PaginationReq
    search: Search | null
    filter: AssetsFilter | null
  }) => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled due to new request')
    }
    cancelTokenSource = axios.CancelToken.source()
    const { data } = await ogBaseAssetsApi('getAssetMaterialList', payload, {
      cancelToken: cancelTokenSource.token,
    })

    materialList.value = data.result.materialList.map((item) => {
      return assignCarbonEmissionValue(item)
    })
    searchStore.setPaginationRes(data.result.pagination)
  }

  const uploadCustomU3m = async (payload: {
    materialId: number
    u3mFile: File
    needToGeneratePhysical: boolean
  }) => {
    const { materialId, u3mFile, needToGeneratePhysical } = payload

    const cancelCustomU3mUpload = () =>
      cancelCustomU3mUploadByMaterialId(materialId)
    if (uploadingU3mMaterialIdList.value.length === 0) {
      window.addEventListener('unload', cancelCustomU3mUpload)
    }

    uploadingU3mMaterialIdList.value.push(materialId)
    const { s3UploadId, fileName } = await uploadFileToS3(u3mFile, u3mFile.name)
    await ogBaseAssetsApi('uploadAssetsMaterialCustomU3m', {
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

  const uploadCustomU3mV2 = async (
    payload: {
      u3mFile: File
      needToGeneratePhysical: boolean
    }[]
  ) => {
    const u3MList: SmartUploadAssetsMaterialV2U3MRequestAllOfU3MListInner[] =
      await Promise.all<SmartUploadAssetsMaterialV2U3MRequestAllOfU3MListInner>(
        payload.map(async (data) => {
          const { u3mFile, needToGeneratePhysical } = data

          const { s3UploadId, fileName } = await uploadFileToS3(
            u3mFile,
            u3mFile.name
          )

          return {
            fileName,
            needToGeneratePhysical,
            s3UploadId,
          }
        })
      )

    return await ogBaseAssetsApi('smartUploadAssetsMaterialV2U3M', {
      u3MList,
    })
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
    const data: {
      materialId: number
      orgId?: string
      groupId?: string
      accessToken: string | null
    } = {
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

  const startSpreadsheetUpdate = (materialList: Material[]) => {
    spreadsheetInitialMaterial.value = materialList
    goToAssetMaterialSpreadSheet()
  }

  const cleanUpSpreadSheet = () => {
    spreadsheetInitialMaterial.value = []
  }

  const addSpreadsheetInputFile = (file: File | null) => {
    spreadsheetInputFile.value = file
  }

  const switchCreateAssetsView = () => {
    useNewAssetsView.value = !useNewAssetsView.value
    track({
      eventName: useNewAssetsView.value
        ? 'switch_to_new_page'
        : 'switch_to_old_page',
      properties: {
        time: new Date().toString(),
        userId: store.getters['user/email'],
        orgId: store.getters['organization/orgId'],
        tag: useNewAssetsView.value
          ? 'switch_to_new_page'
          : 'switch_to_old_page',
        [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]: viewMode.value,
      },
    })
  }

  return {
    switchCreateAssetsView,
    materialList,
    spreadsheetInitialMaterial,
    getAssetsMaterialList,
    uploadingU3mMaterialIdList,
    uploadCustomU3m,
    uploadCustomU3mV2,
    ogBaseAssetsApi,
    startSpreadsheetUpdate,
    cleanUpSpreadSheet,
    addSpreadsheetInputFile,
    useNewAssetsView,
    spreadsheetInputFile,
    viewMode,
  }
})
