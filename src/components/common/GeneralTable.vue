<template lang="pug">
div
  div(class="grid grid-flow-col")
    input-text(
      v-if="searchable"
      v-model:textValue="innerKeyword"
      size="sm"
      class="w-67.5 justify-self-start"
      prependIcon="search"
      :placeholder="$t('RR0053')"
      @enter="$emit('search')"
      @clear="$emit('search')"
    )
    tooltip(v-if="filterable" :showArrow="false" :manual="true" placement="bottom-end" :offset="[0, 8]" class="justify-self-end")
      template(#trigger="{ isActive }")
        div(class="cursor-pointer w-43 h-9 px-1.5 flex justify-between items-center border border-black-400 rounded" :class="{ 'border-primary': isActive }")
          div(class="flex justify-between items-center")
            svg-icon(iconName="filter" class="text-black-700 mr-1" size="20")
            span(class="text-primary") {{ $t("RR0085") }}
          svg-icon(iconName="keyboard_arrow_down" class="text-black-500 transform" :class="{ 'rotate-180': isActive }")
      template(#content)
        slot(name="filter")
  div(v-if="showHeader" class="flex gap-6 items-center bg-black-200 text-body1 text-primary py-4 my-2.5 px-15")
    div(v-for="header in headers" :class="[`w-${header.width}`]" class="flex items-center")
      div {{ header.label }}
      svg-icon(
        v-if="header.sortBy?.length > 0"
        iconName="keyboard_arrow_down"
        size="20"
        class="cursor-pointer transform"
        :class="{ 'text-brand': header.sortBy.includes(innerPagination.sort), 'rotate-180': header.sortBy[1] === innerPagination.sort }"
        @click="handleSort(header.sortBy)"
      )
  overlay-scrollbar-container(:class="[tableContentHeight]")
    div(v-if="items.length > 0" class="grid gap-y-2.5")
      div(
        v-for="(item, index) in items"
        class="flex gap-6 items-center h-15 px-15 text-body1 text-black-700 hover:text-black-900 hover:bg-black-50"
        @mouseenter="indexOfHover = index"
        @mouseleave="indexOfHover = null"
      )
        div(v-for="header in headers" :class="[`w-${header.width}`]")
          div(v-if="item[header.prop]") {{ item[header.prop] }}
          div(v-else)
            slot(
              :item="item"
              :prop="header.prop"
              :isHover="indexOfHover === index"
              :index="index"
            )
    div(v-else class="text-body1 text-black-600 mt-10 text-center") {{ emptyText }}
  div(v-if="innerPagination.totalPage !== 1" class="pt-14 pb-9.5 flex justify-center")
    pagination(v-model:currentPage="innerPagination.currentPage" :totalPage="innerPagination.totalPage" @goTo="$emit('goTo', $event)")
</template>

<script>
import Pagination from '@/components/layout/Pagination.vue'
import { computed, ref } from '@vue/reactivity'

export default {
  name: 'GeneralTable',
  components: { Pagination },
  props: {
    items: {
      type: Array
    },
    headers: {
      type: Array,
      required: true
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
    }
  },
  emits: ['search', 'sort', 'goTo', 'update:pagination'],
  setup (props, { emit }) {
    const tableContentHeight = computed(() => {
      const h = props.pagination.perPageCount * 15 + (props.pagination.perPageCount - 1) * 2.5
      return `h-${h}`
    })
    const indexOfHover = ref(null)
    const innerPagination = computed({
      get: () => props.pagination,
      set: (v) => emit('update:pagination', v)
    })
    const innerKeyword = computed({
      get: () => props.keyword,
      set: (v) => emit('update:keyword', v)
    })


    const handleSort = (sortBy) => {
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

    return {
      indexOfHover,
      innerPagination,
      innerKeyword,
      handleSort,
      tableContentHeight
    }
  }
}
</script>
