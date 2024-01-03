<style lang="scss">
// overwrite InputCheckbox and InputRadio which are in GridItemWrapper
#input-checkbox,
#input-radio {
  @apply top-1 left-1;
}
</style>

<template lang="pug">
modal-behavior(
  :header="modalTitle"
  :primaryBtnText="actionText"
  :primaryBtnDisabled="actionButtonDisabled"
  @click:primary="innerActionCallback"
)
  div(class="w-151 h-101 flex flex-col")
    f-input-text(
      v-model:textValue="queryParams.keyword"
      prependIcon="search"
      :placeholder="$t('RR0118')"
      :disabled="isInRoot"
      @enter="getWorkspaceList()"
    )
    div(class="flex-grow flex flex-col")
      div(class="relative z-20 flex justify-between items-center py-4")
        global-breadcrumb-list(
          :breadcrumbList="locationList"
          @click:item="visit($event.nodeId)"
        )
        div(class="flex items-center")
          div(
            v-if="isMultiSelect && Array.isArray(selectedValue) && selectedValue.length > 0"
            class="flex items-center"
          )
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
                @click:menu="getWorkspaceList()"
              )
      div(
        v-show="isSearching && nodeList.length === 0"
        class="flex-grow flex items-center justify-center"
      )
        f-svg-icon(iconName="loading" size="92" class="text-primary-400")
      f-scrollbar-container(
        v-show="!isSearching || nodeList.length > 0"
        class="flex-grow -mx-5"
        @reachBottom="infiniteScroll"
      )
        div(class="grid grid-flow-row grid-cols-5 auto-rows-auto gap-5 px-5")
          template(v-if="isInRoot")
            grid-item-wrapper(
              v-for="og in ogList"
              :key="og.ogId"
              v-model:selectedValue="selectedValue"
              isSelectable
              :selectOnHover="false"
              :isMultiSelect="isMultiSelect"
              :selectValue="og.nodeId"
              class="w-25 h-25 border rounded-md overflow-hidden"
              :class="[isMultiSelect && Array.isArray(selectedValue) && selectedValue.some((v) => isEqual(v, og)) ? 'border-primary-400 bg-primary-50 text-primary-400' : 'border-grey-250 bg-grey-50 text-grey-900']"
              @click="(selectedOg = og), visit(og.nodeId)"
            )
              template(#content)
                div(class="h-full flex justify-center items-center")
                  p(class="text-caption text-center font-bold line-clamp-3 leading-1.6") {{ og.ogName }}
          template(v-else)
            div(
              class="w-25 h-25 rounded-md border border-grey-250 border-dashed flex items-center justify-center cursor-pointer"
              @click="openModalCreateCollectionSimple"
            )
              f-svg-icon(iconName="add" size="24" class="text-grey-900")
            template(v-for="node in nodeList")
              grid-item-node-for-modal(
                v-if="node.nodeMeta.nodeType === NODE_TYPE.COLLECTION"
                :key="node.nodeMeta.nodeId"
                class="w-25 cursor-pointer"
                :node="node"
                v-model:selectedValue="selectedValue"
                :isMultiSelect="isMultiSelect"
                @click="visit(node.nodeMeta.nodeId)"
              )
                template(#title-right-icon)
                  tooltip-location(
                    v-if="isInKeywordSearch"
                    :locationList="node.nodeMeta.locationList"
                  )
              grid-item-node-for-modal(
                v-if="node.nodeMeta.nodeType === NODE_TYPE.MATERIAL"
                :key="node.nodeMeta.nodeId"
                class="w-25"
                :node="node"
                :isSelectable="false"
              )
                template(#title-right-icon)
                  tooltip-location(
                    v-if="isInKeywordSearch"
                    :locationList="node.nodeMeta.locationList"
                  )
        div(
          v-if="isSearching && nodeList.length > 0"
          class="flex justify-center items-center"
        )
          f-svg-icon(iconName="loading" size="54" class="text-primary-400")
    f-infobar(
      v-if="!isInRoot"
      class="mt-3.5"
      :messageText="isOnlyShowCollection ? $t('RR0119') : $t('UU0037')"
      :action="{ text: isOnlyShowCollection ? $t('UU0037') : $t('UU0036'), handler: () => { isOnlyShowCollection = !isOnlyShowCollection; }, }"
    )
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { NODE_TYPE, CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import GridItemNodeForModal from '@/components/common/gridItem/GridItemNodeForModal.vue'
import TooltipLocation from '@/components/common/TooltipLocation.vue'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'
import {
  OgType,
  type Organization,
  type Group,
  type NodeMetaLocationListInner,
  type NodeChild,
  NodeType,
} from '@frontier/platform-web-sdk'
import { isEqual } from '@frontier/lib'
import { useWorkspaceStore } from '@/stores/workspace'
import useCurrentUnit from '@/composables/useCurrentUnit'

export interface PropsModalWorkspaceNodeList {
  modalTitle: string
  actionText: string
  actionCallback: (nodeIdList: number[]) => void
  isMultiSelect?: boolean
  canCrossLocation?: boolean
  canSelectSelf?: boolean
  selfNodeId?: number
}

const props = withDefaults(defineProps<PropsModalWorkspaceNodeList>(), {
  isMultiSelect: true,
  canCrossLocation: true,
  canSelectSelf: true,
})

const { t } = useI18n()
const { ogType } = useNavigation()
const { ogNodeId } = useCurrentUnit()
const searchStore = useSearchStore()
const workspaceStore = useWorkspaceStore()
const store = useStore()
const sortMenuTree = computed(() => {
  const { CREATE_DATE_C_M, ITEM_NO_A_Z_C_M } = searchStore.sortOption
  return {
    blockList: [
      {
        menuList: [CREATE_DATE_C_M, ITEM_NO_A_Z_C_M].map(({ text, value }) => ({
          title: text,
          selectValue: value,
        })),
      },
    ],
  }
})

const isSearching = ref(false)
const isOnlyShowCollection = ref(false)
const pureNodeList = ref<NodeChild[]>([])
const selectedValue = ref<number[] | number | null>(
  props.isMultiSelect ? [] : null
)
const appendedLocationList = ref<NodeMetaLocationListInner[]>([])
const queryParams = reactive({
  keyword: null as string | null,
  targetPage: 1,
  sort: searchStore.sortOption.CREATE_DATE_C_M.value,
  nodeId: ogNodeId.value,
})
const totalPage = ref(1)

const ogList = computed(() => {
  const list = []
  if (ogType.value === OgType.ORG) {
    const organization = store.getters[
      'organization/organization'
    ] as Organization
    list.push({
      ogId: organization.orgId,
      nodeId: organization.nodeId,
      ogName: organization.orgName,
    })
    if (props.canCrossLocation) {
      organization.groupList.forEach((group) => {
        list.push({
          ogId: group.groupId,
          nodeId: group.nodeId,
          ogName: group.groupName,
        })
      })
    }
  } else {
    const { groupId, nodeId, groupName } = store.getters['group/group'] as Group
    list.push({
      ogId: groupId,
      nodeId,
      ogName: groupName,
    })
  }
  return list
})
const selectedOg = ref<{
  ogId: number
  ogName: string
  nodeId: number
}>()
const locationList = computed(() => {
  const list = [
    {
      name: t('RR0142'),
      nodeId: -1,
    },
  ]

  if (selectedOg.value) {
    list.push({
      name: selectedOg.value.ogName,
      nodeId: selectedOg.value.nodeId,
    })
  }
  list.push(...appendedLocationList.value)
  return list
})
const isInKeywordSearch = computed(() => !!queryParams.keyword)
const isInRoot = computed(() => locationList.value.length === 1)
const nodeList = computed<NodeChild[]>(() => {
  return pureNodeList.value.filter((node) => {
    if (isOnlyShowCollection.value) {
      return node.nodeMeta.nodeType === NodeType.COLLECTION
    }
    if (isInKeywordSearch.value) {
      return node.nodeMeta.nodeType === NodeType.COLLECTION
    }
    if (!props.canSelectSelf) {
      return node.nodeMeta.nodeId !== props.selfNodeId
    }
    return true
  })
})
const actionButtonDisabled = computed(() => {
  return props.isMultiSelect
    ? Array.isArray(selectedValue.value) && selectedValue.value.length === 0
    : !selectedValue.value
})

const getWorkspaceList = async (targetPage = 1, needReset = true) => {
  isSearching.value = true

  queryParams.targetPage = targetPage

  // first time clear for loading UI
  needReset && (pureNodeList.value.length = 0)

  const {
    data: {
      result: { workspaceNodeCollection, pagination },
    },
  } = await workspaceStore.ogBaseWorkspaceApi('getWorkspaceList', {
    nodeId: queryParams.nodeId,
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

  totalPage.value = pagination.totalPage

  appendedLocationList.value = workspaceNodeCollection.nodeMeta.locationList

  needReset && (pureNodeList.value.length = 0)

  workspaceNodeCollection.childNodeList.forEach((node) =>
    pureNodeList.value.push(node)
  )

  isSearching.value = false
}

const visit = (nodeId: number) => {
  queryParams.keyword = null
  if (nodeId === -1) {
    appendedLocationList.value.length = 0
    selectedOg.value = undefined
  } else {
    queryParams.nodeId = nodeId
    getWorkspaceList()
  }
}

const infiniteScroll = () => {
  if (isSearching.value) {
    return
  }

  const currentPage = queryParams.targetPage
  if (currentPage !== totalPage.value) {
    getWorkspaceList(Math.min(currentPage + 1, totalPage.value), false)
  }
}

const clearSelect = () => {
  Array.isArray(selectedValue.value) && (selectedValue.value.length = 0)
}

const openModalCreateCollectionSimple = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-create-collection-simple',
    properties: {
      nodeId: queryParams.nodeId,
      callback: () => {
        getWorkspaceList()
      },
    },
  })
}

const innerActionCallback = async () => {
  await props.actionCallback(
    Array.isArray(selectedValue.value)
      ? selectedValue.value
      : selectedValue.value !== null
      ? [selectedValue.value]
      : []
  )
}
</script>
