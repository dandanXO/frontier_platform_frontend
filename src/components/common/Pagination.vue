<style lang="scss" scoped>
.Pagination {
  :deep(.Page) {
    color: #c4c4c4;
    background-color: transparent !important;
    border: none !important;
  }
  :deep(.Page-active) {
    color: #222222;
  }
}
</style>

<template lang="pug">
v-pagination(
  v-model="innerCurrentPage"
  :pages="totalPage"
  :range-size="1"
  @update:modelValue="updateHandler"
)
</template>

<script>
// https://www.npmjs.com/package/@hennge/vue3-pagination
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { computed } from 'vue'

export default {
  name: 'Pagination',
  components: {
    VPagination
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPage: {
      type: Number,
      required: true
    }
  },
  emits: ['update:currentPage', 'goTo'],
  setup (props, { emit }) {
    const innerCurrentPage = computed({
      get: () => props.currentPage,
      set: (v) => emit('update:currentPage', v)
    })

    const updateHandler = (page) => {
      emit('goTo', page)
    }

    return {
      innerCurrentPage,
      updateHandler
    }
  }
}
</script>
