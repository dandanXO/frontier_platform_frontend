<template lang="pug">
f-breadcrumb(
  :breadcrumbList="breadcrumbList"
  @click:item="$router.push($event.path)"
  class="pt-12.5 pb-12"
)
div(class="pb-7.5")
  div(class="flex items-center pb-1")
    h5(class="text-h5 text-grey-900 font-bold leading-1.6 break-words") {{ `${material.materialNo} ${material.description}` }}
    f-tooltip(class="pl-6 pr-4")
      template(#trigger)
        f-svg-icon(
          iconName="clone"
          class="text-grey-600 hover:text-primary-400 cursor-pointer"
          size="24"
          @click="$emit('clone')"
        )
      template(#content)
        p {{ $t('RR0056') }}
    digital-thread-entrance(
      :material="material"
      :drawerOpenFromLocationList="breadcrumbList.map((item) => item.name).slice(1)"
    )
    slot(name="action-list")
  slot(name="caption")
</template>

<script setup>
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'

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
</script>
