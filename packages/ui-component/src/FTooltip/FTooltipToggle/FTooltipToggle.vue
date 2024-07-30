<style lang="scss">
$radius: 3px;

div[role='popper'] {
  &[data-popper-placement^='top'] #arrow {
    left: 50%;
    transform: translateX(-50%);
    bottom: 0px;
    &::before {
      left: -6px;
    }
  }

  &[data-popper-placement^='bottom'] #arrow {
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    &::before {
      left: -6px;
      transform: rotate(180deg);
    }
  }

  &[data-popper-placement^='left'] #arrow {
    right: -3px;
    top: 50%;
    transform: translateY(-50%);
    &::before {
      top: -6px;
      transform: rotate(-90deg);
    }
  }

  &[data-popper-placement^='right'] #arrow {
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    &::before {
      top: -6px;
      transform: rotate(90deg);
    }
  }
}

#arrow,
#arrow::before {
  visibility: visible;
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(38, 38, 38, 0.8);
  background: inherit;
  z-index: -1;
}

#arrow {
  visibility: hidden;
  @apply bg-transparent;
}
</style>
<template lang="pug">
f-popper(class="w-fit" :placement="placement" :disabled="disabledTooltip")
  template(#trigger)
    div(
      class="flex items-center gap-x-2 p-1 hover:bg-grey-100 hover:rounded cursor-pointer"
    )
      span(v-if="!!triggerText" class="text-caption text-grey-900") {{ triggerText }}
      f-svg-icon(:iconName="triggerIcon" :size="size" class="text-grey-600")
  template(#content="{ isExpand, collapsePopper }") 
    div(
      class="relative rounded bg-grey-900/80 max-w-85 p-5 box-border text-grey-50 text-caption/1.3"
    )
      div
        template(v-if="!slots['slot:tooltip-toggle-content']")
          p(v-if="!!tooltipTitle" class="break-all font-bold") {{ tooltipTitle }}
          p(v-if="!!tooltipMessage" class="break-all") {{ tooltipMessage }}
        slot(v-else name="slot:tooltip-toggle-content" :isExpand="isExpand")
      div(
        v-if="slots['slot:tooltip-toggle-link'] || slots['slot:tooltip-toggle-button']"
        class="pt-7.5 grid grid-flow-col items-center"
      )
        div(v-if="slots['slot:tooltip-toggle-link']" class="justify-self-start break-all")
          slot(name="slot:tooltip-toggle-link")
        div(v-if="slots['slot:tooltip-toggle-button']" class="justify-self-end pl-8.5") 
          slot(
            name="slot:tooltip-toggle-button"
            :collapseTooltipToggle="collapsePopper"
          )
      #arrow
</template>

<script lang="ts">
export default {
  name: 'FTooltipToggle',
}
</script>

<script lang="ts" setup>
import { useSlots } from 'vue'
import { TOOLTIP_PLACEMENT } from '../../constants'
// https://popper.js.org/docs/v2/

export interface TooltipMediaProps {
  placement?: TOOLTIP_PLACEMENT
  offset?: [number, number]
  tooltipTitle?: string
  tooltipMessage?: string
  triggerIcon?: string
  triggerText?: string
  disabledTooltip?: boolean
  size?: number
}

withDefaults(defineProps<TooltipMediaProps>(), {
  placement: TOOLTIP_PLACEMENT.TOP,
  offset: () => [0, 8],
  triggerIcon: 'question',
  triggerText: '',
  disabledTooltip: false,
  size: 16,
})

const slots = useSlots()
</script>
