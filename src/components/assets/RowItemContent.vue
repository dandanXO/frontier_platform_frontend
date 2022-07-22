<template lang="pug">
div(class="grid gap-x-14 grid-cols-2")
  div(class="min-w-75 max-w-115")
    div(class="flex justify-between pb-2 border-b-2 mb-3")
      div(class="text-body1 font-bold text-primary") {{ $t('RR0130') }}
      btn-functional(@click="handleEdit($t('RR0130'), 'spec')") {{ $t("UU0027") }}
    div(class="grid gap-3")
      p(v-for="(item, key) in materialBasicInfo" class="text-body2 line-clamp-1 !break-all" :class="{ 'text-black-700': key === 'frontierNo' }") {{ item.name }}: {{ item.value }}
  div(class="flex flex-col gap-y-7 min-w-75 max-w-115")
    div
      div(class="flex justify-between pb-2 border-b-2 mb-3")
        div(class="text-body1 font-bold text-primary") {{ $t('RR0135') }}
        btn-functional(@click="handleEdit($t('RR0135'), 'inventory')") {{ $t("UU0027") }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.totalInventoryQty.name }}: {{ materialInfo.totalInventoryQty.value }}
    div
      div(class="flex justify-between pb-2 border-b-2 mb-3")
        div(class="text-body1 font-bold text-primary") {{ $t('RR0134') }}
        btn-functional(@click="handleEdit($t('RR0134'), 'price')") {{ $t("UU0027") }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ materialInfo.publicPrice.pricing.name }}: {{ materialInfo.publicPrice.pricing.value }}
    div
      div(class="flex justify-between pb-2 border-b-2 mb-3")
        div(class="text-body1 font-bold text-primary") {{ $t('RR0133') }}
        btn-functional(@click="handleEdit($t('RR0133'), 'tag')") {{ $t("UU0027") }}
      div(class="grid gap-3")
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0027') }}: {{ material.publicTagList.join(',') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0071') }}: {{ material.aiTagList.join(',') }}
        p(class="text-body2 line-clamp-1 !break-all") {{ $t('RR0028') }}: {{ material.privateTagList.join(',') }}
    div
      div(class="flex justify-between items-end pb-2 border-b-2 mb-3")
        div(class="text-body1 font-bold text-primary") {{ $t('RR0219') }}
        svg-icon(iconName="info_outline" size="14" class="text-primary cursor-pointer" @click="openModalIndicatorMethodology")
      div(class="flex items-center gap-x-1")
        div(v-for="property in carbonEmissionInfo" class="min-w-19.5 flex items-center gap-x-1")
          svg-icon(:iconName="property.icon" size="20" :class="[property.differenceInPercent > 0 ? 'text-brand' : 'text-primary']")
          p(v-if="property.personalized" class="text-body2 text-primary") {{ property.personalized }} {{ property.unitShort }}
          hr(v-else class="w-4 border-black-500")
</template>

<script setup>
import { useStore } from 'vuex'
import useMaterial from '@/composables/useMaterial'

const props = defineProps({
  material: {
    type: Object
  }
})
const store = useStore()
const { materialBasicInfo, materialInfo, carbonEmissionInfo } = useMaterial(props.material)

const handleEdit = (title, blockId) => {
  store.dispatch('assets/setMaterial', JSON.parse(JSON.stringify(props.material)))
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-edit-simple-info',
    properties: {
      title,
      blockId
    }
  })
}

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/openModalBehavior', { component: 'modal-indicator-methodology' })
}
</script>
