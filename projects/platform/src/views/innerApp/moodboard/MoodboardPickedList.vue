<template lang="pug">
div(class="h-full")
  div(data-tooltip-boundary-reference="pick-list-header" class="mx-8")
    f-breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)" class="mt-12 mb-9")
    div(class="flex items-end mb-4")
      p(class="text-h4 font-bold text-primary mr-3.5") {{ $t("QQ0034") }}
      i18n-t(keypath="RR0068" tag="p" class="text-caption text-black-500 pb-0.5" scope="global")
        template(#number) {{ moodboardOfferNodeCollection.childNodeList.length }}
    p(class="text-body2 text-black-800 mb-4") {{ $t("QQ0035") }}
    div(class="flex items-center justify-between mb-2")
      f-input-text(
        v-model:textValue="keyword"
        size="sm"
        class="w-67.5"
        prependIcon="search"
        :placeholder="$t('RR0053')"
        @enter="search"
        @clear="search"
      )
      div(class="flex items-center")
        f-button-label(size="lg" @click="selectAll" class="mr-6") {{ $t("RR0052") }}
        grid-or-row(v-model:displayMode="displayMode")
  div(v-if="isLoading" class="flex-grow flex items-center justify-center")
    f-svg-icon(iconName="loading" size="92" class="text-brand")
  template(v-else-if="!isLoading && moodboardOfferNodeCollection.childNodeList.length > 0")
    template(v-if="displayMode === DISPLAY_NODE.LIST")
      div(v-for="(node, index) in moodboardOfferNodeCollection.childNodeList")
        moodboard-row-item(
          v-model:selectedList="selectedNodeList"
          :node="node"
          :properties="node.properties"
          :key="node.properties.materialId"
        )
        div(v-if="index !== moodboardOfferNodeCollection.childNodeList.length - 1" class="border-b mx-7.5 my-5")
    div(v-else-if="displayMode === DISPLAY_NODE.GRID" class="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-6 gap-x-5 mx-7.5")
      grid-item-node(
        v-for="node in moodboardOfferNodeCollection.childNodeList"
        v-model:selectedValue="selectedNodeList"
        :node="node"
        :optionList="optionMaterial(node)"
        @click:option="$event.func(node)"
        @click.stop="openModalMoodboardMaterialDetail(node, true, true)"
      )
        template(#caption)
          btn-pick-tooltip(
            class="absolute right-0 bottom-6"
            :isPicked="node.isPicked"
            @togglePick="togglePick(node, true, false)"
          )
          div(class="mt-1.5 h-6 flex items-center")
            img(:src="node.creatorLogo" class="aspect-square h-full rounded-full")
            p(class="pl-1 font-bold text-caption text-primary") {{ node.creator }}
  div(v-else class="flex flex-col justify-center items-center mt-16")
    p(class="text-h4 text-primary mb-6") {{ $t("QQ0018") }}
    i18n-t(keypath="QQ0087" tag="p" class="text-body1 text-black-700" scope="global")
      template(#number)
        span(class="text-assist-blue cursor-pointer" @click="goToMoodboardDetail(moodboard.moodboardId)") {{ $t("QQ0088") }}
  multi-select-menu(:optionMultiSelect="optionMultiSelect" v-model:selectedList="selectedNodeList")
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { MOODBOARD_TAB, DISPLAY_NODE, U3M_STATUS } from '@/utils/constants.js'
import GridItemNode from '@/components/common/gridItem/GridItemNode.vue'
import MultiSelectMenu from '@/components/common/MultiSelectMenu.vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import GridOrRow from '@/components/common/GridOrRow.vue'
import MoodboardRowItem from '@/components/moodboard/MoodboardRowItem.vue'
import useMoodboardNode from '@/composables/useMoodboardNode.js'

const { t } = useI18n()
const store = useStore()
const { prefixPath, parsePath, goToMoodboardDetail } = useNavigation()
const displayMode = ref(DISPLAY_NODE.LIST)

const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])
const {
  selectedNodeList,
  selectAll,
  cloneMoodboardNode,
  openModalU3mSelectFileFormat,
  exportMoodboardNode,
  openModalMoodboardMaterialDetail,
  togglePick
} = useMoodboardNode(moodboard, moodboardOfferNodeCollection)
const breadcrumbList = computed(() => {
  return [
    {
      name: t('QQ0001'),
      path: parsePath(`${prefixPath.value}/moodboard`)
    },
    {
      name: moodboard.value.moodboardName,
      path: parsePath(`${prefixPath.value}/moodboard/${moodboard.value.moodboardId}?tab=${MOODBOARD_TAB.OFFER}`)
    },
    {
      name: t('QQ0033'),
      path: parsePath(`${prefixPath.value}/moodboard/${moodboard.value.moodboardId}/picked-list`)
    }
  ]
})

const optionMaterial = (node) => {
  return [
    [
      { name: t('UU0015'), func: (n) => cloneMoodboardNode([n]) },
      {
        name: t('RR0059'),
        disabled: node.properties.u3m.status !== U3M_STATUS.COMPLETED,
        func: (n) => openModalU3mSelectFileFormat([n])
      }
    ]
  ]
}

const optionMultiSelect = [
  {
    name: t('RR0060'),
    func: exportMoodboardNode
  }
]

const isLoading = ref(false)
const keyword = ref('')
const search = async () => {
  isLoading.value = true
  const moodboardId = moodboard.value.moodboardId

  await store.dispatch('moodboard/getPickedMoodboardNode', {
    moodboardId,
    keyword: keyword.value || null
  })

  isLoading.value = false
}

await search()
</script>
