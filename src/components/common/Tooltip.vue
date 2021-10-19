<style lang="scss" scoped>
$radius: 3px;
$shadow: rgba(0, 0, 0, 0.1);

div[role="tooltip"] {
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);

  &[data-popper-placement^="top"] > #arrow {
    bottom: -9px;
    &::before {
      box-shadow: 1px 1px 2px $shadow;
      border-radius: 0 0 $radius 0;
    }
  }

  &[data-popper-placement^="bottom"] > #arrow {
    top: -9px;
    &::before {
      box-shadow: -1px -1px 2px $shadow;
      border-radius: $radius 0 0 0;
    }
  }

  &[data-popper-placement^="left"] > #arrow {
    right: -8px;
    &::before {
      box-shadow: 1px -1px 2px $shadow;
      border-radius: 0 $radius 0 0;
    }
  }

  &[data-popper-placement^="right"] > #arrow {
    left: -8px;
    &::before {
      box-shadow: -1px 1px 2px $shadow;
      border-radius: 0 0 0 $radius;
    }
  }
}

#arrow,
#arrow::before {
  position: absolute;
  width: 16px;
  height: 16px;
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

.w-fit {
  width: fit-content;
}
</style>

<template lang="pug">
div(class="w-fit")
  div(ref="trigger" class="w-fit" aria-describedby="tooltip" @mouseenter="showTooltip" @mouseleave="hideTooltip")
    slot
  div(ref="tooltip" role="tooltip" class="z-100 rounded bg-black-0" :class="{'hidden': !show}")
    slot(name="content")
    div(id="arrow" data-popper-arrow)
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { createPopper } from '@popperjs/core'
// https://popper.js.org/docs/v2/

export default {
  name: 'Tooltip',
  props: {
    placement: {
      type: String,
      default: 'auto',
      validator: (value) => {
        return [
          'auto',
          'top',
          'bottom',
          'right',
          'left'
        ].includes(value)
      }
    },
    offset: {
      type: Array,
      default: () => [0, 13]
    }
  },
  setup (props) {
    const show = ref(false)
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
      show.value = true

      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: true }
        ]
      }))
    }

    const hideTooltip = () => {
      show.value = false

      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false }
        ]
      }))
    }

    onMounted(() => {
      popperInstance = createPopper(trigger.value, tooltip.value, option)
    })

    return {
      trigger,
      tooltip,
      show,
      showTooltip,
      hideTooltip
    }
  }
}
</script>
