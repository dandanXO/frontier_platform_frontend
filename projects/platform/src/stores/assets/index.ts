import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
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
  let cancelTokenSourceMaterial: CancelTokenSource | null = null
  let cancelTokenSourceSlim: CancelTokenSource | null = null
  const { goToAssetMaterialSpreadSheet } = useNavigation()
  const { closeNotifyBanner } = useNotifyStore()
  const searchStore = useSearchStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
  const progressLoaded = ref<number>(0)
  const progressTotal = ref<number>(0)
  const abortController = ref(new AbortController()) // AbortController for canceling uploads
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
  const slimMaterialList = ref<Material[]>([])

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
    if (cancelTokenSourceMaterial) {
      cancelTokenSourceMaterial.cancel('Operation canceled due to new request')
    }
    cancelTokenSourceMaterial = axios.CancelToken.source()
    const { data } = await ogBaseAssetsApi('getAssetMaterialList', payload, {
      cancelToken: cancelTokenSourceMaterial.token,
    })

    materialList.value = data.result.materialList.map((item) => {
      return assignCarbonEmissionValue(item)
    })
    searchStore.setPaginationRes(data.result.pagination)
  }

  const getAssetsMaterialSlimList = async (payload: {
    pagination: PaginationReq
    search: Search | null
    filter: AssetsFilter | null
  }) => {
    if (cancelTokenSourceSlim) {
      cancelTokenSourceSlim.cancel('Operation canceled due to new request')
    }
    cancelTokenSourceSlim = axios.CancelToken.source()
    const { data } = await ogBaseAssetsApi(
      'getAssetMaterialSlimList',
      payload,
      {
        cancelToken: cancelTokenSourceSlim.token,
      }
    )

    slimMaterialList.value = data.result.materialList
    searchStore.setPaginationRes(data.result.pagination)
  }
  const updateabortController = () => {
    abortController.value.abort()
    abortController.value = new AbortController()
  }
  const uploadCustomU3m = async (payload: {
    materialId: number
    u3mFile: File
    needToGeneratePhysical: boolean
    callBackUrlTarget: any
    callBackUrlTargetQuery: {}
  }) => {
    const {
      materialId,
      u3mFile,
      needToGeneratePhysical,
      callBackUrlTarget,
      callBackUrlTargetQuery,
    } = payload

    const cancelCustomU3mUpload = () =>
      cancelCustomU3mUploadByMaterialId(materialId)
    if (uploadingU3mMaterialIdList.value.length === 0) {
      window.addEventListener('unload', cancelCustomU3mUpload)
    }

    uploadingU3mMaterialIdList.value.push(materialId)

    try {
      const { s3UploadId, fileName } = await uploadFileToS3(
        u3mFile,
        u3mFile.name,
        (progress, loaded, total) => {
          store.commit('assets/SET_progressLoaded', loaded)
          store.commit('assets/SET_progressTotal', total)
          progressLoaded.value = loaded
          progressTotal.value = total
        },
        abortController.value.signal // 傳遞取消信號
      )

      await ogBaseAssetsApi(callBackUrlTarget, callBackUrlTargetQuery)
      await ogBaseAssetsApi('uploadAssetsMaterialCustomU3m', {
        materialId,
        s3UploadId,
        fileName,
        needToGeneratePhysical,
      })
    } catch (error) {
      // Handle upload abortion or other errors
      if (error instanceof Error && error.message === 'Upload aborted') {
        console.log('Upload was canceled by user')
      } else {
        console.error('Upload failed:', error)
      }
    } finally {
      uploadingU3mMaterialIdList.value =
        uploadingU3mMaterialIdList.value.filter((id) => id !== materialId)

      if (uploadingU3mMaterialIdList.value.length === 0) {
        closeNotifyBanner()
        window.removeEventListener('unload', cancelCustomU3mUpload)
      }
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
            u3mFile.name,
            () => {},
            abortController.value.signal // 傳遞取消信號
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
    slimMaterialList,
    progressLoaded,
    progressTotal,
    abortController,
    updateabortController,
    getAssetsMaterialList,
    getAssetsMaterialSlimList,
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
