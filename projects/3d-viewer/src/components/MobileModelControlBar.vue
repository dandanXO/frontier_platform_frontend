<template lang="pug">
div(class="absolute top-2 left-0 w-full flex items-center justify-between px-5 gap-x-6")
  div(
    class="flex items-center justify-between w-[290px] h-10 border border-grey-800 rounded-[4px] bg-grey-900 text-grey-100 p-3 cursor-pointer"
    :class="{ 'rounded-br-none': expanded }"
    @click="emit('toggleExpand')"
  )
    span(class="font-bold") {{ $t('EE0137') }}
    f-svg-icon(
      size="24"
      :iconName="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
    )
  f-button(theme="dark" size="md" @click="emit('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
defineProps<{
  expanded: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleExpand'): void
  (e: 'close'): void
}>()
</script>

<style scoped></style>
