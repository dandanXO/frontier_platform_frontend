<template>
  <div
    class="flex flex-col items-center justify-center gap-1 cursor-pointer select-none"
    :class="[classContainer]"
  >
    <f-svg-icon :iconName="iconName" size="18" />
    <p>{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  title: string
  iconName: string
  active: boolean
}>()

const classContainer = computed(() =>
  props.active ? 'text-brand-solid' : 'text-primary-inverse'
)
</script>
