<template lang="pug">
div(
  class="rounded-md box-border p-5 flex flex-col gap-y-4 justify-between shadow-2 bg-center bg-cover"
  :style="{ backgroundImage: `url(${coverImg})` }"
)
  h6(
    class="text-h6 font-bold"
    :class="[textColor === BannerColorEnum.WHITE ? 'text-grey-0' : 'text-grey-900']"
  ) {{ title }}
  component(:is="contentComponent")
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type SlotContent, BannerColorEnum } from '@frontier/platform-web-sdk'
import generateContentComponent from '@/utils/generateContentComponent'

const props = defineProps<{
  title: string
  coverImg: string
  textColor: BannerColorEnum
  slotContent: SlotContent
}>()

const contentComponent = computed(() => {
  const { content, contentValue } = props.slotContent
  const textColor =
    props.textColor === BannerColorEnum.WHITE ? 'text-grey-0' : 'text-grey-900'
  return generateContentComponent(
    content,
    contentValue,
    ['w-full', 'text-body2', textColor],
    ['text-body2', textColor, 'underline']
  )
})
</script>
