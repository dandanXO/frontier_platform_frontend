<template lang="pug">
div(class="w-full h-full relative")
  search-table(
    :searchType="SEARCH_TYPE.PUBLIC_LIBRARY"
    :searchCallback="getTitasShowroomList"
    :optionSort="optionSort"
    :optionMultiSelect="optionMultiSelect"
    :canSelectAll="!isFirstLayer"
    :itemList="nodeList"
    v-model:selectedItemList="selectedNodeList"
  )
    template(#header-left="{ goTo }")
      div(class="flex items-center")
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
        f-tooltip(v-if="!isFirstLayer")
          template(#trigger)
            f-svg-icon(
              iconName="clone"
              class="text-grey-600 cursor-pointer hover:text-primary-400 ml-1"
              size="24"
              @click="publicCloneByCollection(currentNodeKey, collection.publish.isCanClone)"
            )
          template(#content)
            p {{ $t('RR0167') }}
    template(#header-right)
      f-button(
        v-if="!isFirstLayer"
        size="sm"
        type="secondary"
        class="-mr-3"
        @click="openModalCollectionDetail"
      ) {{ $t('UU0057') }}
    template(#sub-header)
      div(class="pb-4 px-7.5")
        div(
          class="rounded bg-center h-22 box-border pl-5 pr-6 py-5 bg-fit flex drop-shadow-2 hover:drop-shadow-4"
          :style="{ backgroundImage: `url(${titasShowroomBanner})` }"
        )
          lord-icon(
            src="https://cdn.lordicon.com/lupuorrc.json"
            trigger="loop"
            colors="primary:#ffffff,secondary:#21b185"
            stroke="65"
            style="width: 48px; height: 48px"
          )
          div(class="flex-grow flex flex-col justify-between")
            h6(class="text-h6 text-grey-0 font-bold") {{ $t('II0039') }}
            i18n-t(
              keypath="II0040"
              scope="global"
              tag="p"
              class="text-body2 leading-1.6 text-grey-0"
            )
              template(#II0042)
                a(
                  href="https://export.textiles.org.tw/en/taiwan_select.aspx?exh=IWA_Outdoor_Classics&sort=Intro"
                  target="_blank"
                  class="text-grey-0 underline"
                ) {{ $t('II0042') }}
          f-popper(placement="bottom-end" class="self-end")
            template(#trigger)
              f-button(type="secondary" size="sm" prependIcon="email") {{ $t('UU0119') }}
            template(#content="{ collapsePopper }")
              f-scrollbar-container(class="w-86 max-h-117.5 rounded pt-2 pb-3")
                div(class="h-9.5 pl-3 font-bold text-body2 flex items-center") {{ $t('II0023') }}
                div(class="px-2 grid grid-flow-row gap-1")
                  div(
                    v-for="org in titasInfo.orgList"
                    class="h-12 hover:bg-grey-100 rounded flex items-center pl-2 pr-3"
                    :data-tooltip-boundary-reference="`contact-org-${org.orgName}`"
                  )
                    img(:src="org.logo" class="rounded-full w-8 h-8 object-cover")
                    p(class="flex-grow px-4 line-clamp-1") {{ org.orgName }}
                    f-tooltip(
                      :boundaryReference="`contact-org-${org.orgName}`"
                    )
                      template(#trigger)
                        f-svg-icon(
                          iconName="copy_link"
                          size="24"
                          class="text-grey-600 hover:text-primary-400 mr-3"
                          @click="copyText(org.contactEmail); $store.dispatch('helper/pushFlashMessage', $t('II0029'))"
                        )
                      template(#content)
                        p {{ $t('II0035') }}
                    f-tooltip(
                      :boundaryReference="`contact-org-${org.orgName}`"
                    )
                      template(#trigger)
                        f-svg-icon(
                          iconName="forward_to_mail"
                          size="24"
                          class="text-grey-600 hover:text-primary-400"
                          @click="openModalTitasContactForm(org.contactEmail); collapsePopper()"
                        )
                      template(#content)
                        p {{ $t('II0034') }}
      i18n-t(
        v-if="!isFirstLayer"
        keypath="II0002"
        tag="p"
        class="mx-7.5 mb-4 text-caption text-grey-600"
        scope="global"
      )
        template(#displayName) {{ publishBy }}
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
        div(
          v-if="isFirstLayer"
          class="group bg-grey-50 w-full aspect-square rounded flex items-center justify-center border border-grey-150 cursor-pointer"
          @click="goToPublicLibrary"
        )
          div(class="flex items-center w-50")
            img(src="@/assets/images/logo.png" class="w-5 h-5")
            p(
              class="text-body1 font-bold text-grey-600 leading-1.6 group-hover:text-primary-400 pl-3"
            ) {{ $t('II0022') }}
      div(v-else class="flex h-full justify-center items-end")
        p(class="text-body1 text-grey-900") {{ $t('II0007') }}
  div(v-if="planStatus.INACTIVE" class="absolute inset-0 z-99 opacity-30 bg-grey-0")
  notify-bar-inactive(
    v-if="planStatus.INACTIVE || planStatus.TRANSITION"
    class="absolute bottom-0 left-0 z-100"
  )
</template>

<script setup>
import SearchTable from '@/components/common/SearchTable.vue'
import { SEARCH_TYPE, NODE_TYPE, useConstants } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { watch, ref, computed } from 'vue'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import { useRoute, useRouter } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import useNavigation from '@/composables/useNavigation'
import NotifyBarInactive from '@/components/billings/NotifyBarInactive.vue'
import titasShowroomBanner from '@/assets/images/titas_showroom_banner.png'
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
const { goToPublicLibrary, goToTitasShowroomMaterialDetail } = useNavigation()

const props = defineProps({
  nodeKey: {
    type: String,
    default: null,
  },
})

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
const planStatus = computed(() => store.getters['polling/planStatus'])
const pagination = computed(() => store.getters['helper/search/pagination'])
const collection = computed(() => store.getters['titas/collection'])
const breadcrumbList = computed(() =>
  store.getters['titas/collectionBreadcrumbList']({
    name: '2023 Exhibition Showroom',
    nodeKey: null,
  })
)
const isFirstLayer = computed(() => breadcrumbList.value.length === 1)
const nodeList = computed(() => store.getters['titas/nodeList'])
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

const getTitasShowroomList = async (targetPage = 1, query) => {
  await router.push({
    name: route.name,
    params: {
      nodeKey: currentNodeKey.value,
    },
    query,
  })
  await store.dispatch('titas/getTitasShowroomList', {
    targetPage,
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
    goToTitasShowroomMaterialDetail(node.nodeKey, node.rank)
  }
}

watch(
  () => isFirstLayer.value,
  () => (selectedNodeList.value.length = 0)
)

/** Titas */
const titasInfo = computed(() => store.getters['titas/titasInfo'])
const openModalTitasContactForm = (contactEmail) => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-titas-contact-form',
    properties: {
      toEmail: contactEmail,
    },
  })
}
</script>
