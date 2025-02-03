<template>
  <div class="p-2 gap-2 flex flex-row bg-secondary rounded">
    <div class="relative w-5.5 h-5.5 overflow-hidden rounded cursor-pointer">
      <!-- 不使用 hidden 是因為在 safari 上 color picker 會連帶被隱藏 -->
      <input
        class="absolute left-1 top-0 w-1 h-1"
        ref="colorInputDom"
        type="color"
        :value="color"
        @input="handleColorInput($event, index)"
      />
      <div
        class="absolute w-full h-full"
        :style="{ backgroundColor: color }"
        @click="handleColorClick"
      />
    </div>
    <span class="flex items-center text-body2 text-grey-250 min-w-12 ml-3"
      >{{ color.toUpperCase() }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  index: number
  color: string
}>()

const colorInputDom = ref<HTMLInputElement>()

const emit = defineEmits<{
  (e: 'colorInput', color: string, index: number): void
}>()

const handleColorInput = (e: Event, index: number) => {
  if (!e.target) {
    return
  }
  const target = e.target as HTMLInputElement
  emit('colorInput', target.value, index)
}
const handleColorClick = () => colorInputDom.value?.click()
</script>
