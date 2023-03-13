<template lang="pug">
div(class="relative w-full rounded-md drop-shadow-8 overflow-hidden")
  div(
    class="absolute top-0 left-0 w-1 h-full"
    :class="{ 'bg-forestgreen-300': sticker.addTo === EXTERNAL, 'bg-grey-300': sticker.addTo === INTERNAL }"
  )
  div(class="px-5 py-3 bg-grey-0")
    //- Header
    div(class="flex items-center justify-between")
      sticker-label-add-to(:addTo="sticker.addTo")
      div(class="flex items-center gap-x-4")
        div(class="group flex items-center gap-x-1 cursor-pointer")
          f-svg-icon(
            iconName="sticker"
            size="20"
            :tooltip="$t('TT0094')"
            class="text-grey-300 group-hover:text-primary-400"
          )
          span(class="text-body2 group-hover:text-primary-400") {{ sticker.childStickerList.length }}
        div(class="group flex items-center gap-x-1 cursor-pointer")
          f-svg-icon(
            iconName="tag"
            size="20"
            :tooltip="$t('TT0096')"
            class="text-grey-300 group-hover:text-primary-400"
          )
          span(class="text-body2 group-hover:text-primary-400") {{ sticker.tagList.length }}
        div(class="group flex items-center gap-x-1 cursor-pointer")
          f-svg-icon(
            iconName="star"
            size="20"
            :tooltip="$t('TT0098')"
            class="text-grey-300 group-hover:text-primary-400"
          )
        div(class="group flex items-center gap-x-1 cursor-pointer")
          f-popper(placement="left")
            template(#trigger="{ isExpand }")
              f-svg-icon(
                iconName="more_horiz"
                size="20"
                :tooltip="$t('TT0098')"
                class="text-grey-300 group-hover:text-primary-400"
                :class="{ '!text-primary-400': isExpand }"
              )
            template(#content)
              f-list
                f-list-item {{ $t('TT0055') }}
    //- Content
    div(class="py-5 box-content")
      sticker-text-viewer(:content="sticker.content" :addTo="sticker.addTo")
    div(class="flex items-center gap-x-2")
      f-avatar(
        :imageUrl="avatar"
        :type="sticker.addTo === EXTERNAL ? 'org' : 'user'"
        :labelColor="sticker.creatorUnitLabelColor"
        size="sm"
      )
      p(class="text-caption text-grey-900 font-bold leading-1.6") {{ creator }}
        span(class="text-caption text-grey-300 font-normal") ・{{ $dayjs.unix(sticker.createDate).format('MMM DD, YYYY [at] hh:mm A') }}
</template>

<script setup>
import { computed } from 'vue'
import StickerLabelAddTo from '@/components/sticker/StickerLabelAddTo.vue'
import StickerTextViewer from '@/components/sticker/stickerTextEditor/StickerTextViewer.vue'
import { STICKER_ADD_TO } from '@/utils/constants.js'

const { EXTERNAL, INTERNAL } = STICKER_ADD_TO

const props = defineProps({
  sticker: {
    type: Object,
    required: true,
  },
})

const avatar = computed(() => {
  return props.sticker.addTo === EXTERNAL
    ? props.sticker.creatorUnitLogo
    : props.sticker.creatorAvatar
})
const creator = computed(() => {
  return props.sticker.addTo === EXTERNAL
    ? props.sticker.creatorUnitName
    : props.sticker.creator
})
</script>
