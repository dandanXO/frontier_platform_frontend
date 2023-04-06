<template lang="pug">
div(
  class="py-2 bg-grey-0 rounded shadow-16"
  :class="[innerMenuTree.width, { 'bg-grey-800': theme === 'dark' }]"
)
  //- Root Title
  template(v-if="innerMenuTree.rootTitle")
    div(class="h-8.5 pt-2 px-4 text-body2 text-grey-900 font-bold") {{ innerMenuTree.rootTitle }}
    div(class="w-full h-px my-1 bg-grey-150" :class="{ 'bg-grey-800': theme === 'dark' }")
  //- Button if position is top
  contextual-menu-button(
    v-if="innerMenuTree.button && innerMenuTree.button.position === 'top'"
    v-bind="innerMenuTree.button"
  )
  //- Search Input
  template(v-if="innerMenuTree.searchEnable")
    div(class="h-8 flex items-center px-4")
      f-svg-icon(iconName="search" size="20" class="text-grey-600 mr-2")
      input(
        v-model="searchInput"
        placeholder="Search"
        class="outline-none w-full text-caption text-grey-900 placeholder:text-grey-250"
      )
    div(class="w-full h-px my-1 bg-grey-150")
  //- Add New Menu
  template(v-if="canAddNew")
    template(v-if="!!searchInput && !menuIsExist")
      div(class="px-4 min-h-6 flex items-center")
        p(class="text-caption text-grey-600 break-all")
          span Press
          span(class="font-bold") &nbspEnter&nbsp
          span to create "{{ searchInput }}"
      div(v-if="filteredBlockList.length !== 0" class="w-full h-px my-1 bg-grey-150")
    div(v-else-if="filteredBlockList.length === 0" class="px-4 min-h-6 flex items-center")
      i18n-t(
        keypath="RR0256"
        tag="p"
        class="text-caption text-grey-600 break-all"
        scope="global"
      )
        template(#Enter)
          span(class="font-bold") Enter
  div(
    v-if="filteredBlockList.length > 0"
    :class="innerMenuTree.scrollAreaMaxHeight"
    class="overflow-y-auto overflow-x-hidden overscroll-contain"
  )
    template(v-for="(block, index) in filteredBlockList")
      //- Block Title
      div(v-if="block.blockTitle" class="h-6 py-1.5 px-4 text-caption text-grey-600") {{ block.blockTitle }}
      //- 使用 vue-virtual-scroller 會導致 popper.js 在判斷 content 展開的位置出錯，故先不使用，等有解決方案後再考慮加回。
      //- 原因參考： https://codesandbox.io/s/vue-virtual-scroller-forked-q20xw0?file=/src/VirtualList.vue:410-556
      //- recycle-scroller 元件第一時間的 height 為 0，之後才會根據 itemSize 跟 items 計算出真正高度，
      //- 這會導致 popper.js 計算 content 位置時用 height: 0 計算，導致 placement 是在上方的情況下會跑版。
      //-
      //- recycle-scroller(
      //-   v-if="depthOfMenuTree === 1"
      //-   :class="innerMenuTree.width"
      //-   :items="block.menuList"
      //-   :itemSize="36"
      //-   key-field="title"
      //-   pageMode
      //-   v-slot="{ item }"
      //-   :buffer="108"
      //- )
        contextual-menu-node(
          :theme="theme"
          :class="innerMenuTree.width"
          :menu="item"
          @click:menu="clickMenuHandler($event)"
          :selectMode="selectMode"
          :inputSelectValue="inputSelectValue"
        )
      contextual-menu-node(
        v-for="menu in block.menuList"
        :theme="theme"
        :menu="menu"
        @click:menu="clickMenuHandler($event)"
        :selectMode="selectMode"
        :inputSelectValue="inputSelectValue"
      )
      div(
        v-if="index !== filteredBlockList.length - 1"
        class="w-full h-px my-1 bg-grey-150"
        :class="{ 'bg-grey-700': theme === 'dark' }"
      )
  div(v-else-if="!canAddNew" class="h-6 py-1.5 px-4 text-caption text-grey-600") No Results Found
  //- Button if position is bottom
  contextual-menu-button(
    v-if="innerMenuTree.button && innerMenuTree.button.position === 'bottom'"
    v-bind="innerMenuTree.button"
  )
</template>

<script>
export default {
  name: 'FContextualMenu',
}
</script>

<script setup>
import { ref, computed } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '../constants.js'
// import { RecycleScroller } from 'vue-virtual-scroller'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import isEqual from '../isEqual'

const { SINGLE_CANCEL, SINGLE_NONE_CANCEL, MULTIPLE } = CONTEXTUAL_MENU_MODE

// update:inputSelectValue will execute before click:menu
const emit = defineEmits(['update:inputSelectValue', 'click:menu'])
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
  /**
   * v-model:inputSelectValue
   *
   * If `selectMode` is 3 (Multiple Select) then inputSelectValue must be an Array
   */
  inputSelectValue: {
    validator: () => true,
  },
  /**
   * * 0 - 不可選
   * * 1 - 單選，可取消
   * * 2 - 單選，不可取消
   * * 3 - 多選
   */
  selectMode: {
    type: Number,
    default: 0,
  },
  /**
   * ```
   * {
   *  rootTitle: String,
   *  searchEnable: Boolean,
   *  button: {
   *    position: String, // top or bottom
   *    icon: String,
   *    text: String,
   *    clickHandler: Function,
   *    disabled: Boolean
   *  },
   *  width: String (Tailwindcss),
   *  scrollAreaMaxHeight: String (Tailwindcss),
   *  blockList: [
   *    {
   *      blockTitle: String,
   *      menuList: [
   *        {
   *          title: String,
   *          blockList: Array,
   *          titleLineClamp: Number,
   *          description: String,
   *          descriptionLineClamp: Number
   *          display: String,
   *          disabled: Boolean,
   *          selectable: Boolean,
   *          selectValue: null,
   *          icon: String,
   *          labelColor: String, (Color)
   *          thumbnail: String (URL)
   *          flag: String (URL),
   *          clickHandler: Function,
   *          tooltip: String,
   *          tooltipPlacement: String,
   *          searchEnable: Boolean,
   *          button: {
   *            position: String, // top or bottom
   *            icon: String,
   *            text: String,
   *            clickHandler: Function,
   *            disabled: Boolean
   *          },
   *          width: String (Tailwindcss),
   *          scrollAreaMaxHeight: String (Tailwindcss),
   *        }
   *      ]
   *    }
   *  ]
   * }
   * ```
   */
  menuTree: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  canAddNew: {
    type: Boolean,
    default: false,
  },
})

const innerMenuTree = computed(() => {
  const defaultMenuTree = {
    // required
    blockList: [],
    // optional
    rootTitle: '',
    searchEnable: false,
    button: null,
    width: 'w-60',
    scrollAreaMaxHeight: 'max-h-100',
  }
  return Object.assign({}, defaultMenuTree, props.menuTree)
})

const clickMenuHandler = (menu) => {
  if (props.selectMode === MULTIPLE) {
    const tempArr = [...props.inputSelectValue]
    const index = tempArr.findIndex((selectValue) =>
      isEqual(selectValue, menu.selectValue)
    )
    if (!~index) {
      tempArr.push(menu.selectValue)
    } else {
      tempArr.splice(index, 1)
    }
    emit('update:inputSelectValue', tempArr)
  } else if ([SINGLE_CANCEL, SINGLE_NONE_CANCEL].includes(props.selectMode)) {
    if (
      props.selectMode === SINGLE_CANCEL &&
      isEqual(props.inputSelectValue, menu.selectValue)
    ) {
      emit('update:inputSelectValue', null)
    } else {
      emit('update:inputSelectValue', menu.selectValue)
    }
  }
  emit('click:menu', menu)
}

const searchInput = ref('')
const filteredBlockList = computed(() => {
  const blockList = []
  innerMenuTree.value.blockList.forEach((block) => {
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

// invoke externally e.g. FSelectInput.vue
const setSearchInput = (v) => (searchInput.value = v)
const menuIsExist = computed(() =>
  innerMenuTree.value.blockList.some((block) =>
    block.menuList.some((menu) => menu.title === searchInput.value)
  )
)

defineExpose({
  setSearchInput,
  menuIsExist,
  clickMenuHandler,
})

// const depthOfMenuTree = computed(() => {
//   const getDepth = (tree, level) => {
//     return Math.max(
//       ...tree.blockList.map((block) => {
//         return Math.max(
//           ...block.menuList.map((menu) => {
//             if (menu.blockList && menu.blockList.length > 0) {
//               return getDepth(menu, level + 1)
//             } else {
//               return level
//             }
//           })
//         )
//       })
//     )
//   }
//   return getDepth(props.menuTree, 1)
// })
</script>
