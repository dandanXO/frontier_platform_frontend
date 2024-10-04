<template lang="pug">
f-input-container(:hintError="ruleErrorMsg")
  div(
    :class="classMain"
    v-if="innerTextValue"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  )
    input(
      ref="refInput"
      v-model.trim="innerTextValue"
      class="w-full h-full flex-grow outline-none bg-transparent text-body2 leading-1.6 cursor-not-allowed"
      readonly
      @focus="onFocus"
      @blur="onBlur"
    )

    div(class="flex flex-row gap-2")
      div(
        class="border border-green-200 hover:text-green-400 active:text-green-700 p-1 rounded-md"
      )
        f-svg-icon(
          v-if="(clearable && !!textValue && state === STATE.FOCUS) || !!textValue"
          :size="size === 'lg' ? '20' : '16'"
          iconName="rotate"
          class="cursor-pointer text-green-400 hover:text-green-700 active:text-green-700"
          @click="emit('choose:file')"
          @mousedown.prevent
        )
      div(
        class="border border-red-300 hover:text-red-600 active:text-red-600 p-1 rounded-md"
      )
        f-svg-icon(
          v-if="(clearable && !!textValue && state === STATE.FOCUS) || !!textValue"
          :size="size === 'lg' ? '20' : '16'"
          iconName="trash"
          class="cursor-pointer text-red-500 hover:text-red-600 active:text-red-600"
          @click="clear"
          @mousedown.prevent
        )
  f-button(
    v-else
    type="secondary"
    @click="$emit('choose:file')"
    size="md"
    prependIcon="add"
    isFullWidth
  ) {{ chooseFileTxt ?? t('UU0025') }}
  template(v-if="slots['slot:hint-supporting']" #slot:hint-supporting)
    slot(name="slot:hint-supporting")
</template>

<script setup lang="ts">
import { THEME } from '@frontier/constants'
import { ref, computed, useSlots, watch, type Ref } from 'vue'
import 'flatpickr/dist/flatpickr.css'
import useInput from '@frontier/ui-component/src/FInput/useInput'
import { useI18n } from 'vue-i18n'

const slots = useSlots()
const { t } = useI18n()
const props = defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
  size: {
    type: String,
    default: 'lg',
    validator: (v: string) => ['lg', 'md'].includes(v),
  },
  /**
   * v-model:textValue
   */
  textValue: {
    type: String,
    required: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  chooseFileTxt: {
    type: String,
  },
})

const emit = defineEmits(['update:textValue', 'clear', 'choose:file'])

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v),
})
const {
  isFilled,
  isFocus,
  isHover,
  isError,
  ruleErrorMsg,
  state,
  STATE,
  classTransition,
} = useInput({
  slots,
  inputValue: innerTextValue,
  disabled: ref(true),
})

defineExpose({
  isError,
  focus: () => {
    refInput.value?.focus()
  },
})

const refInput = ref<Ref<HTMLInputElement> | null>(null)

watch(
  () => isFilled.value,
  (filled) => {
    !filled && emit('update:textValue', null)
  }
)

const onFocus = () => {
  isFocus.value = true
}
const onBlur = () => {
  isFocus.value = false
}
const clear = () => {
  emit('update:textValue', null)
  emit('clear')
}

const classMain = computed(() => {
  const classList = [
    ...classTransition.value,
    'border',
    'rounded',
    'flex',
    'items-center',
    'cursor-not-allowed',
    'gap-2',
  ]

  switch (props.size) {
    case 'md':
      classList.push('h-9', 'px-2', 'gap-x-1')
      break
    case 'lg':
      classList.push('h-11', 'px-3', 'gap-x-2')
      break
  }

  props.theme === THEME.LIGHT
    ? classList.push('border-grey-200', 'bg-white')
    : classList.push('border-grey-750', 'bg-grey-750')

  if (isError.value) {
    classList.push('!border-red-300')
  }

  classList.push('border-grey-200', 'bg-white')

  return classList
})
</script>
