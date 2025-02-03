<template>
  <div class="flex flex-1 p-4 items-center justify-center w-full">
    <slot name="content" />
  </div>
</template>

<script setup lang="ts">
import type { BOTTOMBAR_SECTION } from '@/constants'

defineProps<{
  activeSection?: BOTTOMBAR_SECTION
}>()
</script>
