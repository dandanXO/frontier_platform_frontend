<template lang="pug">
div(
  v-if="breadcrumbList.length > 1 || slots['slot:logo']"
  class="flex items-center py-4 xl:pt-12 xl:pb-9"
)
  slot(name="slot:logo")
  global-breadcrumb-list(
    v-if="breadcrumbList.length > 1"
    :breadcrumbList="breadcrumbList"
    @click:item="$router.push($event.path)"
    :fontSize="largerThenLg ? 'text-body1' : 'text-caption'"
  )
div(class="pb-1 xl:pb-4" :class="{ 'xl:pt-5': breadcrumbList.length <= 1 }")
  div(class="flex items-center pb-1 gap-x-4")
    h5(class="text-body1 xl:text-h5 text-grey-900 font-bold leading-1.6 break-words") {{ `${material.materialNo} ${material.description}` }}
    f-tooltip-standard(v-if="canClone" :tooltipMessage="$t('RR0056')")
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
import { useSlots } from 'vue'
import useBreakpoints from '@frontier/3d-viewer/src/composables/useBreakpoints'

const slots = useSlots()

const props = defineProps({
  breadcrumbList: {
    type: Array,
    required: true,
  },
  material: {
    type: Object,
    required: true,
  },
  canClone: {
    type: Boolean,
    default: true,
  },
})
defineEmits(['clone'])

const { largerThenLg } = useBreakpoints()

const drawerOpenFromLocationList = useStickerLocationList(
  props.breadcrumbList.map((b) => b.name)
)
</script>
