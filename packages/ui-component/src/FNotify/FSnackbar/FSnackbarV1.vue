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
</style>

<template lang="pug">
transition(name="v1")
  div(
    v-if="isShowSnackbar"
    ref="refContainer"
    :key="id"
    class="fixed left-0 right-0 z-flash-msg px-9 bottom-5"
    @mouseenter="clearTimer"
    @mouseleave="setTimer"
  )
    div(
      ref="refSnackbar"
      class="flex mx-auto w-fit items-start rounded gap-x-4 shadow-16 px-4"
      :class="[getContainerPaddingY, bgColor]"
    )
      f-svg-icon(
        :iconName="NOTIFY_TYPE_ICON[notifyType]"
        :size="getIconSize"
        :class="[getIconColor, 'mt-[3px]']"
      )
      div(
        class="flex-grow"
        :class="[getMessageMinHeight, !shouldBeNextLine && display === DISPLAY.FLEX ? 'flex items-start gap-x-4' : '']"
      )
        div(class="self-center flex-grow" :class="[getFontSize, textColor]")
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
        iconName="clear"
        :size="getIconSize"
        class="cursor-pointer text-grey-100 hover:text-primary-300 mt-[3px]"
      )
</template>

<script lang="ts">
export default {
  name: 'FSnackbarV1',
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
