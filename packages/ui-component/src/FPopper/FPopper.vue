<template lang="pug">
div(
  ref="refTrigger"
  aria-describedby="popper"
  @click="expandPopper"
  @contextmenu.prevent="expandPopper"
  v-bind="$attrs"
  data-cy="f-popper"
)
  slot(name="trigger" :isExpand="isExpand")
teleport(v-if="isExpand" to="body")
  div(class="fixed z-popper w-screen h-screen" data-cy="f-popper-body")
    div(
      class="fixed w-screen h-screen top-0 left-0"
      @click="collapsePopper"
      @contextmenu.prevent="expandPopper"
      @wheel.prevent
    )
    div(
      ref="refPopper"
      role="popper"
      @click.stop
      class="popper-content-animation shadow-md"
    )
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
import { createPopper, type Instance } from '@popperjs/core'
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
const popperInstance = ref<Instance | null>(null)

const expandPopper = async () => {
  if (isExpand.value || props.disabled) {
    return
  }

  isExpand.value = true

  await nextTick()

  if (!refTrigger.value || !refPopper.value) {
    return
  }

  popperInstance.value = createPopper(refTrigger.value, refPopper.value, {
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
  popperInstance.value = null
  emit('collapse')
}

const getPopperInstance = () => {
  return popperInstance.value
}

defineExpose({
  expandPopper,
  getPopperInstance,
})
</script>

<style lang="scss" scoped>
.popper-content-animation {
  /* overflow-y: scroll;
   animation: slideDown 0.35s ease-out; */
  transform-origin: top center;
}

/* @keyframes slideDown {
  from {
    height: 0px;
    min-height: 0px;
    opacity: 0;
  }
  to {
    min-height: 400px;
    opacity: 1;
  }
} */
</style>
