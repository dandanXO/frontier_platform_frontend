<template lang="pug">
div(class="h-screen flex flex-col" :style="{ width: 'calc(100vw - 240px)' }")
  div(
    v-if="loading"
    class="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-grey-200/50 z-loading"
  )
    f-svg-icon(iconName="loading" size="92" class="text-primary-400")
  thread-board-header
  thread-board-top
  thread-board-content(v-if="workflowStageList")
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import ThreadBoardHeader from '@/components/threadBoard/ThreadBoardHeader.vue'
import ThreadBoardTop from '@/components/threadBoard/ThreadBoardTop.vue'
import ThreadBoardContent from '@/components/threadBoard/ThreadBoardContent.vue'
import useThreadBoardStore from '@/stores/threadBoard'

const threadBoardStore = useThreadBoardStore()
const { loading, workflowStageList } = storeToRefs(threadBoardStore)

onMounted(threadBoardStore.init)
onUnmounted(threadBoardStore.cleanUp)
</script>

<style scoped>
.smooth-dnd-container.horizontal {
  display: flex !important;
}
</style>
