<style lang="scss" scoped>
input[type='date'] {
  &::-webkit-calendar-picker-indicator {
    display: none;
  }
}
</style>

<template lang="pug">
f-input-container(
  :label="label"
  :required="required"
  :hintSupporting="hintSupporting"
  :hintError="ruleErrorMsg || hintError"
)
  template(#slot:prepend-item v-if="addOnLeft !== '' || hasLeftDropdown")
    //- Add On
    div(v-if="addOnLeft !== ''" class="border-r-0 rounded-l" :class="classAddon") {{ te(addOnLeft) ? $t(addOnLeft) : addOnLeft }}
    //- Dropdown
    f-popper(
      v-else
      placement="bottom-start"
      class="border-r-0 rounded-l relative"
      :disabled="disabled"
      :class="classAddon"
    )
      template(#trigger="{ isExpand }")
        div(
          v-if="isExpand"
          class="absolute z-1 top-0 left-0 w-full h-full border rounded-l outline outline-offset-0 outline-4 outline-primary-0 border-primary-300"
        )
        slot(
          name="slot:left-dropdown-trigger"
          :selectedMenu="leftSelectedMenu"
        )
        f-svg-icon(
          iconName="keyboard_arrow_down"
          size="24"
          class="transform ml-1"
          :class="[isExpand ? 'text-primary-500' : 'text-grey-600', { '!text-grey-250': disabled }]"
        )
      template(#content)
        f-contextual-menu(
          v-model:inputSelectValue="innerLeftSelectValue"
          v-bind="leftDropdownOption"
        )
  div(
    :class="classMain"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  )
    //- Leading Icon
    f-svg-icon(
      v-if="prependIcon"
      :size="size === 'lg' ? '24' : '20'"
      :iconName="prependIcon"
      :class="classIcon"
    )
    //- Main Input
    input(
      ref="refInput"
      :type="inputType"
      v-model.trim="innerTextValue"
      :placeholder="placeholder"
      :class="classInput"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @click="onClickInput"
      @change="$emit('change', $event)"
      @keydown.enter="$emit('enter', $event)"
    )
    //- Numeric Control
    div(
      v-if="inputType === 'number' && [STATE.HOVER, STATE.FOCUS].includes(state)"
      :class="[size === 'lg' ? '-mr-0.5' : 'mr-0.5']"
      @mousedown.prevent
    )
      div(
        class="w-4 h-3.5 rounded-t bg-grey-150 hover:bg-grey-250 active:bg-grey-300 flex justify-center"
        @click="increase"
      )
        f-svg-icon(iconName="keyboard_arrow_up" size="14" class="text-grey-800")
      div(class="w-full h-px bg-grey-100")
      div(
        class="w-4 h-3.5 rounded-b bg-grey-150 hover:bg-grey-250 active:bg-grey-300 flex justify-center"
        @click="decrease"
      )
        f-svg-icon(iconName="keyboard_arrow_down" size="14" class="text-grey-800")
    //- Clear Icon
    f-svg-icon(
      v-if="(clearable && !!textValue && state === STATE.FOCUS) || (button?.isFile && !!textValue)"
      :size="size === 'lg' ? '24' : '20'"
      iconName="cancel"
      class="text-grey-150 hover:text-grey-250 active:text-grey-300 cursor-pointer"
      :class="{ '-mr-1': size === 'lg' && !!appendIcon }"
      @click="clear"
      @mousedown.prevent
    )
    //- mousedown event is called before blur event and 
    //- if `prevent` is set it will prevent the blur event from being fired

    //- Trailing Icon
    f-svg-icon(
      v-if="appendIcon"
      :size="size === 'lg' ? '24' : '20'"
      :iconName="appendIcon"
      :class="classIcon"
      @click="onClickAppendIcon"
      @mousedown.prevent
    )
  template(
    #slot:append-item
    v-if="addOnRight !== '' || hasRightDropdown || button"
  )
    //- Add On
    div(v-if="addOnRight !== ''" class="border-l-0 rounded-r" :class="classAddon") {{ te(addOnRight) ? $t(addOnRight) : addOnRight }}
    //- Dropdown
    f-popper(
      v-else-if="hasRightDropdown"
      placement="bottom-start"
      class="border-l-0 rounded-r relative hover:bg-grey-50"
      :disabled="disabled"
      :class="classAddon"
    )
      template(#trigger="{ isExpand }")
        div(
          v-if="isExpand"
          class="absolute z-1 top-0 left-0 w-full h-full border-[1.5px] rounded-r outline outline-offset-0 outline-4 outline-primary-0 border-primary-300"
        )
        slot(
          name="slot:right-dropdown-trigger"
          :selectedMenu="rightSelectedMenu"
        )
        f-svg-icon(
          iconName="keyboard_arrow_down"
          size="24"
          class="transform ml-1"
          :class="[isExpand ? 'text-primary-500' : 'text-grey-600', { '!text-grey-250': disabled }]"
        )
      template(#content)
        f-contextual-menu(
          v-model:inputSelectValue="innerRightSelectValue"
          v-bind="rightDropdownOption"
        )
    //-
    button(
      v-else
      :class="classButton"
      class="rounded-r flex items-center gap-x-1 px-4"
      @click="$emit('click:button')"
    )
      f-svg-icon(v-if="button.icon" :iconName="button.icon" size="24")
      p(v-if="button.text" class="cursor-pointer") {{ te(button.text) ? $t(button.text) : button.text }}
  template(v-if="slots['slot:hint-error']" #slot:hint-error)
    slot(name="slot:hint-error")
  template(v-if="slots['slot:hint-supporting']" #slot:hint-supporting)
    slot(name="slot:hint-supporting")
</template>

<script>
export default {
  name: 'FInputText',
}
</script>

<script setup>
import { ref, toRefs, computed, useSlots, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { CONTEXTUAL_MENU_MODE } from '../../constants.js'
import useInput from '../useInput'
const { te } = useI18n()
const slots = useSlots()

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
   * only work when `label` has been set
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
  size: {
    type: String,
    default: 'lg',
    validator: (v) => ['lg', 'md'].includes(v),
  },
  /**
   * v-model:textValue
   */
  textValue: {
    validator: (prop) =>
      typeof prop === 'number' || typeof prop === 'string' || prop === null,
    required: true,
  },
  inputType: {
    type: String,
    default: 'text',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: (props) => (props.inputType === 'date' ? 'insert_invitation' : ''),
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * only work when inputType is text or number
   */
  placeholder: {
    type: String,
    default: '',
  },
  addOnLeft: {
    type: String,
    default: '',
  },
  leftSelectValue: {},
  leftDropdownOption: {
    type: Object,
    default: () => ({
      selectMode: 0,
      menuTree: () => ({}),
    }),
  },
  addOnRight: {
    type: String,
    default: '',
  },
  rightSelectValue: {},
  rightDropdownOption: {
    type: Object,
    default: () => ({
      selectMode: 0,
      menuTree: () => ({}),
    }),
  },
  /**
   * ```
   * {
   *   type: String, // primary or secondary
   *   icon: String,
   *   text: String
   *   isFile: Boolean
   * }
   * ```
   */
  button: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits([
  'update:textValue',
  'update:leftSelectValue',
  'update:rightSelectValue',
  'input',
  'clear',
  'change',
  'enter',
  'focus',
  'blur',
  'click:input',
  'click:appendIcon',
  'click:button',
])

const innerTextValue = computed({
  get: () => props.textValue,
  set: (v) => emit('update:textValue', v),
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
  inputValue: innerTextValue,
  rules,
  hintError,
  disabled,
})

defineExpose({
  isError,
})

const hasLeftDropdown = computed(() => slots['slot:left-dropdown-trigger'])
const innerLeftSelectValue = computed({
  get: () => props.leftSelectValue,
  set: (v) => emit('update:leftSelectValue', v),
})

const hasRightDropdown = computed(() => slots['slot:right-dropdown-trigger'])
const innerRightSelectValue = computed({
  get: () => props.rightSelectValue,
  set: (v) => emit('update:rightSelectValue', v),
})

const getSelectedMenu = (hasDropdown, dropdownOption, innerSelectValue) => {
  if (!hasDropdown) {
    return null
  }

  const { menuTree, selectMode } = dropdownOption
  const { SINGLE_NONE_CANCEL, SINGLE_CANCEL } = CONTEXTUAL_MENU_MODE

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

  travel(menuTree)

  if ([SINGLE_NONE_CANCEL, SINGLE_CANCEL].includes(selectMode)) {
    return menuList.find((menu) => menu.selectValue === innerSelectValue)
  } else {
    // MULTIPLE
    return menuList.filter((menu) =>
      innerSelectValue.some((selectValue) => menu.selectValue === selectValue)
    )
  }
}
const leftSelectedMenu = computed(() =>
  getSelectedMenu(
    hasLeftDropdown.value,
    props.leftDropdownOption,
    innerLeftSelectValue.value
  )
)
const rightSelectedMenu = computed(() =>
  getSelectedMenu(
    hasRightDropdown.value,
    props.rightDropdownOption,
    innerRightSelectValue.value
  )
)

const refInput = ref(null)

const onInput = async () => {
  await nextTick()
  !isFilled.value && emit('update:textValue', null)
  emit('input')
}
const onFocus = () => {
  isFocus.value = true
  emit('focus')
}
const onBlur = () => {
  isFocus.value = false
  emit('blur')
}
const onClickInput = () => {
  if (props.inputType === 'date') {
    refInput.value.showPicker()
  }
  emit('click:input')
}
const onClickAppendIcon = () => {
  if (props.inputType === 'date') {
    refInput.value.focus()
    refInput.value.showPicker()
  }
  emit('click:appendIcon')
}
const clear = () => {
  emit('update:textValue', null)
  emit('clear')
}
const increase = () => {
  refInput.value.focus()
  let textValue = innerTextValue.value || 0
  textValue = parseInt(textValue) + 1
  emit('update:textValue', textValue)
}
const decrease = () => {
  refInput.value.focus()
  let textValue = innerTextValue.value || 0
  textValue = parseInt(textValue) - 1
  emit('update:textValue', textValue)
}

const classMain = computed(() => {
  const classList = [
    ...classTransition.value,
    'border-[1.5px]',
    'rounded',
    'flex',
    'items-center',
    'outline',
    'outline-none',
  ]

  switch (props.size) {
    case 'md':
      classList.push('h-9', 'px-2', 'gap-x-1')
      break
    case 'lg':
      classList.push('h-11', 'px-3', 'gap-x-2')
      break
  }

  switch (state.value) {
    case STATE.DEFAULT:
      classList.push('border-grey-150', 'bg-grey-0')
      break
    case STATE.HOVER:
      classList.push('border-grey-150', 'bg-grey-50')
      break
    case STATE.FOCUS:
      classList.push(
        'outline-offset-0',
        'outline-4',
        isError.value ? 'outline-red-0' : 'outline-primary-0',
        'border-primary-300',
        'bg-grey-0',
        'relative',
        'z-1'
      )
      break
    case STATE.DISABLED:
      classList.push('border-none', 'cursor-not-allowed', 'bg-grey-100')
      break
  }

  if (isError.value) {
    classList.push('!border-red-300')
  }

  if (
    state.value === STATE.DISABLED &&
    (props.addOnLeft !== '' ||
      props.addOnRight !== '' ||
      hasRightDropdown.value ||
      hasLeftDropdown.value)
  ) {
    classList.push('!bg-grey-150')
  }
  if (props.addOnLeft !== '' || hasLeftDropdown.value) {
    classList.push('!rounded-l-none')
  }
  if (props.addOnRight !== '' || hasRightDropdown.value || props.button) {
    classList.push('!rounded-r-none')
  }

  return classList
})

const classInput = computed(() => {
  const classList = [
    'w-full',
    'h-full',
    'flex-grow',
    'outline-none',
    'bg-transparent',
    'text-body2',
    'leading-1.6',
  ]

  switch (state.value) {
    case STATE.DEFAULT:
      classList.push('placeholder:text-grey-250', 'text-grey-800')
      break
    case STATE.HOVER:
      classList.push('placeholder:text-grey-300', 'text-grey-900')
      break
    case STATE.FOCUS:
      classList.push('placeholder:text-grey-250', 'text-grey-900')
      break
    case STATE.DISABLED:
      classList.push(
        'placeholder:text-grey-250',
        'text-grey-250',
        'cursor-not-allowed'
      )
      break
  }

  if (state.value === STATE.DISABLED && props.button?.isFile) {
    classList.push('!text-grey-600')
  }

  return classList
})

const classIcon = computed(() => {
  const classList = [...classTransition.value]

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
      classList.push('text-grey-900')
      break
    case STATE.DISABLED:
      classList.push('text-grey-250')
      break
  }

  return classList
})

const classAddon = computed(() => {
  const classList = [
    'border-[1.5px]',
    'border-grey-150',
    'flex',
    'items-center',
    'px-4',
    'text-body2',
    'flex-shrink-0',
  ]

  state.value === STATE.DISABLED
    ? classList.push('bg-grey-50', 'text-grey-250', 'cursor-not-allowed')
    : classList.push('bg-grey-100', 'text-grey-900')

  return classList
})

const classButton = computed(() => {
  const classList = []

  switch (props.button.type) {
    case 'primary':
      classList.push('bg-primary-400', 'text-grey-0', 'hover:bg-primary-500')
      break
    case 'secondary':
      classList.push(
        'bg-grey-0',
        'text-primary-400',
        'border-[1.5px]',
        'border-grey-150',
        'border-l-0'
      )
      break
  }

  return classList
})
</script>
