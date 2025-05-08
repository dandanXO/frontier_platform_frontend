<template lang="pug">
div(class="p-3 flex flex-row rounded-lg gap-3 items-center" :class="[bgColor[type]]")
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
  [TYPE.SUCCESS]: 'success',
}

const iconColor = {
  [TYPE.INFO]: 'text-info-solid',
  [TYPE.WARNING]: '',
  [TYPE.ERROR]: 'text-critical-solid',
  [TYPE.SUCCESS]: '',
}

const primaryTextColor = {
  [TYPE.INFO]: 'text-info-solid',
  [TYPE.WARNING]: '',
  [TYPE.ERROR]: 'text-black',
  [TYPE.SUCCESS]: '',
}

const bgColor = {
  [TYPE.INFO]: 'bg-info',
  [TYPE.WARNING]: '',
  [TYPE.ERROR]: 'bg-critical',
  [TYPE.SUCCESS]: '',
}
</script>
