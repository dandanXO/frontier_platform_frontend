<style lang="scss" scoped>
#arrow,
#arrow::before {
  z-index: 10001 !important;
  position: absolute;
  width: 12px !important;
  height: 12px !important;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg) !important;
  background-color: var(--color-primary) !important;
  @apply shadow-md;
  border-width: 0 !important;
}

/* Position the arrow correctly based on placement */
.tooltip-container[data-popper-placement^='top'] #arrow {
  top: 65% !important;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1); /* Shadow for bottom when arrow points down */
}

.tooltip-container[data-popper-placement^='bottom'] #arrow {
  top: -10px !important;
  @apply shadow-md;
}

.tooltip-container[data-popper-placement^='left'] #arrow {
  right: -0px !important;
  @apply shadow-md;
}

.tooltip-container[data-popper-placement^='right'] #arrow {
  left: -12px !important;
  @apply shadow-md;
}
</style>

<template lang="pug">
div(
  ref="refTrigger"
  class="w-fit"
  aria-describedby="tooltip"
  data-cy="tooltip"
  @mouseenter="mouseenterHandler"
  @mouseleave="interactive && debouncedMouseLeave()"
  :data-theme="theme"
)
  div(
    @mouseleave="!interactive && mouseleaveHandler()"
  )
    slot(name="slot:tooltip-trigger")
  teleport(v-if="isActive" to="body") 
    div(
      ref="refTooltip" 
      role="popper" 
      :class="[classContainer, 'tooltip-container']" 
      class="z-tooltip"   
      :onmouseleave="mouseLeaveContainer"
      :onmouseenter="mouseEnterContainer"
      :onclick="(e:Event) => e.stopPropagation()"
      v-if="isActive"
      :data-theme="theme"
    )
      div(class="shadow-md")
        div(
          class="rounded p-3 flex flex-col gap-3 bg-primary text-primary-inverse max-w-265 relative z-2"
          :class="[classContent]"
        )
          div(class="flex flex-col gap-1" v-if="title || desc")
            p(v-if="!!title" class="break-all font-bold text-sm") {{ title }}
            div(v-if="!!desc" class="break-words text-xs")
              p(v-if="isDescHTML" v-html="desc")
              p(v-else) {{ desc }}
          slot(name="slot:tooltip-content")
        #arrow
</template>

<script lang="ts">
export default {
  name: 'FTooltip',
}
</script>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { TOOLTIP_PLACEMENT } from '../../constants'
import { createPopper } from '@popperjs/core'
import { debounce } from 'debounce'
// https://popper.js.org/docs/v2/

interface Props {
  theme?: 'new' | 'new-dark' | 'startrust'
  classContent?: string
  classContainer?: string
  placement?: TOOLTIP_PLACEMENT
  offset?: [number, number]
  interactive?: boolean
  title?: string
  desc?: string
  isDescHTML?: boolean
}

const isActive = ref(false)
const isMouseInsideContainer = ref(false)
const refTrigger = ref<HTMLElement>()
const refTooltip = ref<HTMLElement>()

const props = withDefaults(defineProps<Props>(), {
  placement: TOOLTIP_PLACEMENT.RIGHT,
  classContent: '',
  classContainer: '',
  interactive: false,
})

const debouncedMouseLeave = debounce(() => {
  if (isActive.value) {
    isActive.value = isMouseInsideContainer.value
  }
  // the timer is just to make sure the mouse event container finished
  // before closed the tooltip
}, 100)
const mouseEnterContainer = () => {
  isMouseInsideContainer.value = true
}

const mouseLeaveContainer = () => {
  isMouseInsideContainer.value = false
  isActive.value = false
}

const mouseenterHandler = async () => {
  if (isActive.value) {
    return
  }

  isActive.value = true

  await nextTick()
  if (!refTrigger.value || !refTooltip.value) {
    return
  }

  createPopper(refTrigger.value, refTooltip.value, {
    placement: props.placement,
    modifiers: [
      {
        name: 'placementListener',
        phase: 'main',
        enabled: true,
      },
      {
        name: 'offset',
        options: {
          offset: props.offset,
        },
      },
    ],
  })
}

const mouseleaveHandler = () => {
  isActive.value = false
}
</script>
