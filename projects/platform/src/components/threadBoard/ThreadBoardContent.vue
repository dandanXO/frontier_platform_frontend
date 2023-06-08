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
      :workflowStageMenu="workflowStageMenu"
      @workflowStageCollapse="collapseDefaultWorkflowStage"
      @workflowStageMoveAllThreads="handleWorkflowStageMoveAllThreads"
      @workflowStageMenuMouseEnter="handleWorkflowStageMenuMouseEnter"
      @workflowStageMenuMouseLeave="handleWorkflowStageMenuMouseLeave"
    )
      template(#default="{ scrollContainer }")
        draggable(
          class="min-h-full flex flex-col items-center gap-2 pb-3.5"
          v-model="defaultWorkflowStageThreadList"
          v-bind="threadCardDragOptions"
          @start="(e) => handleDragStart(defaultWorkflowStage, scrollContainer)(e)"
          @end="(e) => handleDragEnd(scrollContainer)(e)"
          :move="handleMove"
          @add="handleAdd"
          @update="handleUpdate"
          :data-workflow-stage-id="defaultWorkflowStage.workflowStageId"
        )
          template(#item="{ element }")
            div(:class="threadCardWrapperClass")
              thread-card(
                :thread="element"
                :active="isThreadCardActive(element)"
                :verticalScrollContainer="scrollContainer"
                @active="openStickerDrawerByThread(element)"
                @materialClick="openMaterialDetail"
              )
  div(
    ref="horizontalScrollContainer"
    class="flex flex-row gap-4 max-w-full w-full h-full px-4 overflow-x-scroll bg-grey-100 p-2"
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
          :class="{ 'draggable-workflow-stage cursor-pointer': !loading && haveMoveWorkflowStagePermission }"
          :active="element.workflowStageId === activeWorkflowStageId"
          :workflowStage="element"
          :workflowStageMenu="workflowStageMenu"
          @workflowStageDelete="deleteWorkflowStage"
          @workflowStageHide="hideWorkflowStage"
          @workflowStageMoveAllThreads="handleWorkflowStageMoveAllThreads"
          @workflowStageMenuMouseEnter="handleWorkflowStageMenuMouseEnter"
          @workflowStageMenuMouseLeave="handleWorkflowStageMenuMouseLeave"
        )
          template(#default="{ scrollContainer }")
            draggable(
              class="min-h-full flex flex-col items-center gap-2 pb-3.5"
              v-model="element.digitalThreadList"
              draggable=".draggable-thread-card"
              v-bind="threadCardDragOptions"
              @start="(e) => handleDragStart(element, scrollContainer)(e)"
              @end="(e) => handleDragEnd(scrollContainer)(e)"
              @add="handleAdd"
              @update="handleUpdate"
              :move="handleMove"
              :data-workflow-stage-id="element.workflowStageId"
            )
              template(#item="{ element }")
                div(:class="threadCardWrapperClass")
                  thread-card(
                    :thread="element"
                    :active="isThreadCardActive(element)"
                    :horizontalScrollContainer="horizontalScrollContainer"
                    :verticalScrollContainer="scrollContainer"
                    @active="openStickerDrawerByThread(element)"
                    @materialClick="openMaterialDetail"
                  )
    div(class="w-120 flex-shrink-0")
      div(
        v-if="isHiddenWorkflowListExpanded"
        class="rounded pb-2 flex flex-col gap-2 w-82.5 flex-shrink-0 bg-grey-200"
      )
        div(
          class="h-12 rounded px-5 hover:bg-grey-150 flex flex-row items-center gap-3 cursor-pointer"
          @click="collapseHiddenWorkflowStage"
        )
          span(class="text-body2 text-grey-900 font-bold") {{ $t('TT0159') }}
          span(class="text-body2 text-grey-600 font-bold") {{ hiddenWorkflowStageList.length }}
        div(class="px-2 flex flex-col gap-2")
          workflow-stage-hidden-card(
            v-for="workflowStage in hiddenWorkflowStageList"
            :key="workflowStage.workflowStageId"
            :workflowStage="workflowStage"
            @workflowStageShow="showWorkflowStage"
          )
      div(
        v-else
        @click="expandHiddenWorkflowStageList"
        class="flex-shrink-0 w-82.5 rounded px-2 hover:bg-grey-150 flex flex-row gap-3 cursor-pointer"
      )
        div(class="h-12 px-3 flex flex-row items-center gap-3")
          span(class="text-body2 text-grey-900 font-bold") {{ $t('TT0159') }}
          span(class="text-body2 text-grey-600 font-bold") {{ hiddenWorkflowStageList.length }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import useThreadBoardStore from '@/stores/threadBoard'
import ThreadCard from '@/components/threadBoard/ThreadCard.vue'
import WorkflowStageColumn from '@/components/threadBoard/WorkflowStageColumn.vue'
import WorkflowStageHiddenCard from './WorkflowStageHiddenCard.vue'
import type { WorkflowStage } from '@frontier/platform-web-sdk'
import type FScrollbarContainer from '@frontier/ui-component/src/FScrollbarContainer/FScrollbarContainer.vue'
import type { WorkflowStageMoveAllThreadsPayload } from '@/types'

const threadBoardStore = useThreadBoardStore()
const {
  loading,
  isDefaultWorkflowStageExpanded,
  isHiddenWorkflowListExpanded,
  defaultWorkflowStage,
  draggableWorkflowStageList,
  defaultWorkflowStageThreadList,
  hiddenWorkflowStageList,
  workflowStageMenu,
  haveMoveWorkflowStagePermission,
} = storeToRefs(threadBoardStore)
const {
  isThreadCardActive,
  collapseDefaultWorkflowStage,
  expandDefaultWorkflowStage,
  expandHiddenWorkflowStageList,
  collapseHiddenWorkflowStage,
  openStickerDrawerByThread,
  openMaterialDetail,
  moveWorkflowStageDigitalThread,
  moveWorkflowStageAllThreads,
  moveWorkflowStageList,
  showWorkflowStage,
  hideWorkflowStage,
  deleteWorkflowStage,
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

const threadCardWrapperClass = computed(() =>
  loading.value ? 'pointer-events-none opacity-80' : 'draggable-thread-card'
)

const isDefaultWorkflowStageHaveUnreadThread = computed(() => {
  if (!defaultWorkflowStage.value) {
    return false
  }

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

const handleWorkflowStageMoveAllThreads = (
  v: WorkflowStageMoveAllThreadsPayload
) => {
  activeWorkflowStageId.value = null
  moveWorkflowStageAllThreads(v)
}

const handleMove = (e) => {
  activeWorkflowStageId.value = Number(e.to.dataset.workflowStageId)
}

const handleAdd = (e) => {
  const digitalThreadSideId = e.item.__draggable_context.element
    .digitalThreadSideId as number
  const fromWorkflowStageId = Number(e.from.dataset.workflowStageId)
  const toWorkflowStageId = Number(e.to.dataset.workflowStageId)
  const targetDigitalThreadSideId =
    e.to.__draggable_component__.modelValue[
      e.newIndex === 0 ? e.newIndex + 1 : e.newIndex - 1
    ]?.digitalThreadSideId
  const isMoveToBeforeTarget = e.newIndex === 0

  moveWorkflowStageDigitalThread(
    digitalThreadSideId,
    fromWorkflowStageId,
    toWorkflowStageId,
    targetDigitalThreadSideId,
    isMoveToBeforeTarget
  )
}

const handleUpdate = (e) => {
  const digitalThreadSideId = e.item.__draggable_context.element
    .digitalThreadSideId as number
  const fromWorkflowStageId = Number(e.from.dataset.workflowStageId)
  const toWorkflowStageId = Number(e.to.dataset.workflowStageId)
  const targetDigitalThreadSideId =
    e.to.__draggable_component__.modelValue[
      e.newIndex === 0 ? e.newIndex + 1 : e.newIndex - 1
    ]?.digitalThreadSideId
  const isMoveToBeforeTarget = e.newIndex === 0

  moveWorkflowStageDigitalThread(
    digitalThreadSideId,
    fromWorkflowStageId,
    toWorkflowStageId,
    targetDigitalThreadSideId,
    isMoveToBeforeTarget
  )
}

const handleDragStart =
  (
    workflowStage: WorkflowStage,
    scrollContainer: InstanceType<typeof FScrollbarContainer>
  ) =>
  (e: Event) => {
    if (scrollContainer.rootElement) {
      scrollContainer.rootElement.style.zIndex = '1'
    }
    activeWorkflowStageId.value = workflowStage.workflowStageId
  }

const handleDragEnd =
  (scrollContainer: InstanceType<typeof FScrollbarContainer>) => (e) => {
    if (scrollContainer.rootElement) {
      // scrollContainer.rootElement.style.zIndex = '0'
    }
    activeWorkflowStageId.value = null
  }

const handleWorkflowStageMenuMouseEnter = (id: number) => {
  activeWorkflowStageId.value = id
}

const handleWorkflowStageMenuMouseLeave = (id: number) => {
  if (activeWorkflowStageId.value === id) {
    activeWorkflowStageId.value = null
  }
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
