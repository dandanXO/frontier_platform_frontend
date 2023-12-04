<template lang="pug">
div(class="h-full")
  div(data-tooltip-boundary-reference="pick-list-header" class="mx-8")
    global-breadcrumb-list(
      :breadcrumbList="locationList"
      @click:item="$event.goTo()"
      class="mt-12 mb-9"
    )
    div(class="flex items-end mb-4")
      p(class="text-h4 font-bold text-grey-900 mr-3.5") {{ $t('QQ0034') }}
      i18n-t(
        keypath="RR0068"
        tag="p"
        class="text-caption text-grey-250 pb-0.5"
        scope="global"
      )
        template(#number) {{ moodboardNodeCollection?.childNodeList.length ?? 0 }}
    p(class="text-body2 text-grey-600 mb-4") {{ $t('QQ0035') }}
    div(class="flex items-center justify-between mb-2")
      f-input-text(
        v-model:textValue="keyword"
        size="md"
        class="w-67.5"
        prependIcon="search"
        :placeholder="$t('RR0053')"
        @enter="search"
        @clear="search"
      )
      div(class="flex items-center")
        f-button-label(size="lg" @click="selectAll" class="mr-6") {{ $t('RR0052') }}
        f-input-tap(
          v-model:inputValue="displayMode"
          :optionList="displayModeOptionList"
        )
  div(v-if="isLoading" class="flex-grow flex items-center justify-center")
    f-svg-icon(iconName="loading" size="92" class="text-primary-400")
  template(v-else-if="!isLoading && moodboardNodeCollection")
    template(v-if="displayMode === DISPLAY_NODE.LIST")
      div(
        v-for="(node, index) in moodboardNodeCollection.childNodeList"
        :key="node.nodeMeta.nodeId"
      )
        row-item-node-moodboard(
          v-model:selectedList="selectedNodeList"
          :node="node"
          :optionList="optionNode"
          @togglePick="togglePick(node, true, false)"
        )
        div(
          v-if="index !== moodboardNodeCollection.childNodeList.length - 1"
          class="border-b border-grey-250 mx-7.5 my-5"
        )
    div(
      v-else-if="displayMode === DISPLAY_NODE.GRID"
      class="grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5"
    )
      grid-item-node-moodboard(
        v-for="node in moodboardNodeCollection.childNodeList"
        :key="node.nodeMeta.nodeId"
        v-model:selectedValue="selectedNodeList"
        :node="node"
        :optionList="optionNode"
        @click.stop="openModalMoodboardMaterialDetail(node, true, true)"
      )
        template(#caption)
          btn-pick-tooltip(
            class="absolute right-0 bottom-6"
            :isPicked="node.moodboardInfo.isPicked"
            @togglePick="togglePick(node, true, false)"
          )
          div(class="mt-1.5 h-6 flex items-center")
            img(
              :src="node.nodeMeta.unitLogo"
              class="aspect-square h-full rounded-full"
            )
            p(class="pl-1 font-bold text-caption text-grey-900") {{ node.nodeMeta.unitName }}
  div(v-else class="flex flex-col justify-center items-center mt-16")
    p(class="text-h4 text-grey-900 mb-6") {{ $t('QQ0018') }}
    i18n-t(keypath="QQ0087" tag="p" class="text-body1 text-grey-600" scope="global")
      template(#number)
        span(
          class="text-cyan-400 cursor-pointer"
          @click="goToMoodboardDetail({}, moodboard.moodboardId)"
        ) {{ $t('QQ0088') }}
  multi-select-menu(
    :optionMultiSelect="optionMultiSelect"
    v-model:selectedList="selectedNodeList"
  )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import {
  DISPLAY_NODE,
  MOODBOARD_OFFER_ID_ALL,
  ASSET_LIST_DISPLAY_MODE,
} from '@/utils/constants'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import RowItemNodeMoodboard from '@/components/moodboard/RowItemNodeMoodboard.vue'
import useMoodboardDetail from '@/composables/useMoodboardDetail.js'
import useMoodboardNode from '@/composables/useMoodboardNode.js'
import { useMoodboardStore } from '@/stores/moodboard'
import GridItemNodeMoodboard from '@/components/moodboard/GridItemNodeMoodboard.vue'

const props = defineProps<{
  moodboardId: string
}>()

const moodboardId = computed(() => Number(props.moodboardId))
const { t } = useI18n()
const { ogBaseMoodboardApi } = useMoodboardStore()
const { goToMoodboard, goToMoodboardDetail, goToMoodboardPickedList } =
  useNavigation()
const displayMode = ref<ASSET_LIST_DISPLAY_MODE>(ASSET_LIST_DISPLAY_MODE.LIST)
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

const { data } = await ogBaseMoodboardApi('getMoodboard', {
  moodboardId: Number(props.moodboardId),
})
const moodboard = ref(data.result.moodboard)
const {
  keyword,
  isLoading,
  search,
  moodboardNodeCollection,
  selectedNodeList,
  selectAll,
} = useMoodboardDetail(moodboardId.value, MOODBOARD_OFFER_ID_ALL, null)

const {
  cloneMoodboardNode,
  downloadU3m,
  exportMoodboardNode,
  openModalMoodboardMaterialDetail,
  togglePick,
} = useMoodboardNode(moodboard, moodboardNodeCollection)

const locationList = computed(() => {
  return [
    {
      name: t('QQ0001'),
      goTo: () => goToMoodboard(),
    },
    {
      name: moodboard.value.moodboardName,
      goTo: () => {
        goToMoodboardDetail({}, moodboardId.value)
      },
    },
    {
      name: t('QQ0033'),
      goTo: () => {
        goToMoodboardPickedList({}, moodboardId.value)
      },
    },
  ]
})
const optionNode = computed(() => [[downloadU3m, cloneMoodboardNode]])
const optionMultiSelect = computed(() => [exportMoodboardNode])
</script>
