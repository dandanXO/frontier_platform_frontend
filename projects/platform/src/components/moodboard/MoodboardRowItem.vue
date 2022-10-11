<template lang="pug">
div(class="grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-grey-50")
  div(class="col-span-3 w-full min-w-42.5 max-w-67.5")
    div(class="pb-2.5 flex justify-between")
      div(class="font-bold text-grey-900 line-clamp-1") {{ properties.materialNo }}
      f-svg-icon(:iconName="statusIconName" size="24" class="text-grey-900")
    div(class="w-full relative aspect-square" @mouseenter="isHover = true" @mouseleave="isHover = false")
      div(class="w-full h-full rounded-md overflow-hidden bg-cover")
        img(v-defaultImg :src="properties.coverImg" class="w-full h-full")
      div(v-if="isHover" class="absolute z-9 inset-0 w-full h-full rounded bg-grey-900/70" @click.stop="openModalMoodboardMaterialDetail(node, true, true)")
      div(v-if="isHover || haveSelectedMoreThanOne" class="absolute z-10 inset-0 w-full h-12")
        div(class="bg-linear w-full h-full rounded-t-md")
        f-input-checkbox(
          v-model:inputValue="innerSelectedList"
          :value="node"
          class="absolute top-3 left-3 cursor-pointer"
          iconColor="text-grey-0"
          uncheckColor="text-grey-0"
          @click.stop
        )
    div(class="flex justify-between relative")
      div(class="h-6.5 text-grey-900 text-body1 line-clamp-1 mt-2.5") {{ properties.description }}
      btn-pick-tooltip(
        class="absolute right-0 -bottom-0.5"
        :isPicked="node.isPicked"
        @togglePick="togglePick(node, true, false)"
      )
    div(class="mt-1.5 h-6 flex items-center")
      img(:src="node.creatorLogo" class="aspect-square h-full rounded-full")
      p(class="pl-1 font-bold text-caption text-grey-900") {{ node.creator }}
  div(class="col-span-8 grid gap-x-14 grid-cols-2")
    div(class="min-w-75 max-w-115")
      div(class="pb-2 border-b-2 border-grey-200 mb-3 text-body1 font-bold text-grey-900") {{ $t('RR0130') }}
      div(class="grid gap-3")
        p(v-for="(item, key) in materialBasicInfo" class="text-body2 line-clamp-1 !break-all" :class="{ 'text-grey-600': key === 'frontierNo' }") {{ item.name }}: {{ item.value }}
    div(class="flex flex-col gap-y-7 min-w-75 max-w-115")
      div(v-if="properties.isPublicInventory")
        div(class="pb-2 border-b-2 border-grey-200 mb-3 text-body1 font-bold text-grey-900") {{ $t('RR0135') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
      div
        div(class="pb-2 border-b-2 border-grey-200 mb-3 text-body1 font-bold text-grey-900") {{ $t('RR0134') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.publicPrice.pricing.name }}: {{ materialInfo.publicPrice.pricing.value }}
      div
        div(class="pb-2 border-b-2 border-grey-200 mb-3 text-body1 font-bold text-grey-900") {{ $t('RR0133') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0027') }}: {{ properties.publicTagList.join(',') }}
      div
        div(class="flex justify-between items-end pb-2 border-b-2 border-grey-200 mb-3")
          div(class="text-body1 font-bold" :class="[made2flowSubscribed ? 'text-grey-900' : 'text-grey-200']") {{ $t('RR0219') }}
          f-svg-icon(iconName="info_outline" size="14" class="text-grey-900 cursor-pointer" @click="openModalIndicatorMethodology")
        div(v-if="made2flowSubscribed" class="flex items-center gap-x-1")
          div(v-for="property in carbonEmissionInfo" class="min-w-19.5 flex items-center gap-x-1")
            f-svg-icon(:iconName="property.icon" size="20" :class="[property.differenceInPercent > 0 ? 'text-primary-400' : 'text-grey-900']")
            p(v-if="property.personalized" class="text-body2 text-grey-900") {{ property.personalized }} {{ property.unitShort }}
            hr(v-else class="w-4 border-grey-200")
        div(v-else class="flex items-center bg-no-repeat" :style="{ backgroundImage: `url(${listViewMask})` }")
          f-svg-icon(iconName="info_outline" size="20" class="text-grey-600 mr-3")
          p(class="text-caption leading-1.6")
            span(class="text-grey-600 mr-6") {{ $t("VV0048") }}
            span(class="inline-flex items-center text-cyan-400 text-right cursor-pointer" @click="viewTheProgram") {{ $t("UU0116") }}
              f-svg-icon(iconName="arrow_forward" size="16" class="ml-1")
  div(class="col-span-1 text-grey-600 flex flex-col gap-3.5")
    f-tooltip(boundaryReference="pick-list-header")
      template(#trigger)
        div(v-if="properties.u3m.status !== U3M_STATUS.COMPLETED" class="w-7.5 h-7.5 flex justify-center items-center text-grey-200")
          f-svg-icon(iconName="u3m" size="24")
        div(v-else class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full cursor-pointer" @click="openModalU3mSelectFileFormat([node])")
          f-svg-icon(iconName="u3m" size="24")
      template(#content)
        p {{ $t("RR0059") }}
    f-popper(placement="left-start")
      template(#trigger)
        div(class="w-7.5 h-7.5 hover:bg-primary-400/10 hover:text-primary-400 flex justify-center items-center rounded-full cursor-pointer")
          f-svg-icon(iconName="more_horiz" size="24")
      template(#content)
        f-list(class="w-55 py-2.5")
          f-list-item(class="text-body2 text-grey-900 px-7" @click.stop="cloneMoodboardNode([node])") {{ $t("RR0167") }}
</template>

<script setup>
import { ref, computed } from '@vue/reactivity'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import useMaterial from '@/composables/useMaterial'
import { U3M_STATUS } from '@/utils/constants'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useMoodboardNode from '@/composables/useMoodboardNode.js'
import { VALUE_ADDED_SERVICE_ID, MADE2FLOW_PLAN_TYPE } from '@/utils/constants.js'
import listViewMask from '@/assets/images/list_view_mask.png'

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
const router = useRouter()

const made2flowSubscribed = computed(() => {
  const { carbonEmission: { materialOwnerMade2FlowPlanType, viewerMade2FlowPlanType } } = props.properties
  const maxPlanType = Math.max(materialOwnerMade2FlowPlanType, viewerMade2FlowPlanType)

  return maxPlanType >= MADE2FLOW_PLAN_TYPE.STANDARD
})
const moodboard = computed(() => store.getters['moodboard/moodboard'])
const moodboardOfferNodeCollection = computed(() => store.getters['moodboard/moodboardOfferNodeCollection'])
const {
  cloneMoodboardNode,
  openModalU3mSelectFileFormat,
  openModalMoodboardMaterialDetail,
  togglePick
} = useMoodboardNode(moodboard, moodboardOfferNodeCollection)
const { materialBasicInfo, materialInfo, carbonEmissionInfo, statusIconName } = useMaterial(props.properties)

const innerSelectedList = computed({
  get: () => props.selectedList,
  set: (v) => emit('update:selectedList', v)
})
const haveSelectedMoreThanOne = computed(() => props.selectedList.length > 0)

const isHover = ref(false)

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/openModalBehavior', { component: 'modal-indicator-methodology' })
}

const viewTheProgram = () => {
  router.push({ name: 'Billings', params: { tab: 'value-added-service' }, query: { service: VALUE_ADDED_SERVICE_ID.MADE2FLOW } })
}
</script>
