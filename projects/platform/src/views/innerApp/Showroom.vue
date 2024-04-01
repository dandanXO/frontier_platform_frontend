<template lang="pug">
div(class="w-full h-full relative")
  search-table(
    :searchType="SEARCH_TYPE.INNER_EXTERNAL"
    :searchCallback="getShowroomNodeList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :canSelectAll="!isFirstLayer"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ visit, totalCount }")
      div(class="flex items-center gap-x-4")
        div(class="flex items-end")
          div(class="flex items-center")
            p(
              class="text-grey-900 hover:text-primary-400 cursor-pointer text-h6"
              @click="goToPublicLibrary()"
            ) {{ $t('RR0003') }}
            f-svg-icon(size="20" iconName="slash" class="text-grey-200")
            global-breadcrumb-list(
              :breadcrumbList="locationList"
              @click:item="$event.goTo(); visit()"
              fontSize="text-h6"
            )
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ totalCount }}
            span )
        template(v-if="!isFirstLayer && workspaceNodeCollection")
          f-tooltip-standard(:tooltipMessage="$t('RR0167')")
            template(#slot:tooltip-trigger)
              f-svg-icon(
                iconName="clone"
                class="text-grey-600 cursor-pointer hover:text-primary-400"
                size="24"
                @click="publicLibraryClone([workspaceNodeCollection.nodeMeta.nodeId], workspaceNodeCollection.nodeMeta.isCanClone, $t('II0009'))"
              )
          f-tooltip-standard(:tooltipMessage="$t('II0034')")
            template(#slot:tooltip-trigger)
              f-svg-icon(
                iconName="forward_to_mail"
                size="24"
                class="text-grey-600 hover:text-primary-400"
                @click="openModalShowroomContactForm(workspaceNodeCollection.nodeMeta.orgId, true)"
              )
    template(#header-right)
      f-popper(v-if="isFirstLayer" placement="bottom-end" class="self-end")
        template(#trigger)
          f-button(size="sm" prependIcon="email") {{ $t('UU0119') }}
        template(#content="{ collapsePopper }")
          f-scrollbar-container(
            class="w-86 max-h-117.5 rounded pt-2 pb-3 bg-grey-0 shadow-16"
          )
            div(class="h-9.5 pl-3 font-bold text-body2 flex items-center") {{ $t('II0023') }}
            div(class="px-2 grid grid-flow-row gap-1")
              div(
                v-for="org in showroom.participatedOrgList"
                :key="org.orgName"
                class="h-12 hover:bg-grey-100 rounded flex items-center pl-2 pr-3"
                :data-tooltip-boundary-reference="`contact-org-${org.orgName}`"
              )
                img(:src="org.logo" class="rounded-full w-8 h-8 object-cover")
                p(class="flex-grow px-4 line-clamp-1") {{ org.orgName }}
                f-tooltip-standard(
                  :boundaryReference="`contact-org-${org.orgName}`"
                  :tooltipMessage="$t('II0035')"
                )
                  template(#slot:tooltip-trigger)
                    f-svg-icon(
                      iconName="copy_link"
                      size="24"
                      class="text-grey-600 hover:text-primary-400 mr-3"
                      @click="copyContactEmail(org.contactEmail)"
                    )
                f-tooltip-standard(
                  :boundaryReference="`contact-org-${org.orgName}`"
                  :tooltipMessage="$t('II0034')"
                )
                  template(#slot:tooltip-trigger)
                    f-svg-icon(
                      iconName="forward_to_mail"
                      size="24"
                      class="text-grey-600 hover:text-primary-400"
                      @click="openModalShowroomContactForm(org.orgId, false); collapsePopper()"
                    )
      f-button(
        v-else
        size="sm"
        type="secondary"
        @click="openModalCollectionDetail"
      ) {{ $t('UU0057') }}
    template(#sub-header)
      i18n-t(
        v-if="!isFirstLayer"
        keypath="II0002"
        tag="p"
        class="mx-7.5 mb-4 text-caption text-grey-600"
        scope="global"
      )
        template(#displayName) {{ publishBy }}
    template(v-if="isFirstLayer" #banner="{ inSearch, currentPage }")
      div(v-if="!inSearch && currentPage === 1" class="pb-4 px-7.5")
        showroom-banner(
          :title="`${$t('II0039')} | ${showroom.subtitle}`"
          :coverImg="showroom.coverImg"
          :textColor="showroom.color"
          :slotContent="showroom.description"
        )
    template(#default="{ visit }")
      div(
        v-if="nodeList.length > 0"
        class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          :key="node.nodeMeta.nodeId"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          :isSelectable="!isFirstLayer"
          :optionList="optionNode"
          @click:node="handleNodeClick(node, visit)"
        )
          template(#caption v-if="isFirstLayer")
            div(class="mt-1.5 h-6 flex items-center")
              f-avatar(:imageUrl="node.nodeMeta.unitLogo" type="org" size="sm")
              p(class="pl-1 font-bold text-caption text-grey-900") {{ node.nodeMeta.unitName }}
      div(v-else class="flex pt-80 justify-center items-end")
        p(class="text-body1 text-grey-900") {{ $t('II0007') }}
</template>

<script setup lang="ts">
import SearchTable, {
  type RouteQuery,
  type SearchPayload,
} from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { watch, ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'
import { copyText } from '@frontier/lib'
import { useSearchStore } from '@/stores/search'
import ShowroomBanner from '@/components/showroom/ShowroomBanner.vue'
import { useShowroomStore } from '@/stores/showroom'
import {
  NodeType,
  type NodeChild,
  type WorkspaceNodeCollection,
  type InnerExternalFilter,
} from '@frontier/platform-web-sdk'
import type { PropsModalCollectionDetail } from '@/components/common/collection/ModalCollectionDetail.vue'

const props = defineProps<{
  showroomId: string
  nodeId?: string
}>()

const currentNodeId = ref<number | null>(
  props.nodeId ? Number(props.nodeId) : null
)

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const router = useRouter()
const route = useRoute()
const searchStore = useSearchStore()
const { ogBaseShowroomApi } = useShowroomStore()
const { publicLibraryClone, publicLibraryShare, publicLibraryCloneByNodeList } =
  usePublicLibrary()
const { goToPublicLibrary, goToShowroomMaterialDetail, goToShowroom } =
  useNavigation()

const { data } = await ogBaseShowroomApi('getShowroom', {
  showroomId: Number(props.showroomId),
})
const showroom = data.result.showroom
const workspaceNodeCollection = ref<WorkspaceNodeCollection>()
const optionSort = computed(() => {
  const {
    RANDOM,
    NEW_ARRIVED,
    GHG_LOW_TO_HIGH,
    WATER_LOW_TO_HIGH,
    LAND_LOW_TO_HIGH,
  } = searchStore.sortOption
  return {
    base: [
      RANDOM,
      NEW_ARRIVED,
      GHG_LOW_TO_HIGH,
      WATER_LOW_TO_HIGH,
      LAND_LOW_TO_HIGH,
    ],
    keywordSearch: [],
  }
})

const optionMultiSelect = computed(() => [publicLibraryCloneByNodeList])

const locationList = computed(() => {
  return [
    {
      name: showroom.subtitle,
      goTo: () => goToShowroom({}, showroom.showroomId),
    },
    ...(workspaceNodeCollection.value?.nodeMeta?.locationList.map(
      ({ name, nodeId }) => ({
        name,
        goTo: () => {
          currentNodeId.value = nodeId
        },
      })
    ) ?? []),
  ]
})
const isFirstLayer = computed(() => locationList.value.length === 1)
const nodeList = computed(
  () => workspaceNodeCollection.value?.childNodeList ?? []
)
const publishBy = computed(
  () => workspaceNodeCollection.value?.nodeMeta.unitName ?? null
)
const optionNode = computed(() => {
  const optionList = [[publicLibraryCloneByNodeList]]
  if (isFirstLayer.value) {
    optionList[0].push(publicLibraryShare)
  }
  return optionList
})
const selectedNodeList = ref<NodeChild[]>([])

const getShowroomNodeList = async (
  payload: SearchPayload<InnerExternalFilter>,
  query: RouteQuery
) => {
  router.push({
    name: route.name as string,
    params: {
      nodeId: currentNodeId.value,
    },
    query,
  })
  const { data } = await ogBaseShowroomApi('getShowroomList', {
    ...payload,
    showroomId: showroom.showroomId,
    nodeId: currentNodeId.value,
  })
  workspaceNodeCollection.value = data.result.workspaceNodeCollection
  searchStore.setPaginationRes(data.result.pagination)
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      nodeMeta: workspaceNodeCollection.value?.nodeMeta,
      collection: workspaceNodeCollection.value?.collection,
      canEdit: false,
    } as PropsModalCollectionDetail,
  })
}

const handleNodeClick = (node: NodeChild, visit: Function) => {
  if (node.nodeMeta.nodeType === NodeType.COLLECTION) {
    searchStore.setKeyword('')
    currentNodeId.value = node.nodeMeta.nodeId
    visit()
  } else {
    goToShowroomMaterialDetail(
      {},
      showroom.showroomId,
      node.nodeMeta.nodeId,
      node.nodeMeta.rank ?? undefined
    )
  }
}

watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)

const openModalShowroomContactForm = (toOrgId: number, onlyToOne: boolean) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-showroom-contact-form',
    properties: {
      toOrgId,
      onlyToOne,
      showroomId: showroom.showroomId,
      participatedOrgList: showroom.participatedOrgList,
    },
  })
}

const copyContactEmail = (email: string) => {
  copyText(email)
  notify.showNotifySnackbar({ messageText: t('II0029') })
}
</script>
