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
        slot(:item="item" :index="index" :removeTarget="removeTarget")
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { inputValidator } from '@frontier/lib'
import { SHARE_WITH_TYPE } from '@/utils/constants'

const props = defineProps<{
  type: SHARE_WITH_TYPE
  placeholder: string
  inputShareList: any[]
  callbackGetTarget: (targetNumber: string) => Promise<any>
}>()

const emit = defineEmits<{
  (e: 'update:inputShareList', v: any[]): void
  (e: 'addNew', v: any): void
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
    emit('addNew', target)
    targetNumber.value = ''
  } catch (error: any) {
    const code = error.code as string

    switch (code) {
      case 'ERR0062':
        return (errorMsg.value = t('WW0158'))
      case 'ERR0063':
        return (errorMsg.value = t('WW0160'))
      case 'ERR0064':
      case 'WW0057':
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
