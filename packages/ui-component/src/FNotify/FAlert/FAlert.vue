<template lang="pug">
div(class="flex flex-row items-center gap-3 p-3 rounded-lg" :class="[bgColor[type]]")
  f-svg-icon(:iconName="iconMap[type]" :class="iconColor[type]")
  div(class="flex flex-col gap-1 text-sm")
    p(class="font-bold" :class="primaryTextColor[type]" v-if="title") {{ title }}
    p(class="text-primary-inverse" v-if="desc") {{ desc }}
    slot(name="content")
</template>

<script lang="ts">
export enum TYPE {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
  SUCCESS = 'success',
}

export interface Props {
  type: TYPE
  title?: string
  desc?: string
}

export default {
  name: 'FAlert',
}
</script>

<script setup lang="ts">
defineProps<Props>()

const iconMap = {
  [TYPE.INFO]: 'info',
  [TYPE.WARNING]: 'warning',
  [TYPE.ERROR]: 'cancel',
  [TYPE.CRITICAL]: 'cancel_outline',
  [TYPE.SUCCESS]: 'success',
}

const iconColor = {
  [TYPE.INFO]: 'text-info-solid',
  [TYPE.WARNING]: '',
  [TYPE.ERROR]: 'text-critical-solid',
  [TYPE.CRITICAL]: '',
  [TYPE.SUCCESS]: '',
}

const primaryTextColor = {
  [TYPE.INFO]: 'text-info-solid',
  [TYPE.WARNING]: '',
  [TYPE.ERROR]: 'text-black',
  [TYPE.CRITICAL]: 'text-critical-text',
  [TYPE.SUCCESS]: '',
}

const bgColor = {
  [TYPE.INFO]: 'bg-info',
  [TYPE.WARNING]: '',
  [TYPE.ERROR]: 'bg-critical',
  [TYPE.CRITICAL]: 'bg-critical',
  [TYPE.SUCCESS]: '',
}
</script>
