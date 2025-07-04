<style lang="scss" scoped>
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
transition(name="v2")
  div(
    v-if="isShowSnackbar"
    ref="refContainer"
    :key="id"
    class="fixed left-0 right-0 z-flash-msg px-9 top-[40px]"
    @mouseenter="clearTimer"
    @mouseleave="setTimer"
  )
    div(
      ref="refSnackbar"
      class="flex mx-auto w-[512px] items-start rounded-lg gap-x-3 shadow-[0px_0px_8px_0px_rgba(19,20,20,0.10),_0px_4px_8px_0px_rgba(19,20,20,0.05)] px-3"
      :class="[getContainerPaddingY, computedBgColor, bgColor === 'bg-grey-800' ? 'bg-green-50-v1' : bgColor]"
    )
      div(
        class="flex items-center justify-center w-10 h-10 rounded-full grow-1"
        :class="getIconBgColor"
        :style="{ 'min-width': 42 + 'px', 'min-height': 42 + 'px' }"
      )
        f-svg-icon(
          :iconName="NOTIFY_TYPE_ICON[notifyType]"
          :size="getIconSize"
          :class="getIconColor"
        )
      div(
        class="flex-grow"
        :class="[getMessageMinHeight, !shouldBeNextLine && display === DISPLAY.FLEX ? 'flex items-start gap-x-4' : '']"
      )
        div(
          class="self-center flex-grow text-sm font-normal"
          :class="[getFontSize, textColor === 'text-grey-100' ? 'text-grey-900-v1' : textColor]"
        )
          p(
            v-if="!!title"
            class="flex-shrink-0 text-base font-bold text-grey-950-v1"
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
        iconName="clear"
        :size="getIconSize"
        class="cursor-pointer text-grey-900-v1 hover:text-grey-700-v1"
      )
</template>

<script lang="ts">
export default {
  name: 'FSnackbarV2',
}
</script>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue'
import type { Component } from 'vue'
import type { Action } from '../../types'
import { NOTIFY_TYPE, NOTIFY_TYPE_ICON, SIZE, DISPLAY } from '../../constants'
import type { NotifySnackbarProps } from './FSnackbar.vue'

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
})

const computedBgColor = computed(() => {
  // V2 且 bgColor 為預設時，根據 notifyType 決定顏色
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
      return props.bgColor
  }
})

const doesItWillClose = computed(() => {
  if (!props.hasCloseButton) {
    return true
  }
  return props.willClose
})

const getContainerPaddingY = computed(() => {
  switch (props.size) {
    case SIZE.SM:
      return 'py-2'
    case SIZE.MD:
      return 'py-3'
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

const getIconColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.INFO:
      return 'text-cyan-400'
    case NOTIFY_TYPE.SUCCESS:
      return 'text-green-700-v1'
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
  if (doesItWillClose.value) {
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
