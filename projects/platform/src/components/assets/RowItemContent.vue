<template lang="pug">
div(class="grid gap-x-14 grid-cols-2")
  div(class="min-w-75 max-w-115")
    div(class="flex justify-between pb-2 border-grey-200 border-b mb-3")
      div(class="text-body1 font-bold text-grey-900") {{ $t('RR0130') }}
      f-button-label(@click="openModalMaterialEditSimple('spec')") {{ $t("UU0027") }}
    div(class="grid gap-3")
      p(v-for="(item, key) in materialBasicInfo" class="text-body2 line-clamp-1 !break-all" :class="{ 'text-grey-600': key === 'frontierNo' }") {{ item.name }}: {{ item.value }}
  div(class="flex flex-col gap-y-7 min-w-75 max-w-115")
    div
      div(class="flex justify-between pb-2 border-grey-200 border-b mb-3")
        div(class="text-body1 font-bold text-grey-900") {{ $t('RR0135') }}
        f-button-label(@click="openModalMaterialEditSimple('inventory')") {{ $t("UU0027") }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
    div
      div(class="flex justify-between pb-2 border-grey-200 border-b mb-3")
        div(class="text-body1 font-bold text-grey-900") {{ $t('RR0134') }}
        f-button-label(@click="openModalMaterialEditSimple('public-price')") {{ $t("UU0027") }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.publicPrice.pricing.name }}: {{ materialInfo.publicPrice.pricing.value }}
    div
      div(class="flex justify-between pb-2 border-grey-200 border-b mb-3")
        div(class="text-body1 font-bold text-grey-900") {{ $t('RR0133') }}
        f-button-label(@click="openModalMaterialEditSimple('tag')") {{ $t("UU0027") }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0027') }}: {{ material.publicTagList.join(',') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0071') }}: {{ material.aiTagList.join(',') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0028') }}: {{ material.privateTagList.join(',') }}
    div
      div(class="flex justify-between items-end pb-2 border-grey-200 border-b mb-3")
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
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useMaterial from '@/composables/useMaterial'
import listViewMask from '@/assets/images/list_view_mask.png'
import { VALUE_ADDED_SERVICE_ID } from '@/utils/constants.js'

const props = defineProps({
  material: {
    type: Object
  }
})
const store = useStore()
const router = useRouter()
const { materialBasicInfo, materialInfo, carbonEmissionInfo } = useMaterial(props.material)

const made2flowSubscribed = computed(() => store.getters['polling/valueAddedService'].made2flow.planStatus.ACTIVATE)

const openModalMaterialEditSimple = async (type) => {
  store.dispatch('assets/setMaterial', JSON.parse(JSON.stringify(props.material)))
  store.dispatch('helper/openModalBehavior', {
    component: `modal-material-edit-simple-${type}`
  })
}

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/openModalBehavior', { component: 'modal-indicator-methodology' })
}

const viewTheProgram = () => {
  router.push({ name: 'Billings', params: { tab: 'value-added-service' }, query: { service: VALUE_ADDED_SERVICE_ID.MADE2FLOW } })
}
</script>
