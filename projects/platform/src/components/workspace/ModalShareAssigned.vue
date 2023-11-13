<template lang="pug">
modal-behavior(
  :header="$t('RR0155')"
  :primaryBtnText="$t('RR0079')"
  :primaryBtnDisabled="targetList.length === 0 || formData.messages.length > 1000"
  @click:primary="assignedShare"
)
  div(class="w-197.5")
    div(class="h-72.5 grid grid-cols-2 gap-x-7.5")
      div
        f-input-text(
          v-model:textValue="targetNumber"
          prependIcon="search"
          :label="$t('RR0156')"
          :placeholder="$t('RR0150')"
          :hintError="errorMsg"
          :button="{ type: 'primary', icon: 'add' }"
          @click:button="addToTargetList"
          class="mb-5"
        )
        f-scrollbar-container(class="h-51")
          div(class="grid gap-y-5")
            div(
              v-for="(item, index) in targetList"
              :key="item.number"
              class="flex items-center gap-x-3"
            )
              img(
                v-if="item.unitLogo"
                :src="item.unitLogo"
                class="w-9 h-9 rounded-full"
              )
              div(
                v-else
                class="w-9 h-9 rounded-full border-grey-250 border border-dashed"
              )
              div(class="text-body2 flex-grow")
                p(class="text-grey-900 line-clamp-1") {{ item.unitName }}
                p(v-if="item.number" class="text-grey-250") {{ item.number }}
              p(
                class="text-body2 text-grey-250 pr-2.5 cursor-pointer"
                @click="removeTarget(index)"
              ) {{ $t('FF0060') }}
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
          :rules="[(v: string) => v.length > 1000 && $t('WW0073')]"
        )
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import { inputValidator } from '@frontier/lib'
import { type ShareTarget, ShareToType } from '@frontier/platform-web-sdk'
import { useWorkspaceStore } from '@/stores/workspace'

const props = defineProps<{
  nodeId: number
}>()

const { t } = useI18n()
const { ogBaseWorkspaceApi, addWorkspaceNodeShareAssigned } =
  useWorkspaceStore()
const store = useStore()
const notify = useNotifyStore()

const targetNumber = ref('')
const formData = reactive({
  isCanClone: false,
  isCanDownloadU3M: false,
  messages: '',
})
const errorMsg = ref('')
const targetList = ref<ShareTarget[]>([])

const addToTargetList = async () => {
  const frozenTargetValue = targetNumber.value.trim()
  if (!inputValidator.required(frozenTargetValue)) {
    return (errorMsg.value = t('WW0002'))
  }
  const existedTarget = targetList.value.find(
    ({ unitName, number }) =>
      unitName === frozenTargetValue || number === frozenTargetValue
  )
  if (existedTarget) {
    const { ORG, GROUP, USER } = ShareToType
    switch (existedTarget.type) {
      case ORG:
        return (errorMsg.value = t('WW0058'))
      case GROUP:
        return (errorMsg.value = t('WW0059'))
      case USER:
        return (errorMsg.value = t('WW0057'))
    }
  }

  const res = await ogBaseWorkspaceApi('getWorkspaceNodeShareAssignedTarget', {
    nodeId: props.nodeId,
    targetNumber: targetNumber.value,
  })
  targetList.value.push(res.data.result.target)
  targetNumber.value = ''
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

const removeTarget = (index: number) => targetList.value.splice(index, 1)

watch(
  () => targetNumber.value,
  () => (errorMsg.value = '')
)
</script>
