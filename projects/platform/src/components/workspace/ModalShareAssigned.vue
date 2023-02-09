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
          v-model:textValue="target"
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
            div(v-for="(item, index) in targetList" class="flex items-center gap-x-3")
              img(v-if="item.logo" :src="item.logo" class="w-9 h-9 rounded-full")
              div(
                v-else
                class="w-9 h-9 rounded-full border-grey-250 border border-dashed"
              )
              div(class="text-body2 flex-grow")
                p(class="text-grey-900 line-clamp-1") {{ item.name }}
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
          :rules="[(v) => v.length > 1000 && $t('WW0073')]"
        )
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { SHARE_TARGET_TYPE } from '@/utils/constants'
import inputValidator from '@/utils/input-validator'

const props = defineProps({
  workspaceNodeId: {
    type: [String, Number],
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()

const target = ref('')
const formData = reactive({
  isCanClone: false,
  isCanDownloadU3M: false,
  messages: '',
})
const errorMsg = ref('')
const targetList = ref([])

const addToTargetList = async () => {
  const frozenTargetValue = target.value.trim()
  if (!inputValidator.required(frozenTargetValue)) {
    return (errorMsg.value = t('WW0002'))
  }
  const existedTarget = targetList.value.find(
    ({ name, number }) =>
      name === frozenTargetValue || number === frozenTargetValue
  )
  if (existedTarget) {
    const { ORG, GROUP, EMAIL } = SHARE_TARGET_TYPE
    switch (existedTarget.type) {
      case ORG:
        return (errorMsg.value = t('WW0058'))
      case GROUP:
        return (errorMsg.value = t('WW0059'))
      case EMAIL:
        return (errorMsg.value = t('WW0057'))
    }
  }

  const temp = await store.dispatch('workspace/getShareTarget', {
    workspaceNodeId: props.workspaceNodeId,
    target: frozenTargetValue,
  })
  targetList.value.push(temp)
  target.value = ''
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('workspace/assignedShare', {
    workspaceNodeId: props.workspaceNodeId,
    targetList: targetList.value,
    ...formData,
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModal')
  store.dispatch('helper/pushFlashMessage', t('RR0157'))
}

const removeTarget = (index) => targetList.value.splice(index, 1)

watch(
  () => target.value,
  () => (errorMsg.value = '')
)
</script>
