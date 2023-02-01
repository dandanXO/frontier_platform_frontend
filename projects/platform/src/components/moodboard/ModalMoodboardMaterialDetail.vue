<template lang="pug">
modal-behavior(
  :header="$t('QQ0085', { materialNo: nodeMaterial.properties.materialNo })"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="box-content w-203 px-21")
    div(class="pb-4")
      div(class="flex items-center pb-2")
        p(class="text-body2 text-grey-900 font-bold line-clamp-1 !break-all pr-6") {{ `${nodeMaterial.properties.materialNo} ${nodeMaterial.properties.description}` }}
        btn-pick-tooltip(
          :isPicked="nodeMaterial.isPicked"
          @togglePick="moodboardType === MOODBOARD_TYPE.DEMANDER && pickHandler()"
        )
      p(class="text-caption text-grey-600")
        span {{ $t('RR0066') }}: {{ $dayjs.unix(nodeMaterial.properties.updateDate).format('YYYY/MM/DD') }}
        span(class="mx-1") at
        span {{ $dayjs.unix(nodeMaterial.properties.updateDate).format('h:mm a') }}
    material-detail-external(
      :material="nodeMaterial.properties"
      isCanDownloadU3M
    )
</template>

<script setup>
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'
import BtnPickTooltip from '@/components/moodboard/BtnPickTooltip.vue'
import { MOODBOARD_TYPE } from '@/utils/constants'

defineProps({
  nodeMaterial: {
    type: Object,
    required: true,
  },
  moodboardType: {
    type: Number,
    default: MOODBOARD_TYPE.DEMANDER,
  },
  pickHandler: {
    type: Function,
  },
})
</script>
