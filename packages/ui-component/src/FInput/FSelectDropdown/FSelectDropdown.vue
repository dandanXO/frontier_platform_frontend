<template lang="pug">
f-input-container(
  :label="label"
  :required="required"
  :hintSupporting="hintSupporting"
  :hintError="ruleErrorMsg || hintError"
)
  f-popper(
    placement="bottom-start"
    data-cy="input-select"
    :disabled="disabled"
    :offset="[0, -4]"
    @expand="isFocus = true"
    @collapse="isFocus = false"
  )
    template(#trigger)
      div(
        :class="classMain"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      )
        //- Leading Visual
        div(
          v-if="prependIcon || selectedMenu?.icon || selectedMenu?.thumbnail || selectedMenu?.labelColor"
          class="flex items-center justify-center shrink-0"
          :class="[size === 'sm' ? 'w-5 h-5' : 'w-6 h-6']"
        )
          //- Icon
          f-svg-icon(
            v-if="prependIcon || selectedMenu?.icon"
            :iconName="prependIcon || selectedMenu?.icon"
            :size="size === 'sm' ? '20' : '24'"
            :class="classIcon"
          )
          //- Thumbnail
          img(
            v-else-if="selectedMenu?.thumbnail"
            :src="selectedMenu.thumbnail"
            class="w-full h-full rounded-full"
          )
          //- Label Color
          div(
            v-else-if="selectedMenu?.labelColor"
            :style="{ backgroundColor: selectedMenu.labelColor }"
            class="w-3 h-3 rounded-sm"
          )
        //- Display Text
        div(:class="classDisplayText") {{ selectedMenu ? selectedMenu?.title : placeholder }}
        //- Trailing Icon
        f-svg-icon(
          v-if="appendIcon"
          :size="size === 'sm' ? '20' : '24'"
          :iconName="appendIcon"
          :class="[...classIcon, { '!text-primary-500': isFocus }]"
        )
    template(#content="{ collapsePopper }")
      f-contextual-menu(
        v-model:inputSelectValue="innerSelectValue"
        :selectMode="canCancel ? SINGLE_CANCEL : SINGLE_NONE_CANCEL"
        :menuTree="dropdownMenuTree"
        @click:menu="collapsePopper"
      )
  template(v-if="slots['slot:hint-error']" #slot:hint-error)
    slot(name="slot:hint-error")
  template(v-if="slots['slot:hint-supporting']" #slot:hint-supporting)
    slot(name="slot:hint-supporting")
</template>

<script>
export default {
  name: 'FSelectDropdown',
}
</script>

<script setup>
import { computed, useSlots, toRefs } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '../../constants.js'
import useInput from '../useInput'
import isEqual from '../../isEqual.js'

const { SINGLE_CANCEL, SINGLE_NONE_CANCEL } = CONTEXTUAL_MENU_MODE

const slots = useSlots()
const emit = defineEmits(['update:selectValue'])
const props = defineProps({
  /**
   * inherit from `FInputContainer.vue`
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * only work when `label` has been setted
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * Throws an error message if any rule fails, then it will be used in preference to it instead of `hintError`
   *
   * ***format: false case && error message***
   */
  rules: {
    type: Array,
    default: () => [],
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * it could be i18n key or text and it works only when `slot:hint-error` hasn't been set and all `rules` are pass.
   *
   */
  hintError: {
    type: [String, Boolean],
    default: '',
  },
  /**
   * inherit from `FInputContainer.vue`
   *
   * it could be i18n key or text and it works only when `slot:hint-supporting` hasn't been set.
   */
  hintSupporting: {
    type: String,
    default: '',
  },
  /**
   * v-model:selectValue
   */
  selectValue: {
    required: true,
    validator: () => true,
  },
  /**
   * inherit from `menuTree` of `FContextualMenu.vue`
   */
  dropdownMenuTree: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  canCancel: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'lg',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: 'keyboard_arrow_down',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
})
const innerSelectValue = computed({
  get: () => props.selectValue,
  set: (v) => emit('update:selectValue', v),
})

const { rules, hintError, disabled } = toRefs(props)
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
  inputValue: innerSelectValue,
  rules,
  hintError,
  disabled,
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
    case 'sm':
      classList.push('h-7', 'px-2', 'gap-x-1.5')
      break
    case 'md':
      classList.push('h-9', 'px-3', 'gap-x-1')
      break
    case 'lg':
      classList.push('h-11', 'px-4', 'gap-x-2')
      break
  }

  switch (state.value) {
    case STATE.DEFAULT:
      classList.push(
        'border-grey-200',
        isError.value ? 'bg-grey-50' : 'bg-grey-0'
      )
      break
    case STATE.HOVER:
      classList.push('border-grey-250', 'bg-grey-50')
      break
    case STATE.FOCUS:
      classList.push(
        isError.value
          ? 'shadow-[0_0_0_4px_#FDE7DA]'
          : 'shadow-[0_0_0_4px_#E9F8F3]',
        'border-primary-300',
        'bg-grey-100'
      )
      break
    case STATE.DISABLED:
      classList.push('border-grey-200', 'cursor-not-allowed', 'bg-grey-50')
      break
  }

  if (isError.value) {
    classList.push('!border-red-300')
  }

  return classList
})

const classIcon = computed(() => {
  const classList = [...classTransition.value]

  switch (state.value) {
    case STATE.DEFAULT:
      isFilled.value
        ? classList.push('text-grey-800')
        : classList.push('text-grey-900')
      break
    case STATE.HOVER:
      isFilled.value
        ? classList.push('text-grey-900')
        : classList.push('text-grey-600')
      break
    case STATE.FOCUS:
      isFilled.value
        ? classList.push('text-grey-900')
        : classList.push('text-grey-600')
      break
    case STATE.DISABLED:
      classList.push('text-grey-250')
      break
  }

  return classList
})

const classDisplayText = computed(() => {
  const classList = ['flex-grow', 'line-clamp-1']

  switch (props.size) {
    case 'sm':
      classList.push('text-caption', 'leading-1.3')
      break
    case 'md':
    case 'lg':
      classList.push('text-body2', 'leading-1.6')
      break
  }

  switch (state.value) {
    case STATE.DEFAULT:
      isFilled.value
        ? classList.push('text-grey-800')
        : classList.push('text-grey-250')
      break
    case STATE.HOVER:
      isFilled.value
        ? classList.push('text-grey-900')
        : classList.push('text-grey-600')
      break
    case STATE.FOCUS:
      isFilled.value
        ? classList.push('text-grey-900')
        : classList.push('text-grey-600')
      break
    case STATE.DISABLED:
      classList.push('text-grey-250')
      break
  }

  return classList
})

const selectedMenu = computed(() => {
  const menuList = []

  const travel = (tree) => {
    for (const block of tree.blockList) {
      for (const menu of block.menuList) {
        if (menu.blockList && menu.blockList.length > 0) {
          travel(menu)
        } else {
          menuList.push(menu)
        }
      }
    }
  }

  travel(props.dropdownMenuTree)

  if (innerSelectValue.value == null) {
    return null
  }

  return menuList.find(
    (menu) =>
      isEqual(menu.title, innerSelectValue.value) ||
      isEqual(menu.selectValue, innerSelectValue.value)
  )
})

defineExpose({
  isError,
  selectedMenu,
})
</script>
