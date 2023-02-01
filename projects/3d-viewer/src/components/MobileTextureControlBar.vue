<template lang="pug">
div(class="absolute top-2 left-0 w-full flex items-center justify-end px-5 gap-x-6")
  f-button(theme="dark" size="md" @click="emit('close')") {{ $t('UU0112') }}
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped></style>
