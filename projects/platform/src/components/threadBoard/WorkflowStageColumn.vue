<template lang="pug">
div
  div(
    v-show="isExpanded"
    class="w-82.5 flex-shrink-0 h-full max-h-full rounded-md flex flex-col overflow-hidden"
    :class="[{ 'bg-primary-50 outline-primary-300 outline outline-1 -outline-offset-1': active && !isEditingName }, isEditingName ? 'bg-grey-0 border border-dashed border-grey-250' : 'bg-grey-100']"
  )
    div(v-if="isEditingName" class="px-2.5 py-4 flex flex-col gap-2")
      f-input-text(:placeholder="$t('TT0148')" v-model:textValue="currentName")
      div(class="flex flex-row gap-2")
        f-button(
          size="md"
          type="primary"
          :disabled="!isNameValid"
          @click="handleSaveEdit"
        ) {{ $t('UU0018') }}
        f-button(size="md" type="text" @click="doneEdit") {{ $t('UU0002') }}
    div(v-else class="p-2")
      div(class="h-8 pl-3 flex flex-row justify-between items-center gap-2")
        div(class="handle max-w-full flex-1 flex flex-row gap-2 items-center")
          div(class="max-w-full flex-1 flex flex-row items-center gap-3")
            div(class="max-w-full flex flex-row items-center gap-3")
              f-svg-icon(
                v-if="workflowStage.isDefault"
                iconName="unsorted"
                size="20"
                class="text-grey-400"
              )
              f-tooltip-standard(
                :tooltipMessage="workflowStage.workflowStageName"
              )
                template(#slot:tooltip-trigger)
                  span(
                    class="text-body2 text-grey-900 font-bold flex-shrink-1 line-clamp-1"
                  ) {{ workflowStage.workflowStageName }}
              span(class="text-body2 leading-1.4 text-grey-600") {{ workflowStage.digitalThreadList.length }}
        div(class="w-8 h-8 flex items-center justify-center flex-shrink-0")
          f-popper(
            :class="{ 'pointer-events-none': threadBoardStore.loading }"
            placement="bottom-end"
          )
            template(#trigger="{ isExpand }")
              icon-button(iconName="more_horiz" :active="isExpand")
            template(#content="{ collapsePopper }")
              f-contextual-menu(
                :menuTree="menuTree"
                @click:menu="collapsePopper"
              )
        div(
          v-if="workflowStage.isDefault"
          class="w-8 h-8 flex items-center justify-center"
        )
          icon-button(
            iconName="double_arrow_left"
            @click.stop="handleWorkflowStageCollapse"
          )
    div(class="h-full" :class="{ 'px-1 pb-2': isEditingName || active }")
      div(
        class="relative h-full"
        :class="{ 'w-79.5 pt-1 bg-grey-100 rounded': isEditingName, 'bg-primary-50 outline-primary-300 outline outline-1 -outline-offset-1': active && isEditingName }"
        @mouseenter="isHoverDragArea = true"
        @mouseleave="isHoverDragArea = false"
      )
        f-scrollbar-container(
          :ref="(el) => (scrollContainer = el)"
          class="h-full"
          @scrollInfoChange="handleScroll"
        )
          slot(
            :scrollContainer="scrollContainer"
            :disabled="!isHoverDragArea && !isFirefox"
          )
        div(
          v-if="showUpperBound && !(isEditingName && active)"
          class="absolute top-0 left-0 h-[1px] w-full bg-grey-200"
        )
        div(
          v-if="showBottomBound && !(isEditingName && active)"
          class="absolute bottom-0 left-0 h-[1px] w-full bg-grey-200"
        )
  div(
    v-show="!isExpanded"
    class="h-full w-8 p-1.5 flex flex-col items-center cursor-pointer"
  )
    div(class="flex flex-col items-center gap-2")
      div(v-if="haveUnreadThread" class="w-5 h-5 flex items-center justify-center")
        p(class="bg-primary-400 w-2 h-2 rounded-full") 
      f-svg-icon(v-else iconName="double_arrow_right" size="20")
      p(
        class="flex gap-2 font-bold [writing-mode:vertical-lr] rotate-180"
        :class="haveUnreadThread ? 'text-primary-500' : 'text-grey-800'"
      )
        span(
          class="text-caption flex items-center"
          :class="{ 'rotate-90 leading-2': !isEn }"
        ) {{ workflowStage.digitalThreadList.length }}
        span(
          class="text-body2 flex items-center"
          :class="{ 'rotate-180 [letter-spacing:.1rem]': !isEn }"
        ) {{ workflowStage.workflowStageName }}
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import IconButton from '@/components/threadBoard/IconButton.vue'
import type overlayscrollbars from 'overlayscrollbars'
import type { FScrollbarContainer } from '@frontier/ui-component'
import type { WorkflowStage } from '@frontier/platform-web-sdk'
import type {
  WorkflowStageRenamePayload,
  WorkflowStageMoveAllThreadsPayload,
  WorkflowStageMenuItem,
} from '@/types'
import useThreadBoardStore from '@/stores/threadBoard'
import useCurrentUnit from '@/composables/useCurrentUnit'
import useNameEditor from '@/composables/useNameEditor'
import { getBoldInterpolationMessageComponent } from '@/utils/render'
import { isFirefox } from '@/utils/browser'

const emit = defineEmits<{
  (e: 'workflowStageCollapse'): void
  (e: 'workflowStageHide', id: number): void
  (e: 'workflowStageRename', v: WorkflowStageRenamePayload): void
  (
    e: 'workflowStageMoveAllThreads',
    v: WorkflowStageMoveAllThreadsPayload
  ): void
  (e: 'workflowStageDelete', id: number): void
  (e: 'workflowStageMenuMouseEnter', id: number): void
  (e: 'workflowStageMenuMouseLeave', id: number): void
}>()

const props = withDefaults(
  defineProps<{
    workflowStage: WorkflowStage
    active?: boolean
    isExpanded?: boolean
    workflowStageMenu: WorkflowStageMenuItem[]
  }>(),
  { active: false, isExpanded: true }
)

const store = useStore()
const threadBoardStore = useThreadBoardStore()
const { t } = useI18n()
const { ogName } = useCurrentUnit()

const workflowStageName = computed(() => props.workflowStage.workflowStageName)
const { isEditingName, currentName, isNameValid, startEdit, doneEdit } =
  useNameEditor(workflowStageName)

const scrollContainer = ref<InstanceType<typeof FScrollbarContainer>>()
const showUpperBound = ref(false)
const showBottomBound = ref(false)
const isHoverDragArea = ref(false)

const user = computed(() => store.getters['user/user'])
const isEn = computed(() => user.value.locale === 'en-US')
const haveUnreadThread = computed(() => {
  return props.workflowStage.digitalThreadList.some(
    (thread) => thread.unreadStickerQty > 0
  )
})

const menuTree = computed(() => ({
  width: 'w-66',
  blockList: (() => {
    const blockList = []
    const renameBlock = {
      menuList: [
        {
          title: t('RR0302'),
          icon: 'create',
          disabled: props.workflowStage.isDefault,
          clickHandler: startEdit,
        },
      ],
    }

    const moveAllDisabled = props.workflowStage.digitalThreadList.length <= 0
    const mapToMenuTreeItem = (w: WorkflowStageMenuItem) => {
      const disabled = w.id === props.workflowStage.workflowStageId
      return {
        title: w.name,
        disabled,
        description: disabled ? t('TT0144') : '',
        clickHandler: () => {
          emit('workflowStageMoveAllThreads', {
            sourceWorkflowStageId: props.workflowStage.workflowStageId,
            targetWorkflowStageId: w.id,
          })
        },
        mouseEnterHandler: () => emit('workflowStageMenuMouseEnter', w.id),
        mouseLeaveHandler: () => emit('workflowStageMenuMouseLeave', w.id),
      }
    }

    const moveAllThreadsBlock = {
      menuList: [
        {
          title: t('TT0143'),
          icon: 'move',
          disabled: moveAllDisabled,
          tooltipMessage: moveAllDisabled ? t('TT0161') : null,
          width: 'w-60',
          blockList: [
            {
              menuList: props.workflowStageMenu
                .filter((item) => item.isDefault)
                .map(mapToMenuTreeItem),
            },
            {
              menuList: props.workflowStageMenu
                .filter((m) => !m.isDefault)
                .map(mapToMenuTreeItem),
            },
          ],
        },
      ],
    }

    const showDeleteBlock = {
      menuList: (() => {
        const menuList = []

        if (threadBoardStore.haveHideShowWorkflowStagePermission) {
          const disabled = !props.workflowStage.canHide
          menuList.push({
            title: t('TT0152'),
            icon: 'hideeye',
            tooltipMessage: disabled ? t('TT0155') : null,
            tooltipContentComponent: !disabled
              ? getBoldInterpolationMessageComponent('TT0158', {
                  currentThreadBoard: ogName.value,
                }).value
              : null,
            disabled,
            clickHandler: () =>
              emit('workflowStageHide', props.workflowStage.workflowStageId),
          })
        }

        if (threadBoardStore.haveDeleteWorkflowStagePermission) {
          menuList.push({
            title: t('TT0153'),
            icon: 'delete',
            tooltipMessage: props.workflowStage.canDelete ? null : t('TT0155'),
            disabled: !props.workflowStage.canDelete,
            clickHandler: () => {
              emit('workflowStageDelete', props.workflowStage.workflowStageId)
            },
          })
        }

        return menuList
      })(),
    }

    blockList.push(moveAllThreadsBlock)
    if (props.workflowStage.isDefault) {
      return blockList
    }
    if (threadBoardStore.haveEditWorkflowStagePermission) {
      blockList.push(renameBlock)
    }
    if (showDeleteBlock.menuList.length > 0) {
      blockList.push(showDeleteBlock)
    }

    return blockList
  })(),
}))

const handleWorkflowStageCollapse = () => {
  emit('workflowStageCollapse')
}

const handleScroll = (scrollInfo: overlayscrollbars.ScrollInfo) => {
  showUpperBound.value = scrollInfo.ratio.y > 0
  if (scrollInfo.handleLengthRatio.y < 1 && scrollInfo.ratio.y !== 1) {
    showBottomBound.value = true
  } else {
    showBottomBound.value = false
  }
}

const handleSaveEdit = () => {
  emit('workflowStageRename', {
    workflowStageId: props.workflowStage.workflowStageId,
    workflowStageName: currentName.value,
  })
  doneEdit()
}
</script>

<style scoped></style>
