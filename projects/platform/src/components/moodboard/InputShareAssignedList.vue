<template lang="pug">
div(class="flex flex-col")
  f-input-text(
    v-model:textValue="targetNumber"
    :placeholder="placeholder"
    :hintError="errorMsg"
    :button="{ type: 'primary', icon: 'add' }"
    @click:button="addToTargetList"
  )
  f-scrollbar-container(v-if="innerInputShareList.length > 0" class="flex-grow mt-5")
    div(class="grid gap-y-3")
      div(
        v-for="(item, index) in innerInputShareList"
        :key="index"
        class="flex items-center py-2 pl-2 pr-4 gap-x-3 hover:bg-grey-100"
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
import type {
  ShareOGTarget,
  ShareEmailTarget,
} from '@frontier/platform-web-sdk'
import { SHARE_WITH_TYPE } from '@/utils/constants'

const props = defineProps<{
  type: SHARE_WITH_TYPE
  placeholder: string
  inputShareList: ShareOGTarget[] | ShareEmailTarget[]
  callbackGetTarget: (
    targetNumber: string
  ) => Promise<ShareOGTarget | ShareEmailTarget>
}>()

const emit = defineEmits<{
  (e: 'update:inputShareList', v: ShareOGTarget[] | ShareEmailTarget[]): void
}>()

const innerInputShareList = computed({
  get: () => props.inputShareList,
  set: (v) => emit('update:inputShareList', v),
})

const { t } = useI18n()
const targetNumber = ref('')
const errorMsg = ref('')

const addToTargetList = async () => {
  const frozenTargetValue = targetNumber.value?.trim() || ''
  if (!inputValidator.required(frozenTargetValue)) {
    return (errorMsg.value = t('WW0002'))
  }
  if (
    props.type === SHARE_WITH_TYPE.USER &&
    !inputValidator.emailFormat(frozenTargetValue)
  ) {
    return (errorMsg.value = t('WW0044'))
  }

  try {
    const target = await props.callbackGetTarget(targetNumber.value)
    innerInputShareList.value.push(target)
    targetNumber.value = ''
  } catch (error: any) {
    const code = error.code as string

    switch (code) {
      case 'ERR0062':
        return (errorMsg.value = t('WW0158'))
      case 'ERR0063':
        return (errorMsg.value = t('WW0160'))
      case 'ERR0064':
        return (errorMsg.value = t('WW0161'))
      case 'ERR0065':
        return (errorMsg.value = t('WW0159'))
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
