<template lang="pug">
div(
  class="flex flex-col items-center justify-center gap-4 bg-brand px-10 py-11 rounded-lg border-dashed border border-brand-solid"
)
  f-svg-icon(iconName="upload" size="42" class="text-brand-solid")
  p(class="text-base text-primary-inverse") {{ $t('RR0484') }}
  f-button(size="md" type="secondary") {{ $t('DD0038') }}
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
