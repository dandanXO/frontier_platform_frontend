<template lang="pug">
div(
  class="fixed inset-0 flex items-center justify-center w-screen h-screen z-modal-confirm bg-grey-900/40"
  @click="closeModalConfirm"
  :data-cy="testId"
)
  div(
    class="flex flex-col min-h-30 md:min-h-54 bg-grey-0 rounded-xl shadow-32"
    :class="[theme === THEME.DARK ? 'bg-grey-800' : 'bg-grey-0', version === 'v2' ? 'w-[min(512px,calc(100vw_-_80px))] items-center p-6' : 'max-h-125 w-[min(416px,calc(100vw_-_80px))] px-4 md:px-8 py-4 md:py-6']"
    @click.stop
  )
    div(v-if="version === 'v2'" class="flex justify-end w-full")
      button(@click="closeModalConfirm")
        f-svg-icon(iconName="close_medium" size="24" class="text-grey-900-v1")
    div(
      class="flex items-center"
      :class="[version === 'v2' ? 'flex-col gap-y-6 mb-2' : 'h-9 flex-row pb-1 md:pb-3.5 gap-x-1 md:gap-x-3']"
      data-cy="modal-confirm-title"
    )
      div(
        v-if="version === 'v2'"
        class="flex items-center justify-center rounded-full min-h-26 min-w-26 h-26 w-26 bg-red-50-v1"
      )
        f-svg-icon(:iconName="getIconName" :class="[getIconColor]" size="48")
      f-svg-icon(
        v-else
        :iconName="getIconName"
        :class="[getIconColor]"
        size="22"
      )
      p(
        class="font-bold"
        :class="[theme === THEME.DARK ? 'text-grey-100' : 'text-grey-900', version === 'v2' ? 'text-xl ' : 'text-body2 md:text-body1 ']"
      ) {{ header }}
    div(v-if="version === 'v2'" class="mb-6 text-sm")
      p(v-if="!!contentText") {{ contentText }}
      component(v-else :is="contentComponent")
    f-scrollbar-container(v-else class="max-h-92.5 flex-grow pl-6.5 md:pl-8.5")
      p(
        v-if="!!contentText"
        class="text-sm whitespace-pre-line"
        :class="[theme === THEME.DARK ? 'text-grey-250' : 'text-grey-600']"
      ) {{ contentText }}
      component(v-else :is="contentComponent")
    div(
      class="flex justify-between"
      :class="[version === 'v2' ? 'flex flex-col items-center w-full gap-y-2' : 'h-11.5 pt-3']"
    )
      p(
        class="flex items-center text-caption leading-1.6"
        v-if="version === 'v1' || (noteText && noteComponent)"
      )
        span(v-if="!!noteText" v-html="noteText")
        component(v-else :is="noteComponent")
      div(
        class=""
        :class="[version === 'v2' ? 'w-full flex gap-3' : 'grid grid-flow-col gap-x-2.5']"
      ) 
        f-button(
          v-if="textBtnText !== ''"
          :theme="theme"
          size="sm"
          type="text"
          @click="textHandler"
          :class="[version === 'v2' ? 'flex-1 px-3 py-2 !font-bold text-sm' : '', version === 'v2' ? getTextBtnColor : '']"
        ) {{ textBtnText }}
        f-button(
          v-if="secondaryBtnText !== ''"
          :theme="theme"
          size="sm"
          type="secondary"
          @click="secondaryHandler"
          :class="[version === 'v2' ? 'flex-1 px-3 py-2 !font-bold text-sm' : '', version === 'v2' ? getSecondayBtnColor : '']"
        ) {{ secondaryBtnText }}
        f-button(
          v-if="primaryBtnText !== ''"
          :theme="theme"
          size="sm"
          type="primary"
          @click="primaryHandler"
          data-cy="modal-confirm-primary"
          :class="[version === 'v2' ? 'flex-1 px-3 py-2 !font-bold text-sm' : '', version === 'v2' ? getPrimaryBtnColor : '']"
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
  testId: {
    type: String,
    default: 'modal-confirm',
  },
  version: {
    type: String,
    default: 'v1',
  },
})

const { INFO, WARNING, SUCCESS, ALERT } = NOTIFY_TYPE

const getIconName = computed(() => {
  const map = {
    [INFO]: 'error_outline',
    [WARNING]: 'error_outline',
    [SUCCESS]: 'check_circle_outline',
    [ALERT]: props.version === 'v2' ? 'delete_forever' : 'warning_amber_round',
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

const getPrimaryBtnColor = computed(() => {
  const map = {
    [INFO]: 'bg-green-500-v1 hover:bg-green-600-v1',
    [WARNING]: 'bg-green-500-v1 hover:bg-green-600-v1',
    [SUCCESS]: 'bg-green-500-v1 hover:bg-green-600-v1',
    [ALERT]: 'bg-red-500-v1 hover:bg-red-600-v1',
  }
  return map[props.type]
})

const getSecondayBtnColor = computed(() => {
  const map = {
    [INFO]: 'border-green-200-v1 text-green-500-v1',
    [WARNING]: 'border-green-200-v1 text-green-500-v1',
    [SUCCESS]: 'border-green-200-v1 text-green-500-v1',
    [ALERT]: 'border-green-200-v1 text-green-500-v1',
  }
  return map[props.type]
})

const getTextBtnColor = computed(() => {
  const map = {
    [INFO]: 'text-green-500-v1',
    [WARNING]: 'text-green-500-v1',
    [SUCCESS]: 'text-green-500-v1',
    [ALERT]: 'text-green-500-v1',
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
