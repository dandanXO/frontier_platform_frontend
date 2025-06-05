<template lang="pug">
div(
  class="flex flex-col flex-1 justify-center align-middle p-2 gap-1 rounded"
  :class="containerClass"
  @click="disabled || !onClick ? noop() : onClick()"
)
  f-svg-icon(v-if="iconName" :iconName="iconName" size="24" class="self-center")
  div(class="flex flex-row gap-2 align-middle justify-center")
    p(class="text-sm text-center") {{ title }}
    f-tooltip(
      v-if="tooltipTitle"
      :title="tooltipTitle"
      :desc="tooltipDesc"
      :placement="TOOLTIP_PLACEMENT.TOP_START"
      data-theme="new"
      class="self-center"
      classContent="w-85"
      :offset="[2, 6]"
      theme="new"
      interactive
    )
      template(#slot:tooltip-trigger)
        f-svg-icon(iconName="question" size="16" color="white" class="self-center")
      template(#slot:tooltip-content)
        div
          a(
            href="https://www.frontier.cool/a/docs/asset-library/creating-3d-materials#:~:text=%E2%9C%A8NEW%C2%A0%0APattern%20Finder%3A"
            target="_blank"
          )
            button(class="text-sm font-semibold underline text-cyan-400-v1") {{ $t('EE0238') }}
</template>

<script setup lang="ts">
import { TOOLTIP_PLACEMENT } from '@frontier/constants'
import { noop } from '@vueuse/core'
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  active?: boolean
  onClick?: VoidFunction
  title: string
  iconName?: string
  tooltipTitle?: string
  tooltipDesc?: string
}
const props = defineProps<Props>()

const containerClass = computed(() => {
  const result = []

  switch (true) {
    case props.active:
      result.push('bg-brand-solid text-primary-inverse')
      break
    case props.disabled:
      result.push(
        'bg-tertiary border border-disabled text-disabled cursor-not-allowed'
      )
      break
    default:
      result.push(
        'bg-primary cursor-pointer border border-secondary-border text-primary-inverse'
      )
      break
  }

  return result
})
</script>
