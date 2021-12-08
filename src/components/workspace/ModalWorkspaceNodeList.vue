<template lang="pug">
div(class="w-161 h-138 px-8 flex flex-col")
  div
    h6(class="text-h6 font-bold text-primary text-center pb-7.5") {{modalTitle}}
    input-text(
      v-model:textValue="keyword"
      prependIcon="search"
      :placeholder="$t('RR0118')"
      :disabled="isInRoot"
      @enter="search"
    )
  div(class="flex-grow flex flex-col")
    div(class="relative z-20 flex justify-between items-center py-4")
      breadcrumbs(:breadcrumbsList="breadcrumbsList" @click:item="goTo($event.key)")
      div(class="flex items-center")
        div(v-if="isMultiSelect && selectedValue.length > 0" class="flex items-center")
          svg-icon(iconName="cancel" size="14" class="text-black-400 mr-1 cursor-pointer" @click="clearSelect")
          i18n-t(keypath="RR0073" tag="div" class="mr-1.5 text-caption")
            template(#number) {{selectedValue.length}}
        tooltip(
          v-if="!isInRoot"
          placement="bottom-end"
          :manual="true"
          :showArrow="false"
          :offset="[0, 8]"
        )
          template(#trigger="{ isActive }")
            svg-icon(
              iconName="swap_horiz"
              size="20"
              class="transform rotate-90 cursor-pointer text-black-700 hover:text-brand"
              :class="{ 'text-brand': isActive }"
            )
          template(#content)
            contextual-menu(v-model:selectValue="queryParams.sort" :optionList="sortOptionList" @update:selectValue="sort")
    div(v-show="isSearching && nodeList.length === 0" class="flex-grow flex items-center justify-center")
      svg-icon(iconName="loading" size="92" class="text-brand")
    overlay-scrollbar-container(v-show="!isSearching || nodeList.length > 0" class="flex-grow -mx-8" @reachBottom="infiniteScroll")
      div(class="grid grid-flow-row grid-cols-5 auto-rows-auto gap-5 px-8")
        template(v-if="isInRoot")
          div(v-for="item in orgAndGroupList"
            class="w-25 h-25 border rounded-md relative flex justify-center items-center cursor-pointer overflow-hidden"
            :class="[isMultiSelect && selectedValue.includes(item.key) ? 'border-brand bg-brand-light text-brand' : 'border-black-400 bg-black-100 text-primary']"
            @click="goTo(item.key), setRootId(item.id)"
          )
            p(class="text-caption text-center line-height-1.6 font-bold line-clamp-3") {{item.name}}
            div(class="w-full h-7.5 absolute top-0 left-0")
              div(class="bg-linear w-full h-full rounded-t-md")
              input-checkbox(
                v-model:inputValue="selectedValue"
                :value="item.key"
                size="20"
                class="cursor-pointer absolute top-1 left-1 -z-1"
                iconColor="text-black-0"
                uncheckColor="text-black-0"
                @click.stop
              )
        template(v-else)
          div(
            class="w-25 h-25 rounded-md border border-black-500 border-dashed flex items-center justify-center cursor-pointer"
            @click="openModalCreateCollectionSimple"
          )
            svg-icon(iconName="add" size="24" class="text-primary")
          template(v-for="node in nodeList")
            template(v-if="node.nodeType === NODE_TYPE.COLLECTION")
              node-item-for-modal(
                class="w-25 cursor-pointer"
                v-model:selectedValue="selectedValue"
                :nodeType="node.nodeType"
                :nodeKey="node.key"
                :node="node.data"
                :displayName="node.data.name"
                :isShowLocation="isInKeywordSearch"
                :isMultiSelect="isMultiSelect"
                @click="goTo(node.key)"
              )
            template(v-if="node.nodeType === NODE_TYPE.MATERIAL")
              node-item-for-modal(
                class="w-25"
                :nodeType="node.nodeType"
                :nodeKey="node.key"
                :node="node.data"
                :displayName="node.data.materialNo"
                :isShowLocation="isInKeywordSearch"
                :isSelectable="false"
              )
      div(v-if="isSearching && nodeList.length > 0" class="flex justify-center items-center")
        svg-icon(iconName="loading" size="54" class="text-brand")
  div(v-if="!isInRoot" class="w-full h-8.5 mt-3.5 px-2.5 bg-black-50 flex items-center gap-x-1")
    svg-icon(iconName="error_outline" size="14" class="text-primary")
    p(class="text-caption text-primary") {{isOnlyShowCollection ? $t('RR0119'): $t('UU0037')}}
    p(class="text-caption text-assist-blue cursor-pointer" @click="isOnlyShowCollection = !isOnlyShowCollection") {{isOnlyShowCollection ? $t('UU0037') : $t('UU0036')}}
  btn-group(
    class="h-25"
    :primaryText="actionText"
    :primaryButtonDisabled="actionButtonDisabled"
    @click:primary="innerActionCallback"
    :secondaryButton="false"
  )
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { NODE_LOCATION, NODE_TYPE, SORT_BY } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import NodeItemForModal from '@/components/layout/NodeItemForModal.vue'

export default {
  name: 'ModalWorkspaceNodeList',
  components: {
    NodeItemForModal
  },
  props: {
    modalTitle: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      required: true
    },
    actionCallback: {
      type: Function,
      required: true
    },
    canCrossLocation: {
      type: Boolean,
      default: false
    },
    isMultiSelect: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()

    const sortOptionList = [
      SORT_BY.CREATE_DATE_C_M,
      SORT_BY.MATERIAL_NO_A_Z_C_M
    ]

    const isSearching = ref(false)
    const isOnlyShowCollection = ref(false)
    const pureNodeList = ref([])
    const selectedValue = ref(props.isMultiSelect ? [] : '')
    const appendedBreadcrumbsList = ref([])
    const keyword = ref('')
    const queryParams = reactive({
      keyword: '',
      targetPage: 1,
      sort: sortOptionList[0].value,
      workspaceNodeId: null,
      type: null
    })
    const totalPage = ref(1)
    const rootId = ref(0)

    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const orgAndGroupList = computed(() => {
      const organization = store.getters['organization/organization']
      const list = []
      list.push({
        id: organization.orgId,
        key: `${NODE_LOCATION.ORG}-${organization.workspaceNodeId}`,
        name: organization.orgName
      })
      organization.groupList.forEach(group => {
        list.push({
          id: group.groupId,
          key: `${NODE_LOCATION.GROUP}-${group.workspaceNodeId}`,
          name: group.groupName
        })
      })
      return list
    })
    const breadcrumbsList = computed(() => {
      const list = [...appendedBreadcrumbsList.value]
      let key

      if (props.canCrossLocation) {
        key = 'root'
      } else {
        if (routeLocation.value === 'org') {
          const { workspaceNodeId } = store.getters['organization/organization']
          key = `${NODE_LOCATION.ORG}-${workspaceNodeId}`
        }
        if (routeLocation.value === 'group') {
          const { workspaceNodeId } = store.getters['group/group']
          key = `${NODE_LOCATION.GROUP}-${workspaceNodeId}`
        }
      }

      list.unshift({
        name: t('RR0009'),
        key
      })
      return list
    })
    const isInKeywordSearch = computed(() => !!queryParams.keyword)
    const isInRoot = computed(() => props.canCrossLocation && breadcrumbsList.value.length === 1)
    const nodeList = computed(() => {
      if (isOnlyShowCollection.value) {
        return pureNodeList.value.filter(node => node.nodeType === NODE_TYPE.COLLECTION)
      }
      if (isInKeywordSearch.value) {
        return pureNodeList.value.filter(node => node.nodeType === NODE_TYPE.COLLECTION)
      }
      return pureNodeList.value
    })
    const actionButtonDisabled = computed(() => {
      return props.isMultiSelect
        ? selectedValue.value.length === 0
        : !selectedValue.value
    })

    const setRootId = (id) => (rootId.value = id)

    const getWorkspaceForModal = async () => {
      isSearching.value = true

      const { pagination, workspaceCollection } = await store.dispatch('workspace/getWorkspaceForModal', queryParams)
      totalPage.value = pagination.totalPage

      appendedBreadcrumbsList.value = workspaceCollection.breadcrumbList.map(item => ({
        key: `${item.type}-${item.workspaceNodeId}`,
        name: item.name
      }))

      if (workspaceCollection.childCollectionList.length > 0) {
        workspaceCollection.childCollectionList.forEach(collection => {
          pureNodeList.value.push({
            key: `${collection.type}-${collection.workspaceNodeId}`,
            nodeType: NODE_TYPE.COLLECTION,
            data: collection
          })
        })
      }

      if (workspaceCollection.childMaterialList.length > 0) {
        workspaceCollection.childMaterialList.forEach(material => {
          pureNodeList.value.push({
            key: `${material.type}-${material.workspaceNodeId}`,
            nodeType: NODE_TYPE.MATERIAL,
            data: material
          })
        })
      }

      isSearching.value = false
    }

    const parseAndSetKey = (key) => {
      const [type, workspaceNodeId] = key.split('-')
      queryParams.type = type
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
        appendedBreadcrumbsList.value.length = 0
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
      if (isSearching.value) { return }

      const currentPage = queryParams.targetPage
      if (currentPage !== totalPage.value) {
        queryParams.targetPage = Math.min(currentPage + 1, totalPage.value)
        getWorkspaceForModal()
      }
    }

    const clearSelect = () => (selectedValue.value.length = 0)

    const openModalCreateCollectionSimple = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-create-collection-simple',
        properties: {
          id: rootId.value,
          type: Number(queryParams.type),
          workspaceNodeId: Number(queryParams.workspaceNodeId),
          callback: () => {
            clearNodeList()
            getWorkspaceForModal()
          }
        }
      })
    }

    const innerActionCallback = async () => {
      await props.actionCallback(selectedValue.value)
    }

    if (!props.canCrossLocation) {
      goTo(breadcrumbsList.value[0].key)

      if (routeLocation.value === 'org') {
        const { orgId } = store.getters['organization/organization']
        setRootId(orgId)
      } else if (routeLocation.value === 'group') {
        const { groupId } = store.getters['group/group']
        setRootId(groupId)
      }
    }

    return {
      queryParams,
      orgAndGroupList,
      selectedValue,
      infiniteScroll,
      breadcrumbsList,
      goTo,
      isInRoot,
      isOnlyShowCollection,
      isSearching,
      NODE_TYPE,
      nodeList,
      search,
      clearSelect,
      openModalCreateCollectionSimple,
      setRootId,
      keyword,
      sortOptionList,
      getWorkspaceForModal,
      sort,
      isInKeywordSearch,
      innerActionCallback,
      actionButtonDisabled
    }
  }
}
</script>
