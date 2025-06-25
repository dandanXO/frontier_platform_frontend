<style lang="scss" scoped>
.v1-enter-active,
.v1-leave-active {
  transition: all 0.2s ease-in;
}

.v1-leave-to {
  opacity: 0;
}

.v1-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.v2-enter-active,
.v2-leave-active {
  transition: all 0.2s ease-in;
}

.v2-leave-to {
  opacity: 0;
}

.v2-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
</style>

<template lang="pug">
transition(:name="version || 'v1'")
  div(
    v-if="isShowSnackbar"
    ref="refContainer"
    :key="id"
    class="fixed left-0 right-0 z-flash-msg px-9"
    :class="[version === VERSION.V2 ? 'top-10' : 'bottom-5']"
    @mouseenter="clearTimer"
    @mouseleave="setTimer"
  )
    div(
      ref="refSnackbar"
      class="flex mx-auto"
      :class="[getContainerPaddingY, computedBgColor, version === VERSION.V2 ? 'w-[512px] items-start rounded-lg gap-x-3 shadow-[0px_0px_8px_0px_rgba(19,20,20,0.10),_0px_4px_8px_0px_rgba(19,20,20,0.05)] px-3' : 'w-fit items-start rounded gap-x-4 shadow-16 px-4']"
    )
      div(
        :class="version === VERSION.V2 ? `${getIconBgColor} rounded-full h-10 w-10 min-h-10 min-w-10 flex items-center justify-center` : ''"
      )
        f-svg-icon(
          :iconName="NOTIFY_TYPE_ICON[notifyType]"
          :size="getIconSize"
          :class="[getIconColor, version === VERSION.V2 ? '' : 'mt-[3px]']"
        )
      div(
        class="flex-grow"
        :class="[getMessageMinHeight, !shouldBeNextLine && display === DISPLAY.FLEX ? 'flex items-start gap-x-4' : '']"
      )
        div(
          class="self-center flex-grow"
          :class="[getFontSize, version === VERSION.V2 && textColor === 'text-grey-100' ? 'text-grey-900-v1' : textColor, version === VERSION.V2 ? 'font-light text-sm' : '']"
        )
          p(
            v-if="!!title"
            class="flex-shrink-0 font-bold"
            :class="[title ? 'mb-1' : '']"
          ) {{ title }}
          p(v-if="!!messageText") {{ messageText }}
          component(v-else :is="messageComponent")
        button(
          v-if="!!action"
          @click="action.handler"
          class="outline-none cursor-pointer text-cyan-300 hover:text-cyan-100"
          :class="[getFontSize, action.classes, { 'px-2': !shouldBeNextLine && display === DISPLAY.FLEX }]"
        ) {{ action.text }}
      f-svg-icon(
        v-if="hasCloseButton"
        @click="close"
        :iconName="version === VERSION.V2 ? 'close_medium' : 'clear'"
        :size="getIconSize"
        class="cursor-pointer"
        :class="version === VERSION.V2 ? 'text-grey-900-v1 hover:text-green-700-v1 ' : 'text-grey-100 hover:text-primary-300 mt-[3px]'"
      )
</template>

<script lang="ts">
export default {
  name: 'FSnackbar',
}
</script>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import type { Component } from 'vue'
import type { Action } from '../../types'
import {
  NOTIFY_TYPE,
  NOTIFY_TYPE_ICON,
  SIZE,
  DISPLAY,
  VERSION,
} from '../../constants'

export interface NotifySnackbarProps {
  id?: number
  isShowSnackbar: boolean
  notifyType?: NOTIFY_TYPE
  size?: SIZE
  display?: DISPLAY
  title?: string
  /**
   * One of  `messageText` or `messageComponent` must have a value
   */
  messageText?: string
  /**
   * One of  `messageText` or `messageComponent` must have a value
   */
  messageComponent?: Component
  /**
   * ```
   * {
   *    text: string
   *    handler(): void
   *    classes?: string
   * }
   * ```
   */
  action?: Action
  hasCloseButton?: boolean
  /**
   * Whether close automatically, after a `delay`
   */
  willClose?: boolean
  /**
   * How much time(ms) after it will close
   */
  delay?: number
  // cusomerClass
  bgColor?: string
  textColor?: string
  version?: VERSION
}

const emit = defineEmits<{
  (e: 'update:isShowSnackbar', isShowSnackbar: boolean): void
}>()

const props = withDefaults(defineProps<NotifySnackbarProps>(), {
  id: 0,
  isShowSnackbar: false,
  notifyType: NOTIFY_TYPE.SUCCESS,
  size: SIZE.MD,
  display: DISPLAY.FLEX,
  hasCloseButton: true,
  willClose: true,
  delay: 4000,
  bgColor: 'bg-grey-800',
  textColor: 'text-grey-100',
  version: VERSION.V1,
})
const getContainerPaddingY = computed(() => {
  switch (props.size) {
    case SIZE.SM:
      return props.version === VERSION.V2 ? 'py-2' : 'py-3'
    case SIZE.MD:
      return props.version === VERSION.V2 ? 'py-3' : 'py-4'
  }

  throw new Error('unexpected size type')
})

const getIconSize = computed(() => {
  switch (props.size) {
    case SIZE.SM:
      return '16'
    case SIZE.MD:
      return '24'
  }

  throw new Error('unexpected size type')
})
const computedBgColor = computed(() => {
  // V2 且 bgColor 為預設時，根據 notifyType 決定顏色
  if (props.version === VERSION.V2 && props.bgColor === 'bg-grey-800') {
    switch (props.notifyType) {
      case NOTIFY_TYPE.WARNING:
        return 'bg-yellow-50-v1'
      case NOTIFY_TYPE.ALERT:
        return 'bg-red-50-v1'
      case NOTIFY_TYPE.SUCCESS:
        return 'bg-green-50-v1'
      case NOTIFY_TYPE.INFO:
        return 'bg-cyan-50-v1'
      default:
        return 'bg-green-50-v1'
    }
  }
  return props.bgColor
})
const getIconColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.INFO:
      return 'text-cyan-400'
    case NOTIFY_TYPE.SUCCESS:
      return props.version === VERSION.V2
        ? 'text-green-700-v1'
        : 'text-primary-300'
    case NOTIFY_TYPE.WARNING:
      return 'text-yellow-500'
    case NOTIFY_TYPE.ALERT:
      return 'text-red-300'
  }

  throw new Error('unexpected notify type')
})

const getIconBgColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.INFO:
      return 'bg-cyan-100-v1'
    case NOTIFY_TYPE.SUCCESS:
      return 'bg-green-100-v1'
    case NOTIFY_TYPE.WARNING:
      return 'bg-yellow-100-v1'
    case NOTIFY_TYPE.ALERT:
      return 'bg-red-100-v1'
  }

  throw new Error('unexpected notify type')
})

const getFontSize = computed(() => {
  switch (props.size) {
    case SIZE.SM:
      return 'text-caption/1.6'
    case SIZE.MD:
      return 'text-body1/1.6'
  }

  throw new Error('unexpected notify type')
})

const getMessageMinHeight = computed(() => {
  switch (props.size) {
    case SIZE.SM:
      return 'min-h-5.5'
    case SIZE.MD:
      return 'min-h-7.5'
  }

  throw new Error('unexpected notify type')
})

const rootObserver = ref<ResizeObserver>()
const refContainer = ref<HTMLElement>()
const refSnackbar = ref<HTMLElement>()
const shouldBeNextLine = ref(false)

watch(
  () => props.isShowSnackbar,
  async () => {
    rootObserver.value = new ResizeObserver(() => {
      shouldBeNextLine.value =
        props.isShowSnackbar &&
        refContainer.value!.clientWidth - 36 * 2 <= // 36 is space between screen and snack bar
          refSnackbar.value!.clientWidth
    })
    if (props.isShowSnackbar) {
      await nextTick()
      refSnackbar.value && rootObserver.value.observe(refSnackbar.value)
    } else {
      refSnackbar.value && rootObserver.value?.unobserve(refSnackbar!.value)
    }
  }
)

/**
 * when `isShowSnackbar` turns true, call setTimer
 * and when mouse hovers on it clear the timer and reset timer when mouse leaves
 */
type Timeout = ReturnType<typeof setTimeout>
const timer = ref<Timeout>()
const setTimer = () => {
  clearTimer()
  if (props.willClose) {
    timer.value = setTimeout(close, props.delay)
  }
}
const clearTimer = () => {
  clearTimeout(timer.value)
}
watch(() => props.id, setTimer)
const close = () => {
  clearTimer()
  emit('update:isShowSnackbar', false)
}
</script>
