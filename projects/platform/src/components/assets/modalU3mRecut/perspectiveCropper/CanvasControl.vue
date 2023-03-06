<template lang="pug">
span(
  class="flex items-center absolute gap-x-4 top-5 left-1/2 -translate-x-1/2 h-11.5 bg-grey-800 text-grey-100 px-5 rounded-md border-[1px] border-grey-700"
)
  div(class="flex items-center gap-x-3")
    icon-button(
      iconName="remove_zoom_out"
      size="16"
      @click="emit('zoomMinus')"
    )
    zoom-input-select(
      :value="zoomValue"
      :blockList="zoomBlockList"
      @select="handleSelectUpdate"
    )
    icon-button(iconName="add" size="16" @click="emit('zoomAdd')")
  info-divider(size="sm")
  icon-button(
    v-if="useGridToggle"
    size="16"
    iconName="grid_4x4"
    :active="gridOpen"
    @click="emit('toggleGrid')"
  )
  input-grid-color(
    :labelColor="gridColor"
    @update:labelColor="handleColorChange"
  )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Decimal from 'decimal.js'
import InfoDivider from '@/components/assets/modalU3mRecut/perspectiveCropper/InfoDivider.vue'
import IconButton from '@/components/assets/modalU3mRecut/perspectiveCropper/IconButton.vue'
import InputGridColor from '@/components/assets/modalU3mRecut/perspectiveCropper/InputGridColor.vue'
import ZoomInputSelect from '@/components/assets/modalU3mRecut/perspectiveCropper/ZoomInputSelect.vue'

const props = defineProps<{
  zoom: number
  zoomBlockList: { menuList: { title: string }[] }[]
  gridColor?: string
  gridOpen?: boolean
  useGridToggle?: boolean
}>()

const handleSelectUpdate = (v: string) => {
  emit('update:zoom', v)
}

const zoomValue = computed(
  () => new Decimal(props.zoom).toDP(2).mul(100).toString() + '%'
)

const handleColorChange = (hex: string) => {
  emit('update:gridColor', hex)
}

const emit = defineEmits<{
  (e: 'zoomAdd'): void
  (e: 'zoomMinus'): void
  (e: 'toggleGrid'): void
  (e: 'update:gridColor', hex: string): void
  (e: 'update:zoom', type: string): void
}>()
</script>

<style scoped></style>
