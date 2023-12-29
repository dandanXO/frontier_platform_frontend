<template lang="pug">
modal-behavior(
  :header="$t('RR0155')"
  :primaryBtnText="$t('RR0079')"
  :primaryBtnDisabled="targetList.length === 0 || formData.messages.length > 1000"
  @click:primary="assignedShare"
)
  div(class="w-197.5")
    div(class="h-72.5 grid grid-cols-2 gap-x-7.5")
      input-share-assigned-list(v-model:inputShareList="targetList" :callbackGetTarget="getTarget")
      div
        f-input-container(:label="$t('FF0032')" class="pb-5")
          f-input-checkbox(
            binary
            v-model:inputValue="formData.isCanDownloadU3M"
            :label="$t('FF0033')"
            class="pb-2.5"
            iconSize="20"
          )
          f-input-checkbox(
            binary
            v-model:inputValue="formData.isCanClone"
            :label="$t('FF0034')"
            iconSize="20"
          )
        f-input-textarea(
          v-model:textValue="formData.messages"
          :label="$t('RR0146')"
          minHeight="min-h-43.5"
          :rules="[(v: string) => v.length > 1000 && $t('WW0142', { limitNumber: 1000 })]"
        )
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import type { ShareTarget } from '@frontier/platform-web-sdk'
import { useWorkspaceStore } from '@/stores/workspace'
import InputShareAssignedList from '@/components/common/InputShareAssignedList.vue'

const props = defineProps<{
  nodeId: number
}>()

const { t } = useI18n()
const { ogBaseWorkspaceApi, addWorkspaceNodeShareAssigned } =
  useWorkspaceStore()
const store = useStore()
const notify = useNotifyStore()

const formData = reactive({
  isCanClone: false,
  isCanDownloadU3M: false,
  messages: '',
})
const targetList = ref<ShareTarget[]>([])

const getTarget = async (targetNumber: string) => {
  const { data } = await ogBaseWorkspaceApi(
    'getWorkspaceNodeShareAssignedTarget',
    {
      nodeId: props.nodeId,
      targetNumber,
    }
  )
  return data.result.target
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await addWorkspaceNodeShareAssigned({
    nodeId: props.nodeId,
    targetList: targetList.value,
    ...formData,
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  notify.showNotifySnackbar({ messageText: t('RR0157') })
}
</script>
