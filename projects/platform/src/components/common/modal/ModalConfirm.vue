<template lang="pug">
div(
  class="fixed inset-0 z-modal-confirm w-screen h-screen bg-grey-900/40 flex justify-center items-center"
  @click="closeModalConfirm"
  data-cy="modal-confirm"
)
  div(
    class="w-[min(416px,calc(100vw_-_80px))] max-h-125 min-h-30 md:min-h-54 px-4 md:px-8 py-4 md:py-6 bg-grey-0 rounded flex flex-col shadow-32"
    :class="[theme === THEME.DARK ? 'bg-grey-800' : 'bg-grey-0']"
    @click.stop
  )
    div(
      class="h-9 pb-1 md:pb-3.5 flex items-center gap-x-1 md:gap-x-3"
      data-cy="modal-confirm-title"
    )
      f-svg-icon(:iconName="getIconName" :class="[getIconColor]" size="22")
      p(
        class="text-body2 md:text-body1 font-bold"
        :class="[theme === THEME.DARK ? 'text-grey-100' : 'text-grey-900']"
      ) {{ header }}
    f-scrollbar-container(class="max-h-92.5 flex-grow pl-6.5 md:pl-8.5")
      p(
        v-if="!!contentText"
        class="text-caption md:text-body2 leading-1.6"
        :class="[theme === THEME.DARK ? 'text-grey-250' : 'text-grey-600']"
      ) {{ contentText }}
      component(v-else :is="contentComponent")
    div(class="h-11.5 pt-3 flex justify-between")
      p(class="flex items-center text-caption leading-1.6")
        span(v-if="!!noteText" v-html="noteText")
        component(v-else :is="noteComponent")
      div(class="grid grid-flow-col gap-x-2.5")
        f-button(
          v-if="textBtnText !== ''"
          :theme="theme"
          size="sm"
          type="text"
          @click="textHandler"
        ) {{ textBtnText }}
        f-button(
          v-if="secondaryBtnText !== ''"
          :theme="theme"
          size="sm"
          type="secondary"
          @click="secondaryHandler"
        ) {{ secondaryBtnText }}
        f-button(
          v-if="primaryBtnText !== ''"
          :theme="theme"
          size="sm"
          type="primary"
          @click="primaryHandler"
          data-cy="modal-confirm-primary"
        ) {{ primaryBtnText }}
</template>

<script setup>
import { NOTIFY_TYPE, THEME } from '@/utils/constants'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
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
