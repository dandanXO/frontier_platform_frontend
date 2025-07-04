<template lang="pug">
div(
  class="fixed inset-0 z-modal-confirm w-screen h-screen bg-grey-900/40 flex justify-center items-center"
  @click="closeModalConfirm"
  :data-cy="testId"
)
  div(
    class="min-w-[512px] rounded-xl flex flex-col shadow-32 max-h-125 w-[min(416px,calc(100vw_-_80px))] p-6 gap-6 bg-grey-0"
    @click.stop
  )
    div(
      class="flex h-14 flex-row gap-x-1 border-b border-grey-200-v1 justify-between items-start"
      data-cy="modal-confirm-title"
    )
      //- f-svg-icon(:iconName="getIconName" :class="[getIconColor]" size="22")
      p(class="font-bold text-xl text-grey-950-v1") {{ header }}
      f-svg-icon(
        iconName="close_medium"
        size="24"
        class="text-grey-950-v1 cursor-pointer"
        @click="closeModalConfirm"
      )
    p(
      v-if="!!contentText"
      class="text-sm whitespace-pre-line text-center font-normal text-grey-900-v1"
    ) {{ contentText }}
    component(v-else :is="contentComponent")

    div(class="flex flex-row gap-x-3 justify-center") 
      f-button(
        v-if="textBtnText !== ''"
        size="sm"
        type="text"
        @click="textHandler"
        class="h-[40px] w-[178px]"
      ) {{ textBtnText }}
      f-button(
        v-if="secondaryBtnText !== ''"
        size="sm"
        type="secondary"
        @click="secondaryHandler"
        class="h-[40px] w-[178px] text-green-500-v1 border-green-200-v1 border !font-bold !text-sm hover:!text-green-500-v1"
      ) {{ secondaryBtnText }}
      f-button(
        v-if="primaryBtnText !== ''"
        size="sm"
        type="secondary"
        @click="primaryHandler"
        data-cy="modal-confirm-primary"
        class="h-[40px] w-[178px] text-white border-red-500-v1 !bg-red-500-v1 border !font-bold !text-sm hover:!text-white"
      ) {{ primaryBtnText }}
</template>

<script setup>
import { NOTIFY_TYPE } from '@/utils/constants'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    default: NOTIFY_TYPE.SUCCESS,
    validator: (v) =>
      Object.keys(NOTIFY_TYPE)
        .map((key) => NOTIFY_TYPE[key])
        .includes(v),
  },
  contentText: {
    type: String,
  },
  contentComponent: {
    type: Object,
  },
  noteText: {
    type: String,
  },
  noteComponent: {
    type: Object,
  },
  primaryBtnText: {
    type: String,
    default: '',
  },
  primaryBtnHandler: {
    type: Function,
  },
  closeAfterPrimaryBtnHandler: {
    type: Boolean,
    default: true,
  },
  afterPrimaryBtnHandler: {
    type: Function,
  },
  secondaryBtnText: {
    type: String,
    default: '',
  },
  secondaryBtnHandler: {
    type: Function,
  },
  closeAfterSecondaryBtnHandler: {
    type: Boolean,
    default: true,
  },
  afterSecondaryBtnHandler: {
    type: Function,
  },
  textBtnText: {
    type: String,
    default: '',
  },
  textBtnHandler: {
    type: Function,
  },
  closeAfterTextBtnHandler: {
    type: Boolean,
    default: true,
  },
  afterTextBtnHandler: {
    type: Function,
  },
  testId: {
    type: String,
    default: 'modal-confirm',
  },
})

const { INFO, WARNING, SUCCESS, ALERT } = NOTIFY_TYPE

const getIconName = computed(() => {
  const map = {
    [INFO]: 'error_outline',
    [WARNING]: 'error_outline',
    [SUCCESS]: 'check_circle_outline',
    [ALERT]: 'warning_amber_round',
  }
  return map[props.type]
})

const getIconColor = computed(() => {
  const map = {
    [INFO]: 'text-cyan-400',
    [WARNING]: 'text-yellow-500',
    [SUCCESS]: 'text-primary-400',
    [ALERT]: 'text-red-400',
  }
  return map[props.type]
})

const closeModalConfirm = () => store.dispatch('helper/closeModalConfirm')

const primaryHandler = async () => {
  !!props.primaryBtnHandler && (await props.primaryBtnHandler())
  props.closeAfterPrimaryBtnHandler && closeModalConfirm()
  !!props.afterPrimaryBtnHandler && (await props.afterPrimaryBtnHandler())
}
const secondaryHandler = async () => {
  !!props.secondaryBtnHandler && (await props.secondaryBtnHandler())
  props.closeAfterSecondaryBtnHandler && closeModalConfirm()
  !!props.afterSecondaryBtnHandler && (await props.afterSecondaryBtnHandler())
}
const textHandler = async () => {
  !!props.textBtnHandler && (await props.textBtnHandler())
  props.closeAfterTextBtnHandler && closeModalConfirm()
  !!props.afterTextBtnHandler && (await props.afterTextBtnHandler())
}
</script>
