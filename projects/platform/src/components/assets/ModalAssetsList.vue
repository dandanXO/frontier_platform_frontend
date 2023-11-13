<template lang="pug">
modal-behavior(
  :header="modalTitle"
  :primaryBtnText="actionText"
  :primaryBtnDisabled="actionButtonDisabled"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="innerActionCallback"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
) 
  template(#note)
    component(:is="noteComponent")
  div(class="w-145 h-89 flex flex-col")
    f-input-text(
      v-model:textValue="queryParams.keyword"
      prependIcon="search"
      :placeholder="$t('FF0017')"
      :disabled="isInRoot"
      @enter="getMaterialList()"
    )
    div(class="flex-grow flex flex-col")
      div(class="relative z-20 flex justify-between items-center py-4")
        global-breadcrumb-list(
          :breadcrumbList="locationList"
          @click:item="visit($event.ogId, $event.ogType)"
        )
        div(class="flex items-center")
          div(v-if="selectedValue.length > 0" class="flex items-center")
            f-svg-icon(
              iconName="cancel"
              size="14"
              class="text-grey-250 mr-1 cursor-pointer"
              @click="clearSelect"
            )
            i18n-t(
              keypath="RR0073"
              tag="div"
              class="mr-1.5 text-caption"
              scope="global"
            )
              template(#number) {{ selectedValue.length }}
          f-popper(v-if="!isInRoot" placement="bottom-end")
            template(#trigger="{ isExpand }")
              f-svg-icon(
                iconName="sortby"
                size="20"
                class="transform cursor-pointer text-grey-600 hover:text-primary-400"
                :class="{ 'text-primary-400': isExpand }"
              )
            template(#content)
              f-contextual-menu(
                :menuTree="sortMenuTree"
                v-model:inputSelectValue="queryParams.sort"
                :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
                @click:menu="getMaterialList()"
              )
      div(
        v-show="isSearching && materialList.length === 0"
        class="flex-grow flex items-center justify-center"
      )
        f-svg-icon(iconName="loading" size="92" class="text-primary-400")
      f-scrollbar-container(
        v-if="!isSearching || materialList.length > 0"
        class="h-64.5 -mx-5"
        @reachBottom="infiniteScroll"
      )
        div(class="grid grid-flow-row grid-cols-5 auto-rows-auto gap-5 px-5")
          template(v-if="isInRoot")
            div(
              v-for="og in ogList"
              :key="og.ogId"
              class="w-25 h-25 border rounded-md relative flex justify-center items-center cursor-pointer overflow-hidden border-grey-250 bg-grey-50 text-grey-900"
              @click="(selectedOg = og), visit(og.ogType, og.ogId)"
            )
              p(class="text-caption text-center font-bold line-clamp-3") {{ og.ogName }}
          template(v-else)
            grid-item-material-for-modal(
              v-for="material in materialList"
              class="w-25"
              :key="material.materialId"
              v-model:selectedValue="selectedValue"
              :material="material"
            )
        div(
          v-if="isSearching && materialList.length > 0"
          class="flex justify-center items-center"
        )
          f-svg-icon(iconName="loading" size="54" class="text-primary-400")
</template>

<script setup lang="ts">
import { ref, reactive, computed, type Component } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import GridItemMaterialForModal from '@/components/common/gridItem/GridItemMaterialForModal.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'
import {
  OgType,
  type Material,
  type Organization,
  type Group,
} from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'

export interface PropsModalAssetsList {
  modalTitle: string
  actionText: string
  actionCallback: (materialIdList: number[]) => void
  noteComponent?: Component
}

const props = defineProps<PropsModalAssetsList>()

const { t } = useI18n()
const { ogType: initOgType, ogId: initOgId } = useNavigation()
const store = useStore()
const organization = computed<Organization>(
  () => store.getters['organization/organization']
)
const searchStore = useSearchStore()
const sortMenuTree = computed(() => {
  const { CREATE_DATE, LAST_UPDATE, ITEM_NO_A_Z } = searchStore.sortOption
  return {
    blockList: [
      {
        menuList: [CREATE_DATE, LAST_UPDATE, ITEM_NO_A_Z].map(
          ({ text, value }) => ({
            title: text,
            selectValue: value,
          })
        ),
      },
    ],
  }
})
const isSearching = ref(false)
const materialList = ref<Material[]>([])
const queryParams = reactive({
  keyword: null as string | null,
  targetPage: 1,
  sort: searchStore.sortOption.CREATE_DATE.value,
  ogId: initOgId.value,
  ogType: initOgType.value,
})
const totalPage = ref(1)
const selectedValue = ref<number[]>([])
const ogList = computed(() => {
  const group = store.getters['group/group'] as Group
  return [
    {
      ogId: organization.value.orgId,
      ogType: OgType.ORG,
      ogName: organization.value.orgName,
    },
    {
      ogId: group.groupId,
      ogType: OgType.GROUP,
      ogName: group.groupName,
    },
  ]
})
const selectedOg = ref<{
  ogId: number
  ogType: number
  ogName: string
}>()
const locationList = computed(() => {
  const list = [
    {
      name: t('RR0008'),
      ogId: -1,
      ogType: -1,
    },
  ]

  if (selectedOg.value) {
    list.push({
      name: selectedOg.value.ogName,
      ogId: selectedOg.value.ogId,
      ogType: selectedOg.value.ogType,
    })
  }
  return list
})
const isInRoot = computed(
  () => queryParams.ogType === OgType.GROUP && locationList.value.length === 1
)
const actionButtonDisabled = computed(() => selectedValue.value.length === 0)

const innerActionCallback = async () => {
  await props.actionCallback(
    Array.isArray(selectedValue.value)
      ? selectedValue.value
      : selectedValue.value !== null
      ? [selectedValue.value]
      : []
  )
}

const getMaterialList = async (targetPage = 1, needReset = true) => {
  isSearching.value = true

  queryParams.targetPage = targetPage

  // first time clear for loading UI
  needReset && (materialList.value.length = 0)

  const {
    data: { result },
  } = await assetsApi.getAssetMaterialList({
    orgId: organization.value.orgId,
    ogType: queryParams.ogType,
    ogId: queryParams.ogId,
    pagination: {
      isShowMatch: false,
      perPageCount: 40,
      sort: queryParams.sort,
      targetPage: queryParams.targetPage,
    },
    search: queryParams.keyword
      ? {
          keyword: queryParams.keyword,
          tagList: [],
        }
      : null,
    filter: null,
  })

  totalPage.value = result.pagination.totalPage

  needReset && (materialList.value.length = 0)

  result.materialList.forEach((material) => {
    materialList.value.push(material)
  })

  isSearching.value = false
}

const infiniteScroll = () => {
  if (isSearching.value) {
    return
  }

  const currentPage = queryParams.targetPage
  if (currentPage !== totalPage.value) {
    getMaterialList(Math.min(currentPage + 1, totalPage.value), false)
  }
}

const visit = (ogType: OgType | -1, ogId: number) => {
  queryParams.keyword = null
  if (ogId === -1 || ogType === -1) {
    selectedOg.value = undefined
  } else {
    queryParams.ogId = ogId
    queryParams.ogType = ogType
    getMaterialList()
  }
}

const clearSelect = () => (selectedValue.value.length = 0)

if (initOgType.value === OgType.ORG) {
  getMaterialList()
}
</script>
