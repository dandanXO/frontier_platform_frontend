<template lang="pug">
div(class="grid grid-cols-12 max-w-405 gap-12 lg:gap-14 px-14 py-5 hover:bg-grey-50")
  row-item-content(
    :material="material"
    :selectedList="selectedList"
    @update:selectedList="emit('update:selectedList', $event)"
    canEdit
  )
    template(#slot:action="{ isHover }")
      digital-thread-entrance(
        :isHover="isHover"
        :material="material"
        :drawerOpenFromLocationList="[]"
      )
  row-item-sidebar(:material="material" class="col-span-1")
</template>

<script setup lang="ts">
import RowItemSidebar from '@/components/assets/RowItemSidebar.vue'
import RowItemContent from '@/components/common/rowItem/RowItemContent.vue'
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import type { Material } from '@frontier/platform-web-sdk'

defineProps<{
  selectedList: Material[]
  material: Material
}>()

const emit = defineEmits<{
  (e: 'update:selectedList', v: Material[]): void
}>()
</script>
