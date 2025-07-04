<template lang="pug">
f-popper(
  placement="bottom-end"
  :disabled="disabled"
  @expand="isFocus = true"
  @collapse="isFocus = false"
)
  template(#trigger="{ isExpand }")
    div(
      :class="classMain"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    )
      label(class="w-5 h-5 rounded" :style="{ backgroundColor: innerLabelColor }")
      f-svg-icon(
        iconName="keyboard_arrow_right"
        size="20"
        class="text-grey-600 transform"
        :class="[isExpand ? '-rotate-90' : 'rotate-90']"
      )
  template(#content)
    div(class="w-max p-2.5 rounded bg-grey-0 shadow-16")
      div(class="grid grid-cols-6 grid-rows-3 gap-x-2 gap-y-1.5")
        label(
          v-for="item in labelColorList"
          :key="item.labelColor"
          class="w-5 h-5 rounded-sm relative cursor-pointer"
          :style="{ backgroundColor: item.labelColor }"
          @click="innerLabelColor = item.labelColor"
        )
          f-svg-icon(
            v-if="item.labelColor === innerLabelColor"
            iconName="done"
            size="14"
            class="text-grey-0 absolute transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )
</template>

<script setup>
import { computed, useSlots, toRefs } from 'vue'
import { COLOR } from '@/utils/constants'
import useInput from '@frontier/ui-component/src/FInput/useInput'

const emit = defineEmits(['update:labelColor'])
const props = defineProps({
  labelColor: {
    validator: (v) => true,
    required: true,
  },
  size: {
    type: String,
    default: 'lg',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const { disabled } = toRefs(props)
const labelColorList = computed(() =>
  Object.values(COLOR).map((color) => ({ labelColor: color }))
)

const innerLabelColor = computed({
  get: () => props.labelColor,
  set: (v) => emit('update:labelColor', v),
})

const slots = useSlots()
const { state, STATE, classTransition, isFocus, isHover } = useInput({
  slots,
  inputValue: innerLabelColor,
  disabled: disabled,
})

const classMain = computed(() => {
  const classList = [
    'border',
    'rounded',
    'flex',
    'items-center',
    ...classTransition.value,
  ]

  switch (props.size) {
    case 'md':
      classList.push('h-9', 'px-3', 'gap-x-1')
      break
    case 'lg':
      classList.push('h-11', 'px-4', 'gap-x-2')
      break
  }
  switch (state.value) {
    case STATE.DEFAULT:
      classList.push('border-grey-200', 'bg-grey-0')
      break
    case STATE.HOVER:
      classList.push('border-grey-250', 'bg-grey-50-v1')
      break
    case STATE.FOCUS:
      classList.push(
        'shadow-[0_0_0_4px_#E9F8F3]',
        'border-primary-300',
        'bg-grey-100'
      )
      break
    case STATE.DISABLED:
      classList.push('border-grey-200', 'cursor-not-allowed', 'bg-grey-50')
      break
  }

  return classList
})
</script>
