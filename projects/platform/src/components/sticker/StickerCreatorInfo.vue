<template lang="pug">
div(class="flex flex-shrink min-w-0 items-center gap-x-2")
  f-avatar(
    :imageUrl="avatar"
    :type="avatarType"
    :labelColor="labelColor"
    size="sm"
    :hasBorder="false"
  )
  div(class="flex-shrink min-w-0")
    f-tooltip-standard(isNotFitWidth :tooltipMessage="creatorInfoText")
      template(#slot:tooltip-trigger)
        p(
          class="whitespace-nowrap text-ellipsis overflow-hidden text-caption text-grey-900 font-bold leading-1.6"
        ) {{ creatorInfoText }}
span(v-if="createDate" class="flex-shrink-0 text-caption text-grey-300 font-normal") ・{{ toStandardFormat(createDate) }}
</template>

<script setup lang="ts">
import useStickerCreatorInfo from '@/composables/useStickerCreatorInfo'
import { toStandardFormat } from '@frontier/utils'

const props = defineProps<{
  sticker: object
}>()

const { avatar, avatarType, labelColor, creatorInfoText, createDate } =
  useStickerCreatorInfo(props.sticker)
</script>

<style scoped></style>
