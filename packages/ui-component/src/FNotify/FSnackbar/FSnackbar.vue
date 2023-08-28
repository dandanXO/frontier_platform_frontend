<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease-in;
}

.v-leave-to {
  opacity: 0;
}

.v-enter-from {
  transform: translateY(20px);
  opacity: 0;
}
</style>

<template lang="pug">
transition
  div(
    v-if="isShowSnackbar"
    ref="refContainer"
    :key="id"
    class="fixed z-flash-msg bottom-5 left-0 right-0 px-9"
    @mouseenter="clearTimer"
    @mouseleave="setTimer"
  )
    div(
      ref="refSnackbar"
      class="w-fit mx-auto px-4 flex items-start gap-x-4 rounded shadow-16 bg-grey-800"
      :class="getContainerPaddingY"
    )
      f-svg-icon(
        :iconName="NOTIFY_TYPE_ICON[notifyType]"
        :size="getIconSize"
        :class="getIconColor"
        class="mt-[3px]"
      )
      div(
        class="flex-grow"
        :class="[getMessageMinHeight, !shouldBeNextLine && display === DISPLAY.FLEX ? 'flex items-start gap-x-4' : '']"
      )
        div(class="flex-grow self-center text-grey-100" :class="getFontSize")
          p(v-if="!!title" class="font-bold flex-shrink-0") {{ title }}
          p(v-if="!!messageText") {{ messageText }}
          component(v-else :is="messageComponent")
        button(
          v-if="!!action"
          @click="action.handler"
          class="outline-none text-cyan-300 hover:text-cyan-100 cursor-pointer"
          :class="[getFontSize, action.classes, { 'px-2': !shouldBeNextLine && display === DISPLAY.FLEX }]"
        ) {{ action.text }}
      f-svg-icon(
        v-if="hasCloseButton"
        @click="close"
        iconName="clear"
        :size="getIconSize"
        class="text-grey-100 hover:text-primary-300 cursor-pointer mt-[3px]"
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
import { NOTIFY_TYPE, NOTIFY_TYPE_ICON, SIZE, DISPLAY } from '../../constants'

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
})

const getContainerPaddingY = computed(() => {
  switch (props.size) {
    case SIZE.SM:
      return 'py-3'
    case SIZE.MD:
      return 'py-4'
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

const getIconColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.INFO:
      return 'text-cyan-400'
    case NOTIFY_TYPE.SUCCESS:
      return 'text-primary-300'
    case NOTIFY_TYPE.WARNING:
      return 'text-yellow-500'
    case NOTIFY_TYPE.ALERT:
      return 'text-red-300'
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
