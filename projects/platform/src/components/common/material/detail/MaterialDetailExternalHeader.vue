<template lang="pug">
global-breadcrumb-list(
  :breadcrumbList="breadcrumbList"
  @click:item="$router.push($event.path)"
  class="pt-12.5 pb-12"
)
div(class="pb-7.5")
  div(class="flex items-center pb-1")
    h5(class="text-h5 text-grey-900 font-bold leading-1.6 break-words") {{ `${material.materialNo} ${material.description}` }}
    f-tooltip-standard(class="pl-6 pr-4" :tooltipMessage="$t('RR0056')")
      template(#slot:tooltip-trigger)
        f-svg-icon(
          iconName="clone"
          class="text-grey-600 hover:text-primary-400 cursor-pointer"
          size="24"
          @click="$emit('clone')"
        )
    digital-thread-entrance(
      :material="material"
      :drawerOpenFromLocationList="drawerOpenFromLocationList"
    )
    slot(name="action-list")
  slot(name="caption")
</template>

<script setup>
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import useStickerLocationList from '@/composables/useStickerLocationList'

const props = defineProps({
  breadcrumbList: {
    type: Array,
    required: true,
  },
  material: {
    type: Object,
    required: true,
  },
})
defineEmits(['clone'])

const drawerOpenFromLocationList = useStickerLocationList(
  props.breadcrumbList.map((b) => b.name)
)
</script>
