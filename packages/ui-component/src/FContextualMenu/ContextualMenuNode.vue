<template lang="pug">
div(
  ref="refTrigger"
  class="min-h-9 py-1.5 flex items-center"
  :class="bgClassList"
  :disabled="innerMenu.disabled"
  @mouseleave="hasNextLevel && collapseMenu()"
  @click.stop="clickMenuHandler"
)
  f-tooltip(
    :placement="innerMenu.tooltipPlacement"
    isNotFitWidth
    @mouseenter="hasNextLevel && expandMenu()"
    class="w-full flex items-center px-4"
    :disabledTooltip="disabledTooltip"
  )
    template(#trigger)
      //- Checkbox
      div(
        v-if="!hasNextLevel && !innerMenu.disabled && innerMenu.selectable && selectMode === MULTIPLE"
      )
        f-svg-icon(
          v-if="isSelect"
          iconName="check_box"
          size="20"
          class="text-primary-400 mr-2"
        )
        f-svg-icon(
          v-else
          iconName="check_box_outline_blank"
          size="20"
          class="text-grey-250 mr-2"
        )
      //- Leading Visual
      div(
        v-if="innerMenu.icon || innerMenu.thumbnail || innerMenu.labelColor || innerMenu.flag"
        class="w-6 h-6 flex items-center justify-center mr-2 shrink-0"
      )
        //- Icon
        f-svg-icon(
          v-if="innerMenu.icon"
          :iconName="innerMenu.icon"
          size="24"
          class="text-grey-900"
        )
        //- Thumbnail
        img(
          v-else-if="innerMenu.thumbnail"
          :src="innerMenu.thumbnail"
          class="w-full h-full rounded-full"
        )
        //- Flag
        img(
          v-else-if="innerMenu.flag"
          :src="innerMenu.flag"
          class="w-full h-4 rounded-sm"
        )
        //- Label Color
        div(
          v-else-if="innerMenu.labelColor"
          :style="{ backgroundColor: innerMenu.labelColor }"
          class="w-3 h-3 rounded-sm"
        )
      div(
        :class="innerMenu.display"
        class="w-full flex-grow items-center pr-2"
        @mouseleave="hoverOn = null"
      )
        p(
          ref="refTitle"
          class="text-body2 !leading-1.6 text-ellipsis overflow-hidden break-all"
          :class="[{ 'font-bold': innerMenu.description !== '' }, innerMenu.disabled ? 'text-grey-250' : 'text-grey-900', { '!text-grey-100': props.theme === 'dark' }]"
          :style="{ '-webkit-box-orient': 'vertical', '-webkit-line-clamp': innerMenu.titleLineClamp, display: '-webkit-box' }"
          @mouseenter="hoverOn = 'title'"
        ) {{ innerMenu.title }}
        p(
          v-if="innerMenu.description"
          ref="refDescription"
          :class="{ 'pl-2': innerMenu.display === 'flex', 'pt-0.5': innerMenu.display === 'block' }"
          class="min-w-[40%] text-caption text-grey-600 !leading-1.3 text-ellipsis overflow-hidden break-all"
          :style="{ '-webkit-box-orient': 'vertical', '-webkit-line-clamp': innerMenu.descriptionLineClamp, display: '-webkit-box' }"
          @mouseenter="hoverOn = 'description'"
        ) {{ innerMenu.description }}
      //- Trailing Icon
      div(
        v-if="hasNextLevel || (selectMode !== MULTIPLE && isSelect)"
        class="shrink-0 w-6 h-6"
      )
        f-svg-icon(
          v-if="hasNextLevel"
          iconName="keyboard_arrow_right"
          size="24"
          class="text-grey-600"
        )
        f-svg-icon(
          v-else-if="selectMode !== MULTIPLE && isSelect"
          iconName="done"
          size="24"
          class="text-primary-400"
        )
    template(#content)
      p
        span(v-if="isTitleEllipsis && hoverOn === 'title'" class="break-all font-bold") {{ innerMenu.title }}
        span(v-else-if="isDescriptionEllipsis && hoverOn === 'description'") {{ innerMenu.description }}
        span(v-else) {{ innerMenu.tooltip }}
  div(
    ref="refContextMenu"
    v-if="isExpand"
    :class="innerMenu.width"
    class="py-2 bg-grey-0 rounded shadow-16"
    @click.stop
  )
    //- Button if position is top
    contextual-menu-button(
      v-if="innerMenu.button && innerMenu.button.position === 'top'"
      v-bind="innerMenu.button"
    )
    //- Search Input
    template(v-if="innerMenu.searchEnable")
      div(class="h-8 flex items-center px-4")
        f-svg-icon(iconName="search" size="20" class="text-grey-600 mr-2")
        input(
          v-model="searchInput"
          placeholder="Search"
          class="outline-none w-full text-caption text-grey-900 placeholder:text-grey-250"
        )
      div(class="w-full h-px my-1 bg-grey-150")
    div(
      v-if="filteredBlockList.length > 0"
      :class="innerMenu.scrollAreaMaxHeight"
      class="overflow-auto overscroll-contain"
    )
      template(v-for="(block, index) in filteredBlockList")
        //- Block Title
        div(v-if="block.blockTitle" class="h-6 py-1.5 px-4 text-caption text-grey-600") {{ block.blockTitle }}
        contextual-menu-node(
          v-for="childMenu in block.menuList"
          :theme="theme"
          :menu="childMenu"
          @click:menu="$emit('click:menu', $event)"
          :selectMode="selectMode"
          :inputSelectValue="inputSelectValue"
        )
        div(
          v-if="index !== filteredBlockList.length - 1"
          class="w-full h-px my-1 bg-grey-150"
        )
    div(v-else class="h-6 py-1.5 px-4 text-caption text-grey-600") No Results Found
    //- Button if position is bottom
    contextual-menu-button(
      v-if="innerMenu.button && innerMenu.button.position === 'bottom'"
      v-bind="innerMenu.button"
    )
</template>

<script>
export default {
  name: 'ContextualMenuNode',
}
</script>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { createPopper } from '@popperjs/core'
import { CONTEXTUAL_MENU_MODE } from '../constants.js'
import isEqual from '../isEqual'

const { NONE_SELECT, MULTIPLE } = CONTEXTUAL_MENU_MODE

const emit = defineEmits(['click:menu'])
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
  menu: {
    type: Object,
    default: () => {},
  },
  inputSelectValue: {
    validator: () => true,
  },
  selectMode: {
    type: Number,
    required: true,
  },
  searchEnable: {
    type: Array,
    default: () => [],
  },
})

const innerMenu = computed(() => {
  const defaultMenu = {
    // required
    title: 'Menu',
    blockList: [
      // {
      //   blockTitle: 'Block Titles',
      //   menuList: [
      //     /** Menu **/
      //   ],
      // },
    ],
    // optional
    titleLineClamp: 1,
    description: '',
    descriptionLineClamp: 1,
    display: 'flex', // flex or block
    disabled: false,
    selectable: true,
    selectValue: props.menu.title,
    icon: '',
    thumbnail: '', // https://picsum.photos/50
    flag: '', // http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg
    labelColor: '',
    clickHandler: () => {},
    tooltip: '',
    tooltipPlacement: 'right',
    searchEnable: false,
    button: null,
    width: 'w-fit',
    scrollAreaMaxHeight: '',
  }

  return Object.assign({}, defaultMenu, props.menu)
})

const hasNextLevel = computed(
  () => innerMenu.value.blockList && innerMenu.value.blockList.length > 0
)

const bgClassList = computed(() => {
  if (innerMenu.value.disabled) {
    return ['bg-grey-0']
  }

  if (props.theme === 'dark') {
    return ['bg-grey-800', 'hover:bg-grey-700']
  }

  return [
    'hover:bg-grey-100',
    'active:bg-grey-150',
    isSelect.value ? 'bg-grey-150' : 'bg-grey-0',
  ]
})

const clickMenuHandler = () => {
  const { disabled, selectable } = innerMenu.value
  if (hasNextLevel.value || disabled || !selectable) {
    return
  }

  innerMenu.value.clickHandler && innerMenu.value.clickHandler()
  emit('click:menu', innerMenu.value)
}
const isSelect = computed(() => {
  if (props.selectMode === NONE_SELECT) {
    return false
  } else if (props.selectMode === MULTIPLE) {
    return props.inputSelectValue?.some((selectValue) =>
      isEqual(selectValue, innerMenu.value.selectValue)
    )
  } else {
    return isEqual(props.inputSelectValue, innerMenu.value.selectValue)
  }
})

const isExpand = ref(false)
const refTrigger = ref(null)
const refContextMenu = ref(null)
const hoverOn = ref(null)

const expandMenu = async () => {
  if (isExpand.value) {
    return
  }

  isExpand.value = true

  await nextTick()

  const PADDING_TOP = 8
  const SEARCH_INPUT = 41
  const BUTTON = 40
  const BLOCK_TITLE = 24

  const { searchEnable, button, blockList } = innerMenu.value
  let offset = PADDING_TOP
  if (searchEnable) {
    offset += SEARCH_INPUT
  }

  if (!!button && button.position === 'top') {
    offset += BUTTON
  }

  if (blockList[0].blockTitle) {
    offset += BLOCK_TITLE
  }

  createPopper(refTrigger.value, refContextMenu.value, {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [-offset, -4],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          boundary: document.querySelector(`body`),
        },
      },
    ],
  })
}

const collapseMenu = () => {
  isExpand.value = false
}

const refTitle = ref(null)
const isTitleEllipsis = ref(false)

const refDescription = ref(null)
const isDescriptionEllipsis = ref(false)
onMounted(async () => {
  /**
   * @Magic
   * Don't know why the following values are wrong in first render
   * so awaiting the layout render completely then do the following calculation
   */
  await nextTick()

  /**
   * @Magic
   * 元素的實際大小會有浮點數，且在 chrome 和 safari 中呈現的數值會有些微差異
   * 所以目前的先直接無條件進位，以確保不會錯判。
   */

  isTitleEllipsis.value =
    Math.ceil(refTitle.value.getBoundingClientRect().height) <
    refTitle.value.scrollHeight

  if (innerMenu.value.description !== '') {
    isDescriptionEllipsis.value =
      Math.ceil(refDescription.value.getBoundingClientRect().height) <
      refDescription.value.scrollHeight
  }
})

const searchInput = ref('')
const filteredBlockList = computed(() => {
  const blockList = []
  innerMenu.value.blockList.forEach((block) => {
    const filteredMenuList = block.menuList.filter((menu) =>
      menu.title.includes(searchInput.value)
    )
    if (filteredMenuList.length > 0) {
      blockList.push({
        ...block,
        menuList: filteredMenuList,
      })
    }
  })
  return blockList
})

const disabledTooltip = computed(() => {
  if (hoverOn.value === 'title' && isTitleEllipsis.value) {
    return false
  }

  if (hoverOn.value === 'description' && isDescriptionEllipsis.value) {
    return false
  }

  if (
    !!innerMenu.value.tooltip &&
    !!hoverOn.value &&
    !isTitleEllipsis.value &&
    !isDescriptionEllipsis.value
  ) {
    return false
  }

  return true
})
</script>
