<template>
  <div class="relative" :class="{ 'flex flex-col h-full': fitContainer }">
    <div class="grid grid-flow-col" :class="{ 'flex-shrink-0': fitContainer }">
      <f-input-text
        v-if="searchable"
        v-model:textValue="innerKeyword"
        size="md"
        class="w-67.5 justify-self-start"
        prependIcon="search"
        :placeholder="searchPlaceholder"
        @input="$emit('search')"
        @change="$emit('search')"
        @clear="$emit('search')"
      />
      <f-popper
        v-if="filterable"
        placement="bottom-end"
        class="justify-self-end"
      >
        <template #trigger="{ isExpand }">
          <div
            class="cursor-pointer w-43 h-9 px-1.5 flex justify-between items-center border border-grey-250 rounded"
            :class="{ 'border-grey-900': isExpand }"
          >
            <div class="flex justify-between items-center">
              <f-svg-icon
                iconName="filter"
                class="text-grey-600 mr-1"
                size="20"
              />
              <span class="text-grey-900">Filter</span>
            </div>
            <f-svg-icon
              iconName="keyboard_arrow_down"
              class="text-grey-250 transform"
              :class="{ 'rotate-180': isExpand }"
            />
          </div>
        </template>
        <template #content>
          <div class="bg-grey-0 shadow-4 rounded">
            <slot name="filter"></slot>
          </div>
        </template>
      </f-popper>
    </div>
    <div
      ref="refTable"
      class="overflow-x-auto"
      :class="{
        'overflow-y-hidden': !fitContainer,
        'overflow-y-hidden flex flex-col flex-grow min-h-0': fitContainer,
      }"
      :style="
        fitContainer
          ? { minWidth: tableWidth }
          : { width: boxWidth + 'px', minWidth: tableWidth }
      "
    >
      <div
        v-if="showHeader"
        class="grid grid-cols-12 gap-6 items-center bg-grey-50-v1 text-body2 text-grey-900 h-10 px-15 rounded"
        :class="{ 'flex-shrink-0': fitContainer, 'my-2.5': !fitContainer }"
        :style="{ minWidth: tableWidth }"
      >
        <div
          v-for="header in headers"
          :key="header.prop"
          :class="[header.colSpan, header.align, getHeaderCustomClass(header)]"
        >
          <div
            class="group inline-flex items-center"
            :class="{ 'cursor-pointer': !!header.sortBy }"
            @click="handleSort(header.sortBy)"
          >
            <span
              class="inline-block whitespace-nowrap"
              :class="[
                {
                  'group-hover:text-grey-900': !!header.sortBy && !fitContainer,
                  'text-green-500 font-bold':
                    header.sortBy?.includes(currentSort) && fitContainer,
                  'text-grey-600': !(
                    header.sortBy?.includes(currentSort) && fitContainer
                  ),
                },
                header.textColor || '',
              ]"
              >{{ header.label }}</span
            >
            <f-svg-icon
              v-if="header.sortBy?.length > 0"
              :iconName="sortIconName"
              size="20"
              class="transform inline-block"
              :class="{
                'group-hover:!text-primary-400': !fitContainer,
                'text-grey-600': !header.sortBy?.includes(currentSort),
                'text-primary-500':
                  header.sortBy?.includes(currentSort) && !fitContainer,
                'text-green-500':
                  header.sortBy?.includes(currentSort) && fitContainer,
                'rotate-180': header.sortBy?.[1] === currentSort,
              }"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isLoading"
        class="w-full h-full flex justify-center items-center flex-shrink-0"
        data-cy="loading-indicator"
      >
        <f-svg-icon iconName="loading" size="92" class="text-primary-400" />
      </div>
      <template v-else>
        <div
          v-if="items.length > 0"
          class="grid gap-y-2.5"
          :class="{ 'overflow-y-hidden flex-grow min-h-0': fitContainer }"
          :style="{ minWidth: tableWidth }"
        >
          <div
            v-for="(item, index) in items"
            :key="index"
            class="grid grid-cols-12 gap-6 items-center px-15 text-body2 text-grey-900 hover:bg-grey-50/50 rounded"
            :class="{
              'border-b border-grey-50-v1 h-12': fitContainer,
            }"
            :style="{
              minWidth: tableWidth,
              height: !fitContainer ? rowHeight : undefined,
            }"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="indexOfHover = null"
          >
            <div
              v-for="header in headers"
              :key="header.prop"
              :class="[
                header.colSpan,
                header.align,
                getItemCustomClass(header),
              ]"
            >
              <slot
                :item="item"
                :prop="header.prop"
                :isHover="indexOfHover === index"
                :index="index"
              >
                <div>{{ item[header.prop] }}</div>
              </slot>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-body1 text-grey-600 my-10 text-center"
          :class="{ 'flex-shrink-0': fitContainer }"
        >
          {{ emptyText }}
        </div>
      </template>
    </div>
    <div
      v-if="innerPagination.totalPage > 1"
      class="flex justify-center"
      :class="{ 'flex-shrink-0': fitContainer, 'py-6': !fitContainer }"
    >
      <f-paginator
        showQuickJumper
        v-model:currentPage="innerPagination.currentPage"
        :totalPage="innerPagination.totalPage"
        @goTo="$emit('goTo', $event)"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'

export default {
  name: 'FTable',
  props: {
    /**
     * header's format:
     *
     * ```
     * [
     *  {
     *    prop: 'key',
     *    label: 'name',
     *    colSpan: 'col-span-1',
     *    align: 'text-center',
     *    sortBy: [1, 2],
     *    customClass: [],
     *    itemCustomClass: []
     *  }
     * ]
     * ```
     *
     * **option**
     *
     * * align : [Tailwind Text Align](https://tailwindcss.com/docs/text-align)
     * * colSpan : `col-span-[1~12]`
     *
     */
    headers: {
      type: Array,
      required: true,
    },
    /**
     * Have to match value of prop of header's item or use slot to handle
     */
    items: {
      type: Array,
      required: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    /**
     * format:
     *
     * ```
     * {
     *  sort: Number,
     *  currentPage: Number,
     *  totalPage: Number,
     *  perPageCount: 8
     * }
     * ```
     */
    pagination: {
      type: Object,
      default: () => ({
        sort: null,
        currentPage: 1,
        totalPage: 1,
        perPageCount: 8,
      }),
    },
    emptyText: {
      type: String,
      default: '',
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: '',
    },
    keyword: {
      type: String,
      default: '',
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    tableWidth: {
      type: String,
      default: '100%',
    },
    rowHeight: {
      type: String,
      default: '90px',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    fitContainer: {
      type: Boolean,
      default: false,
    },
    currentSort: {
      type: [String, Number],
      default: null,
    },
  },
  emits: [
    'search',
    'sort',
    'goTo',
    'update:pagination',
    'update:keyword',
    'handleMouseEnter',
    'update:currentSort',
  ],
  setup(props, { emit }) {
    const refTable = ref(null)
    const boxWidth = ref(0)
    const indexOfHover = ref(null)
    const innerPagination = computed({
      get: () => props.pagination,
      set: (v) => emit('update:pagination', v),
    })
    const innerKeyword = computed({
      get: () => props.keyword,
      set: (v) => emit('update:keyword', v),
    })

    const sortIconName = computed(() => {
      return props.fitContainer ? 'switch_up' : 'keyboard_arrow_down'
    })

    const getHeaderCustomClass = (header) => header.customClass || []
    const getItemCustomClass = (header) => header.itemCustomClass || []

    const handleSort = (sortBy) => {
      if (!sortBy) {
        return
      }

      let newSortValue = null
      if (sortBy.includes(props.currentSort)) {
        if (props.currentSort === sortBy[0]) {
          newSortValue = sortBy[1]
        } else {
          newSortValue = sortBy[0]
        }
      } else {
        newSortValue = sortBy.length > 1 ? sortBy[1] : sortBy[0]
      }

      emit('update:currentSort', newSortValue)
      emit('sort')
    }

    const handleMouseEnter = (index) => {
      indexOfHover.value = index
      emit('handleMouseEnter', index)
    }

    onMounted(() => {
      if (!props.fitContainer && refTable.value) {
        const calculateWidth = () => {
          const leftDis = refTable.value.getBoundingClientRect().left
          boxWidth.value = document.body.clientWidth - leftDis - 24
        }
        calculateWidth()
        window.addEventListener('resize', calculateWidth)
      }
    })

    return {
      refTable,
      indexOfHover,
      innerPagination,
      innerKeyword,
      boxWidth,
      handleSort,
      handleMouseEnter,
      getHeaderCustomClass,
      getItemCustomClass,
      sortIconName,
    }
  },
}
</script>
