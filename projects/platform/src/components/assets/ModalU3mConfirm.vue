<template lang="pug">
div(class="flex flex-col gap-3 text-primary-inverse text-center")
  p(class="font-bold text-xl") {{ title }}
  p(class="text-sm") {{ description }}

div(class="flex flex-row items-center justify-center gap-3")
  f-button(size="md" type="critical-outline" :onclick="secondaryBtnHandler") {{ secondaryBtnText }}
  f-button(size="md" :onclick="primaryBtnHandler") {{ primaryBtnText }}
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
