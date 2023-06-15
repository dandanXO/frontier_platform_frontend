<template lang="pug">
div(
  class="w-full h-15 px-9 flex items-center gap-x-4"
  :class="[hasContainer ? getContainerColor : '']"
)
  f-svg-icon(:iconName="NOTIFY_TYPE_ICON[notifyType]" size="24" class="text-grey-900")
  p(class="flex-grow flex items-center gap-x-7 text-body1/1.6 text-grey-900")
    span(v-if="!!title" class="font-bold flex-shrink-0") {{ title }}
    span(v-if="!!messageText" class="line-clamp-1 !leading-1.6") {{ messageText }}
    component(v-else :is="messageComponent")
  button(
    v-if="!!action"
    class="outline-none px-6 py-2 hover:bg-grey-0/80 rounded text-grey-900 text-body1"
    @click="action.handler"
    :class="action.classes"
  ) {{ action.text }}
  div(
    v-if="hasCloseButton"
    class="w-8 h-8 flex-shrink-0 flex items-center justify-center hover:bg-grey-0/80 rounded-full"
    @click="$emit('close')"
  )
    f-svg-icon(iconName="clear" size="24" class="text-grey-900 cursor-pointer")
</template>

<script lang="ts">
export default {
  name: 'FBanner',
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Component } from 'vue'
import type { Action } from '../../FNotify'
import { NOTIFY_TYPE, NOTIFY_TYPE_ICON } from '../../constants'

export interface NotifyBannerProps {
  notifyType?: NOTIFY_TYPE
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
  hasContainer?: boolean
}

defineEmits<{
  (e: 'close'): void
}>()

const props = withDefaults(defineProps<NotifyBannerProps>(), {
  notifyType: NOTIFY_TYPE.WARNING,
  hasCloseButton: true,
  hasContainer: true,
})

const getContainerColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.INFO:
      return 'bg-cyan-0'
    case NOTIFY_TYPE.SUCCESS:
      return 'bg-primary-50'
    case NOTIFY_TYPE.WARNING:
      return 'bg-yellow-0'
    case NOTIFY_TYPE.ALERT:
      return 'bg-red-0'
  }
  throw new Error('unexpected notify type')
})
</script>
