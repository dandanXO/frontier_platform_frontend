<template lang="pug">
div(
  class="h-12 w-full rounded border border-grey-150 shadow-4 p-2 flex flex-row items-center justify-between bg-grey-0"
)
  div(:key="workflowStage.workflowStageId" class="flex flex-row gap-3")
    span(class="text-body2 text-grey-900 font-bold flex items-center") {{ workflowStage.workflowStageName }}
    span(class="text-body2 text-grey-600 flex items-center") {{ workflowStage.digitalThreadList.length }}
  f-popper(
    :class="{ 'pointer-events-none': threadBoardStore.loading }"
    placement="bottom-end"
  )
    template(#trigger="{ isExpand }")
      icon-button(iconName="more_horiz" :active="isExpand")
    template(#content)
      f-contextual-menu(:menuTree="menuTree")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconButton from '@/components/threadBoard/IconButton.vue'
import useThreadBoardStore from '@/stores/threadBoard'
import type { WorkflowStage } from '@frontier/platform-web-sdk'

const props = defineProps<{
  workflowStage: WorkflowStage
}>()

const emit = defineEmits<{
  (e: 'workflowStageShow', id: number): void
}>()

const { t } = useI18n()
const threadBoardStore = useThreadBoardStore()

const menuTree = computed(() => ({
  width: 'w-50',
  blockList: [
    {
      menuList: (() => {
        const list = []
        if (threadBoardStore.haveHideShowWorkflowStagePermission) {
          list.push({
            title: t('TT0160'),
            icon: 'openeye',
            clickHandler: () => {
              emit('workflowStageShow', props.workflowStage.workflowStageId)
            },
          })
        }
        list.push({
          title: t('TT0151'),
          icon: 'create',
          clickHandler: () => {},
        })
        return list
      })(),
    },
  ],
}))
</script>

<style scoped></style>
