<template lang="pug">
div(
  ref="refInfobar"
  class="px-4 py-3 flex items-start gap-x-4 rounded"
  :class="[{ 'bg-grey-50': hasContainer, border: hasBorder }, hasBorder ? getBorderColor : '']"
)
  f-svg-icon(
    :iconName="NOTIFY_TYPE_ICON[notifyType]"
    size="16"
    :class="getIconColor"
    class="mt-[3px]"
  )
  div(
    class="flex-grow min-h-5.5"
    :class="[!shouldBeNextLine && display === DISPLAY.FLEX ? 'flex items-start gap-x-4' : '']"
  )
    div(class="flex-grow self-center text-grey-600 text-caption/1.6")
      p(v-if="!!title" class="font-bold flex-shrink-0") {{ title }}
      p(v-if="!!messageText" ref="refMessage") {{ messageText }}
      p(v-else ref="refMessage")
        slot
    button(
      v-if="!!action"
      @click="action.handler"
      class="outline-none text-cyan-500 hover:text-cyan-700 text-caption/1.6 cursor-pointer"
      :class="[action.classes, { 'px-2': !shouldBeNextLine && display === DISPLAY.FLEX }]"
    ) {{ action.text }}
  f-svg-icon(
    v-if="hasCloseButton"
    @click="$emit('close')"
    iconName="clear"
    size="16"
    class="text-grey-100 hover:text-primary-300 cursor-pointer mt-[3px]"
  )
</template>

<script lang="ts">
export default {
  name: 'FInfobar',
}
</script>

<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { Action } from '../../FNotify'
import { NOTIFY_TYPE, NOTIFY_TYPE_ICON, DISPLAY } from '../../constants'

export interface NotifyInfobarProps {
  notifyType?: NOTIFY_TYPE
  display?: DISPLAY
  title?: string
  /**
   * when `messageText` has a value, `slot:default` wouldn't work
   */
  messageText?: string
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

const props = withDefaults(defineProps<NotifyInfobarProps>(), {
  notifyType: NOTIFY_TYPE.INFO,
  display: DISPLAY.FLEX,
  hasCloseButton: false,
  hasContainer: true,
})

const getIconColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.INFO:
      return 'text-grey-600'
    case NOTIFY_TYPE.TIPS:
      return 'text-cyan-400'
    case NOTIFY_TYPE.WARNING:
      return 'text-yellow-500'
    case NOTIFY_TYPE.CRITICAL:
      return 'text-red-400'
  }

  throw new Error('unexpected notify type')
})

const hasBorder = computed(() => props.notifyType !== NOTIFY_TYPE.INFO)
const getBorderColor = computed(() => {
  switch (props.notifyType) {
    case NOTIFY_TYPE.TIPS:
      return 'border-cyan-100'
    case NOTIFY_TYPE.WARNING:
      return 'border-yellow-200'
    case NOTIFY_TYPE.CRITICAL:
      return 'border-red-100'
  }

  throw new Error('unexpected notify type')
})

const infobarObserver = ref<ResizeObserver>()
const refInfobar = ref<HTMLElement>()
const refMessage = ref<HTMLElement>()
const shouldBeNextLine = ref(false)
const checkMessageLine = () => {
  const lineHeight = 19.2 // text-caption/1.6 => 12 * 1.6 => 19.2
  const height = refMessage.value!.clientHeight
  if (lineHeight < height) {
    // more than one line
    shouldBeNextLine.value = true
  } else {
    shouldBeNextLine.value =
      refInfobar.value!.getBoundingClientRect().width < 340
  }
}

onMounted(() => {
  checkMessageLine()
  infobarObserver.value = new ResizeObserver(checkMessageLine)
  refInfobar.value && infobarObserver.value.observe(refInfobar.value)
})
onBeforeUnmount(() => {
  refInfobar.value && infobarObserver.value?.unobserve(refInfobar!.value)
})
</script>
