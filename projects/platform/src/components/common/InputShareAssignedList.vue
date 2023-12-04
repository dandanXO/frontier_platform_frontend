<template lang="pug">
div(class="flex flex-col")
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
  f-scrollbar-container(class="flex-grow")
    div(class="grid gap-y-5")
      div(
        v-for="(item, index) in innerInputShareList"
        :key="item.number"
        class="flex items-center gap-x-3"
      )
        img(v-if="item.unitLogo" :src="item.unitLogo" class="w-9 h-9 rounded-full")
        div(v-else class="w-9 h-9 rounded-full border-grey-250 border border-dashed")
        div(class="text-body2 flex-grow")
          p(class="text-grey-900 line-clamp-1") {{ item.unitName }}
          p(v-if="item.number" class="text-grey-250") {{ item.number }}
        p(
          class="text-body2 text-grey-250 pr-2.5 cursor-pointer"
          @click="removeTarget(index)"
        ) {{ $t('FF0060') }}
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { inputValidator } from '@frontier/lib'
import { type ShareTarget, ShareToType } from '@frontier/platform-web-sdk'

const props = defineProps<{
  inputShareList: ShareTarget[]
  callbackGetTarget: (targetNumber: string) => Promise<ShareTarget>
}>()

const emit = defineEmits<{
  (e: 'update:inputShareList', v: ShareTarget[]): void
}>()

const innerInputShareList = computed({
  get: () => props.inputShareList,
  set: (v) => emit('update:inputShareList', v),
})

const { t } = useI18n()
const targetNumber = ref('')
const errorMsg = ref('')

const addToTargetList = async () => {
  const frozenTargetValue = targetNumber.value.trim()
  if (!inputValidator.required(frozenTargetValue)) {
    return (errorMsg.value = t('WW0002'))
  }
  const existedTarget = innerInputShareList.value.find(
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

  try {
    const target = await props.callbackGetTarget(targetNumber.value)
    innerInputShareList.value.push(target)
    targetNumber.value = ''
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

const removeTarget = (index: number) =>
  innerInputShareList.value.splice(index, 1)

watch(
  () => targetNumber.value,
  () => (errorMsg.value = '')
)
</script>
