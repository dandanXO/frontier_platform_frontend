<template lang="pug">
modal-behavior(
  :header="$t('QQ0085', { materialNo: nodeMaterial.properties.materialNo })"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="box-content w-203 px-21")
    div(class="pb-4")
      div(class="flex items-center pb-2")
        p(class="text-body2 text-primary font-bold line-clamp-1 !break-all pr-6") {{ `${nodeMaterial.properties.materialNo} ${nodeMaterial.properties.description}` }}
        tooltip(placement="top")
          template(#trigger)
            div(class="w-6.5 h-6.5 group cursor-pointer hover:bg-brand/10 rounded-full flex items-center justify-center" @click="moodboardType === MOODBOARD_TYPE.DEMANDER && pickHandler()")
              svg-icon(
                size="20"
                :iconName="nodeMaterial.isPicked ? 'bookmark' : 'bookmark_border'"
                :class="[nodeMaterial.isPicked ? 'text-brand' : 'text-black-800']"
                class="group-hover:text-brand"
              )
          template(#content)
            p(class="text-caption text-primary p-2.5 whitespace-nowrap") {{ nodeMaterial.isPicked ? $t('QQ0081') : $t('QQ0082') }}
      p(class="text-caption text-black-700")
        span {{ $t("RR0066") }}: {{ $dayjs.unix(nodeMaterial.properties.updateDate).format("YYYY/MM/DD") }}
        span(class="mx-1") at
        span {{ $dayjs.unix(nodeMaterial.properties.updateDate).format("h:mm a") }}
    material-detail-external(:material="nodeMaterial.properties" isCanDownloadU3M)
</template>

<script setup>
import MaterialDetailExternal from '@/components/layout/materialDetail/MaterialDetailExternal.vue'
import { MOODBOARD_TYPE } from '@/utils/constants.js'

defineProps({
  nodeMaterial: {
    type: Object,
    required: true
  },
  moodboardType: {
    type: Number,
    default: MOODBOARD_TYPE.DEMANDER
  },
  pickHandler: {
    type: Function
  }
})

</script>
