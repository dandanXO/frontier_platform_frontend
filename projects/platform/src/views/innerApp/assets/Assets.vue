<template lang="pug">
search-table(
  :searchType="SEARCH_TYPE.ASSETS"
  :searchCallback="getMaterialList"
  :optionSort="optionSort"
  :optionMultiSelect="optionMultiSelect"
  :itemList="materialList"
  v-model:selectedItemList="selectedMaterialList"
)
  template(#header-left="{ totalCount }")
    h5(class="text-h5 font-bold text-grey-900") {{ $t('RR0008') }}
      span(class="text-caption text-grey-600 pl-1")
        span (
        i18n-t(keypath="RR0068" tag="span" scope="global")
          template(#number) {{ totalCount }}
        span )
  template(#header-right)
    f-input-tap(
      :optionList="displayModeOptionList"
      v-model:inputValue="displayMode"
    )
    f-button(
      v-permission="{ FUNC_ID: FUNC_ID.ASSET_CREATE, behavior: 'deleteElement' }"
      size="sm"
      prependIcon="texture_add"
      @click="goToMaterialUpload"
    ) {{ $t('UU0020') }}
  template(#default)
    template(v-if="materialList.length > 0")
      //- Jira: F22-3010
      //- 因為 rowItem 加入 color, pattern 呈現後，每個 rowItem 的高度會不一致，所以無法使用 recycle-scroller
      //- 先改回 v-for 去 render，但是會犧牲部分效能
      //- recycle-scroller(
      //-   v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST"
      //-   :items="materialList"
      //-   :itemSize="currentItemSize"
      //-   key-field="materialId"
      //-   pageMode
      //-   v-slot="{ item, index }"
      //-   @resize="resize"
      //-   :buffer="currentItemSize * 3"
      //- )
      //-   row-item(
      //-     :key="item.materialId"
      //-     :material="item"
      //-     v-model:selectedList="selectedMaterialList"
      //-     data-cy="assets"
      //-   )
      //-   div(
      //-     v-if="index !== materialList.length - 1"
      //-     class="border-b border-grey-250 mx-7.5 my-5"
      //-   )
      div(
        v-show="displayMode === ASSET_LIST_DISPLAY_MODE.LIST"
        v-for="(item, index) in materialList"
        :key="item.materialId"
      )
        row-item(
          :material="item"
          v-model:selectedList="selectedMaterialList"
          :materialOptions="materialOptions"
          data-cy="assets-item-list"
        )
        div(
          v-if="index !== materialList.length - 1"
          class="border-b border-grey-250 mx-7.5 my-5"
        )
      div(
        v-show="displayMode === ASSET_LIST_DISPLAY_MODE.GRID"
        class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5"
      )
        grid-item-material(
          v-for="material in materialList"
          :key="material.materialId"
          :material="material"
          :selectValue="material"
          v-model:selectedValue="selectedMaterialList"
          :optionList="optionList"
          @click.stop="clickMaterialItemHandler(material.materialId)"
          :drawerOpenFromLocationList="[]"
          data-cy="assets-item-grid"
          :data-tooltip-boundary-reference="`material-${material.materialId}`"
        )
          template(
            #title-right-icon
            v-if="material.faceSide?.isLowDpi || material.backSide?.isLowDpi"
          )
            low-dpi-label(
              :material="material"
              :materialOptions="materialOptions"
            )
    div(v-else class="flex h-full justify-center items-center")
      div(class="flex flex-col justify-center items-center")
        div(
          v-if="permissionList.includes(FUNC_ID.ASSET_CREATE)"
          class="border border-grey-250 rounded-md border-dashed p-2 cursor-pointer"
          @click="goToMaterialUpload()"
        )
          f-svg-icon(iconName="texture_add" size="24" class="text-grey-900")
        p(
          v-if="permissionList.includes(FUNC_ID.ASSET_CREATE)"
          class="text-body2 text-grey-900 pt-3"
        ) {{ $t('EE0079') }}
        div(v-else class="text-body2 text-grey-900") {{ $t('HH0013') }}
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
  type SortOption,
} from '@/components/common/SearchTable.vue'
import RowItem from '@/components/assets/RowItem.vue'
import GridItemMaterial from '@/components/common/gridItem/GridItemMaterial.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useAssets from '@/composables/useAssets'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'
import {
  SEARCH_TYPE,
  ASSET_LIST_DISPLAY_MODE,
  NOTIFY_TYPE,
} from '@/utils/constants'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useRoute, useRouter } from 'vue-router'
// https://github.com/Akryum/vue-virtual-scroller/tree/next/packages/vue-virtual-scroller
import { useI18n } from 'vue-i18n'
import { useAssetsStore } from '@/stores/assets'
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import type { AssetsFilter, Material } from '@frontier/platform-web-sdk'
import LowDpiLabel from '@/components/assets/LowDpiLabel.vue'

const assetsStore = useAssetsStore()
const searchStore = useSearchStore()
const { materialList } = storeToRefs(assetsStore)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const store = useStore()
const { goToMaterialUpload, goToAssetMaterialDetail } = useNavigation()
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

const materialOptionsRes = await assetsStore.ogBaseAssetsApi(
  'getMaterialOptions'
)
const materialOptions = materialOptionsRes.data.result

const selectedMaterialList = ref<Material[]>([])
const displayMode = ref<ASSET_LIST_DISPLAY_MODE>(ASSET_LIST_DISPLAY_MODE.GRID)
const optionSort = computed(() => {
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
  return {
    base: [
      CREATE_DATE,
      LAST_UPDATE,
      ITEM_NO_A_Z,
      {
        ...GHG_LOW_TO_HIGH,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...WATER_LOW_TO_HIGH,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
      {
        ...LAND_LOW_TO_HIGH,
        disabled: !made2flowPlanStatus.value.ACTIVATE,
        tooltipMessage: !made2flowPlanStatus.value.ACTIVATE && t('VV0047'),
      },
    ] as SortOption[],
    keywordSearch: [RELEVANCE] as SortOption[],
  }
})

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
const optionList = computed(() => {
  const funcOneList: any[] = []
  const funTwoList = [downloadU3m]
  const optionList = [funTwoList, [printLabel, printA4Swatch]]

  // Get the role and retrieve the corresponding permissions
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]

  // Map each permission ID to its corresponding handler logic
  const permissionHandlerMap = {
    [FUNC_ID.ASSET_EDIT]: () => {
      // If user can edit materials
      optionList.unshift([editMaterial])
    },
    [FUNC_ID.ASSET_COPY]: () => {
      // If user can copy assets
      funcOneList.push(cloneTo)
    },
    [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () => {
      // If user can add assets to workspace
      funcOneList.push(addToWorkspace)
    },
    [FUNC_ID.ASSETS_3DVIEWER_EDIT]: () => {
      // If user can edit in 3D viewer
      funTwoList.unshift(createU3m)
    },
    [FUNC_ID.ASSET_DELETE]: () => {
      // If user can delete assets
      optionList.push([deleteMaterial])
    },
  }

  // Single pass over permissionList to apply the appropriate modifications
  permissionList.forEach((permission) => {
    if (permissionHandlerMap[permission]) {
      permissionHandlerMap[permission]()
    }
  })

  // After populating funcOneList, if it has items, add it at the beginning of optionList
  if (funcOneList.length > 0) {
    optionList.unshift(funcOneList)
  }

  return optionList
})

const optionMultiSelect = computed(() => {
  // Base list of functions
  const list = [printA4Swatch, printLabel, downloadU3m, exportExcel]

  // Get the role and permissions
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]

  // Map each permission ID to the corresponding operation
  const permissionHandlerMap = {
    [FUNC_ID.ASSET_COPY]: () => {
      list.unshift(cloneTo)
    },
    [FUNC_ID.ASSET_MERGE]: () => {
      list.push(mergeMaterial)
    },
    [FUNC_ID.ASSET_ADD_TO_WORK_SPACE]: () => {
      list.push(addToWorkspace)
    },
    [FUNC_ID.ASSET_SPREADSHEET]: () => {
      list.push(startSpreadSheetUpdate)
    },
    [FUNC_ID.ASSET_DELETE]: () => {
      list.push(deleteMaterial)
    },
  }

  // Single pass over permissionList to execute the relevant handlers
  permissionList.forEach((permission) => {
    if (permissionHandlerMap[permission]) {
      permissionHandlerMap[permission]()
    }
  })

  // Return the updated list
  return list
})

const getMaterialList = async (
  payload: SearchPayload<AssetsFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name,
    query,
  })
  await assetsStore.getAssetsMaterialList(payload)
}

const displayModeOptionList = [
  {
    selectValue: ASSET_LIST_DISPLAY_MODE.GRID,
    icon: 'apps',
  },
  {
    selectValue: ASSET_LIST_DISPLAY_MODE.LIST,
    icon: 'format_list_bulleted',
  },
]

// Jira: F22-3010
// 因為 rowItem 加入 color, pattern 呈現後，每個 rowItem 的高度會不一致，所以無法使用 recycle-scroller
// 先改回 v-for 去 render，但是會犧牲部分效能
// const currentItemSize = ref(379)
// const resize = () => {
//   /**
//    * @Todo figure out what happen in Safari
//    */
//   if (document.querySelector('.vue-recycle-scroller__item-view')) {
//     currentItemSize.value =
//       document?.querySelector('.vue-recycle-scroller__item-view')
//         ?.clientHeight ?? 379
//   } else {
//     currentItemSize.value = 379
//   }
// }
</script>
