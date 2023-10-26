import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Material,
  PaginationReq,
  Search,
  AssetsFilter,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import { useSearchStore } from '@/stores/search'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

export const useAssetsStore = defineStore('assets', () => {
  const searchStore = useSearchStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

  const material = ref<Material>()

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

  return {
    material,
    getAssetsMaterial,
    materialList,
    getAssetsMaterialList,
  }
})
