<template lang="pug">
div(
  ref="refTrigger"
  class="min-h-9 py-1.5 flex items-center cursor-pointer"
  :class="bgClassList"
  :disabled="innerMenu.disabled"
  @mouseenter="mouseEnterHandler"
  @mouseleave="mouseLeaveHandler"
  @click.prevent="clickMenuHandler"
  @touchstart.prevent.stop="clickMenuHandler"
  :data-cy="currentTestId"
)
  f-tooltip-standard(
    :placement="innerMenu.tooltipPlacement"
    isNotFitWidth
    class="flex items-center w-full px-4"
    :disabledTooltip="disabledTooltip"
    :tooltipTitle="tooltipTitle"
    :tooltipMessage="tooltipMessage"
  )
    template(#slot:tooltip-trigger)
      //- Checkbox
      div(
        v-if="!hasNextLevel && innerMenu.selectable && selectMode === MULTIPLE"
      )
        f-svg-icon(
          v-if="isSelect"
          iconName="check_box"
          size="20"
          class="mr-2"
          :class="[version === 'v2' ? 'text-green-500-v1' : 'text-primary-400']"
        )
        f-svg-icon(
          v-else
          iconName="check_box_outline_blank"
          size="20"
          class="mr-2 text-grey-250"
        )
      //- Leading Visual
      div(
        v-if="!hideLeadingVisual && (innerMenu.icon || innerMenu.thumbnail || innerMenu.labelColor || innerMenu.flag)"
        class="flex items-center justify-center mr-2 shrink-0"
        :class="[innerMenu.thumbnailSize === SIZE.MD ? 'w-8 h-8' : 'w-6 h-6']"
      )
        //- Icon
        f-svg-icon(
          v-if="innerMenu.icon"
          :iconName="innerMenu.icon"
          size="24"
          :class="[innerMenu.disabled ? 'text-grey-250' : 'text-grey-900', { '!text-grey-100': props.theme === 'dark' }]"
        )
        //- Thumbnail
        img(
          v-else-if="innerMenu.thumbnail"
          :src="innerMenu.thumbnail"
          class="w-full h-full rounded-full"
          :class="{ 'opacity-60': innerMenu.disabled }"
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
          :class="{ 'opacity-60': innerMenu.disabled }"
        )

      div(
        :class="innerMenu.display"
        class="items-center flex-grow w-full pr-2 overflow-hidden"
        @mouseleave="hoverOn = null"
      )
        p(
          ref="refTitle"
          class="text-body2 !leading-1.6 text-ellipsis overflow-hidden break-words"
          :class="[{ 'font-bold': innerMenu.description !== '' }, innerMenu.disabled ? 'text-grey-250' : 'text-grey-900', { '!text-grey-100': props.theme === 'dark' }]"
          :style="{ '-webkit-box-orient': 'vertical', '-webkit-line-clamp': innerMenu.titleLineClamp, display: '-webkit-box' }"
          @mouseenter="hoverOn = 'title'"
        ) {{ innerMenu.title }}
        p(
          v-if="innerMenu.description"
          ref="refDescription"
          :class="[{ 'pl-2': innerMenu.display === DISPLAY.FLEX, 'pt-0.5': innerMenu.display === DISPLAY.BLOCK }, innerMenu.disabled ? 'text-grey-250' : 'text-grey-600']"
          class="min-w-[40%] text-caption !leading-1.3 text-ellipsis overflow-hidden break-words"
          :style="{ '-webkit-box-orient': 'vertical', '-webkit-line-clamp': innerMenu.descriptionLineClamp, display: '-webkit-box' }"
          @mouseenter="hoverOn = 'description'"
        ) {{ innerMenu.description }}
      //- Notify
      div(v-if="innerMenu.hasNotify" class="flex items-center justify-center pr-2")
        div(class="w-2 h-2 rounded-full bg-primary-400")
      //- Trailing Icon
      div(
        v-if="!hideTrailingIcon && (hasNextLevel || (selectMode !== MULTIPLE && isSelect))"
        class="w-6 h-6 shrink-0"
      )
        f-svg-icon(
          v-if="hasNextLevel"
          iconName="keyboard_arrow_right"
          size="24"
          :class="[innerMenu.disabled ? 'text-grey-250' : 'text-grey-600']"
        )
        f-svg-icon(
          v-else-if="selectMode !== MULTIPLE && isSelect"
          iconName="done"
          size="24"
          class="text-primary-400"
        )

    template(#slot:tooltip-content v-if="innerMenu.tooltipContentComponent")
      component(:is="innerMenu.tooltipContentComponent")
  div(
    ref="refContextMenu"
    v-if="isExpand"
    :class="innerMenu.width"
    class="py-2 rounded bg-grey-0 shadow-16"
    @click.stop
  )
    //- Button if position is top
    contextual-menu-button(
      v-if="innerMenu.button && innerMenu.button.position === 'top'"
      v-bind="innerMenu.button"
    )
    //- Search Input
    template(v-if="innerMenu.searchEnable")
      div(class="flex items-center h-8 px-4")
        f-svg-icon(iconName="search" size="20" class="mr-2 text-grey-600")
        input(
          v-model="searchInput"
          placeholder="Search"
          class="w-full outline-none text-caption text-grey-900 placeholder:text-grey-250"
        )
      div(class="w-full h-px my-1 bg-grey-150")
    div(
      v-if="filteredBlockList.length > 0"
      :class="innerMenu.scrollAreaMaxHeight"
      class="overflow-auto overscroll-contain"
    )
      template(
        v-for="(block, index) in filteredBlockList"
        :key="`block-${index}`"
      )
        //- Block Title
        div(v-if="block.blockTitle" class="h-6 py-1.5 px-4 text-caption text-grey-600") {{ block.blockTitle }}
        contextual-menu-node(
          v-for="childMenu in block.menuList"
          :key="childMenu.title"
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

<script lang="ts">
export default {
  name: 'ContextualMenuNode',
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { createPopper } from '@popperjs/core'
import { CONTEXTUAL_MENU_MODE, DISPLAY, SIZE, THEME } from '../constants'
import type { MenuItem, MenuBlock } from '../types'
import { isEqual } from '@frontier/lib'
import { useBreakpoints } from '@frontier/lib'

const { NONE_SELECT, MULTIPLE } = CONTEXTUAL_MENU_MODE

const emit = defineEmits<{
  (e: 'click:menu', menu: Required<MenuItem>): void
}>()

// Extend the props with the new Boolean props for visual hiding.
const props = withDefaults(
  defineProps<{
    theme?: `${THEME}`
    menu: MenuItem
    inputSelectValue: any
    selectMode: CONTEXTUAL_MENU_MODE
    hideLeadingVisual?: boolean
    hideTrailingIcon?: boolean
    version?: 'v1' | 'v2'
  }>(),
  {
    theme: THEME.LIGHT,
    hideLeadingVisual: false,
    hideTrailingIcon: false,
    version: 'v1',
  }
)

const currentTestId = props.menu.testId ?? 'contextual-menu-node'
const { isDesktop } = useBreakpoints()

const innerMenu = computed<Required<MenuItem>>(() =>
  Object.assign(
    {},
    {
      // optional
      titleLineClamp: 1,
      description: '',
      descriptionLineClamp: 1,
      display: DISPLAY.FLEX,
      disabled: false,
      selectable: true,
      selectValue: props.menu.title,
      icon: '',
      thumbnail: '', // https://picsum.photos/50
      thumbnailSize: SIZE.SM,
      flag: '', // http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg
      labelColor: '',
      tooltipTitle: '',
      tooltipMessage: '',
      tooltipContentComponent: null,
      tooltipPlacement: 'right',
      searchEnable: false,
      button: null,
      width: 'w-fit',
      scrollAreaMaxHeight: '',
      hasNotify: false,
      clickHandler: (v: MenuItem) => {},
      mouseEnterHandler: () => {},
      mouseLeaveHandler: () => {},
    },
    props.menu
  )
)

const hasNextLevel = computed(
  () => innerMenu.value.blockList && innerMenu.value.blockList.length > 0
)

const bgClassList = computed(() => {
  if (innerMenu.value.disabled) {
    return ['bg-grey-0']
  }

  if (props.theme === THEME.DARK) {
    return ['bg-grey-850', 'hover:bg-grey-750']
  }

  return [
    'hover:bg-grey-100',
    'active:bg-grey-150',
    isSelect.value ? 'bg-grey-150' : 'bg-grey-0',
  ]
})

const mouseEnterHandler = () => {
  innerMenu.value.mouseEnterHandler()
  if (hasNextLevel.value && !innerMenu.value.disabled) {
    expandMenu()
  }
}

const mouseLeaveHandler = () => {
  innerMenu.value.mouseLeaveHandler()
  if (hasNextLevel.value && !innerMenu.value.disabled) {
    collapseMenu()
  }
}

const clickMenuHandler = () => {
  const { disabled, selectable } = innerMenu.value

  // for mobile and tablet
  if (!isDesktop.value) {
    if (
      props.selectMode === CONTEXTUAL_MENU_MODE.NONE_SELECT &&
      hasNextLevel.value
    ) {
      mouseEnterHandler()
      return
    }
  }

  if (
    (props.selectMode !== CONTEXTUAL_MENU_MODE.NONE_SELECT &&
      hasNextLevel.value) ||
    disabled ||
    !selectable
  ) {
    return
  }

  innerMenu.value.clickHandler && innerMenu.value.clickHandler(innerMenu.value)
  emit('click:menu', innerMenu.value)
}
const isSelect = computed(() => {
  if (props.selectMode === NONE_SELECT) {
    return false
  } else if (props.selectMode === MULTIPLE) {
    return props.inputSelectValue?.some((selectValue: any) =>
      isEqual(selectValue, innerMenu.value.selectValue)
    )
  } else {
    return isEqual(props.inputSelectValue, innerMenu.value.selectValue)
  }
})

const isExpand = ref(false)
const refTrigger = ref<HTMLElement>()
const refContextMenu = ref<HTMLElement>()
const hoverOn = ref<string | null>(null)

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

const refTitle = ref<HTMLElement>()
const isTitleEllipsis = ref(false)

const refDescription = ref<HTMLElement>()
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
    Math.ceil(refTitle.value!.getBoundingClientRect().height) <
    refTitle.value!.scrollHeight

  if (innerMenu.value.description !== '') {
    isDescriptionEllipsis.value =
      Math.ceil(refDescription.value!.getBoundingClientRect().height) <
      refDescription.value!.scrollHeight
  }
})

const searchInput = ref('')
const filteredBlockList = computed(() => {
  const blockList: MenuBlock[] = []
  innerMenu.value.blockList.forEach((block) => {
    const filteredMenuList = block.menuList.filter((menu) =>
      menu.title.toLowerCase().includes(searchInput.value.toLowerCase())
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
    (!!innerMenu.value.tooltipTitle ||
      !!innerMenu.value.tooltipMessage ||
      !!innerMenu.value.tooltipContentComponent) &&
    !!hoverOn.value &&
    !isTitleEllipsis.value &&
    !isDescriptionEllipsis.value
  ) {
    return false
  }

  return true
})

const tooltipTitle = computed(() => {
  if (isTitleEllipsis.value && hoverOn.value === 'title') {
    return innerMenu.value.title
  }
  if (innerMenu.value.tooltipTitle) {
    return innerMenu.value.tooltipTitle
  }
  return null
})

const tooltipMessage = computed(() => {
  if (isDescriptionEllipsis.value && hoverOn.value === 'description') {
    return innerMenu.value.description
  }
  if (innerMenu.value.tooltipMessage) {
    return innerMenu.value.tooltipMessage
  }
  return null
})
</script>
