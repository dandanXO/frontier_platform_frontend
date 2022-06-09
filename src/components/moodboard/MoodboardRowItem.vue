<template lang="pug">
div(class="grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-black-50")
  div(class="col-span-3 w-full min-w-42.5 max-w-67.5")
    div(class="pb-2.5 flex justify-between")
      div(class="font-bold text-primary line-clamp-1") {{ properties.materialNo }}
      svg-icon(:iconName="statusIconName" size="24" class="text-primary")
    div(class="w-full relative aspect-square" @mouseenter="isHover = true" @mouseleave="isHover = false")
      div(class="w-full h-full rounded-md overflow-hidden bg-cover" :class="{ 'border': neverScanBefore }")
        img(v-defaultImg :src="properties.coverImg" class="w-full h-full")
      div(v-if="isHover" class="absolute z-9 inset-0 w-full h-full rounded bg-black-900/70" @click.stop="openModalMoodboardMaterialDetail(node, true, true)")
      div(v-if="isHover || haveSelectedMoreThanOne" class="absolute z-10 inset-0 w-full h-12")
        div(class="bg-linear w-full h-full rounded-t-md")
        input-checkbox(
          v-model:inputValue="innerSelectedList"
          :value="JSON.stringify(node)"
          class="absolute top-3 left-3 cursor-pointer"
          iconColor="text-black-0"
          uncheckColor="text-black-0"
          @click.stop
        )
    div(class="flex justify-between relative")
      div(class="h-6.5 text-primary text-body1 line-clamp-1 mt-2.5") {{ properties.description }}
      btn-pick-tooltip(
        class="absolute right-0 -bottom-0.5"
        :isPicked="node.isPicked"
        @togglePick="togglePick(node, true, false)"
      )
    div(class="mt-1.5 h-6 flex items-center")
      img(:src="node.creatorLogo" class="aspect-square h-full rounded-full")
      p(class="pl-1 font-bold text-caption text-primary") {{ node.creator }}
  div(class="col-span-8 grid gap-x-14 grid-cols-2")
    div(class="min-w-75 max-w-115")
      div(class="pb-2 border-b-2 mb-3 text-body1 font-bold text-primary") {{ $t('RR0130') }}
      div(class="grid gap-3")
        p(v-for="(item, key) in materialBasicInfo" class="text-body2 line-clamp-1 !break-all" :class="{ 'text-black-700': key === 'frontierNo' }") {{ item.name }}: {{ item.value }}
    div(class="flex flex-col gap-y-7 min-w-75 max-w-115")
      div
        div(class="pb-2 border-b-2 mb-3 text-body1 font-bold text-primary") {{ $t('RR0135') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
      div
        div(class="pb-2 border-b-2 mb-3 text-body1 font-bold text-primary") {{ $t('RR0134') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.publicPrice.pricing.name }}: {{ materialInfo.publicPrice.pricing.value }}
      div
        div(class="pb-2 border-b-2 mb-3 text-body1 font-bold text-primary") {{ $t('RR0133') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0027') }}: {{ properties.publicTagList.join(',') }}
      div
        div(class="flex justify-between items-end pb-2 border-b-2 mb-3")
          div(class="text-body1 font-bold text-primary") {{ $t('RR0219') }}
          svg-icon(iconName="info_outline" size="14" class="text-primary cursor-pointer" @click="openModalIndicatorMethodology")
        div(class="flex items-center gap-x-1")
          div(v-for="property in carbonEmissionInfo" class="min-w-19.5 flex items-center gap-x-1")
            svg-icon(:iconName="property.icon" size="20" :class="[property.differenceInPercent > 0 ? 'text-brand' : 'text-primary']")
            p(v-if="property.personalized" class="text-body2 text-primary") {{ property.personalized }} {{ property.unitShort }}
            hr(v-else class="w-4 border-black-500")
  div(class="col-span-1 text-black-700 flex flex-col gap-3.5")
    tooltip(placement="left")
      template(#trigger)
        div(v-if="properties.u3m.status !== U3M_STATUS.COMPLETED" class="w-7.5 h-7.5 flex justify-center items-center text-black-500")
          svg-icon(iconName="u3m" size="24")
        div(v-else class="w-7.5 h-7.5 hover:bg-brand/10 hover:text-brand flex justify-center items-center rounded-full cursor-pointer" @click="openModalU3mSelectFileFormat([node])")
          svg-icon(iconName="u3m" size="24")
      template(#content)
        div(class="py-3 px-3 text-primary text-caption whitespace-nowrap") {{ $t("RR0059") }}
    div(v-if="isShowOverlay" class="fixed" style="width: 4000px; height: 3000px; top: -1500px; left: -2000px;")
    tooltip(
      placement="left-start"
      :showArrow="false"
      :offset="[0, 8]"
      @show="openOverlay"
      @hide="closeOverlay"
      manual
    )
      template(#trigger)
        div(class="w-7.5 h-7.5 hover:bg-brand/10 hover:text-brand flex justify-center items-center rounded-full cursor-pointer")
          svg-icon(iconName="more_horiz" size="24")
      template(#content)
        list(class="w-55 py-2.5")
          list-item(class="text-body2 text-primary px-7" @click.stop="cloneMoodboardNode([node])") {{ $t("RR0167") }}
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import useMaterial from '@/composables/useMaterial'
import { U3M_STATUS } from '@/utils/constants'
import { useStore } from 'vuex'
import useMoodboardNode from '@/composables/useMoodboardNode.js'

const props = defineProps({
  node: {
    type: Object
  },
  properties: {
    type: Object
  },
  selectedList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:selectedList'])

const store = useStore()
const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])
const {
  cloneMoodboardNode,
  openModalU3mSelectFileFormat,
  openModalMoodboardMaterialDetail,
  togglePick
} = useMoodboardNode(moodboard, moodboardOfferNodeCollection)
const { materialBasicInfo, materialInfo, carbonEmissionInfo, neverScanBefore, statusIconName } = useMaterial(props.properties)

const innerSelectedList = computed({
  get: () => props.selectedList,
  set: (v) => emit('update:selectedList', v)
})
const haveSelectedMoreThanOne = computed(() => props.selectedList.length > 0)

const isHover = ref(false)

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/openModalBehavior', { component: 'modal-indicator-methodology' })
}

const isShowOverlay = ref(false)
const openOverlay = () => { isShowOverlay.value = true }
const closeOverlay = () => { isShowOverlay.value = false }
</script>
