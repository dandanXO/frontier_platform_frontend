<template lang="pug">
div(class="p-3 flex flex-row rounded-lg gap-3" :class="bgColor[type]")
  f-svg-icon(:iconName="iconMap[type]" :class="primaryTextColor[type]")
  div(class="flex flex-col gap-1 text-sm")
    p(class="font-bold" :class="primaryTextColor[type]" v-if="title") {{ title }}
    p(class="text-primary-inverse" v-if="desc") {{ desc }}
    slot(name="content")
</template>

<script lang="ts">
export enum TYPE {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'error',
  SUCCESS = 'success',
}
export default {
  name: 'FAlert',
}
</script>

<script setup lang="ts">
defineProps<{
  type: TYPE
  title?: string
  desc?: string
}>()

const iconMap = {
  [TYPE.INFO]: 'info',
  [TYPE.WARNING]: 'warning',
  [TYPE.CRITICAL]: 'error',
  [TYPE.SUCCESS]: 'success',
}

const primaryTextColor = {
  [TYPE.INFO]: 'text-info-solid',
  [TYPE.WARNING]: '',
  [TYPE.CRITICAL]: '',
  [TYPE.SUCCESS]: '',
}

const bgColor = {
  [TYPE.INFO]: 'bg-info',
  [TYPE.WARNING]: '',
  [TYPE.CRITICAL]: '',
  [TYPE.SUCCESS]: '',
}
</script>
