<template lang="pug">
modal-behavior(
  :header="$t('RR0155')"
  :primaryBtnText="$t('UU0096')"
  :primaryBtnDisabled="targetList.length === 0 || message.length > 1000"
  @click:primary="assignedShare"
  :secondaryBtnText="$t('UU0002')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="w-177.5 grid grid-cols-2 gap-x-7.5")
    input-share-assigned-list(
      v-model:inputShareList="targetList"
      :callbackGetTarget="getTarget"
    )
    f-input-textarea(
      v-model:textValue="message"
      :label="$t('RR0146')"
      :placeholder="$t('RR0202')"
      minHeight="min-h-43.5"
      :rules="[(v) => v.length > 1000 && $t('WW0073')]"
    )
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import type { ShareTarget } from '@frontier/platform-web-sdk'
import InputShareAssignedList from '@/components/common/InputShareAssignedList.vue'
import { useMoodboardStore } from '@/stores/moodboard'

export interface PropsModalMoodboardShare {
  moodboardId: number
}

const props = defineProps<PropsModalMoodboardShare>()

const { t } = useI18n()
const store = useStore()
const { ogBaseMoodboardApi } = useMoodboardStore()
const notify = useNotifyStore()
const message = ref('')
const targetList = ref<ShareTarget[]>([])

const getTarget = async (targetNumber: string) => {
  const { data } = await ogBaseMoodboardApi('getMoodboardShareTarget', {
    moodboardId: props.moodboardId,
    targetNumber,
  })

  return data.result.target
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await ogBaseMoodboardApi('addMoodboardShare', {
    moodboardId: props.moodboardId,
    targetList: targetList.value,
    message: message.value,
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModalBehavior')
  notify.showNotifySnackbar({ messageText: t('RR0157') })
}
</script>
