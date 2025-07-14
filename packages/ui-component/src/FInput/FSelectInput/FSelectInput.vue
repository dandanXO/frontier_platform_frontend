<template lang="pug">
f-input-container(
  ref="refContainer"
  :label="label"
  :required="required"
  :hintSupporting="hintSupporting"
  :hintError="ruleErrorMsg || hintError"
)
  f-popper(
    ref="refPopper"
    placement="bottom-start"
    data-cy="input-chips"
    @expand="expand"
    @collapse="collapse"
    :offset="[0, 8]"
    :disabled="disabled"
    :onFirstUpdate="checkPlacementAndReverse"
    @click="handleContainerClick"
  )
    template(#trigger)
      div(
        :class="classMain"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
        @click="handleContainerClick"
      )
        //- Leading Visual - Icon
        div(v-if="prependIcon" :class="classIcon")
          f-svg-icon(
            :iconName="prependIcon"
            :size="size === 'lg' ? '24' : '20'"
          )
        //- display text and input
        div(class="flex-1 flex-grow w-full h-full flex items-center relative")
          //- Multiple mode: chips and inline input
          template(v-if="multiple")
            div(:class="classChipContainer" class="flex-1 flex" ref="refChipContainer")
              div(
                v-for="(chip, index) in displayText"
                :key="chip"
                class="rounded h-4 box-content px-2 flex items-center gap-x-1 bg-grey-100 cursor-pointer flex-shrink-0"
                :class="[size === 'lg' ? 'py-2 text-body2' : 'py-1.5 text-caption']"
              )
                template(v-if="getIsEllipsis(chip)")
                  f-tooltip-standard(:tooltipMessage="chip" class="flex-grow")
                    template(#slot:tooltip-trigger)
                      span(class="line-clamp-1 whitespace-nowrap overflow-hidden") {{ chip }}
                span(v-else class="whitespace-nowrap overflow-hidden") {{ chip }}
                f-svg-icon(
                  iconName="clear"
                  size="16"
                  class="text-grey-600 cursor-pointer"
                  @click.stop="removeChip(index)"
                )
              //- Inline input that flows with chips
              input(
                v-show="displayText.length === 0 || isEditing"
                :class="classInput"
                ref="refInput"
                type="text"
                class="inline-block border-none bg-transparent outline-none flex-1"
                :style="{ width: displayText.length === 0 ? '100%' : '120px', minWidth: displayText.length === 0 ? '0' : '120px', height: size === 'lg' ? '24px' : '20px', fontSize: size === 'lg' ? '14px' : '12px', lineHeight: size === 'lg' ? '1.6' : '1.3' }"
                :placeholder="displayText.length === 0 && !isEditing ? placeholder : ''"
                :readonly="disabled"
                v-model.trim="inputText"
                @input="setSearchInput(inputText)"
                @keydown.enter="addNewMenu"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              )
          //- Single mode: full width input or display text
          template(v-else)
            input(
              v-show="!displayText || isEditing"
              :class="classInput"
              ref="refInput"
              type="text"
              class="w-full"
              :placeholder="!displayText && !isEditing ? placeholder : ''"
              :readonly="disabled"
              v-model.trim="inputText"
              @input="setSearchInput(inputText)"
              @keydown.enter="addNewMenu"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            )
            //- Display text overlay for single select when not editing
            div(
              v-show="!!displayText && !isEditing && !disabled"
              :class="classInput"
              class="absolute inset-0 pointer-events-none flex items-center"
            )
              template(v-if="getIsEllipsis(displayText)")
                f-tooltip-standard(:tooltipMessage="displayText")
                  template(#slot:tooltip-trigger)
                    span(class="line-clamp-1 whitespace-nowrap overflow-hidden") {{ displayText }}
              span(v-else class="whitespace-nowrap overflow-hidden") {{ displayText }}
        //- Clear Icon
        div(
          v-if="clearable && !disabled && (isEditing || (multiple && displayText.length > 0) || (!multiple && !!displayText))"
          :class="classIcon"
        )
          f-svg-icon(
            :size="size === 'lg' ? '24' : '20'"
            iconName="cancel"
            class="text-grey-150 hover:text-grey-250 active:text-grey-300 cursor-pointer"
            @click.stop="clearAll"
          )
    template(#content="{ collapsePopper }")
      div(:class="{ 'flex-col-reverse': isReverse }" class="w-0 flex flex-col")
        f-contextual-menu(
          :style="[widthFitWithInput ? { width: contentWidth + 'px' } : '']"
          ref="refContextualMenu"
          v-model:inputSelectValue="innerSelectValue"
          @click:menu="!multiple && collapsePopper()"
          @tabSwitch="handleTabSwitch"
          :canAddNew="canAddNew"
          :selectMode="multiple ? MULTIPLE : SINGLE_CANCEL"
          :menuTree="dropdownMenuTree"
          :version="version"
        )
          template(#custom-not-found)
            slot(name="custom-not-found")

  template(v-if="slots['slot:hint-error']" #slot:hint-error)
    slot(name="slot:hint-error")
  template(v-if="slots['slot:hint-supporting']" #slot:hint-supporting)
    slot(name="slot:hint-supporting")
  template(#slot:suffix)
    slot(name="slot:suffix-label")
</template>

<script>
export default {
  name: 'FSelectInput',
}
</script>

<script setup>
/**
 * @KnownIssues
 * 1. Leading Visual 無依照 Figma 設計圖實現 Color Label & Thumbnail
 * 2. 數量多時爆卡
 */

import {
  ref,
  toRefs,
  useSlots,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch,
} from 'vue'
import { CONTEXTUAL_MENU_MODE } from '../../constants'
import useInput from '../useInput'
import { isIframe, isEqual } from '@frontier/lib'

const { SINGLE_CANCEL, MULTIPLE } = CONTEXTUAL_MENU_MODE

const slots = useSlots()
const emit = defineEmits(['update:selectValue', 'addNew', 'collapse'])
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
   *當使用 multiple input 時可用此規則來限制 每張卡片的輸入字串
   *
   * 直接阻擋使用者輸入 而非輸入再檢查
   */
  multipleTagInputValidations: {
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
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * v-model:selectValue
   * If `multiple` is true then selectValue must be an Array
   */
  selectValue: {
    required: true,
    validator: () => true,
  },
  prependIcon: {
    type: String,
    default: '',
  },
  /**
   * inherit from `menuTree` of `FContextualMenu.vue`
   */
  dropdownMenuTree: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  canAddNew: {
    type: Boolean,
    default: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * if `widthFitWithInput` is true, then it would ignore dropdownMenuTree's `width` property
   */
  widthFitWithInput: {
    type: Boolean,
    default: true,
  },
  labelNeeded: {
    type: Boolean,
    default: true,
  },
  version: {
    type: String,
    default: 'v1',
  },
  hasError: {
    type: Boolean,
    default: false,
  },
})
const innerSelectValue = computed({
  get: () => {
    if (props.multiple) {
      return Array.isArray(props.selectValue) ? props.selectValue : []
    } else {
      return props.selectValue ? props.selectValue : ''
    }
  },
  set: (v) => emit('update:selectValue', v),
})
const displayText = computed(() => {
  const getMenu = (v) => {
    for (const block of props.dropdownMenuTree.blockList) {
      for (const menu of block.menuList) {
        if (isEqual(menu.selectValue, v)) {
          return menu
        }
      }
    }
    return null
  }

  const getDisplayText = (value) => {
    const menu = getMenu(value)
    return menu?.title?.trim() || value?.name || value
  }

  if (props.multiple) {
    return Array.isArray(innerSelectValue.value)
      ? innerSelectValue.value.map(getDisplayText)
      : []
  }

  return getDisplayText(innerSelectValue.value)
})

const inputText = ref('')
const isEditing = ref(false)

const { rules, hintError, disabled, multiple } = toRefs(props)
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
  isMultiple: multiple, // is Multiple chips input type
  slots,
  inputValue: inputText,
  rules,
  hintError,
  disabled,
})

const classMain = computed(() => {
  const classList = [
    ...classTransition.value,
    'border',
    'rounded',
    'flex',
    'items-center',
  ]

  switch (props.size) {
    case 'md':
      classList.push('min-h-9', 'px-2', 'gap-x-1')
      break
    case 'lg':
      classList.push('min-h-11', 'px-3', 'gap-x-2')
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
      classList.push('border-grey-250', 'bg-grey-50-v1')
      break
    case STATE.FOCUS:
      classList.push(
        isError.value
          ? 'shadow-[0_0_0_4px_#FDE7DA]'
          : 'shadow-[0_0_0_2px_#8ADDF4]',
        'border-grey-200',
        'bg-grey-0'
      )
      break
    case STATE.DISABLED:
      classList.push('border-grey-200', 'cursor-not-allowed', 'bg-grey-50')
      break
  }

  if (isError.value || props.hasError) {
    classList.push('!border-red-300')
  }

  return classList
})

const classIcon = computed(() => {
  const classList = ['self-start', ...classTransition.value]

  switch (props.size) {
    case 'md':
      classList.push('mt-[7px]')
      break
    case 'lg':
      classList.push('mt-[9px]')
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
      classList.push('text-grey-900')
      break
    case STATE.DISABLED:
      classList.push('text-grey-250')
      break
  }

  return classList
})

const classChipContainer = computed(() => [
  'flex',
  'flex-wrap',
  'gap-x-1',
  'gap-y-1',
  'items-center',
  props.multiple ? 'py-[5px]' : 'py-[3px]',
])

const classInput = computed(() => {
  const classList = [
    'outline-none',
    'bg-transparent',
    'text-body2',
    'leading-1.6',
    'placeholder:text-grey-600-v1',
  ]

  switch (props.size) {
    case 'md':
      classList.push('h-5')
      break
    case 'lg':
      classList.push('h-6')
      break
  }

  switch (state.value) {
    case STATE.DEFAULT:
      classList.push('text-grey-800')
      break
    case STATE.HOVER:
      classList.push('text-grey-900')
      break
    case STATE.FOCUS:
      classList.push('text-grey-900')
      break
    case STATE.DISABLED:
      classList.push('text-grey-250', 'cursor-not-allowed')
      break
  }

  return classList
})

const refContainer = ref(null)
const refInput = ref(null)
const contentWidth = ref(0)
const chipMaxWidth = computed(() => {
  /**
   * the width of input is determined by the following rules:
   * 1. the width of container padding x is 24px if size is lg, otherwise 16px
   * 2. the width of item gap is 12px if size is lg, otherwise 8px
   * 3. the width of leading visual is 24px if size is lg, otherwise 20px
   * 4. the width of clear button is 24px if size is lg, otherwise 20px
   * 5. the width of chip padding x is 16px
   * 6. the width of input is 100% of container - (clear button + item gap)(if there is clear button) - (leading visual + item gap)(if there is prependIcon) - container padding x - chip padding x (if it is multiple)
   */
  const containerPaddingX = props.size === 'lg' ? 24 : 16
  const itemGapWidth = props.size === 'lg' ? 12 : 8
  const leadingVisualWidth = props.prependIcon
    ? (props.size === 'lg' ? 24 : 20) + itemGapWidth
    : 0
  const clearButtonWidth = props.clearable
    ? (props.size === 'lg' ? 24 : 20) + itemGapWidth
    : 0
  const chipPaddingX = props.multiple ? 16 : 0
  return (
    contentWidth.value -
    clearButtonWidth -
    leadingVisualWidth -
    containerPaddingX -
    chipPaddingX
  )
})
const getIsEllipsis = (chip) => {
  // Use a reasonable max width for ellipsis check (e.g., 200px)
  const maxWidth = 200
  const span = document.createElement('span')
  span.innerText = chip
  span.style.maxWidth = maxWidth + 'px'
  span.style.display = 'inline-block'
  span.style.overflow = 'hidden'
  span.style.textOverflow = 'ellipsis'
  span.style.whiteSpace = 'nowrap'
  document.body.appendChild(span)
  const isEllipsis = span.offsetWidth < span.scrollWidth
  document.body.removeChild(span)
  return isEllipsis
}
const popperOffsetY = ref(props.size === 'lg' ? 44 : 36)
const refContainerObserver = ref(null)
const refChipContainer = ref(null)
const popperInstance = ref(null)

onMounted(() => {
  refContainerObserver.value = new ResizeObserver((entries) => {
    // Use a fixed offset for more consistent positioning
    popperOffsetY.value = props.size === 'lg' ? 48 : 40
    contentWidth.value = entries[0].contentRect.width

    // Update popper position when container resizes
    if (popperInstance.value && isFocus.value) {
      popperInstance.value.update()
    }
  })
  refContainerObserver.value.observe(refContainer.value.$el)
})
onBeforeUnmount(() => {
  refContainerObserver.value.unobserve(refContainer.value.$el)
})

// Store popper instance and update position when chips change
watch(
  displayText,
  () => {
    if (isFocus.value && popperInstance.value) {
      // Force popper to recalculate position
      popperInstance.value.update()
    }
  },
  { deep: true }
)

const expand = () => {
  isFocus.value = true
  isEditing.value = true
  nextTick(() => {
    if (refInput.value) {
      refInput.value.focus({ preventScroll: isIframe() })
    }
  })
  if (!props.multiple && displayText.value) {
    inputText.value = displayText.value
  }

  // Store popper instance for later updates
  if (refPopper.value) {
    // Access the popper instance through the FPopper component
    nextTick(() => {
      if (refPopper.value && refPopper.value.getPopperInstance) {
        popperInstance.value = refPopper.value.getPopperInstance()
      }
    })
  }
}

const collapse = () => {
  isFocus.value = false
  isEditing.value = false
  setSearchInput('')
  inputText.value = ''
  popperInstance.value = null
  emit('collapse')
}

const isReverse = ref(false)

const checkPlacementAndReverse = (state) => {
  const { placement } = state
  isReverse.value = placement.includes('top')
}

const refContextualMenu = ref(null)

const setSearchInput = (searchInput) => {
  // 使用 select input 檢查並且直接過濾使用者的input 不是按下enter才顯示錯誤
  if (props.multipleTagInputValidations.length) {
    props.multipleTagInputValidations.forEach((rule) => {
      inputText.value = rule(searchInput)
      searchInput = rule(searchInput)
    })
  }
  if (refContextualMenu.value) {
    refContextualMenu.value.setSearchInput(searchInput || '')
  }
}

const addNewMenu = async () => {
  /**
   * 1. check if it is filled or if it is allowed to add new menu
   * 2. if this menu doesn't exist in current dropdownMenuTree then emit 'addNew' event to outside, so that it can add new menu externally
   * 3. invoke refContextualMenu.value.clickMenuHandler to select
   * 4. clear inputText and search input which is from FContextualMenu
   */

  // step 1
  if (
    !isFilled.value ||
    !props.canAddNew ||
    refContextualMenu.value.disabledAddNew
  ) {
    return
  }

  // step 2
  /**
   * 在 <Input>(ref = refInput) 的 input 事件已經呼叫 refContextualMenu 的 setSearchInput
   * 所以可以直接調用 refContextualMenu 的 menuIsExist 來檢查該 Menu 是否已存在在清單中。
   */
  if (!refContextualMenu.value.menuIsExist) {
    emit('addNew', inputText.value)
    await nextTick()
  }

  // step 3
  /**
   * 從 dropdownMenuTree 中找到該 menu 並呼叫 refContextualMenu 的 clickMenuHandler 將其選取。
   */
  const selectedMenu = props.dropdownMenuTree.blockList
    .flatMap((block) => block.menuList)
    .find((menu) => menu.title === inputText.value)
  refContextualMenu.value.clickMenuHandler(selectedMenu)

  // step 4
  setSearchInput('')
  if (props.multiple) {
    inputText.value = ''
  } else {
    isEditing.value = false
  }
}

const clearAll = () => {
  /**
   * the following things need to be cleared
   * 1. inputText
   * 2. innerSelectValue
   * 3. searchInput (which is from FContextualMenu)
   * 4. editing state
   */
  inputText.value = ''
  innerSelectValue.value = props.multiple ? [] : ''
  setSearchInput('')
  isEditing.value = false
}

const removeChip = (index) => {
  innerSelectValue.value = innerSelectValue.value.filter((_, i) => i !== index)
}

const refPopper = ref(null)

const handleInputFocus = () => {
  isEditing.value = true
}

const handleInputBlur = () => {
  isEditing.value = false
}

const handleContainerClick = () => {
  if (!props.disabled) {
    isEditing.value = true
    nextTick(() => {
      if (refInput.value) {
        refInput.value.focus({ preventScroll: isIframe() })
      }
    })
  }
}

const handleTabSwitch = () => {
  // Enable editing mode and refocus the input field when tabs are switched
  isEditing.value = true
  isFocus.value = true

  nextTick(() => {
    if (refInput.value) {
      refInput.value.focus({ preventScroll: isIframe() })
      // Ensure the input is visible and ready for editing
      if (props.multiple && displayText.value.length > 0) {
        // For multiple mode, make sure the input is visible
        inputText.value = ''
      } else if (!props.multiple && displayText.value) {
        // For single mode, set the input text to the current display text
        inputText.value = displayText.value
      }
    }
  })
}

defineExpose({
  focus: () => refPopper.value.expandPopper(),
})
</script>
