<template lang="pug">
div(class="flex items-center h-9.5")
  sticker-create-creator-info(:addFrom="props.addFrom" :addTo="props.addTo")
  div(
    class="flex-shrink-0 w-7 h-7 bg-grey-0 border border-grey-150 flex items-center justify-center rounded mr-1.5"
    @click="emit('mentionTrigger')"
    :class="[addTo === STICKER_ADD_TO.EXTERNAL ? 'text-grey-150 pointer-events-none' : 'text-grey-900 cursor-pointer']"
  )
    f-svg-icon(iconName="mention" size="16")
  div(
    class="flex-shrink-0 w-7 h-7 bg-grey-0 border border-grey-150 flex items-center justify-center rounded mr-4 cursor-pointer"
    @click="emit('tagInputTrigger')"
  )
    f-svg-icon(
      iconName="tag"
      size="16"
      class="text-grey-900"
      :tooltipMessage="$t('TT0053')"
    )
  f-button(
    size="sm"
    :disabled="addButtonDisabled"
    @click="emit('addButtonClick')"
  ) {{ $t('UU0035') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STICKER_ADD_TO } from '@/utils/constants'
import StickerCreateCreatorInfo from '@/components/sticker/StickerCreateCreatorInfo.vue'

const props = defineProps<{
  addButtonDisabled: boolean
  addTo: number
  addFrom: any
  tagList: string[]
}>()

const emit = defineEmits<{
  (e: 'addButtonClick'): void
  (e: 'mentionTrigger'): void
  (e: 'tagInputTrigger'): void
  (e: 'update:tagList', v: any): void
}>()

const addTo = computed(() => props.addTo)
</script>

<style scoped></style>
