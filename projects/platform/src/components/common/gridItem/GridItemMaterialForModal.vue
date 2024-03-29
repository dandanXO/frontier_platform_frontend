<template lang="pug">
grid-item-wrapper(
  isSelectable
  isMultiSelect
  v-model:selectedValue="innerSelectedValue"
  :selectValue="material.materialId"
  :selectOnHover="false"
)
  template(#title="{ isHover }")
    span(:class="{ 'text-primary-400': isHover }") {{ material.itemNo }}
  template(#content)
    img(
      v-defaultImg
      :src="material.coverImage?.thumbnailUrl"
      class="w-full h-full rounded-md overflow-hidden object-contain"
    )
</template>

<script setup lang="ts">
import GridItemWrapper from '@/components/common/gridItem/GridItemWrapper.vue'
import { computed } from 'vue'
import type { Material } from '@frontier/platform-web-sdk'

const props = defineProps<{
  material: Material
  selectedValue: Array<number>
}>()

const emit = defineEmits<{
  (e: 'update:selectedValue', v: Array<number>): void
}>()

const innerSelectedValue = computed({
  get: () => props.selectedValue,
  set: (v) => emit('update:selectedValue', v),
})
</script>
