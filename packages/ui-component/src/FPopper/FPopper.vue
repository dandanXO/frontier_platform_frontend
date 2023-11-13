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

<script lang="ts">
export default {
  name: 'FPopper',
}
</script>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { createPopper } from '@popperjs/core'
import type { TOOLTIP_PLACEMENT } from '../constants'
// https://popper.js.org/docs/v2/

const emit = defineEmits<{
  (e: 'expand'): void
  (e: 'collapse'): void
}>()

const props = withDefaults(
  defineProps<{
    placement?: `${TOOLTIP_PLACEMENT}`
    offset?: [number, number]
    disabled?: boolean
    onFirstUpdate?: () => void
  }>(),
  {
    placement: 'auto',
    offset: () => [0, 10],
    disabled: false,
    onFirstUpdate: () => {},
  }
)

const isExpand = ref(false)
const refTrigger = ref<HTMLElement>()
const refPopper = ref<HTMLElement>()

const expandPopper = async () => {
  if (isExpand.value || props.disabled) {
    return
  }

  isExpand.value = true

  await nextTick()

  if (!refTrigger.value || !refPopper.value) {
    return
  }

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
