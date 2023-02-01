<template lang="pug">
div(
  class="cursor-pointer active:text-primary-400"
  :class="active ? ['text-primary-400', 'hover:text-primary-500'] : ['hover:text-grey-200']"
  @click="emit('click')"
)
  f-svg-icon(:iconName="iconName" :size="size")
</template>

<script setup lang="ts">
defineProps<{
  iconName: string
  size: string
  active?: boolean
}>()

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped></style>
