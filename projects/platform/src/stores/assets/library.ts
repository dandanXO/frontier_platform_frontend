import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios, { type CancelTokenSource } from 'axios'
import type {
  Material,
  PaginationReq,
  Search,
  AssetsFilter,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import { useSearchStore } from '@/stores/search'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import assignCarbonEmissionValue from '@/utils/material/assignCarbonEmissionValue'

export const useAssetsLibraryStore = defineStore('assetsLibraryStore', () => {
  let cancelTokenSourceMaterial: CancelTokenSource | null = null
  let cancelTokenSourceSlim: CancelTokenSource | null = null
  const searchStore = useSearchStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

  const materialList = ref<Material[]>([])
  const slimMaterialList = ref<Material[]>([])
  const isLoading = ref(false)
  const isSlimMaterialsLoading = ref(false)

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

  const parseSlimMaterial = (material: any): Material => ({
    ...material,
    weightDisplaySetting: material.weightDisplaySetting || {
      isShowWeightGsm: false,
    },
    u3m: material.u3m || { status: -1 },
    customU3m: material.customU3m || { status: -1 },
    sideType: material.sideType || 1,
    faceSide: {
      descriptionList: material.faceSide?.descriptionList || [],
      constructionCustomPropertyList:
        material.faceSide?.constructionCustomPropertyList || [],
      contentList: material.faceSide?.contentList || [],
      finishList: material.faceSide?.finishList || [],
    },
    tagInfo: {
      tagList: material.tagInfo?.tagList || [],
    },
    digitalThreadInfo: {
      threadQty: material.digitalThreadInfo?.threadQty || 0,
      hasUnreadThread: material.digitalThreadInfo?.hasUnreadThread || false,
    },
  })

  const displayedMaterialList = computed(() => {
    const isAnyLoading = isLoading.value || isSlimMaterialsLoading.value

    if (!isAnyLoading) {
      return materialList.value
    }
    if (slimMaterialList.value.length > 0) {
      return slimMaterialList.value.map(parseSlimMaterial)
    }
    return materialList.value.length > 0 ? materialList.value : []
  })

  return {
    materialList,
    slimMaterialList,
    displayedMaterialList,
    isLoading,
    isSlimMaterialsLoading,
    getAssetsMaterialList,
    getAssetsMaterialSlimList,
  }
})
