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
      v-model:textValue="keyword"
      prependIcon="search"
      :placeholder="$t('RR0118')"
      :disabled="isInRoot"
      @enter="search"
    )
    div(class="flex-grow flex flex-col")
      div(class="relative z-20 flex justify-between items-center py-4")
        f-breadcrumb(
          :breadcrumbList="breadcrumbList"
          @click:item="goTo($event.key)"
        )
        div(class="flex items-center")
          div(v-if="isMultiSelect && selectedValue.length > 0" class="flex items-center")
            f-svg-icon(
              iconName="cancel"
              size="14"
              class="text-grey-200 mr-1 cursor-pointer"
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
                iconName="swap_horiz"
                size="20"
                class="transform rotate-90 cursor-pointer text-grey-600 hover:text-primary-400"
                :class="{ 'text-primary-400': isExpand }"
              )
            template(#content)
              f-contextual-menu(
                :menuTree="sortMenuTree"
                v-model:inputSelectValue="queryParams.sort"
                :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_NONE_CANCEL"
                @click:menu="sort"
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
              v-for="item in orgAndGroupList"
              v-model:selectedValue="selectedValue"
              isSelectable
              :selectOnHover="false"
              :isMultiSelect="isMultiSelect"
              :selectValue="item"
              class="w-25 h-25 border rounded-md overflow-hidden"
              :class="[isMultiSelect && selectedValue.map((v) => JSON.stringify(v)).includes(JSON.stringify(item)) ? 'border-primary-400 bg-primary-0 text-primary-400' : 'border-grey-200 bg-grey-50 text-grey-900']"
              @click="goTo(item.nodeKey), setRootId(item.id)"
            )
              template(#content)
                div(class="h-full flex justify-center items-center")
                  p(class="text-caption text-center font-bold line-clamp-3 leading-1.6") {{ item.name }}
          template(v-else)
            div(
              class="w-25 h-25 rounded-md border border-grey-200 border-dashed flex items-center justify-center cursor-pointer"
              @click="openModalCreateCollectionSimple"
            )
              f-svg-icon(iconName="add" size="24" class="text-grey-900")
            template(v-for="node in nodeList")
              grid-item-node-for-modal(
                v-if="node.nodeType === NODE_TYPE.COLLECTION"
                class="w-25 cursor-pointer"
                v-model:selectedValue="selectedValue"
                :node="node"
                :isMultiSelect="isMultiSelect"
                @click="goTo(node.nodeKey)"
              )
                template(#title-right-icon)
                  tooltip-location(
                    v-if="isInKeywordSearch"
                    :location="node.location"
                  )
              grid-item-node-for-modal(
                v-if="node.nodeType === NODE_TYPE.MATERIAL"
                class="w-25"
                :node="node"
                :isSelectable="false"
              )
                template(#title-right-icon)
                  tooltip-location(
                    v-if="isInKeywordSearch"
                    :location="node.location"
                  )
        div(
          v-if="isSearching && nodeList.length > 0"
          class="flex justify-center items-center"
        )
          f-svg-icon(iconName="loading" size="54" class="text-primary-400")
    div(
      v-if="!isInRoot"
      class="w-full h-8.5 mt-3.5 px-2.5 bg-grey-50 flex items-center gap-x-1"
    )
      f-svg-icon(iconName="error_outline" size="14" class="text-grey-900")
      p(class="text-caption text-grey-900") {{ isOnlyShowCollection ? $t('RR0119') : $t('UU0037') }}
      p(
        class="text-caption text-cyan-400 cursor-pointer"
        @click="isOnlyShowCollection = !isOnlyShowCollection"
      ) {{ isOnlyShowCollection ? $t('UU0037') : $t('UU0036') }}
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import {
  NODE_LOCATION,
  NODE_TYPE,
  useConstants,
  CONTEXTUAL_MENU_MODE,
} from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import GridItemNodeForModal from '@/components/common/gridItem/GridItemNodeForModal.vue'
import TooltipLocation from '@/components/common/TooltipLocation.vue'

const props = defineProps({
  modalTitle: {
    type: String,
    required: true,
  },
  actionText: {
    type: String,
    required: true,
  },
  actionCallback: {
    type: Function,
    required: true,
  },
  isMultiSelect: {
    type: Boolean,
    default: true,
  },
  canCrossLocation: {
    type: Boolean,
    default: true,
  },
  canSelectSelf: {
    type: Boolean,
    default: true,
  },
  // only have value when canSelectSelf is false
  selfNodeKey: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()
const store = useStore()
const { SORT_BY } = useConstants()
const sortMenuTree = computed(() => {
  const { CREATE_DATE_C_M, MATERIAL_NO_A_Z_C_M } = SORT_BY.value
  return {
    blockList: [
      {
        menuList: [CREATE_DATE_C_M, MATERIAL_NO_A_Z_C_M].map(
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
const isOnlyShowCollection = ref(false)
const pureNodeList = ref([])
const selectedValue = ref(props.isMultiSelect ? [] : '')
const appendedBreadcrumbList = ref([])
const keyword = ref('')
const queryParams = reactive({
  keyword: '',
  targetPage: 1,
  sort: SORT_BY.value.CREATE_DATE_C_M.value,
  workspaceNodeId: null,
  workspaceNodeLocation: null,
})
const totalPage = ref(1)
const rootId = ref(0)

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const orgAndGroupList = computed(() => {
  const list = []
  if (routeLocation.value === 'org') {
    const organization = store.getters['organization/organization']
    list.push({
      id: organization.orgId,
      nodeKey: `${NODE_LOCATION.ORG}-${organization.workspaceNodeId}`,
      name: organization.orgName,
    })
    if (props.canCrossLocation) {
      organization.groupList.forEach((group) => {
        list.push({
          id: group.groupId,
          nodeKey: `${NODE_LOCATION.GROUP}-${group.workspaceNodeId}`,
          name: group.groupName,
        })
      })
    }
  } else {
    const { groupId, workspaceNodeId, groupName } = store.getters['group/group']
    list.push({
      id: groupId,
      nodeKey: `${NODE_LOCATION.GROUP}-${workspaceNodeId}`,
      name: groupName,
    })
  }
  return list
})
const breadcrumbList = computed(() => {
  const list = [...appendedBreadcrumbList.value]
  list.unshift({
    name: t('RR0142'),
    key: 'root',
  })
  return list
})
const isInKeywordSearch = computed(() => !!queryParams.keyword)
const isInRoot = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => {
  let temp = pureNodeList.value
  if (isOnlyShowCollection.value) {
    temp = temp.filter((node) => node.nodeType === NODE_TYPE.COLLECTION)
  }
  if (isInKeywordSearch.value) {
    temp = temp.filter((node) => node.nodeType === NODE_TYPE.COLLECTION)
  }
  if (!props.canSelectSelf) {
    temp = temp.filter((node) => node.nodeKey !== props.selfNodeKey)
  }
  return temp
})
const actionButtonDisabled = computed(() => {
  return props.isMultiSelect
    ? selectedValue.value.length === 0
    : !selectedValue.value
})

const setRootId = (id) => (rootId.value = id)

const getWorkspaceForModal = async () => {
  isSearching.value = true

  const { pagination, workspaceCollection } = await store.dispatch(
    'workspace/getWorkspaceForModal',
    queryParams
  )
  totalPage.value = pagination.totalPage

  appendedBreadcrumbList.value = workspaceCollection.breadcrumbList.map(
    (item) => ({
      key: `${item.workspaceNodeLocation}-${item.workspaceNodeId}`,
      name: item.name,
    })
  )

  if (workspaceCollection.childCollectionList.length > 0) {
    workspaceCollection.childCollectionList.forEach((collection) => {
      const {
        workspaceNodeLocation,
        workspaceNodeId,
        isPublic,
        isCanShared,
        isCanClone,
        isCanDownloadU3M,
        location,
        publicDate,
        share,
        publish,
        /** collection property */
        collectionId,
        name,
        coverImgList,
        itemCounts,
        hasChildCollection,
      } = collection
      pureNodeList.value.push({
        workspaceNodeId,
        workspaceNodeLocation,
        nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        nodeType: NODE_TYPE.COLLECTION,
        location,
        isPublic,
        isCanShared,
        isCanClone,
        isCanDownloadU3M,
        publicDate,
        share,
        publish,
        properties: {
          collectionId,
          name,
          coverImgList,
          itemCounts,
          hasChildCollection,
        },
      })
    })
  }

  if (workspaceCollection.childMaterialList.length > 0) {
    workspaceCollection.childMaterialList.forEach((material) => {
      const {
        workspaceNodeId,
        workspaceNodeLocation,
        isPublic,
        isCanShared,
        isCanClone,
        isCanDownloadU3M,
        location,
        publicDate,
        share,
        publish,
        rank,
        /** material property */
        materialId,
        materialNo,
        content,
        description,
        finish,
        width,
        weightUnit,
        weightGsm,
        weightOz,
        weightOy,
        warpDensity,
        weftDensity,
        warpYarnCount,
        weftYarnCount,
        coverImg,
      } = material
      pureNodeList.value.push({
        workspaceNodeId,
        workspaceNodeLocation,
        nodeKey: `${workspaceNodeLocation}-${workspaceNodeId}`,
        nodeType: NODE_TYPE.MATERIAL,
        location,
        isPublic,
        isCanShared,
        isCanClone,
        isCanDownloadU3M,
        publicDate,
        share,
        publish,
        rank,
        properties: {
          materialId,
          materialNo,
          content,
          description,
          finish,
          width,
          weightUnit,
          weightGsm,
          weightOz,
          weightOy,
          warpDensity,
          weftDensity,
          warpYarnCount,
          weftYarnCount,
          coverImg,
        },
      })
    })
  }

  isSearching.value = false
}

const parseAndSetKey = (key) => {
  const [workspaceNodeLocation, workspaceNodeId] = key.split('-')
  queryParams.workspaceNodeLocation = workspaceNodeLocation
  queryParams.workspaceNodeId = workspaceNodeId
}

const clearNodeList = () => {
  pureNodeList.value.length = 0
  queryParams.targetPage = 1
}

const clearKeyword = () => {
  keyword.value = ''
  queryParams.keyword = ''
}

const goTo = (key) => {
  clearKeyword()
  clearNodeList()
  if (key === 'root') {
    appendedBreadcrumbList.value.length = 0
  } else {
    parseAndSetKey(key)
    getWorkspaceForModal()
  }
}

const search = () => {
  queryParams.keyword = keyword.value
  clearNodeList()
  getWorkspaceForModal()
}

const sort = () => {
  clearNodeList()
  getWorkspaceForModal()
}

const infiniteScroll = () => {
  if (isSearching.value) {
    return
  }

  const currentPage = queryParams.targetPage
  if (currentPage !== totalPage.value) {
    queryParams.targetPage = Math.min(currentPage + 1, totalPage.value)
    getWorkspaceForModal()
  }
}

const clearSelect = () => (selectedValue.value.length = 0)

const openModalCreateCollectionSimple = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-create-collection-simple',
    properties: {
      id: rootId.value,
      workspaceNodeLocation: Number(queryParams.workspaceNodeLocation),
      workspaceNodeId: Number(queryParams.workspaceNodeId),
      callback: () => {
        clearNodeList()
        getWorkspaceForModal()
      },
    },
  })
}

const innerActionCallback = async () => {
  await props.actionCallback(selectedValue.value)
}
</script>
