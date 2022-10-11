<template lang="pug">
div
  div(
    ref="refTrigger"
    :class="[isNotFitWidth ? 'w-full' : 'w-fit']"
    aria-describedby="tooltip"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  )
    slot(name="trigger" :isActive="isActive")
  div(ref="refTooltip" role="tooltip" class="z-100 rounded bg-grey-900/80 px-2 py-1.5"  :class="{ 'hidden': !isActive }")
    slot(v-if="isActive" name="content"  :isActive="isActive")
</template>

<script>
export default {
  name: 'FTooltip'
}
</script>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { createPopper } from '@popperjs/core'
// https://popper.js.org/docs/v2/

const emit = defineEmits(['show', 'hide'])
const props = defineProps({
  placement: {
    type: String,
    default: 'top',
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
    default: () => [0, 8]
  },
  /**
   * attach the attribute `data-tooltip-boundary-reference="[key]"` on reference element first then set the `boundaryReference` on `FTooltip`
   * 
   * ```
   * <div data-tooltip-boundary-reference="target"/>
   * ...
   * <f-tooltip boundaryReference="target">
   * ...
   * ```
   */
  boundaryReference: {
    type: String,
    default: ''
  },
  isNotFitWidth: {
    type: Boolean,
    default: false
  }
})

const isActive = ref(false)
let popperInstance = reactive({})
const timer = ref(null)

const showTooltip = () => {
  timer.value = setTimeout(async () => {
    isActive.value = true

    await nextTick()
    const children = refTooltip.value.children
    if (children.length === 1 && children[0].tagName === 'P') {
      children[0].classList.add('text-grey-50', 'text-caption', 'leading-1.3')
    }

    popperInstance.setOptions((options) => ({
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: true }
      ],
    }))
    emit('show')
  }, 500)
}

const hideTooltip = () => {
  if (!isActive.value) {
    clearTimeout(timer.value)
    return
  }

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

const refTrigger = ref(null)
const refTooltip = ref(null)

onMounted(() => {
  const modifiers = [
    {
      name: 'offset',
      options: {
        offset: props.offset
      }
    }
  ]

  if (props.boundaryReference !== '') {
    modifiers.push(
      {
        name: 'preventOverflow',
        options: {
          boundary: document.querySelector(`[data-tooltip-boundary-reference="${props.boundaryReference}"]`)
        }
      }
    )
  }

  const option = {
    placement: props.placement,
    modifiers
  }
  popperInstance = createPopper(refTrigger.value, refTooltip.value, option)
})
</script>
