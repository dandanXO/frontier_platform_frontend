<template>
  <div
    class="p-2 rounded-lg bg-grey-0 flex flex-col gap-1 shadow-16"
    :class="[innerMenuTree.width, { 'bg-grey-850': theme === THEME.DARK }]"
  >
    <!-- Root Title -->
    <template v-if="innerMenuTree.rootTitle">
      <div class="h-8.5 pt-2 px-4 text-body2 text-grey-900 font-bold">
        {{ innerMenuTree.rootTitle }}
      </div>
      <div
        class="w-full h-px my-1 bg-grey-150"
        :class="{ 'bg-grey-850': theme === THEME.DARK }"
      ></div>
    </template>

    <!-- Button if position is top -->
    <contextual-menu-button
      v-if="innerMenuTree.button && innerMenuTree.button.position === 'top'"
      v-bind="innerMenuTree.button"
    />

    <f-tabs
      v-if="innerMenuTree.type === CONTEXTUAL_MENU_TYPE.TAB"
      ref="refTab"
      :tabList="tabList"
      @switch="switchTab($event.id)"
      tabListContainerStyle="flex flex-row justify-center flex-1"
      tabItemContainerStyle="flex-1 flex-row justify-center"
      keyField="id"
    />

    <!-- Search Input -->
    <template v-if="innerMenuTree.searchEnable">
      <div class="flex items-center h-8 px-4">
        <f-svg-icon iconName="search" size="20" class="mr-2 text-grey-600" />
        <input
          v-model="searchInput"
          placeholder="Search"
          class="w-full outline-none text-caption text-grey-900 placeholder:text-grey-600-v1"
        />
      </div>
      <div class="w-full h-px my-1 bg-grey-150"></div>
    </template>

    <!-- Add New Menu -->
    <template v-if="!disabledAddNew">
      <template v-if="!!searchInput && !menuIsExist">
        <div class="flex items-center px-4 min-h-6">
          <p class="break-all text-caption text-grey-600">
            Press <span class="font-bold">Enter</span> to create "{{
              searchInput
            }}"
          </p>
        </div>
        <div v-if="!isEmpty" class="w-full h-px my-1 bg-grey-150"></div>
      </template>
      <div v-else-if="isEmpty" class="flex items-center px-4 min-h-6">
        <i18n-t
          keypath="RR0256"
          tag="p"
          class="break-all text-caption text-grey-600"
          scope="global"
        >
          <template #Enter>
            <span class="font-bold">Enter</span>
          </template>
        </i18n-t>
      </div>
    </template>

    <div
      v-if="isItemsExist[innerMenuTree.type ?? CONTEXTUAL_MENU_TYPE.LIST]"
      :class="innerMenuTree.scrollAreaMaxHeight"
      class="overflow-x-hidden overflow-y-auto overscroll-contain"
      data-cy="f-context-menu"
    >
      <contextual-menu-node
        v-for="menu in filteredBlockTabItems"
        :key="menu.title + new Date().getTime()"
        :theme="theme"
        :menu="menu"
        @click:menu="clickMenuHandler($event)"
        :selectMode="selectMode"
        :inputSelectValue="inputSelectValue"
        :hideLeadingVisual="hideLeadingVisual"
        :hideTrailingIcon="hideTrailingIcon"
        :version="version"
      />

      <template
        v-for="(block, index) in filteredBlockListItems"
        :key="`block-${index}`"
      >
        <!-- Block Title -->
        <div
          v-if="block.blockTitle"
          class="h-6 py-1.5 px-4 text-caption text-grey-600"
        >
          {{ block.blockTitle }}
        </div>

        <contextual-menu-node
          v-for="menu in block.menuList"
          class="rounded"
          :key="menu.title"
          :theme="theme"
          :menu="menu"
          @click:menu="clickMenuHandler($event)"
          :selectMode="selectMode"
          :inputSelectValue="inputSelectValue"
          :hideLeadingVisual="hideLeadingVisual"
          :hideTrailingIcon="hideTrailingIcon"
          :version="version"
        />

        <div
          v-if="index !== filteredBlockListItems.length - 1"
          class="w-full h-px my-1 bg-grey-150"
          :class="{ 'bg-grey-750': theme === THEME.DARK }"
        ></div>
      </template>
    </div>

    <div
      v-else-if="disabledAddNew && !usingCustomNotFound"
      class="h-6 py-1.5 px-4 text-caption text-grey-600"
    >
      No Results Found
    </div>

    <slot
      v-else-if="disabledAddNew && usingCustomNotFound"
      name="custom-not-found"
    />

    <!-- Button if position is bottom -->
    <contextual-menu-button
      v-if="innerMenuTree.button && innerMenuTree.button.position === 'bottom'"
      v-bind="innerMenuTree.button"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'FContextualMenu',
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CONTEXTUAL_MENU_MODE, CONTEXTUAL_MENU_TYPE, THEME } from '../constants'
// import { RecycleScroller } from 'vue-virtual-scroller'
// import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { isEqual } from '@frontier/lib'
import type { MenuBlock, MenuItem, MenuTree } from '../types'
import Fuse from 'fuse.js'

const { SINGLE_CANCEL, SINGLE_NONE_CANCEL, MULTIPLE } = CONTEXTUAL_MENU_MODE

// update:inputSelectValue will execute before click:menu
const emit = defineEmits<{
  (e: 'update:inputSelectValue', inputSelectValue: any): void
  (e: 'click:menu', menu: Required<MenuItem>): void
}>()

const activeTab = ref(0)

const switchTab = (id: number) => {
  activeTab.value = id
}

const props = withDefaults(
  defineProps<{
    theme?: `${THEME}`
    /**
     * v-model:inputSelectValue
     *
     * If `selectMode` is 3 (Multiple Select) then inputSelectValue must be an Array
     */
    inputSelectValue?: any
    /**
     * * 0 - 不可選
     * * 1 - 單選，可取消
     * * 2 - 單選，不可取消
     * * 3 - 多選
     */
    selectMode?: CONTEXTUAL_MENU_MODE
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
     *          leadingVisual
     *          thumbnail: String (URL)
     *          thumbnailSize: String (SIZE.MD & SIZE.SM)
     *          flag: String (URL),
     *          clickHandler: Function,
     *          mouseEnterHandler: Function,
     *          mouseLeaveHandler: Function,
     *          tooltipTitle: String,
     *          tooltipMessage: String,
     *          tooltipContentComponent: Component,
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
     *          hasNotify: Boolean
     *        }
     *      ]
     *    }
     *  ]
     * }
     * ```
     */
    menuTree: MenuTree
    canAddNew?: boolean
    hideLeadingVisual?: boolean
    hideTrailingIcon?: boolean
    version?: string
  }>(),
  {
    theme: THEME.LIGHT,
    selectMode: CONTEXTUAL_MENU_MODE.NONE_SELECT,
    canAddNMew: false,
    hideLeadingVisual: false,
    hideTrailingIcon: false,
    version: 'v1',
  }
)

const usingCustomNotFound = computed(() => {
  if (innerMenuTree.value.type === CONTEXTUAL_MENU_TYPE.TAB) {
    return innerMenuTree.value.blockList[activeTab.value].usingCustomNotFound
  }

  return false
})

// const props = defineProps({
//   theme: {
//     type: String,
//     default: 'light',
//   },
//   /**
//    * v-model:inputSelectValue
//    *
//    * If `selectMode` is 3 (Multiple Select) then inputSelectValue must be an Array
//    */
//   inputSelectValue: {
//     validator: () => true,
//   },
//   /**
//    * * 0 - 不可選
//    * * 1 - 單選，可取消
//    * * 2 - 單選，不可取消
//    * * 3 - 多選
//    */
//   selectMode: {
//     type: Number,
//     default: 0,
//   },

//   menuTree: {
//     type: Object,
//     required: true,
//     default: () => ({}),
//   },
//   canAddNew: {
//     type: Boolean,
//     default: false,
//   },
// })

const innerMenuTree = computed<MenuTree>(() =>
  Object.assign(
    {},
    {
      rootTitle: '',
      searchEnable: false,
      button: null,
      width: 'w-60',
      type: CONTEXTUAL_MENU_TYPE.LIST,
      scrollAreaMaxHeight: 'max-h-100',
    },
    props.menuTree
  )
)

const disabledAddNew = computed(
  () =>
    !props.canAddNew ||
    innerMenuTree.value.blockList[activeTab.value].disabledAddNew
)

const clickMenuHandler = (menu: Required<MenuItem>) => {
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
const filteredBlockListItems = computed(() => {
  if (innerMenuTree.value.type === CONTEXTUAL_MENU_TYPE.TAB) {
    return []
  }

  const blockList: MenuBlock[] = []
  innerMenuTree.value.blockList?.forEach((block) => {
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

const filteredBlockTabItems = computed(() => {
  if (
    innerMenuTree.value.type === CONTEXTUAL_MENU_TYPE.LIST ||
    !innerMenuTree.value.blockList[activeTab.value]
  ) {
    return []
  }

  const menuList = innerMenuTree.value.blockList[activeTab.value].menuList

  const fuse = new Fuse(menuList, {
    keys: ['title'],
    threshold: 0.5,
    ignoreLocation: true,
    minMatchCharLength: 1,
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    useExtendedSearch: true,
    sortFn: (a, b) => {
      const scoreA = a.score || 0
      const scoreB = b.score || 0
      const lengthWeight = Number.EPSILON // ~2.22e-16 (smallest positive number)
      const missingCharsWeight = Number.EPSILON

      const queryLength = searchInput.value.length

      // Calculate total matched characters
      const totalMatchedA =
        a.matches?.[0]?.indices?.reduce(
          (sum, [s, e]) => sum + (e - s + 1),
          0
        ) || 0
      const totalMatchedB =
        b.matches?.[0]?.indices?.reduce(
          (sum, [s, e]) => sum + (e - s + 1),
          0
        ) || 0

      const missingCharsA = Math.max(queryLength - totalMatchedA, 0)
      const missingCharsB = Math.max(queryLength - totalMatchedB, 0)

      // Access item properties safely
      const itemValueA = a.matches?.[0]?.value || ''
      const itemValueB = b.matches?.[0]?.value || ''

      const aLengthDiff = Math.abs(queryLength - itemValueA.length)
      const bLengthDiff = Math.abs(queryLength - itemValueB.length)

      // Calculate penalties
      const combinedScoreA =
        scoreA + aLengthDiff * lengthWeight + missingCharsA * missingCharsWeight

      const combinedScoreB =
        scoreB + bLengthDiff * lengthWeight + missingCharsB * missingCharsWeight

      return combinedScoreA - combinedScoreB
    },
  })

  return searchInput.value
    ? fuse
        .search(searchInput.value)
        .map((result) => result.item)
        // Deduplicate items using a Set based on unique identifier
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.title === item.title)
        )
    : menuList
})

const isItemsExist = computed(() => ({
  [CONTEXTUAL_MENU_TYPE.LIST]: !!filteredBlockListItems.value.length,
  [CONTEXTUAL_MENU_TYPE.TAB]: !!filteredBlockTabItems.value.length,
}))

const isEmpty = computed(
  () =>
    filteredBlockListItems.value.length || filteredBlockTabItems.value.length
)

// invoke externally e.g. FSelectInput.vue
const setSearchInput = (v: string) => (searchInput.value = v)
const menuIsExist = computed(() =>
  innerMenuTree.value.blockList.some((block) =>
    block.menuList.some((menu) => menu.title === searchInput.value)
  )
)

const tabList = computed(() =>
  innerMenuTree.value.blockList.map((tab, id) => ({
    name: tab.blockTitle,
    id,
  }))
)

defineExpose({
  setSearchInput,
  menuIsExist,
  clickMenuHandler,
  activeTab,
  tabList,
  disabledAddNew,
})
</script>
