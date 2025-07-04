<template>
  <div class="flex">
    <template v-for="(tab, index) in tabs" :key="tab.id">
      <button
        @click="handleClick(tab.id)"
        :class="[
          'flex-1 px-4 py-2 h-10 text-sm font-bold leading-5 focus:outline-none',
          modelValue === tab.id
            ? 'text-green-500-v1 border-b-2 border-green-500-v1'
            : 'text-black border-b border-grey-200-v1 hover:text-green-500-v1 hover:border-green-500-v1',
        ]"
        type="button"
      >
        {{ tab.name }}
      </button>
      <div
        v-if="index < tabs.length - 1"
        class="w-2 h-10 border-b border-grey-200-v1"
        aria-hidden="true"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface Tab {
  id: string
  name: string
  [key: string]: any // Allow other properties
}

const props = defineProps({
  tabs: {
    type: Array as PropType<Tab[]>,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleClick = (tabId: string) => {
  emit('update:modelValue', tabId)
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
