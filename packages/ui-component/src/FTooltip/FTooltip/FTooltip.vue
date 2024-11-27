<style lang="scss">
#arrow,
#arrow::before {
  border-top-color: var(--color-primary) !important;
}
</style>

<template lang="pug">
div(
  ref="refTrigger"
  class="w-fit"
  aria-describedby="tooltip"
  data-cy="tooltip"
  @mouseenter="mouseenterHandler"
  @mouseleave="interactive && mouseleaveHandler()"
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
      :class="[classContainer, customClassContainer]" 
      class="z-tooltip"   
      :onmouseleave="mouseleaveHandler"
      :onclick="(e:Event) => e.stopPropagation()"
      v-if="isActive"
      :data-theme="theme"
    )
      div(
        class="rounded p-3 flex flex-col gap-3 bg-primary text-primary-inverse max-w-265"
        :class="[classContent]"
      )
        div(class="flex flex-col gap-1")
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
// https://popper.js.org/docs/v2/

interface Props {
  theme?: 'new' | 'new-dark' | 'startrust'
  classContent?: string
  classContainer?: string
  placement?: TOOLTIP_PLACEMENT.RIGHT
  offset?: [number, number]
  interactive?: boolean
  title?: string
  desc?: string
  isDescHTML?: boolean
}

const isActive = ref(false)
const refTrigger = ref<HTMLElement>()
const refTooltip = ref<HTMLElement>()
const customClassContainer = ref('')

const props = withDefaults(defineProps<Props>(), {
  placement: TOOLTIP_PLACEMENT.RIGHT,
  classContent: '',
  classContainer: '',
  interactive: false,
})

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
        fn: (properties) => {
          const {
            state: { placement },
          } = properties

          if (!placement) {
            return
          }
          const styleTooltip = {
            [TOOLTIP_PLACEMENT.RIGHT]: 'pl-2',
            [TOOLTIP_PLACEMENT.TOP_END]: 'pb-2',
          }

          // no need to get the placement right
          // by giving empty string as the default value
          // will solved the issue
          // @ts-expect-error
          customClassContainer.value = styleTooltip[placement] ?? ''
          return properties.state
        },
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
