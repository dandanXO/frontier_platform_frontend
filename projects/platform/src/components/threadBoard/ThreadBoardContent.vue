<template lang="pug">
div(class="w-full max-w-full h-full min-h-0 flex-shrink-1 flex flex-row")
  div(
    v-if="defaultWorkflowStage"
    class="relative flex min-h-0 p-2 bg-grey-0"
    :class="defaultWorkflowStageWrapperClass"
    @click="expandDefaultWorkflowStage"
  )
    div(
      class="absolute top-0 right-0 h-full w-px bg-grey-200"
      :class="{ 'hover:w-0.5 hover:bg-primary-300 cursor-pointer': isDefaultWorkflowStageExpanded }"
      @click.stop="collapseDefaultWorkflowStage"
    )
    workflow-stage-column(
      :isExpanded="isDefaultWorkflowStageExpanded"
      :workflowStage="defaultWorkflowStage"
      :active="defaultWorkflowStage.workflowStageId === activeWorkflowStageId"
      @workflowStageCollapse="collapseDefaultWorkflowStage"
    )
      template(#default="{ scrollContainer }")
        draggable(
          class="min-h-full flex flex-col items-center gap-2 pb-3.5"
          v-model="defaultWorkflowStageThreadList"
          v-bind="threadCardDragOptions"
        )
          template(#item="{ element }")
            div(class="draggable-thread-card")
              thread-card(
                :thread="element"
                :active="isThreadCardActive(element)"
                :verticalScrollContainer="scrollContainer"
                @active="openStickerDrawerByThread(element)"
                @materialClick="openMaterialDetail"
              )
  div(
    ref="horizontalScrollContainer"
    class="flex flex-row gap-4 max-w-full h-full px-4 overflow-x-scroll bg-grey-100 p-2"
  )
    draggable(
      class="flex flex-row gap-2 h-full"
      handle=".handle"
      draggable=".draggable-workflow-stage"
      v-model="draggableWorkflowStageList"
      v-bind="workflowStageDragOptions"
      @change="handleWorkflowStageListChange"
    )
      template(#item="{ element }")
        workflow-stage-column(
          :class="{ 'draggable-workflow-stage cursor-pointer': canMoveWorkflowStage }"
          :active="element.workflowStageId === activeWorkflowStageId"
          :workflowStage="element"
        )
          template(#default="{ scrollContainer }")
            draggable(
              class="min-h-full flex flex-col items-center gap-2 pb-3.5"
              v-model="element.digitalThreadList"
              draggable=".draggable-thread-card"
              v-bind="threadCardDragOptions"
            )
              template(#item="{ element }")
                div(class="draggable-thread-card")
                  thread-card(
                    :thread="element"
                    :active="isThreadCardActive(element)"
                    :horizontalScrollContainer="horizontalScrollContainer"
                    :verticalScrollContainer="scrollContainer"
                    @active="openStickerDrawerByThread(element)"
                    @materialClick="openMaterialDetail"
                  )
    div(class="w-120 flex-shrink-0")
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import useThreadBoardStore from '@/stores/threadBoard'
import ThreadCard from '@/components/threadBoard/ThreadCard.vue'
import WorkflowStageColumn from '@/components/threadBoard/WorkflowStageColumn.vue'

const threadBoardStore = useThreadBoardStore()
const {
  isDefaultWorkflowStageExpanded,
  defaultWorkflowStage,
  draggableWorkflowStageList,
  defaultWorkflowStageThreadList,
  canMoveWorkflowStage,
} = storeToRefs(threadBoardStore)
const {
  isThreadCardActive,
  collapseDefaultWorkflowStage,
  expandDefaultWorkflowStage,
  openStickerDrawerByThread,
  openMaterialDetail,
  moveWorkflowStageList,
} = threadBoardStore

const horizontalScrollContainer = ref<HTMLDivElement>()
const activeWorkflowStageId = ref<number | null>(null)

const scrollSpeed = ref(10)
const scrollSensitivity = ref(100)

const workflowStageDragOptions = computed(() => ({
  itemKey: 'workflowStageId',
  forceFallback: 'true',
  // scrollSensitivity: 40,
  // scrollSpeed: 10,
  scrollSpeed: scrollSpeed.value,
  scrollSensitivity: scrollSensitivity.value,

  animation: 250,
  group: 'workflowStage',
  disabled: false,
  ghostClass: 'ghost',
}))

const threadCardDragOptions = computed(() => ({
  itemKey: 'digitalThreadSideId',
  forceFallback: 'true',
  // scrollSensitivity: 100,
  // scrollSpeed: 10,
  scrollSpeed: scrollSpeed.value,
  scrollSensitivity: scrollSensitivity.value,

  animation: 250,
  group: 'thread',
  disabled: false,
  ghostClass: 'ghost',
}))

const isDefaultWorkflowStageHaveUnreadThread = computed(() => {
  if (!defaultWorkflowStage.value) return false
  return defaultWorkflowStage.value.digitalThreadList.some(
    (thread) => thread.unreadStickerQty > 0
  )
})

const defaultWorkflowStageWrapperClass = computed(() => {
  if (isDefaultWorkflowStageExpanded.value) {
    return ['bg-grey-0  pl-5']
  }

  const baseClass = ['pl-2 ']
  if (isDefaultWorkflowStageHaveUnreadThread.value) {
    baseClass.push('bg-primary-0 hover:bg-primary-0')
  } else {
    baseClass.push('hover:bg-grey-150')
  }

  return baseClass
})

const handleWorkflowStageListChange = (e) => {
  const { element, oldIndex, newIndex } = e.moved
  moveWorkflowStageList(element.workflowStageId, oldIndex, newIndex)
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  /* background: #c8ebfb; */
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
