<style lang="scss" scoped>
$radius: 3px;
$shadow: rgba(0, 0, 0, 0.1);

div[role="tooltip"] {
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);

  &[data-popper-placement^="top"]>#arrow {
    bottom: -7px;

    &::before {
      box-shadow: 1px 1px 2px $shadow;
      border-radius: 0 0 $radius 0;
    }
  }

  &[data-popper-placement^="bottom"]>#arrow {
    top: -7px;

    &::before {
      box-shadow: -1px -1px 2px $shadow;
      border-radius: $radius 0 0 0;
    }
  }

  &[data-popper-placement^="left"]>#arrow {
    right: -7px;

    &::before {
      box-shadow: 1px -1px 2px $shadow;
      border-radius: 0 $radius 0 0;
    }
  }

  &[data-popper-placement^="right"]>#arrow {
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
  z-index: -1;
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
div
  div(
    ref="refTrigger"
    class="w-fit"
    aria-describedby="tooltip"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  )
    slot(name="trigger" :isActive="isActive")
  div(ref="refTooltip" role="tooltip" class="z-100 rounded bg-black-0" :class="{ 'hidden': !isActive }")
    slot(v-if="isActive" name="content" :isActive="isActive")
    div(v-if="showArrow" id="arrow" data-popper-arrow)
</template>

<script>
export default {
  name: 'Tooltip'
}
</script>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { createPopper } from '@popperjs/core'
// https://popper.js.org/docs/v2/

const emit = defineEmits(['show', 'hide'])
const props = defineProps({
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
  }
})

const isActive = ref(false)
const refTrigger = ref(null)
const refTooltip = ref(null)
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

onMounted(() => {
  popperInstance = createPopper(refTrigger.value, refTooltip.value, option)
})
</script>
