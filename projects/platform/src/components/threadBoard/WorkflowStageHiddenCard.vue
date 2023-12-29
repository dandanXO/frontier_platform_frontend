<template lang="pug">
div(class="w-full rounded border border-grey-150 shadow-4 p-2 bg-grey-0")
  div(v-if="isEditingName" class="px-1 flex flex-col gap-y-2")
    f-input-text(:placeholder="$t('TT0148')" v-model:textValue="currentName")
    div(class="flex flex-row gap-2")
      f-button(
        size="md"
        type="primary"
        :disabled="!isNameValid"
        @click="handleSaveEdit"
      ) {{ $t('UU0018') }}
      f-button(size="md" type="text" @click="doneEdit") {{ $t('UU0002') }}
  div(v-else class="h-8 flex flex-row items-center justify-between")
    div(:key="workflowStage.workflowStageId" class="flex flex-row gap-3")
      span(class="text-body2 text-grey-900 font-bold flex items-center") {{ workflowStage.workflowStageName }}
      span(class="text-body2 text-grey-600 flex items-center") {{ workflowStage.digitalThreadList.length }}
    f-popper(
      placement="bottom-end"
      :class="{ 'pointer-events-none': threadBoardStore.loading }"
    )
      template(#trigger="{ isExpand }")
        icon-button(iconName="more_horiz" :active="isExpand")
      template(#content)
        f-contextual-menu(:menuTree="menuTree")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WorkflowStage } from '@frontier/platform-web-sdk'
import useThreadBoardStore from '@/stores/threadBoard'
import IconButton from '@/components/threadBoard/IconButton.vue'
import type { WorkflowStageRenamePayload } from '@/types'
import useNameEditor from '@/composables/useNameEditor'

const props = defineProps<{
  workflowStage: WorkflowStage
}>()

const emit = defineEmits<{
  (e: 'workflowStageShow', id: number): void
  (e: 'workflowStageRename', v: WorkflowStageRenamePayload): void
}>()

const { t } = useI18n()
const threadBoardStore = useThreadBoardStore()

const workflowStageName = computed(() => props.workflowStage.workflowStageName)
const { isEditingName, currentName, isNameValid, startEdit, doneEdit } =
  useNameEditor(workflowStageName)

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
        if (threadBoardStore.haveEditWorkflowStagePermission) {
          list.push({
            title: t('RR0302'),
            icon: 'create',
            clickHandler: startEdit,
          })
        }
        return list
      })(),
    },
  ],
}))

const handleSaveEdit = () => {
  emit('workflowStageRename', {
    workflowStageId: props.workflowStage.workflowStageId,
    workflowStageName: currentName.value,
  })
  doneEdit()
}
</script>

<style scoped></style>
