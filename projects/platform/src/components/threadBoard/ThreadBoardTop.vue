<template lang="pug">
div(
  class="h-13 flex-shrink-0 flex flex-row justify-between items-center px-7.5 border-b border-grey-150"
)
  div(class="flex flex-row items-center gap-2")
    f-svg-icon(iconName="sticker_thread" size="20" class="text-primary-400")
    span(class="font-bold text-body1 text-grey-900") {{ $t('TT0133') }}
    span(class="text-body2 text-grey-600") {{ $t('RR0068', { number: threadQty }) }}
  div(class="flex flex-row items-center gap-4")
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useThreadBoardStore from '@/stores/threadBoard'

const threadBoardStore = useThreadBoardStore()
const { threadQty } = storeToRefs(threadBoardStore)
</script>

<style scoped></style>
