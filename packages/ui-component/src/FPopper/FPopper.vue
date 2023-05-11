<template lang="pug">
div(
  ref="refTrigger"
  aria-describedby="popper"
  @click="expandPopper"
  v-bind="$attrs"
)
  slot(name="trigger" :isExpand="isExpand")
teleport(v-if="isExpand" to="body")
  div(class="fixed z-popper w-screen h-screen")
    div(
      class="fixed w-screen h-screen top-0 left-0"
      @click="collapsePopper"
      @wheel.prevent
    )
    div(ref="refPopper" role="popper" @click.stop)
      slot(
        name="content"
        :isExpand="isExpand"
        :collapsePopper="collapsePopper"
      )
</template>

<script>
export default {
  name: 'FPopper',
}
</script>

<script setup>
import { ref, nextTick } from 'vue'
import { createPopper } from '@popperjs/core'
import { THEME } from '../constants'
// https://popper.js.org/docs/v2/

const emit = defineEmits(['expand', 'collapse'])
const props = defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
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
        'left-end',
      ].includes(value)
    },
  },
  offset: {
    type: Array,
    default: () => [0, 10],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onFirstUpdate: {
    type: Function,
    default: () => {},
  },
})

const isExpand = ref(false)
const refTrigger = ref(null)
const refPopper = ref(null)

const expandPopper = async () => {
  if (isExpand.value || props.disabled) {
    return
  }

  isExpand.value = true

  await nextTick()

  createPopper(refTrigger.value, refPopper.value, {
    onFirstUpdate: props.onFirstUpdate,
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: props.offset,
        },
      },
    ],
  })
  emit('expand')
}

const collapsePopper = () => {
  isExpand.value = false
  emit('collapse')
}

defineExpose({
  expandPopper,
})
</script>
