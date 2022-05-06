<template lang="pug">
div(class="relative")
  div(class="grid grid-flow-col")
    input-text(
      v-if="searchable"
      v-model:textValue="innerKeyword"
      size="sm"
      class="w-67.5 justify-self-start"
      prependIcon="search"
      :placeholder="searchPlaceholder"
      @input="$emit('search')"
      @change="$emit('search')"
      @clear="$emit('search')"
    )
    tooltip(v-if="filterable" :showArrow="false" manual placement="bottom-end" :offset="[0, 8]" class="justify-self-end")
      template(#trigger="{ isActive }")
        div(class="cursor-pointer w-43 h-9 px-1.5 flex justify-between items-center border border-black-400 rounded" :class="{ 'border-primary': isActive }")
          div(class="flex justify-between items-center")
            svg-icon(iconName="filter" class="text-black-700 mr-1" size="20")
            span(class="text-primary") {{ $t("RR0085") }}
          svg-icon(iconName="keyboard_arrow_down" class="text-black-500 transform" :class="{ 'rotate-180': isActive }")
      template(#content)
        slot(name="filter")
  div(ref="refTable" class="overflow-x-auto overflow-y-hidden" :style="{ width: boxWidth + 'px' }")
    div(v-if="showHeader" class="grid grid-cols-12 gap-6 items-center bg-black-200 text-body2 text-primary h-10 my-2.5 px-15 rounded" :style="{ minWidth: tableWidth }")
      div(v-for="header in headers" :class="[header.colSpan, header.align, getHeaderCustomClass(header)]")
        div(
          class="group inline-flex items-center"
          :class="{ 'cursor-pointer': !!header.sortBy }"
          @click="handleSort(header.sortBy)"
        )
          span(class="text-black-600 inline-block" :class="{ 'group-hover:text-primary': !!header.sortBy }") {{ header.label }}
          svg-icon(
            v-if="header.sortBy?.length > 0"
            iconName="keyboard_arrow_down"
            size="20"
            class="transform text-black-600 group-hover:!text-brand inline-block"
            :class="{ 'text-brand-dark': header.sortBy.includes(innerPagination.sort), 'rotate-180': header.sortBy[1] === innerPagination.sort }"
          )
    div(v-if="isLoading" class="w-full h-full flex justify-center items-center")
      svg-icon(iconName="loading" size="92" class="text-brand")
    template(v-else)
      div(v-if="items.length > 0" class="grid gap-y-2.5" :style="{ minWidth: tableWidth }")
        div(
          v-for="(item, index) in items"
          class="grid grid-cols-12 gap-6 items-center px-15 text-body2 text-primary hover:bg-black-50/50 rounded"
          :style="{ minWidth: tableWidth, height: rowHeight }"
          @mouseenter="indexOfHover = index"
          @mouseleave="indexOfHover = null"
        )
          div(v-for="header in headers" :class="[header.colSpan, header.align, getItemCustomClass(header)]")
            div(v-if="item[header.prop]") {{ item[header.prop] }}
            slot(
              v-else
              :item="item"
              :prop="header.prop"
              :isHover="indexOfHover === index"
              :index="index"
            )
      div(v-else class="text-body1 text-black-600 mt-10 text-center") {{ emptyText }}
  div(v-if="innerPagination.totalPage > 1" class="py-6 flex justify-center")
    pagination(v-model:currentPage="innerPagination.currentPage" :totalPage="innerPagination.totalPage" @goTo="$emit('goTo', $event)")
</template>

<script>
import Pagination from '@/components/layout/Pagination.vue'
import { computed, ref } from '@vue/reactivity'
import { onMounted } from 'vue'

export default {
  name: 'GeneralTable',
  components: { Pagination },
  props: {
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true,
      default: () => ([
        {
          prop: 'key',
          label: 'name',
          width: 'w-1/12',
          align: 'text-center',
          sortBy: [1, 2],
          customClass: [],
          itemCustomClass: []
        }
      ])
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    keyword: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default: ''
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    pagination: {
      type: Object,
      default: () => ({
        sort: null,
        currentPage: 1,
        totalPage: 1,
        perPageCount: 8
      })
    },
    filterable: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    tableWidth: {
      type: String,
      default: '100%'
    },
    rowHeight: {
      type: String,
      default: '90px'
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['search', 'sort', 'goTo', 'update:pagination', 'update:keyword'],
  setup (props, { emit }) {
    const refTable = ref(null)
    const boxWidth = ref(0)
    const indexOfHover = ref(null)
    const innerPagination = computed({
      get: () => props.pagination,
      set: (v) => emit('update:pagination', v)
    })
    const innerKeyword = computed({
      get: () => props.keyword,
      set: (v) => emit('update:keyword', v)
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
      getHeaderCustomClass,
      getItemCustomClass
    }
  }
}
</script>
