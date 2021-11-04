<style lang="scss" scoped>
$radius: 3px;
$shadow: rgba(0, 0, 0, 0.1);

div[role="tooltip"] {
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);

  &[data-popper-placement^="top"] > #arrow {
    bottom: -7px;
    &::before {
      box-shadow: 1px 1px 2px $shadow;
      border-radius: 0 0 $radius 0;
    }
  }

  &[data-popper-placement^="bottom"] > #arrow {
    top: -7px;
    &::before {
      box-shadow: -1px -1px 2px $shadow;
      border-radius: $radius 0 0 0;
    }
  }

  &[data-popper-placement^="left"] > #arrow {
    right: -7px;
    &::before {
      box-shadow: 1px -1px 2px $shadow;
      border-radius: 0 $radius 0 0;
    }
  }

  &[data-popper-placement^="right"] > #arrow {
    left: -7px;
    &::before {
      box-shadow: -1px 1px 2px $shadow;
      border-radius: 0 0 0 $radius;
    }
  }
}

#arrow,
#arrow::before {
  position: absolute;
  width: 14px;
  height: 14px;
  background: inherit;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: "";
  transform: rotate(45deg);
}
</style>

<template lang="pug">
div(class="w-fit" v-click-away="clickAway")
  div(
    ref="trigger"
    class="w-fit"
    aria-describedby="tooltip"
    @mouseenter="manual ? '' : showTooltip()"
    @mouseleave="manual ? '' : hideTooltip()"
    @click="handleClick"
  )
    slot(name='trigger' :isActive="isActive")
  div(ref="tooltip" role="tooltip" class="z-100 rounded bg-black-0" :class="{'hidden': !isActive}")
    slot(name="content" :isActive="isActive")
    div(v-if="showArrow" id="arrow" data-popper-arrow)
</template>

<script>
import { directive } from 'vue3-click-away'
import { ref, onMounted, reactive } from 'vue'
import { createPopper } from '@popperjs/core'
// https://popper.js.org/docs/v2/

export default {
  name: 'Tooltip',
  directives: {
    ClickAway: directive
  },
  props: {
    placement: {
      type: String,
      default: 'auto',
      validator: (value) => {
        return [
          'auto',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'
        ].includes(value)
      }
    },
    offset: {
      type: Array,
      default: () => [0, 13]
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    manual: {
      // whether to control Tooltip manually.
      // mouseenter and mouseleave won't have effects if set to true
      type: Boolean,
      default: false
    }
  },
  emits: ['show', 'hide'],
  setup (props, { emit }) {
    const isActive = ref(false)
    const trigger = ref(null)
    const tooltip = ref(null)
    let popperInstance = reactive({})
    const option = {
      placement: props.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: props.offset
          }
        }
      ]
    }

    const showTooltip = () => {
      isActive.value = true

      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: true }
        ]
      }))
      emit('show')
    }

    const hideTooltip = () => {
      isActive.value = false

      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false }
        ]
      }))
      emit('hide')
    }

    const clickAway = () => {
      props.manual && hideTooltip()
    }

    const handleClick = () => {
      if (!props.manual) return

      if (isActive.value) hideTooltip()
      else showTooltip()
    }

    onMounted(() => {
      popperInstance = createPopper(trigger.value, tooltip.value, option)
    })

    return {
      trigger,
      tooltip,
      isActive,
      showTooltip,
      hideTooltip,
      clickAway,
      handleClick
    }
  }
}
</script>
