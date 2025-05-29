<template>
  <search-table-v2
    :display-mode="displayMode"
    :search-type="SEARCH_TYPE.ASSETS"
    :option-sort="sortOptions"
    :option-multi-select="multiSelectOptions"
    :item-list="displayedMaterialList"
    v-model:selected-item-list="selectedMaterialList"
    :is-asset-slim-list-loading="isSlimMaterialsLoading"
    assets
    data-theme="new"
  >
    <template #header-left="{ totalCount }">
      <h5 class="font-bold text-h5 text-grey-900">
        {{ $t('RR0008') }}
        <span class="pl-1 text-caption text-grey-600">
          <span>(</span>
          <i18n-t keypath="RR0068" tag="span" scope="global">
            <template #number>{{ totalCount }}</template>
          </i18n-t>
          <span>)</span>
        </span>
      </h5>
    </template>

    <template #header-right>
      <f-pill-group
        v-if="!imageSearchData"
        :optionList="displayModeOptions"
        v-model:inputValue="displayMode"
        :size="SIZE.LG"
      />
      <f-button
        v-permission="{
          FUNC_ID: FUNC_ID.ASSET_CREATE,
          behavior: 'deleteElement',
        }"
        :size="SIZE.LG"
        prependIcon="texture_add"
        @click="goToMaterialUpload"
        >{{ $t('UU0020') }}
      </f-button>
    </template>

    <template #left-side-content>
      <div
        class="flex flex-col gap-4 p-4 rounded-2xl bg-secondary h-fit"
        v-if="imageSearchData"
      >
        <div
          class="flex flex-col justify-center gap-2 align-center rounded-xl bg-primary w-62 h-60"
        >
          <f-svg-icon
            v-if="isSlimMaterialsLoading"
            iconName="loading"
            size="140"
            class="self-center text-green-600-v1"
            testId="loading-indicator"
          ></f-svg-icon>
          <img
            v-else
            :src="imageSearchData.url"
            class="object-cover w-full h-full rounded-xl"
          />
        </div>
        <f-button
          :size="SIZE.LG"
          prependIcon="sync"
          type="text"
          @click="showSearchByImageModal"
          class="font-semibold underline"
          :disabled="isSlimMaterialsLoading"
          >{{ $t('RR0489') }}</f-button
        >
      </div>
    </template>
    <template #default>
      <div
        class="flex gap-5"
        :class="[
          displayMode === ASSET_LIST_DISPLAY_MODE.LIST
            ? 'flex-col'
            : 'flex-row',
        ]"
      >
        <template v-if="isSlimMaterialsLoading">
          <!-- Skeleton loading for LIST view -->
          <div v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST">
            <div v-for="i in 40" :key="`skeleton-list-${i}`">
              <div
                class="grid grid-cols-12 gap-12 py-5 max-w-405 lg:gap-14 px-14 hover:bg-grey-50"
              >
                <!-- Item content - using col-span-11 like the real component -->
                <div class="grid grid-cols-12 col-span-11">
                  <!-- Left part: image + item details (matches RowItemContent structure) -->
                  <div class="w-full min-w-42.5 max-w-67.5 col-span-3">
                    <!-- Item number -->
                    <SkeletonBase class="h-5 w-3/4 mb-2.5" />

                    <!-- Image placeholder -->
                    <div class="relative w-full aspect-square">
                      <SkeletonBase class="w-full h-full" />
                    </div>

                    <!-- Item specs -->
                    <div class="my-2">
                      <SkeletonBase class="w-full h-4 mb-1" />
                      <SkeletonBase class="w-3/4 h-4" />
                    </div>

                    <!-- Icons row -->
                    <div class="flex gap-3">
                      <SkeletonBase class="w-6 h-6 rounded-full" />
                      <SkeletonBase class="w-6 h-6 rounded-full" />
                    </div>
                  </div>

                  <!-- Material details - other columns -->
                  <div class="col-span-9 pl-5">
                    <!-- Material properties -->
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                      <SkeletonBase class="w-3/4 h-4" />
                      <SkeletonBase class="w-2/3 h-4" />
                      <SkeletonBase class="w-1/2 h-4" />
                      <SkeletonBase class="w-2/3 h-4" />
                      <SkeletonBase class="w-3/4 h-4" />
                      <SkeletonBase class="w-3/5 h-4" />
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
              <div class="my-5 border-b border-grey-250" />
            </div>
          </div>

          <!-- Skeleton loading for GRID view -->
          <div
            v-show="displayMode === ASSET_LIST_DISPLAY_MODE.GRID"
            class="grid w-full gap-y-6 gap-x-5"
            :class="[
              imageSearchData
                ? 'grid-cols-4'
                : 'grid-cols-3 md:grid-cols-4 2xl:grid-cols-5',
            ]"
          >
            <GridItemMaterialSkeleton
              v-for="i in 40"
              :key="`skeleton-grid-${i}`"
            />
          </div>
        </template>
        <template v-else-if="displayedMaterialList.length > 0">
          <div v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST">
            <div
              v-for="(item, index) in displayedMaterialList"
              :key="`${item.materialId}-list`"
            >
              <RowItem
                :key="`${item.materialId}-list`"
                :material="item"
                v-model:selected-list="selectedMaterialList"
                :material-options="materialOptions"
                data-cy="assets-item-list"
                :disabled="isLoading"
              />
              <div
                v-if="index !== displayedMaterialList.length - 1"
                class="my-5 border-b border-grey-250"
              />
            </div>
          </div>

          <div
            v-show="displayMode === ASSET_LIST_DISPLAY_MODE.GRID"
            class="grid grid-cols-3 gap-y-6 gap-x-5"
            :class="[
              imageSearchData
                ? 'grid-cols-4'
                : 'grid-cols-3 md:grid-cols-4 2xl:grid-cols-5',
            ]"
          >
            <GridItemMaterial
              v-for="material in displayedMaterialList"
              :key="material.materialId + '-grid'"
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
                v-if="
                  material.faceSide?.isLowDpi || material.backSide?.isLowDpi
                "
              >
                <LowDpiLabel
                  :material="material"
                  :material-options="materialOptions"
                />
              </template>
            </GridItemMaterial>
          </div>
        </template>
        <EmptyStateAssets v-else />
      </div>
    </template>
  </search-table-v2>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useI18n } from 'vue-i18n'

import { FUNC_ID, PERMISSION_MAP, SIZE } from '@/utils/constants'
import {
  SEARCH_TYPE,
  ASSET_LIST_DISPLAY_MODE,
  NOTIFY_TYPE,
  SCROLL_POSITION_KEY,
} from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { useAssetsStore } from '@/stores/assets'
import { useSearchStore } from '@/stores/search'
import { useAssetsLibraryStore } from '@/stores/assets/library'
import RowItem from '@/components/assets/RowItem.vue'
import GridItemMaterial from '@/components/common/gridItem/GridItemMaterial.vue'
import SkeletonBase from '@/components/common/SkeletonBase.vue'
import EmptyStateAssets from '@/components/assets/EmptyStateAssets.vue'
import ModalSearchByImage from '@/components/common/ModalSearchByImage.vue'
import GridItemMaterialSkeleton from '@/components/common/gridItem/GridItemMaterialSkeleton.vue'
import SearchTableV2 from '@/components/common/SearchTableV2.vue'
import LowDpiLabel from '@/components/assets/LowDpiLabel.vue'

// Permission hook
interface PermissionsAPI {
  hasPermission: (permissionId: string | number) => boolean
  permissionList: number[]
}
const usePermissions = (): PermissionsAPI => {
  const store = useStore()
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId] || []
  return {
    hasPermission: (permissionId: string | number): boolean => {
      const id =
        typeof permissionId === 'string'
          ? parseInt(permissionId, 10)
          : permissionId
      return permissionList.includes(id)
    },
    permissionList,
  }
}

defineOptions({
  name: 'AssetsMaterialList',
})

const assetsStore = useAssetsStore()
const assetsLibraryStore = useAssetsLibraryStore()
const searchStore = useSearchStore()

const {
  displayMode,
  displayedMaterialList,
  selectedMaterialList,
  displayModeOptions,
  sortOptions,
  multiSelectOptions,
  isLoading,
  isSlimMaterialsLoading,
} = storeToRefs(assetsLibraryStore)
const { imageInput: imageSearchData } = storeToRefs(searchStore)
const { t } = useI18n()
const store = useStore()
const { goToMaterialUpload, goToAssetMaterialDetail } = useNavigation()
const { permissionList } = usePermissions()
watch(selectedMaterialList, (newVal) => {
  assetsStore.setSelectedMaterialList(newVal)
})

const materialOptionsRes = await assetsStore.ogBaseAssetsApi(
  'getMaterialOptions'
)
const materialOptions = materialOptionsRes.data.result

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

const {
  editMaterial,
  createU3m,
  printA4Swatch,
  downloadU3m,
  cloneTo,
  addToWorkspace,
  printLabel,
  deleteMaterial,
} = useAssets()

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

const showSearchByImageModal = () => {
  store.dispatch('helper/pushModalCommon', {
    body: ModalSearchByImage,
    classModal: 'w-128',
    theme: 'new',
    title: t('RR0483'),
    onClose: () => {
      store.dispatch('helper/closeModal')
    },
    properties: {
      onFinish: async (file: File) => {
        await searchStore.setImageInput(file)
        store.dispatch('helper/closeModal')
        assetsLibraryStore.search()
      },
    },
  })
}

onMounted(() => {
  if (assetsStore.selectedMaterialList.length > 0) {
    selectedMaterialList.value = assetsStore.selectedMaterialList
  }
})
</script>
