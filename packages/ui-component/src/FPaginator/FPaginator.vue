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
div(class="flex")
  v-pagination(
    v-model="innerCurrentPage"
    :pages="totalPage"
    :range-size="1"
    @update:modelValue="updateHandler"
  )
  template(v-if="showQuickJumperProp") 
    div(class="mx-4 my-auto") Go to
    f-input-text(
      v-if="showQuickJumperProp"
      @keyup.enter="handleQuickJump"
      v-model:textValue="jumpPage"
      :placeholder="$t('OO0128')"
      size="md"
      class="w-18"
    )
</template>

<script>
// https://www.npmjs.com/package/@hennge/vue3-pagination
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { computed, ref, toRefs } from 'vue'

export default {
  name: 'FPaginator',
  components: {
    VPagination,
  },
  props: {
    showQuickJumper: {
      type: Boolean,
      required: false,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalPage: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:currentPage', 'goTo'],
  setup(props, { emit }) {
    const innerCurrentPage = computed({
      get: () => props.currentPage,
      set: (v) => emit('update:currentPage', v),
    })
    const { showQuickJumper: showQuickJumperProp } = toRefs(props)

    const updateHandler = (page) => {
      emit('goTo', page)
    }
    const jumpPage = ref(null)
    const isValidPage = (page) => {
      return page && 0 < page && page <= props.totalPage
    }
    const handleQuickJump = (e) => {
      let page = Number(e.target.value)
      if (isValidPage(page)) {
        emit('update:currentPage', page)
        emit('goTo', page)
      } else {
        // if wrong clear input
        jumpPage.value = null
      }
    }

    return {
      jumpPage,
      handleQuickJump,
      showQuickJumperProp,
      innerCurrentPage,
      updateHandler,
    }
  },
}
</script>
