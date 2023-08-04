<template lang="pug">
div(class="relative")
  div(class="grid grid-flow-col")
    f-input-text(
      v-if="searchable"
      v-model:textValue="innerKeyword"
      size="md"
      class="w-67.5 justify-self-start"
      prependIcon="search"
      :placeholder="searchPlaceholder"
      @input="$emit('search')"
      @change="$emit('search')"
      @clear="$emit('search')"
    )
    f-popper(v-if="filterable" placement="bottom-end" class="justify-self-end")
      template(#trigger="{ isExpand }")
        div(
          class="cursor-pointer w-43 h-9 px-1.5 flex justify-between items-center border border-grey-250 rounded"
          :class="{ 'border-grey-900': isExpand }"
        )
          div(class="flex justify-between items-center")
            f-svg-icon(iconName="filter" class="text-grey-600 mr-1" size="20")
            span(class="text-grey-900") Filter
          f-svg-icon(
            iconName="keyboard_arrow_down"
            class="text-grey-250 transform"
            :class="{ 'rotate-180': isExpand }"
          )
      template(#content)
        div(class="bg-grey-0 shadow-4 rounded")
          slot(name="filter")
  div(
    ref="refTable"
    class="overflow-x-auto overflow-y-hidden"
    :style="{ width: boxWidth + 'px' }"
  )
    div(
      v-if="showHeader"
      class="grid grid-cols-12 gap-6 items-center bg-grey-100 text-body2 text-grey-900 h-10 my-2.5 px-15 rounded"
      :style="{ minWidth: tableWidth }"
    )
      div(
        v-for="header in headers"
        :class="[header.colSpan, header.align, getHeaderCustomClass(header)]"
      )
        div(
          class="group inline-flex items-center"
          :class="{ 'cursor-pointer': !!header.sortBy }"
          @click="handleSort(header.sortBy)"
        )
          span(
            class="text-grey-600 inline-block whitespace-nowrap"
            :class="{ 'group-hover:text-grey-900': !!header.sortBy }"
          ) {{ header.label }}
          f-svg-icon(
            v-if="header.sortBy?.length > 0"
            iconName="keyboard_arrow_down"
            size="20"
            class="transform text-grey-600 group-hover:!text-primary-400 inline-block"
            :class="{ 'text-primary-500': header.sortBy.includes(innerPagination.sort), 'rotate-180': header.sortBy[1] === innerPagination.sort }"
          )
    div(v-if="isLoading" class="w-full h-full flex justify-center items-center")
      f-svg-icon(iconName="loading" size="92" class="text-primary-400")
    template(v-else)
      div(
        v-if="items.length > 0"
        class="grid gap-y-2.5"
        :style="{ minWidth: tableWidth }"
      )
        div(
          v-for="(item, index) in items"
          class="grid grid-cols-12 gap-6 items-center px-15 text-body2 text-grey-900 hover:bg-grey-50/50 rounded"
          :style="{ minWidth: tableWidth, height: rowHeight }"
          @mouseenter="handleMouseEnter(index)"
          @mouseleave="indexOfHover = null"
        )
          div(
            v-for="header in headers"
            :class="[header.colSpan, header.align, getItemCustomClass(header)]"
          )
            slot(
              :item="item"
              :prop="header.prop"
              :isHover="indexOfHover === index"
              :index="index"
            )
              div {{ item[header.prop] }}
      div(v-else class="text-body1 text-grey-600 mt-10 text-center") {{ emptyText }}
  div(v-if="innerPagination.totalPage > 1" class="py-6 flex justify-center")
    f-paginator(
      v-model:currentPage="innerPagination.currentPage"
      :totalPage="innerPagination.totalPage"
      @goTo="$emit('goTo', $event)"
    )
</template>

<script>
import { computed, ref } from 'vue'
import { onMounted } from 'vue'

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
  },
  emits: [
    'search',
    'sort',
    'goTo',
    'update:pagination',
    'update:keyword',
    'handleMouseEnter',
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

    const getHeaderCustomClass = (header) => header.customClass || []
    const getItemCustomClass = (header) => header.itemCustomClass || []

    const handleSort = (sortBy) => {
      if (!sortBy) return

      if (sortBy.includes(innerPagination.value.sort)) {
        if (innerPagination.value.sort === sortBy[0]) {
          innerPagination.value.sort = sortBy[1]
        } else {
          innerPagination.value.sort = sortBy[0]
        }
      } else {
        innerPagination.value.sort = sortBy[1]
      }
      emit('sort')
    }

    const handleMouseEnter = (index) => {
      indexOfHover.value = index
      emit('handleMouseEnter', index)
    }

    onMounted(() => {
      const leftDis = refTable.value.getBoundingClientRect().left
      // 24 is padding-right
      boxWidth.value = document.body.clientWidth - leftDis - 24
      window.addEventListener('resize', () => {
        boxWidth.value = document.body.clientWidth - leftDis - 24
      })
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
    }
  },
}
</script>
