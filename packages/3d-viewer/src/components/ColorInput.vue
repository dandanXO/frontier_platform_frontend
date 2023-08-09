<template lang="pug">
div(class="flex flex-row justify-between items-center")
  div(class="flex flex-row items-center")
    div(class="relative w-5.5 h-5.5 overflow-hidden rounded cursor-pointer")
      //- 不使用 hidden 是因為在 safari 上 color picker 會連帶被隱藏
      input(
        class="absolute left-1 bottom-0 w-1 h-1"
        ref="colorInputDom"
        type="color"
        :value="color"
        @input="handleColorInput($event, index)"
      )
      div(
        class="absolute w-full h-full"
        :style="{ backgroundColor: color }"
        @click="handleColorClick"
      )
    span(class="flex items-center text-body2 text-grey-250 min-w-12 ml-3") {{ color.toUpperCase() }}
  div(class="px-4 border border-grey-700 rounded flex items-center h-11 w-40")
    input(
      ref="pantoneInputDom"
      class="w-full flex-grow outline-none bg-transparent overflow-hidden text-grey-100 text-body2 placeholder:text-grey-400 placeholder:overflow-visible"
      :value="pantoneDisplay"
      list="pantone-list"
      :placeholder="$t('EE0140')"
      @change="handlePantoneCodeChange"
    )
  datalist#pantone-list
    option(:key="pantoneItem.pantoneId" v-for="pantoneItem in pantoneList") {{ pantoneItem.display }}
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { values } from 'ramda'
import chroma from 'chroma-js'
import type { PantoneItem } from '../composables/useColors'

const props = defineProps<{
  index: number
  color: string
  pantoneList?: { [code: string]: PantoneItem }
}>()
const emit = defineEmits<{
  (e: 'delete', index: number): void
  (e: 'colorChange', color: string, index: number): void
  (e: 'colorInput', color: string, index: number): void
}>()

const pantoneInputDom = ref<HTMLInputElement>()
const colorInputDom = ref<HTMLInputElement>()
const handleKeyboardEvent = (e: KeyboardEvent) => e.stopPropagation()

const handleColorClick = () => colorInputDom.value?.click()

const pantoneDisplay = computed(() => {
  const rgb = chroma(props.color).rgb()
  if (!props.pantoneList) {
    return
  }
  const pantoneItem = values(props.pantoneList).find(
    (pantoneItem) =>
      pantoneItem.r === rgb[0] &&
      pantoneItem.g === rgb[1] &&
      pantoneItem.b === rgb[2]
  )
  return pantoneItem?.name
})

const handleColorInput = (e: Event, index: number) => {
  if (!e.target) {
    return
  }
  const target = e.target as HTMLInputElement
  emit('colorInput', target.value, index)
}

const handlePantoneCodeChange = (e: Event) => {
  if (!e.target) {
    return
  }
  const target = e.target as HTMLInputElement

  const pantoneItem = props.pantoneList?.[target.value]
  if (!pantoneItem) {
    target.value = pantoneDisplay.value || ''
    return
  }
  target.value = pantoneItem.name

  const { r, g, b } = pantoneItem
  const newColor = chroma(r, g, b).hex()
  emit('colorChange', newColor, props.index)
}

onMounted(() => {
  if (!pantoneInputDom.value) {
    return
  }
  pantoneInputDom.value.addEventListener('keydown', handleKeyboardEvent)
})

onUnmounted(() => {
  if (!pantoneInputDom.value) {
    return
  }
  pantoneInputDom.value.removeEventListener('keydown', handleKeyboardEvent)
})
</script>
