<template>
  <div
    class="absolute top-3 right-[-39.2px] w-10 text-primary-inverse cursor-pointer bg-primary border-r border-t border-b border-secondary-border rounded-r"
  >
    <div class="flex items-center justify-center w-10 h-10">
      <div class="absolute h-full w-10 right-5 top-0 z-1000"></div>
      <f-svg-icon
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        size="24"
        iconName="union"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  expanded: boolean
}>()
</script>

<style scoped></style>
