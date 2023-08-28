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
    :offset="[0, -popperOffsetY]"
    :disabled="disabled"
    :onFirstUpdate="checkPlacementAndReverse"
  )
    template(#trigger)
      div(
        :class="classMain"
        @mouseenter="isHover = true"
        @mouseleave="isHover = false"
      )
        //- Leading Visual - Icon
        div(v-if="prependIcon" :class="classIcon")
          f-svg-icon(
            :iconName="prependIcon"
            :size="size === 'lg' ? '24' : '20'"
          )
        //- display text
        div(class="flex-grow w-full h-full flex items-center")
          div(
            v-show="multiple && displayText.length !== 0"
            :class="classChipContainer"
          )
            div(
              v-for="chip in displayText"
              :key="chip"
              class="rounded h-4 box-content px-2 flex items-center gap-x-1 bg-grey-100 cursor-pointer"
              :class="[size === 'lg' ? 'py-2 text-body2' : 'py-1.5 text-caption']"
              :style="{ maxWidth: chipMaxWidth + 'px' }"
            )
              template(v-if="getIsEllipsis(chip)")
                f-tooltip-standard(:tooltipMessage="chip" class="flex-grow")
                  template(#slot:tooltip-trigger)
                    span(class="line-clamp-1") {{ chip }}
              span(v-else) {{ chip }}
              f-svg-icon(
                v-if="isHover"
                iconName="clear"
                size="16"
                class="text-grey-600"
              )
          div(
            v-show="!multiple && !!displayText"
            :class="classInput"
            class="flex items-center"
          )
            template(v-if="getIsEllipsis(displayText)")
              f-tooltip-standard(:tooltipMessage="displayText")
                template(#slot:tooltip-trigger)
                  span(class="line-clamp-1") {{ displayText }}
            span(v-else) {{ displayText }}
          //- placeholder
          input(
            v-show="!(multiple && displayText.length !== 0) && !(!multiple && !!displayText)"
            type="text"
            :placeholder="placeholder"
            :class="classInput"
            class="w-full"
            :readonly="disabled"
          )
    template(#content="{ collapsePopper }")
      div(:class="{ 'flex-col-reverse': isReverse }" class="w-0 flex flex-col")
        div(:style="{ width: contentWidth + 'px' }" :class="classMain")
          //- Leading Visual - Icon
          div(v-if="prependIcon" :class="classIcon")
            f-svg-icon(
              :iconName="prependIcon"
              :size="size === 'lg' ? '24' : '20'"
            )
          //- Input
          div(
            :class="[multiple ? classChipContainer : '']"
            class="flex-grow w-full h-full flex items-center"
          )
            template(v-if="multiple")
              div(
                v-for="(chip, index) in displayText"
                :key="chip"
                class="rounded h-4 box-content px-2 flex items-center gap-x-1 bg-grey-100 cursor-pointer"
                :class="[size === 'lg' ? 'py-2 text-body2' : 'py-1.5 text-caption']"
                :style="{ maxWidth: chipMaxWidth + 'px' }"
                @click.stop="removeChip(index)"
              )
                template(v-if="getIsEllipsis(chip)")
                  f-tooltip-standard(:tooltipMessage="chip" class="flex-grow")
                    template(#slot:tooltip-trigger)
                      span(class="line-clamp-1") {{ chip }}
                span(v-else) {{ chip }}
                f-svg-icon(iconName="clear" size="16" class="text-grey-600")
            input(
              :class="classInput"
              ref="refInput"
              type="text"
              class="flex-grow"
              v-model.trim="inputText"
              @input="setSearchInput(inputText)"
              @keydown.enter="addNewMenu"
            )
          //- Clear Icon
          div(v-if="clearable" :class="classIcon")
            f-svg-icon(
              v-if="clearable"
              :size="size === 'lg' ? '24' : '20'"
              iconName="cancel"
              class="text-grey-150 hover:text-grey-250 active:text-grey-300 cursor-pointer"
              @click.stop="clearAll"
            )
        f-contextual-menu(
          :style="[widthFitWithInput ? { width: contentWidth + 'px' } : '']"
          ref="refContextualMenu"
          v-model:inputSelectValue="innerSelectValue"
          @click:menu="!multiple && collapsePopper()"
          :canAddNew="canAddNew"
          :selectMode="multiple ? MULTIPLE : SINGLE_CANCEL"
          :menuTree="dropdownMenuTree"
        )
  template(v-if="slots['slot:hint-error']" #slot:hint-error)
    slot(name="slot:hint-error")
  template(v-if="slots['slot:hint-supporting']" #slot:hint-supporting)
    slot(name="slot:hint-supporting")
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
} from 'vue'
import { CONTEXTUAL_MENU_MODE } from '../../constants'
import useInput from '../useInput'
import { isEqual } from '@frontier/utils'

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
})
const innerSelectValue = computed({
  get: () => props.selectValue,
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
  if (props.multiple) {
    return innerSelectValue.value.map((v) => getMenu(v)?.title)
  }
  return getMenu(innerSelectValue.value)?.title
})

const inputText = ref('')

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
      classList.push('border-grey-250', 'bg-grey-50')
      break
    case STATE.FOCUS:
      classList.push(
        isError.value
          ? 'shadow-[0_0_0_4px_#FDE7DA]'
          : 'shadow-[0_0_0_4px_#E9F8F3]',
        'border-primary-300',
        'bg-grey-0'
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
  props.multiple ? 'py-[5px]' : 'py-[3px]',
])

const classInput = computed(() => {
  const classList = [
    'outline-none',
    'bg-transparent',
    'text-body2',
    'leading-1.6',
    'placeholder:text-grey-250',
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
  const span = document.createElement('span')
  span.innerText = chip
  span.style.maxWidth = chipMaxWidth.value + 'px'
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
onMounted(() => {
  refContainerObserver.value = new ResizeObserver((entries) => {
    if (props.label) {
      popperOffsetY.value =
        refContainer.value.$el.children[1].getBoundingClientRect().height
    } else {
      popperOffsetY.value =
        refContainer.value.$el.children[0].getBoundingClientRect().height
    }
    contentWidth.value = entries[0].contentRect.width
  })
  refContainerObserver.value.observe(refContainer.value.$el)
})
onBeforeUnmount(() => {
  refContainerObserver.value.unobserve(refContainer.value.$el)
})

const expand = () => {
  isFocus.value = true
  refInput.value.focus()
  !props.multiple && (inputText.value = displayText.value)
}

const collapse = () => {
  isFocus.value = false
  setSearchInput('')
  inputText.value = ''
  emit('collapse')
}

const isReverse = ref(false)

const checkPlacementAndReverse = (state) => {
  const { placement } = state
  isReverse.value = placement.includes('top')
}

const refContextualMenu = ref(null)

const setSearchInput = (searchInput) => {
  refContextualMenu.value.setSearchInput(searchInput)
}

const addNewMenu = async () => {
  /**
   * 1. check if it is filled or if it is allowed to add new menu
   * 2. if this menu doesn't exist in current dropdownMenuTree then emit 'addNew' event to outside, so that it can add new menu externally
   * 3. invoke refContextualMenu.value.clickMenuHandler to select
   * 4. clear inputText and search input which is from FContextualMenu
   */

  // step 1
  if (!isFilled.value || !props.canAddNew) {
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
  props.multiple && (inputText.value = '')
}

const clearAll = () => {
  /**
   * the following things need to be cleared
   * 1. inputText
   * 2. innerSelectValue
   * 3. searchInput (which is from FContextualMenu)
   */
  inputText.value = ''
  innerSelectValue.value = props.multiple ? [] : ''
  setSearchInput('')
}

const removeChip = (index) => {
  innerSelectValue.value.splice(index, 1)
}

const refPopper = ref(null)
defineExpose({
  focus: () => refPopper.value.expandPopper(),
})
</script>
