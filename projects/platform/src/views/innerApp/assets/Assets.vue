<template>
  <search-table
    :display-mode="displayMode"
    :search-type="SEARCH_TYPE.ASSETS"
    :search-callback="getMaterialList"
    :option-sort="sortOptions"
    :option-multi-select="multiSelectOptions"
    :item-list="displayedMaterialList"
    v-model:selected-item-list="selectedMaterialList"
    :is-asset-slim-list-loading="isSlimMaterialsLoading"
    assets
  >
    <template #header-left="{ totalCount }">
      <h5 class="text-h5 font-bold text-grey-900">
        {{ $t('RR0008') }}
        <span class="text-caption text-grey-600 pl-1">
          <span>(</span>
          <i18n-t keypath="RR0068" tag="span" scope="global">
            <template #number>{{ totalCount }}</template>
          </i18n-t>
          <span>)</span>
        </span>
      </h5>
    </template>

    <template #header-right>
      <div class="flex items-center space-x-3">
        <f-input-tap
          :option-list="displayModeOptions"
          v-model:input-value="displayMode"
        />
        <f-button
          v-permission="{
            FUNC_ID: FUNC_ID.ASSET_CREATE,
            behavior: 'deleteElement',
          }"
          size="sm"
          prepend-icon="texture_add"
          @click="goToMaterialUpload"
        >
          {{ $t('UU0020') }}
        </f-button>
      </div>
    </template>

    <template #default>
      <template v-if="displayedMaterialList.length > 0">
        <div v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST">
          <div
            v-for="(item, index) in displayedMaterialList"
            :key="`${item.materialId}-${new Date().getTime()}`"
          >
            <RowItem
              :material="item"
              v-model:selected-list="selectedMaterialList"
              :material-options="materialOptions"
              data-cy="assets-item-list"
              :disabled="isLoading"
            />
            <div
              v-if="index !== displayedMaterialList.length - 1"
              class="border-b border-grey-250 mx-7.5 my-5"
            />
          </div>
        </div>

        <div
          v-show="displayMode === ASSET_LIST_DISPLAY_MODE.GRID"
          class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5"
        >
          <GridItemMaterial
            v-for="material in displayedMaterialList"
            :key="material.materialId + '-' + new Date().getTime()"
            :material="material"
            :select-value="material"
            v-model:selected-value="selectedMaterialList"
            :option-list="optionList"
            :is-selectable="!isLoading"
            :is-loading="isLoading"
            @click.stop="handleMaterialClick(material.materialId)"
            :drawer-open-from-location-list="[]"
            data-cy="assets-item-grid"
            :data-tooltip-boundary-reference="`material-${material.materialId}`"
          >
            <template
              #title-right-icon
              v-if="material.faceSide?.isLowDpi || material.backSide?.isLowDpi"
            >
              <LowDpiLabel
                :material="material"
                :material-options="materialOptions"
              />
            </template>
          </GridItemMaterial>
        </div>
      </template>
      <template v-else-if="isSlimMaterialsLoading">
        <!-- Skeleton loading for LIST view -->
        <div v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST">
          <div v-for="i in 40" :key="`skeleton-list-${i}`">
            <div
              class="grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-grey-50"
            >
              <!-- Item content - using col-span-11 like the real component -->
              <div class="col-span-11 grid grid-cols-12">
                <!-- Left part: image + item details (matches RowItemContent structure) -->
                <div class="w-full min-w-42.5 max-w-67.5 col-span-3">
                  <!-- Item number -->
                  <SkeletonBase class="h-5 w-3/4 mb-2.5" />

                  <!-- Image placeholder -->
                  <div class="w-full relative aspect-square">
                    <SkeletonBase class="w-full h-full" />
                  </div>

                  <!-- Item specs -->
                  <div class="my-2">
                    <SkeletonBase class="h-4 w-full mb-1" />
                    <SkeletonBase class="h-4 w-3/4" />
                  </div>

                  <!-- Icons row -->
                  <div class="flex gap-3">
                    <SkeletonBase class="h-6 w-6 rounded-full" />
                    <SkeletonBase class="h-6 w-6 rounded-full" />
                  </div>
                </div>

                <!-- Material details - other columns -->
                <div class="col-span-9 pl-5">
                  <!-- Material properties -->
                  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    <SkeletonBase class="h-4 w-3/4" />
                    <SkeletonBase class="h-4 w-2/3" />
                    <SkeletonBase class="h-4 w-1/2" />
                    <SkeletonBase class="h-4 w-2/3" />
                    <SkeletonBase class="h-4 w-3/4" />
                    <SkeletonBase class="h-4 w-3/5" />
                  </div>
                </div>
              </div>

              <!-- Item sidebar - col-span-1 -->
              <div class="col-span-1 flex flex-col gap-3.5 items-center">
                <SkeletonBase class="h-7.5 w-7.5 rounded-full" />
                <SkeletonBase class="h-7.5 w-7.5 rounded-full" />
                <SkeletonBase class="h-7.5 w-7.5 rounded-full" />
              </div>
            </div>
            <div class="border-b border-grey-250 mx-7.5 my-5" />
          </div>
        </div>

        <!-- Skeleton loading for GRID view -->
        <div
          v-show="displayMode === ASSET_LIST_DISPLAY_MODE.GRID"
          class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5"
        >
          <div v-for="i in 40" :key="`skeleton-grid-${i}`" class="relative">
            <!-- Main wrapper -->
            <div class="relative">
              <!-- Square aspect ratio container -->
              <div class="w-full aspect-square relative">
                <!-- Top selection bar area -->
                <div class="absolute z-10 top-0 left-0 w-full h-11">
                  <SkeletonBase class="w-full h-full rounded-t-md opacity-10" />
                </div>

                <!-- Main image content -->
                <SkeletonBase
                  class="absolute top-0 left-0 w-full h-full rounded-md"
                />
              </div>

              <!-- Caption area -->
              <SkeletonBase class="h-3 w-1/2 mt-1" />
            </div>
          </div>
        </div>
      </template>
      <empty-state-assets v-else />
    </template>
  </search-table>
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
  type SortOption,
} from '@/components/common/SearchTable.vue'
import LowDpiLabel from '@/components/assets/LowDpiLabel.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'
import {
  SEARCH_TYPE,
  ASSET_LIST_DISPLAY_MODE,
  NOTIFY_TYPE,
  SCROLL_POSITION_KEY,
} from '@/utils/constants'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAssetsStore } from '@/stores/assets'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import type {
  AssetsFilter,
  ExternalFilter,
  InnerExternalFilter,
  Material,
  WorkspaceFilter,
} from '@frontier/platform-web-sdk'
import RowItem from '@/components/assets/RowItem.vue'
import GridItemMaterial from '@/components/common/gridItem/GridItemMaterial.vue'
import SkeletonBase from '@/components/common/SkeletonBase.vue'
import EmptyStateAssets from '@/components/assets/EmptyStateAssets.vue'

// Permission hook
interface PermissionsAPI {
  hasPermission: (permissionId: string | number) => boolean
}
const usePermissions = (): PermissionsAPI => {
  const store = useStore()
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId] || []
  return {
    hasPermission: (permissionId: string | number): boolean => {
      return permissionList.includes(permissionId)
    },
  }
}

defineOptions({
  name: 'AssetsMaterialList',
})

const assetsStore = useAssetsStore()
const searchStore = useSearchStore()
const { materialList, slimMaterialList } = storeToRefs(assetsStore)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const store = useStore()
const { goToMaterialUpload, goToAssetMaterialDetail, goToAssets } =
  useNavigation()
const { hasPermission } = usePermissions()
const roleId = store.getters['organization/orgUser/orgUser'].roleID
const permissionList = PERMISSION_MAP[roleId]
const clickMaterialItemHandler = (materialId: number) => {
  if (selectedMaterialList.value.length === 0) {
    goToAssetMaterialDetail({}, materialId)
  } else {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('EE0178'),
      contentText: t('EE0179'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: () => {
        goToAssetMaterialDetail({}, materialId)
      },
      secondaryBtnText: t('UU0002'),
    })
  }
}

const isLoading = ref(false)
const isSlimMaterialsLoading = ref(false)
const selectedMaterialList = ref<Material[]>([])
const displayMode = ref<ASSET_LIST_DISPLAY_MODE>(
  Number(route.query.displayMode) === ASSET_LIST_DISPLAY_MODE.LIST
    ? ASSET_LIST_DISPLAY_MODE.LIST
    : ASSET_LIST_DISPLAY_MODE.GRID
)

const materialOptionsRes = await assetsStore.ogBaseAssetsApi(
  'getMaterialOptions'
)
const materialOptions = materialOptionsRes.data.result

const hasCreatePermission = computed(() => hasPermission(FUNC_ID.ASSET_CREATE))

const displayModeOptions = computed(() => {
  return [
    {
      selectValue: ASSET_LIST_DISPLAY_MODE.GRID,
      icon: 'apps',
    },
    {
      selectValue: ASSET_LIST_DISPLAY_MODE.LIST,
      icon: 'format_list_bulleted',
    },
  ]
})

const handleMaterialClick = (materialId: number) => {
  if (displayMode.value === ASSET_LIST_DISPLAY_MODE.GRID) {
    const scrollContainer = document.querySelector('.md\\:overflow-y-auto')
    if (scrollContainer) {
      sessionStorage.setItem(
        SCROLL_POSITION_KEY,
        JSON.stringify({
          position: scrollContainer.scrollTop,
          page: searchStore.paginationRes?.currentPage,
        })
      )
    }
  }

  if (selectedMaterialList.value.length === 0) {
    goToAssetMaterialDetail({}, materialId)
    return
  }

  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('EE0178'),
    contentText: t('EE0179'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: () => goToAssetMaterialDetail({}, materialId),
    secondaryBtnText: t('UU0002'),
  })
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

const getMaterialList = async (
  payload: SearchPayload<
    AssetsFilter | WorkspaceFilter | InnerExternalFilter | ExternalFilter
  >,
  query: RouteQuery
) => {
  // Reset slim and full material list when starting a new search to avoid showing stale data
  slimMaterialList.value = []
  materialList.value = []

  isLoading.value = true
  isSlimMaterialsLoading.value = true

  const requestInfo = {
    fullMaterialCanceled: false,
    slimMaterialCanceled: false,
  }

  updateUrlWithSearchParams(query)

  await Promise.allSettled([
    assetsStore
      .getAssetsMaterialList(payload as SearchPayload<AssetsFilter>)
      .catch((error: any) => {
        if (error?.name === 'CanceledError') {
          requestInfo.fullMaterialCanceled = true
        }
        throw error
      }),
    assetsStore
      .getAssetsMaterialSlimList(payload as SearchPayload<AssetsFilter>)
      .then((response) => {
        if (!requestInfo.slimMaterialCanceled) {
          isSlimMaterialsLoading.value = false
        }
        return response
      })
      .catch((error: any) => {
        if (error?.name === 'CanceledError') {
          requestInfo.slimMaterialCanceled = true
        }
        throw error
      }),
  ])

  if (!requestInfo.fullMaterialCanceled) {
    isLoading.value = false
  }
}

const updateUrlWithSearchParams = (query: RouteQuery) => {
  const queryParams = new URLSearchParams()
  queryParams.set('displayMode', displayMode.value.toString())

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.set(key, value.toString())
    }
  })

  goToAssets({}, queryParams.toString())
}

const {
  editMaterial,
  createU3m,
  printA4Swatch,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  printLabel,
  mergeMaterial,
  exportExcel,
  deleteMaterial,
  startSpreadSheetUpdate,
} = useAssets()

const sortOptions = computed(() => {
  const {
    CREATE_DATE,
    LAST_UPDATE,
    ITEM_NO_A_Z,
    GHG_LOW_TO_HIGH,
    WATER_LOW_TO_HIGH,
    LAND_LOW_TO_HIGH,
    RELEVANCE,
  } = searchStore.sortOption

  const made2flowPlanStatus = computed(
    () => store.getters['polling/valueAddedService'].made2flow.planStatus
  )
  const isM2fActive = made2flowPlanStatus.value.ACTIVATE
  const m2fTooltip = !isM2fActive ? t('VV0047') : ''

  return {
    base: [
      CREATE_DATE,
      LAST_UPDATE,
      ITEM_NO_A_Z,
      {
        ...GHG_LOW_TO_HIGH,
        disabled: !isM2fActive,
        tooltipMessage: m2fTooltip,
      },
      {
        ...WATER_LOW_TO_HIGH,
        disabled: !isM2fActive,
        tooltipMessage: m2fTooltip,
      },
      {
        ...LAND_LOW_TO_HIGH,
        disabled: !isM2fActive,
        tooltipMessage: m2fTooltip,
      },
    ] as SortOption[],
    keywordSearch: [RELEVANCE] as SortOption[],
  }
})

const optionList = computed(() => {
  if (isLoading.value) {
    return []
  }

  // Define option groups with proper grouping for GridItemMaterial operations
  type FunctionOption = any
  const primaryOptions: FunctionOption[] = []
  const secondaryOptions: FunctionOption[] = [downloadU3m]
  const optionGroups: FunctionOption[][] = [
    secondaryOptions,
    [printLabel, printA4Swatch],
  ]

  const permissionOptionsMap = {
    [FUNC_ID.ASSET_EDIT]: () => optionGroups.unshift([editMaterial]),
    [FUNC_ID.ASSET_COPY]: () => primaryOptions.push(cloneTo),
    [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () =>
      primaryOptions.push(addToWorkspace),
    [FUNC_ID.ASSETS_3DVIEWER_EDIT]: () => secondaryOptions.unshift(createU3m),
    [FUNC_ID.ASSET_DELETE]: () => optionGroups.push([deleteMaterial]),
  }

  permissionList.forEach((permission) => {
    if (permissionOptionsMap[permission]) {
      permissionOptionsMap[permission]()
    }
  })

  if (primaryOptions.length > 0) {
    optionGroups.unshift(primaryOptions)
  }

  return optionGroups
})

const multiSelectOptions = computed(() => {
  const options = [printA4Swatch, printLabel, downloadU3m, exportExcel]

  const permissionOptionsMap = {
    [FUNC_ID.ASSET_COPY]: () => options.unshift(cloneTo),
    [FUNC_ID.ASSET_MERGE]: () => options.push(mergeMaterial),
    [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () => options.push(addToWorkspace),
    [FUNC_ID.ASSET_SPREADSHEET]: () => options.push(startSpreadSheetUpdate),
    [FUNC_ID.ASSET_DELETE]: () => options.push(deleteMaterial),
  }

  permissionList.forEach((permission) => {
    if (permissionOptionsMap[permission]) {
      permissionOptionsMap[permission]()
    }
  })

  return options
})
</script>
