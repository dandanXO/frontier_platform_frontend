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
    div
      f-input-text(
        v-model:textValue="target"
        :label="$t('RR0156')"
        :placeholder="$t('RR0245')"
        :hintError="errorMsg"
        :button="{ type: 'primary', icon: 'add' }"
        @click:button="addToTargetList"
        class="mb-5"
      )
      f-scrollbar-container(class="h-32.5")
        div(class="grid gap-y-5")
          div(v-for="(item, index) in targetList" class="flex items-center gap-x-3")
            img(v-if="item.logo" :src="item.logo" class="w-9 h-9 rounded-full")
            div(v-else class="w-9 h-9 rounded-full border-grey-250 border border-dashed")
            div(class="text-body2 flex-grow")
              p(class="text-grey-900 line-clamp-1") {{ item.name }}
              p(v-if="item.number" class="text-grey-250") {{ item.number }}
            p(
              class="text-body2 text-grey-250 pr-2.5 cursor-pointer"
              @click="removeTarget(index)"
            ) {{ $t('FF0060') }}
    f-input-textarea(
      v-model:textValue="message"
      :label="$t('RR0146')"
      :placeholder="$t('RR0202')"
      minHeight="min-h-43.5"
      :rules="[(v) => v.length > 1000 && $t('WW0073')]"
    )
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { useI18n } from 'vue-i18n'
import { SHARE_TARGET_TYPE } from '@/utils/constants'
import { inputValidator } from '@frontier/lib'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const target = ref('')
const message = ref('')
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
  try {
    const temp = await store.dispatch('moodboard/getMoodboardShareTarget', {
      target: frozenTargetValue,
    })
    targetList.value.push(temp)
    target.value = ''
  } catch (error) {
    const { code } = error

    switch (code) {
      case 'ERR0022':
        return (errorMsg.value = t('WW0055'))
      case 'ERR0023':
        return (errorMsg.value = t('WW0057'))
      case 'ERR0024':
        return (errorMsg.value = t('WW0058'))
      case 'ERR0025':
        return (errorMsg.value = t('WW0059'))
      default:
        throw error
    }
  }
}

const assignedShare = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('moodboard/shareMoodboard', {
    targetList: targetList.value,
    message: message.value,
  })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/closeModalBehavior')
  notify.showNotifySnackbar({ messageText: t('RR0157') })
}

const removeTarget = (index) => targetList.value.splice(index, 1)

watch(
  () => target.value,
  () => (errorMsg.value = '')
)
</script>
