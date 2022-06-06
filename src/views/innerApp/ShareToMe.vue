<template lang="pug">
div(class="w-full h-full")
  search-table(
    :searchType="SEARCH_TYPE.SHARE"
    :searchCallback="getShareToMeList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-center")
        div(class="flex items-end")
          breadcrumb(:breadcrumbList="breadcrumbList" @click:item="setSharingIdAndNodeKey($event.nodeKey); goTo()" fontSize="text-h6")
          p(class="flex text-caption text-black-700 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span")
              template(#number) {{ pagination.totalCount }}
            span )
        tooltip(v-if="!isFirstLayer" placement="bottom")
          template(#trigger)
            svg-icon(
              iconName="clone"
              class="text-black-700 cursor-pointer hover:text-brand ml-1"
              size="24"
              @click="shareToMeCloneByCollection(currentNodeKey, collection.share.sharingId, collection.isCanClone)"
            )
          template(#content)
            p(class="text-caption text-primary px-3 py-1") {{ $t("RR0056") }}
    template(#header-right)
      div(v-if="!isFirstLayer" class="relative cursor-pointer" @click="openModalShareMessage")
        svg-icon(iconName="chat" size="24" class="text-black-700")
        div(v-if="haveMsgAndFirstRead" class="absolute -top-px -right-px w-2 h-2 rounded-full border border-black-0 bg-warn")
      btn(v-if="!isFirstLayer" size="sm" type="secondary" class="-mr-3" @click="openModalCollectionDetail") {{ $t("UU0057") }}
    template(v-if="!isFirstLayer" #sub-header)
      div(class="mx-7.5 mb-7.5 text-caption text-black-700 flex items-center")
        p(class="pr-2.5") {{ collection.share.displayName }}
        p {{ $t("RR0148") }} {{ $dayjs.unix(collection.share.shareDate).format("YYYY/MM/DD") }}
    template(#default="{ inSearch, goTo }")
      div(v-if="nodeList.length > 0" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start")
        child-node-item(
          v-for="node in nodeList"
          v-model:selectedList="selectedNodeList"
          :node="node"
          :properties="node"
          :displayName="node.nodeType === NODE_TYPE.COLLECTION ? node.name : node.materialNo"
          :optionList="optionNode"
          :isShowLocation="inSearch"
          :locationList="node.location"
          @click:option="$event.func(node, node.share.sharingId)"
          @click.stop="handleNodeClick(node, goTo)"
        )
          template(#caption v-if="isFirstLayer")
            div(class="mt-1.5 h-6 flex items-center")
              img(:src="node.share.logo" class="aspect-square h-full rounded-full")
              p(class="pl-1 font-bold text-caption text-primary") {{ node.share.displayName }}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-primary") {{ $t("HH0001") }}
    template(#menu-option="{ option }")
      div(
        v-if="option.name === $t('RR0167')"
        class="whitespace-nowrap cursor-pointer hover:text-brand px-5"
        @click="shareToMeCloneByNodeList(selectedNodeList.map(item => JSON.parse(item)), collection.share.sharingId)"
      ) {{ option.name }}
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { SORT_BY, SEARCH_TYPE, NODE_TYPE } from '@/utils/constants.js'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import ChildNodeItem from '@/components/common/ChildNodeItem.vue'
import { useRoute, useRouter } from 'vue-router'
import useShareToMe from '@/composables/useShareToMe'
import useNavigation from '@/composables/useNavigation'

const props = defineProps({
  nodeKey: {
    type: String,
    default: null
  }
})

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const { shareToMeCloneByNode, shareToMeCloneByNodeList, shareToMeCloneByCollection, shareToMeDeleteByNode, shareToMeDeleteByNodeList } = useShareToMe()
const { goToShareToMeMaterial } = useNavigation()
const optionSort = {
  base: [
    SORT_BY.MATERIAL_NO_A_Z_C_M,
    SORT_BY.LAST_UPDATE
  ],
  keywordSearch: [
    SORT_BY.RELEVANCE_C_M
  ]
}
const optionMultiSelect = computed(() => {
  return isFirstLayer.value
    ? [{ name: t('RR0063'), func: shareToMeDeleteByNodeList }]
    : [{ name: t('RR0167'), func: shareToMeCloneByNodeList }]
})
const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['shareToMe/collection'])
const breadcrumbList = computed(() => store.getters['shareToMe/collectionBreadcrumbList']({
  name: t('RR0010'),
  nodeKey: null
}))
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['shareToMe/nodeList'])
const optionNode = computed(() => {
  const optionList = [
    [
      { name: t('RR0167'), func: shareToMeCloneByNode }
    ]
  ]
  if (isFirstLayer.value) {
    optionList[0].push({ name: t('RR0063'), func: shareToMeDeleteByNode })
  }
  return optionList
})
const currentNodeKey = ref(props.nodeKey)
const sharingId = ref(route.query.sharingId || null)
const selectedNodeList = ref([])
const isFirstTime = ref(true)
const haveMsgAndFirstRead = computed(() => !!collection.value?.share?.message && isFirstTime.value)

const getShareToMeList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value
    },
    query: {
      sharingId: sharingId.value,
      ...query
    }
  })
  await store.dispatch('shareToMe/getShareToMeList', { targetPage, sharingId: sharingId.value, nodeKey: currentNodeKey.value })
}

const setSharingIdAndNodeKey = (nodeKey, targetSharingId = null) => {
  currentNodeKey.value = nodeKey
  if (targetSharingId && isFirstLayer.value) {
    sharingId.value = targetSharingId
  } else if (nodeKey === null && targetSharingId === null) {
    sharingId.value = null
  }
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModal', {
    header: t('FF0006'),
    component: 'modal-collection-detail',
    properties: {
      ...collection.value
    }
  })
}

const openModalShareMessage = () => {
  isFirstTime.value = false
  store.dispatch('helper/openModal', {
    component: 'modal-share-message',
    header: t('RR0146'),
    properties: {
      message: collection.value.share.message
    }
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    setSharingIdAndNodeKey(node.nodeKey, node.share.sharingId)
    goTo()
  } else {
    goToShareToMeMaterial(node.nodeKey, node.share.sharingId)
  }
}


watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)
</script>
