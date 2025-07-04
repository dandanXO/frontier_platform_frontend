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
f-snackbar-v1(
  v-if="version === VERSION.V1"
  v-bind="$props"
  @update:isShowSnackbar="emit('update:isShowSnackbar', $event)"
)
f-snackbar-v2(
  v-else
  v-bind="$props"
  @update:isShowSnackbar="emit('update:isShowSnackbar', $event)"
)
</template>

<script lang="ts">
export default {
  name: 'FSnackbar',
}
</script>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { Action } from '../../types'
import { NOTIFY_TYPE, SIZE, DISPLAY, VERSION } from '../../constants'
import FSnackbarV1 from './FSnackbarV1.vue'
import FSnackbarV2 from './FSnackbarV2.vue'

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

withDefaults(defineProps<NotifySnackbarProps>(), {
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
</script>
