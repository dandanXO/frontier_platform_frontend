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
  div(class="flex min-w-72 max-w-140 justify-between items-center")
    div(
      class="bg-grey-50-v1 rounded-sm w-12 h-12 flex items-center justify-center cursor-pointer"
      @click="updateHandler(currentPage - 1)"
    )
      f-svg-icon(
        size="16"
        iconName="left_arrow_page"
        :class="{ 'text-grey-400-v1': currentPage === 1 }"
      )
    div(class="flex h-12 justify-center flex-nowrap gap-x-2")
      div
        f-input-text(
          v-if="showQuickJumperProp"
          @keyup.enter="handleQuickJump"
          v-model:textValue="jumpPage"
          :placeholder="currentPage"
          size="xl"
          class="w-12 font-bold"
          :clearable="false"
          textAlign="center"
        ) 
      div(class="flex justify-center items-center gap-x-2 font-bold text-grey-900-v1") 
        div(class="font-normal") of
        div {{ totalPage }}
    div(
      class="bg-grey-50-v1 rounded-sm w-12 h-12 flex items-center justify-center cursor-pointer"
      @click="updateHandler(currentPage + 1)"
    )
      f-svg-icon(
        size="16"
        iconName="right_arrow_page"
        :class="{ 'text-grey-400-v1': currentPage === totalPage }"
      )
</template>

<script>
import { computed, ref, toRefs, onMounted, onUnmounted } from 'vue'

export default {
  name: 'FPaginator',

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
      set: (v) => {
        emit('update:currentPage', v)
        jumpPage.value = v
      },
    })
    const { showQuickJumper: showQuickJumperProp } = toRefs(props)

    const updateHandler = (page) => {
      if (page < 1 || page > props.totalPage) {
        return
      }
      jumpPage.value = page
      emit('update:currentPage', page)
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
    const handleKeydown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        updateHandler(props.currentPage - 1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        updateHandler(props.currentPage + 1)
      }
    }
    onMounted(() => {
      jumpPage.value = props.currentPage
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      handleKeydown,
      jumpPage,
      handleQuickJump,
      showQuickJumperProp,
      innerCurrentPage,
      updateHandler,
    }
  },
}
</script>
