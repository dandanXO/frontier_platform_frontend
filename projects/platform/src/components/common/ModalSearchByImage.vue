<template lang="pug">
div(class="bg-brand px-10 py-11 rounded-lg border-dashed border border-brand-solid")
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  primaryBtnText: string
  secondaryBtnText: string
  primaryBtnHandler: VoidFunction
  secondaryBtnHandler: VoidFunction
}
defineProps<Props>()
</script>
