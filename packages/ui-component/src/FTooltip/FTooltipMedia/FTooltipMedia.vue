<template lang="pug">
div(
  ref="refTrigger"
  :class="[isNotFitWidth ? 'w-full' : 'w-fit']"
  aria-describedby="tooltip"
  @mouseenter="mouseenterHandler"
  @mouseleave="mouseleaveHandler"
)
  slot(name="slot:tooltip-trigger" :isActive="isActive")
  teleport(v-if="isActive" to="body") 
    div(
      ref="refTooltip"
      role="tooltip"
      class="z-tooltip rounded bg-grey-900/80 px-2 pt-2 pb-1.5 min-w-26.5 max-w-56 box-content text-grey-50 text-caption/1.3"
    )
      div(class="rounded-sm overflow-hidden mb-1.5")
        img(v-if="!!imageUrl" :src="imageUrl")
        div(
          v-else-if="!!pantone"
          class="w-26.5 h-26.5"
          :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }"
        )
      slot(
        v-if="slots['slot:tooltip-content']"
        name="slot:tooltip-content"
        :isActive="isActive"
      )
      template(v-else)
        p(v-if="!!tooltipTitle" class="break-all font-bold") {{ tooltipTitle }}
        p(v-if="!!tooltipMessage") {{ tooltipMessage }}
</template>

<script lang="ts">
export default {
  name: 'FTooltipMedia',
}
</script>

<script lang="ts" setup>
import { toRefs, useSlots } from 'vue'
import { TOOLTIP_PLACEMENT } from '../../constants'
import { useTooltip } from '../../FTooltip'
// https://popper.js.org/docs/v2/

export interface TooltipMediaProps {
  placement?: `${TOOLTIP_PLACEMENT}`
  offset?: [number, number]
  isNotFitWidth?: boolean
  disabledTooltip?: boolean
  tooltipTitle?: string
  tooltipMessage?: string
  /**
   * attach the attribute `data-tooltip-boundary-reference="[key]"` on reference element first then set the `boundaryReference` on `FTooltipStandard`
   *
   * ```
   * <div data-tooltip-boundary-reference="target"/>
   * ...
   * <f-tooltip-standard boundaryReference="target">
   * ...
   * ```
   */
  boundaryReference?: string
  imageUrl?: string
  pantone?: {
    r: number
    g: number
    b: number
  }
}

const emit = defineEmits<{
  (e: 'show'): void
  (e: 'hide'): void
}>()

const props = withDefaults(defineProps<TooltipMediaProps>(), {
  placement: TOOLTIP_PLACEMENT.TOP,
  offset: () => [0, 8],
  isNotFitWidth: false,
  disabledTooltip: false,
})

const slots = useSlots()
const { disabledTooltip, offset, boundaryReference, placement } = toRefs(props)
const {
  refTrigger,
  refTooltip,
  isActive,
  mouseenterHandler,
  mouseleaveHandler,
} = useTooltip({
  disabledTooltip,
  offset,
  boundaryReference,
  placement,
  emit,
})
</script>
