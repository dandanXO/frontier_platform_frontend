<template lang="pug">
f-svg-icon(
  :class="[disabled ? 'text-grey-250' : 'text-grey-600 cursor-pointer']"
  :iconName="iconName"
  size="20"
  @click="!disabled && emits('click')"
)
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconName: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  }
)

const emits = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped></style>
