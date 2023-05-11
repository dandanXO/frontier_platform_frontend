<template lang="pug">
div(
  ref="refTrigger"
  :class="[isNotFitWidth ? 'w-full' : 'w-fit']"
  aria-describedby="tooltip"
  @mouseenter="showTooltip"
  @mouseleave="hideTooltip"
)
  slot(name="slot:tooltip-trigger" :isActive="isActive")
  teleport(v-if="isActive" to="body") 
    div(
      ref="refTooltip"
      role="tooltip"
      class="z-tooltip rounded bg-grey-900/80 px-2 py-1.5 max-w-85 text-grey-50 text-caption/1.3"
    )
      slot(
        v-if="slots['slot:tooltip-content']"
        name="slot:tooltip-content"
        :isActive="isActive"
      )
      template(v-else)
        p(v-if="!!tooltipTitle" class="break-all font-bold") {{ tooltipTitle }}
        p(v-if="!!tooltipMessage" class="break-all") {{ tooltipMessage }}
</template>

<script lang="ts">
export default {
  name: 'FTooltipStandard',
}
</script>

<script lang="ts" setup>
import { useSlots, toRefs } from 'vue'
import { TOOLTIP_PLACEMENT } from '../../constants'
import { useTooltip } from '../../FTooltip'
// https://popper.js.org/docs/v2/

export interface TooltipStandardProps {
  placement?: TOOLTIP_PLACEMENT
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
}

const emit = defineEmits<{
  (e: 'show'): void
  (e: 'hide'): void
}>()

const props = withDefaults(defineProps<TooltipStandardProps>(), {
  placement: TOOLTIP_PLACEMENT.TOP,
  offset: () => [0, 8],
  isNotFitWidth: false,
  disabledTooltip: false,
})

const slots = useSlots()
const { disabledTooltip, offset, boundaryReference, placement } = toRefs(props)
const { refTrigger, refTooltip, isActive, showTooltip, hideTooltip } =
  useTooltip({
    disabledTooltip,
    offset,
    boundaryReference,
    placement,
    emit,
  })
</script>
