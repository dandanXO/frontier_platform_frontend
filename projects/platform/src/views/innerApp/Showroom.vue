<template lang="pug">
div(class="w-full h-full relative")
  search-table(
    :searchType="SEARCH_TYPE.PUBLIC_LIBRARY"
    :searchCallback="getShowroomNodeList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :canSelectAll="!isFirstLayer"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-center gap-x-4")
        div(class="flex items-end")
          div(class="flex items-center")
            p(
              class="text-grey-900 hover:text-primary-400 cursor-pointer text-h6"
              @click="goToPublicLibrary"
            ) {{ $t('II0001') }}
            f-svg-icon(size="20" iconName="slash" class="text-grey-200")
            f-breadcrumb(
              :breadcrumbList="breadcrumbList"
              @click:item="currentNodeKey = $event.nodeKey; goTo()"
              fontSize="text-h6"
            )
          p(class="flex text-caption text-grey-600 pl-1")
            span (
            i18n-t(keypath="RR0068" tag="span" scope="global")
              template(#number) {{ pagination.totalCount }}
            span )
        template(v-if="!isFirstLayer")
          f-tooltip
            template(#trigger)
              f-svg-icon(
                iconName="clone"
                class="text-grey-600 cursor-pointer hover:text-primary-400"
                size="24"
                @click="publicCloneByCollection(currentNodeKey, collection.publish.isCanClone)"
              )
            template(#content)
              p {{ $t('RR0167') }}
          f-tooltip
            template(#trigger)
              f-svg-icon(
                iconName="forward_to_mail"
                size="24"
                class="text-grey-600 hover:text-primary-400"
                @click="openModalShowroomContactForm(collection.publish.orgId)"
              )
            template(#content)
              p {{ $t('II0034') }}
    template(#header-right)
      f-popper(v-if="isFirstLayer" placement="bottom-end" class="self-end")
        template(#trigger)
          f-button(type="secondary" size="sm" prependIcon="email") {{ $t('UU0119') }}
        template(#content="{ collapsePopper }")
          f-scrollbar-container(
            class="w-86 max-h-117.5 rounded pt-2 pb-3 bg-grey-0 drop-shadow-16"
          )
            div(class="h-9.5 pl-3 font-bold text-body2 flex items-center") {{ $t('II0023') }}
            div(class="px-2 grid grid-flow-row gap-1")
              div(
                v-for="org in showroom.participatedOrgList"
                class="h-12 hover:bg-grey-100 rounded flex items-center pl-2 pr-3"
                :data-tooltip-boundary-reference="`contact-org-${org.orgName}`"
              )
                img(:src="org.logo" class="rounded-full w-8 h-8 object-cover")
                p(class="flex-grow px-4 line-clamp-1") {{ org.orgName }}
                f-tooltip(:boundaryReference="`contact-org-${org.orgName}`")
                  template(#trigger)
                    f-svg-icon(
                      iconName="copy_link"
                      size="24"
                      class="text-grey-600 hover:text-primary-400 mr-3"
                      @click="copyText(org.contactEmail); $store.dispatch('helper/pushFlashMessage', $t('II0029'))"
                    )
                  template(#content)
                    p {{ $t('II0035') }}
                f-tooltip(:boundaryReference="`contact-org-${org.orgName}`")
                  template(#trigger)
                    f-svg-icon(
                      iconName="forward_to_mail"
                      size="24"
                      class="text-grey-600 hover:text-primary-400"
                      @click="openModalShowroomContactForm(org.orgId); collapsePopper()"
                    )
                  template(#content)
                    p {{ $t('II0034') }}
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
    template(#banner v-if="pagination.currentPage === 1 && isFirstLayer")
      div(class="pb-4 px-7.5")
        div(
          class="rounded-md box-border bg-center bg-fit p-5 flex flex-col gap-y-4 justify-between drop-shadow-2 hover:drop-shadow-4 cursor-pointer"
          :style="{ backgroundImage: `url(${showroom.coverImg})` }"
        )
          h6(
            class="text-h6 font-bold"
            :class="[showroom.color === BANNER_TEXT_COLOR.WHITE ? 'text-grey-0' : 'text-grey-900']"
          ) {{ $t('II0039') }} | {{ showroom.title }}
          component(:is="showroomDescriptionComponent")
    template(#default="{ goTo }")
      div(
        v-if="nodeList.length > 0"
        class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6.5 gap-x-5 mx-7.5 grid-flow-row auto-rows-auto content-start"
      )
        grid-item-node(
          v-for="node in nodeList"
          v-model:selectedValue="selectedNodeList"
          :node="node"
          :isSelectable="!isFirstLayer"
          :optionList="optionNode"
          @click:option="$event.func(node)"
          @click.stop="handleNodeClick(node, goTo)"
        )
          template(#caption v-if="isFirstLayer")
            div(class="mt-1.5 h-6 flex items-center")
              img(:src="node.publish.logo" class="aspect-square h-full rounded-full")
              p(class="pl-1 font-bold text-caption text-grey-900") {{ node.publish.displayName }}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-grey-900") {{ $t('II0007') }}
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import {
  SEARCH_TYPE,
  NODE_TYPE,
  useConstants,
  BANNER_TEXT_COLOR,
} from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'
import copyText from '@/utils/copy-text'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const {
  publicCloneByNode,
  publicCloneByNodeList,
  publicCloneByCollection,
  optionShareNode,
} = usePublicLibrary()
const { goToPublicLibrary, goShowroomMaterialDetail } = useNavigation()

const props = defineProps({
  showroomId: {
    type: String,
  },
  nodeKey: {
    type: String,
    default: null,
  },
})

await store.dispatch('showroom/getShowroom', { showroomId: props.showroomId })

const optionSort = computed(() => {
  const { SORT_BY } = useConstants()
  const {
    RANDOM,
    NEW_ARRIVED,
    GHG_RESULTS,
    WATER_DEPLETION_RESULTS,
    LAND_USE_RESULTS,
  } = SORT_BY.value
  return {
    base: [
      RANDOM,
      NEW_ARRIVED,
      GHG_RESULTS,
      WATER_DEPLETION_RESULTS,
      LAND_USE_RESULTS,
    ],
    keywordSearch: [],
  }
})

const optionMultiSelect = computed(() => [
  {
    name: t('RR0167'),
    func: publicCloneByNodeList,
  },
])
const showroom = computed(() => store.getters['showroom/showroom'])
const showroomDescriptionComponent = computed(
  () => store.getters['showroom/showroomDescriptionComponent']
)

const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['showroom/collection'])
const breadcrumbList = computed(() =>
  store.getters['showroom/collectionBreadcrumbList']({
    name: showroom.value.title,
    nodeKey: null,
  })
)
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['showroom/nodeList'])
const publishBy = computed(() => collection.value.publish.displayName)
const optionNode = computed(() => {
  const optionList = [
    [
      {
        name: t('RR0167'),
        func: publicCloneByNode,
      },
    ],
  ]
  if (isFirstLayer.value) {
    optionList[0].push(optionShareNode)
  }
  return optionList
})

const currentNodeKey = ref(props.nodeKey)
const selectedNodeList = ref([])

const getShowroomNodeList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value,
    },
    query,
  })
  await store.dispatch('showroom/getShowroomNodeList', {
    targetPage,
    showroomId: props.showroomId,
    nodeKey: currentNodeKey.value === '' ? null : currentNodeKey.value,
  })
}

const openModalCollectionDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-collection-detail',
    properties: {
      ...collection.value,
    },
  })
}

const handleNodeClick = (node, goTo) => {
  if (node.nodeType === NODE_TYPE.COLLECTION) {
    currentNodeKey.value = node.nodeKey
    goTo()
  } else {
    goShowroomMaterialDetail(node.nodeKey, props.showroomId, node.rank)
  }
}

watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)

const openModalShowroomContactForm = (toOrgId) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-showroom-contact-form',
    properties: {
      toOrgId,
    },
  })
}
</script>
