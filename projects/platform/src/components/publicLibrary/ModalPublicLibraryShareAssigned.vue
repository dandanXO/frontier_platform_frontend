<template lang="pug">
modal-behavior(
  :header="$t('RR0155')"
  :primaryBtnText="$t('RR0079')"
  :primaryBtnDisabled="targetList.length === 0"
  @click:primary="assignedShare"
)
  div(class="w-104.5")
    input-share-assigned-list(
      v-model:inputShareList="targetList"
      :callbackGetTarget="getTarget"
    )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import InputShareAssignedList from '@/components/common/InputShareAssignedList.vue'
import { usePublicLibraryStore } from '@/stores/publicLibrary'
import type { ShareTarget } from '@frontier/platform-web-sdk'

const props = defineProps<{
  nodeId: number
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const { ogBasePublicLibraryApi } = usePublicLibraryStore()
const targetList = ref<ShareTarget[]>([])

const getTarget = async (targetNumber: string) => {
  const { data } = await ogBasePublicLibraryApi(
    'getPublicLibraryNodeShareAssignedTarget',
    {
      nodeId: props.nodeId,
      targetNumber,
    }
  )
  return data.result.target
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await ogBasePublicLibraryApi('addPublicLibraryNodeShareAssigned', {
    nodeId: props.nodeId,
    targetList: targetList.value,
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  notify.showNotifySnackbar({ messageText: t('RR0157') })
}
</script>
