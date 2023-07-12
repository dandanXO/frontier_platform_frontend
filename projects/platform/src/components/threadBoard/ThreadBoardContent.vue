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
      template(#default="{ scrollContainer, disabled }")
        draggable(
          class="min-h-full flex flex-col items-center gap-2 pb-3.5"
          v-model="defaultWorkflowStageThreadList"
          v-bind="threadCardDragOptions"
          :data-workflow-stage-id="defaultWorkflowStage.workflowStageId"
          :move="handleMove"
          :disabled="disabled"
          @add="handleUpdate"
          @update="handleUpdate"
          @start="(e) => handleDragStart(e, defaultWorkflowStage.workflowStageId, scrollContainer)"
          @end="handleDragEnd(scrollContainer)"
        )
          template(#item="{ element }")
            div(:class="threadCardWrapperClass")
              thread-card(
                :thread="element"
                :active="isThreadCardActive(element)"
                :dragging="isThreadCardDragging(element)"
                :verticalScrollContainer="scrollContainer"
                @active="openStickerDrawerByThread(element)"
                @materialClick="openMaterialDetail"
              )
  div(ref="horizontalScrollContainer" class="w-full h-full px-4 bg-grey-100 p-2")
    div(class="flex flex-row gap-4 h-full")
      div(class="flex flex-row gap-2 h-full")
        draggable(
          class="flex flex-row gap-2 h-full"
          handle=".handle"
          draggable=".draggable-workflow-stage"
          v-model="draggableWorkflowStageList"
          v-bind="workflowStageDragOptions"
          @change="handleWorkflowStageListChange"
          @start="displayGrabbingCursor"
          @end="removeGrabbingCursor"
        )
          template(#item="{ element }")
            workflow-stage-column(
              :class="{ 'draggable-workflow-stage cursor-grab': !loading && haveMoveWorkflowStagePermission }"
              :active="element.workflowStageId === activeWorkflowStageId"
              :workflowStage="element"
              :workflowStageMenu="workflowStageMenu"
              @workflowStageMoveAllThreads="handleWorkflowStageMoveAllThreads"
              @workflowStageMenuMouseEnter="handleWorkflowStageMenuMouseEnter"
              @workflowStageMenuMouseLeave="handleWorkflowStageMenuMouseLeave"
              @workflowStageHide="hideWorkflowStage"
              @workflowStageRename="renameWorkflowStage"
              @workflowStageDelete="deleteWorkflowStage"
            )
              template(#default="{ scrollContainer, disabled }")
                draggable(
                  class="min-h-full flex flex-col items-center gap-2 pb-3.5"
                  v-model="element.digitalThreadList"
                  draggable=".draggable-thread-card"
                  v-bind="threadCardDragOptions"
                  @start="(e) => handleDragStart(e, element.workflowStageId, scrollContainer)"
                  @end="handleDragEnd(scrollContainer)"
                  @add="handleUpdate"
                  @update="handleUpdate"
                  :disabled="disabled"
                  :move="handleMove"
                  :data-workflow-stage-id="element.workflowStageId"
                )
                  template(#item="{ element }")
                    div(:class="threadCardWrapperClass")
                      thread-card(
                        :thread="element"
                        :active="isThreadCardActive(element)"
                        :dragging="isThreadCardDragging(element)"
                        :horizontalScrollContainer="horizontalScrollContainer"
                        :verticalScrollContainer="scrollContainer"
                        @active="openStickerDrawerByThread(element)"
                        @materialClick="openMaterialDetail"
                      )
        workflow-stage-column(
          class="opacity-50 pointer-events-none"
          v-if="creatingGhostWorkflowStage"
          :workflowStage="creatingGhostWorkflowStage"
          :workflowStageMenu="[]"
        )
          template(#default="{ scrollContainer }")
            div(class="min-h-full flex flex-col items-center gap-2 pb-3.5")
              div(
                v-for="thread in creatingGhostWorkflowStage.digitalThreadList"
                :key="thread.digitalThreadSideId"
              )
                thread-card(
                  :thread="thread"
                  :active="isThreadCardActive(thread)"
                  :dragging="isThreadCardDragging(thread)"
                  :horizontalScrollContainer="horizontalScrollContainer"
                  :verticalScrollContainer="scrollContainer"
                  @active="openStickerDrawerByThread(thread)"
                  @materialClick="openMaterialDetail"
                )
      workflow-stage-create(
        v-if="haveCreateWorkflowStagePermission"
        :isThreadCardDragging="draggingThreadCardId != null"
      )
        template(#toggle)
          draggable(
            class="w-full h-full overflow-hidden"
            draggable=".draggable-thread-card"
            v-bind="threadCardDragOptions"
            v-model="creatingWorkflowStageThreadList"
            @add="isCreatingWorkflowStage = true"
          )
            template(#item="{ element }")
          div(
            class="absolute left-0 top-0 w-full h-full pt-3.5 flex flex-col items-center gap-2 text-grey-600 bg-grey-100"
            :class="[draggingThreadCardId != null ? 'hover:bg-primary-50 hover:text-primary-400' : 'hover:bg-grey-150']"
          )
            f-svg-icon(iconName="add" size="20")
            span(
              class="font-bold text-body2 [writing-mode:vertical-lr] flex gap-2"
              :class="isZh ? 'leading-2' : 'rotate-180'"
            ) {{ $t('TT0142') }}
        template(#content="{ scrollContainer }")
          div(
            class="relative bg-grey-100 h-full rounded flex flex-col items-center"
            :class="activeWorkflowStageId === 'creatingWorkflowStage' ? 'border border-primary-300 bg-primary-50' : ''"
          )
            p(
              v-if="creatingWorkflowStageThreadList.length === 0"
              class="absolute top-16 left-0 w-full flex justify-center text-body2 text-grey-250 font-bold"
            ) {{ $t('TT0149') }}
            draggable(
              class="flex-shrink-1 min-h-full flex flex-col gap-2 p-2"
              v-model="creatingWorkflowStageThreadList"
              draggable=".draggable-thread-card"
              v-bind="threadCardDragOptions"
              :move="handleMove"
              @add="sortCreatingWorkflowStage"
              @update="sortCreatingWorkflowStage"
              @start="(e) => handleDragStart(e, 'creatingWorkflowStage', scrollContainer)"
              @end="handleDragEnd(scrollContainer)"
              data-workflow-stage-id="creatingWorkflowStage"
            )
              template(#item="{ element }")
                div(:class="threadCardWrapperClass")
                  thread-card(
                    :thread="element"
                    :active="isThreadCardActive(element)"
                    :dragging="isThreadCardDragging(element)"
                    :horizontalScrollContainer="horizontalScrollContainer"
                    @click="openStickerDrawerByThread(element)"
                    @materialClick="openMaterialDetail"
                  )
      div(class="w-120 max-h-full flex-shrink-0")
        div(
          v-if="isHiddenWorkflowListExpanded"
          class="h-full rounded pb-2 flex flex-col gap-2 w-82.5 flex-shrink-0 bg-grey-200"
        )
          div(
            class="h-12 rounded px-5 hover:bg-grey-150 flex flex-row items-center gap-3 cursor-pointer"
            @click="collapseHiddenWorkflowStage"
          )
            span(class="text-body2 text-grey-900 font-bold") {{ $t('TT0159') }}
            span(class="text-body2 text-grey-600 font-bold") {{ hiddenWorkflowStageList.length }}
          f-scrollbar-container(class="h-full px-2")
            div(class="flex flex-col gap-2")
              workflow-stage-hidden-card(
                v-for="workflowStage in hiddenWorkflowStageList"
                :key="workflowStage.workflowStageId"
                :workflowStage="workflowStage"
                @workflowStageShow="showWorkflowStage"
                @workflowStageRename="renameWorkflowStage"
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
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import overlayscrollbars from 'overlayscrollbars'
import useThreadBoardStore from '@/stores/threadBoard'
import ThreadCard from '@/components/threadBoard/ThreadCard.vue'
import WorkflowStageColumn from '@/components/threadBoard/WorkflowStageColumn.vue'
import workflowStageCreate from '@/components/threadBoard/WorkflowStageCreate.vue'
import WorkflowStageHiddenCard from './WorkflowStageHiddenCard.vue'
import type FScrollbarContainer from '@frontier/ui-component/src/FScrollbarContainer/FScrollbarContainer.vue'
import type {
  WorkflowStageId,
  WorkflowStageMoveAllThreadsPayload,
} from '@/types'
import type { DigitalThreadBase } from '@frontier/platform-web-sdk'

const store = useStore()
const threadBoardStore = useThreadBoardStore()
const {
  loading,
  isDefaultWorkflowStageExpanded,
  isHiddenWorkflowListExpanded,
  defaultWorkflowStage,
  draggableWorkflowStageList,
  defaultWorkflowStageThreadList,
  creatingWorkflowStageThreadList,
  hiddenWorkflowStageList,
  workflowStageMenu,
  isCreatingWorkflowStage,
  creatingGhostWorkflowStage,
  haveCreateWorkflowStagePermission,
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
  renameWorkflowStage,
  moveWorkflowStageList,
  showWorkflowStage,
  hideWorkflowStage,
  deleteWorkflowStage,
  sortCreatingWorkflowStage,
} = threadBoardStore

const horizontalScrollContainer = ref<HTMLDivElement>()
const activeWorkflowStageId = ref<WorkflowStageId | null>(null)
const draggingThreadCardId = ref<number | null>(null)

const user = computed(() => store.getters['user/user'])
const isZh = computed(() => user.value.locale === 'zh-TW')

const workflowStageDragOptions = computed(() => ({
  itemKey: 'workflowStageId',
  forceFallback: true,
  scrollSensitivity: 40,
  scrollSpeed: 7,
  animation: 250,
  group: 'workflowStage',
  disabled: false,
  ghostClass: 'vue-draggable-thread-board',
}))

const threadCardDragOptions = computed(() => ({
  itemKey: 'digitalThreadSideId',
  forceFallback: true,
  scrollSensitivity: 60,
  scrollSpeed: 7,
  animation: 250,
  group: 'thread',
  ghostClass: 'vue-draggable-thread-board',
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
    baseClass.push('bg-primary-50 hover:bg-primary-50')
  } else {
    baseClass.push('hover:bg-grey-150')
  }

  return baseClass
})

const handleWorkflowStageListChange = (e: any) => {
  const { element, oldIndex, newIndex } = e.moved
  moveWorkflowStageList(element.workflowStageId, oldIndex, newIndex)
}

const handleWorkflowStageMoveAllThreads = (
  v: WorkflowStageMoveAllThreadsPayload
) => {
  activeWorkflowStageId.value = null
  moveWorkflowStageAllThreads(v)
}

const handleMove = (e: any) => {
  const rawId = e.to.dataset.workflowStageId
  if (rawId === 'creatingWorkflowStage') {
    activeWorkflowStageId.value = rawId
    return
  }
  activeWorkflowStageId.value = Number(e.to.dataset.workflowStageId)
}

const handleUpdate = (e: any) => {
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

const handleDragStart = (
  e: any,
  workflowStageId: WorkflowStageId,
  scrollContainer?: InstanceType<typeof FScrollbarContainer>
) => {
  const digitalThreadSideId = e.item.__draggable_context.element
    .digitalThreadSideId as number
  draggingThreadCardId.value = digitalThreadSideId
  if (scrollContainer?.rootElement) {
    scrollContainer.rootElement.style.zIndex = '1'
  }
  activeWorkflowStageId.value = workflowStageId
  displayGrabbingCursor()
}

const displayGrabbingCursor = () => {
  document.documentElement.classList.add('vue-draggable-thread-board-grabbing')
}

const removeGrabbingCursor = () => {
  document.documentElement.classList.remove(
    'vue-draggable-thread-board-grabbing'
  )
}

const handleDragEnd = (
  scrollContainer?: InstanceType<typeof FScrollbarContainer>
) => {
  if (scrollContainer?.rootElement) {
    scrollContainer.rootElement.style.zIndex = '0'
  }
  activeWorkflowStageId.value = null
  draggingThreadCardId.value = null
  removeGrabbingCursor()
}

const handleWorkflowStageMenuMouseEnter = (id: number) => {
  activeWorkflowStageId.value = id
}

const handleWorkflowStageMenuMouseLeave = (id: number) => {
  if (activeWorkflowStageId.value === id) {
    activeWorkflowStageId.value = null
  }
}

const isThreadCardDragging = (thread: DigitalThreadBase) => {
  return thread.digitalThreadSideId === draggingThreadCardId.value
}

onMounted(() => {
  if (!horizontalScrollContainer.value) {
    throw new Error('horizontalScrollContainer undefined')
  }

  overlayscrollbars(horizontalScrollContainer.value, {
    overflowBehavior: {
      x: 'scroll',
      y: 'hidden',
    },
  })
})
</script>

<style>
.vue-draggable-thread-board-ghost {
  opacity: 0.5;
}

.vue-draggable-thread-board-grabbing * {
  cursor: grabbing !important;
}
</style>
