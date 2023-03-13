<template lang="pug">
div(
  @mouseenter="isHoverChildSticker = true"
  @mouseleave="isHoverChildSticker = false"
)
  //- Header
  div(class="flex items-center justify-between pb-2")
    div(
      class="flex items-center gap-x-1 text-grey-300"
      :class="{ '!text-grey-600': isHoverChildSticker }"
    )
      f-svg-icon(iconName="sticker")
      span(class="text-caption") {{ `#${childSticker.order}` }}
    div(class="flex items-center gap-x-4")
      div(
        class="group flex items-center gap-x-1 cursor-pointer text-grey-300"
        :class="{ '!text-grey-600': isHoverChildSticker && !isHoverIconTag && !isShowTagList, '!text-primary-400': isHoverIconTag || isShowTagList }"
        @mouseenter="isHoverIconTag = true"
        @mouseleave="isHoverIconTag = false"
        @click.stop="isShowTagList = !isShowTagList"
      )
        f-svg-icon(iconName="tag" size="20" :tooltip="$t('TT0096')")
        span(
          v-if="isHoverChildSticker || childSticker.tagList.length > 0"
          class="text-body2"
        ) {{ childSticker.tagList.length }}
      div(
        class="group flex items-center gap-x-1 cursor-pointer text-grey-300"
        :class="{ '!text-grey-600': isHoverChildSticker && !isHoverIconStar, '!text-primary-400': isHoverIconStar }"
        @mouseenter="isHoverIconStar = true"
        @mouseleave="isHoverIconStar = false"
        @click.stop
      )
        f-svg-icon(iconName="star" size="20" :tooltip="$t('TT0098')")
      div(
        class="group flex items-center gap-x-1 cursor-pointer text-grey-300"
        @mouseenter="isHoverIconMore = true"
        @mouseleave="isHoverIconMore = false"
        @click.stop
      )
        f-popper(placement="left")
          template(#trigger="{ isExpand }")
            f-svg-icon(
              iconName="more_horiz"
              size="20"
              :tooltip="$t('TT0098')"
              class="text-grey-300"
              :class="{ '!text-grey-600': isHoverChildSticker && !isHoverIconMore, '!text-primary-400': isHoverIconMore || isExpand }"
            )
          template(#content)
            f-list
              f-list-item {{ $t('TT0055') }}
  //- Content
  child-sticker-text-viewer(:content="childSticker.content")
  //- Tag List
  sticker-tag-list(
    ref="refStickerTagList"
    v-if="(childSticker.tagList.length !== 0 && isHoverIconTag) || isShowTagList"
    :stickerId="childSticker.stickerId"
    :stickerTagList="childSticker.tagList"
  )
  //- Footer
  div(
    v-if="!refStickerTagList?.isEditingTagList"
    class="flex items-center gap-x-2 pt-4"
    @click.stop
  )
    f-avatar(
      :imageUrl="avatar"
      :type="childSticker.addTo === EXTERNAL ? 'org' : 'user'"
      size="sm"
    )
    p(class="text-caption text-grey-900 font-bold leading-1.6") {{ creator }}
      span(class="text-caption text-grey-300 font-normal") ・{{ $dayjs.unix(childSticker.createDate).format('MMM DD, YYYY [at] hh:mm A') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import ChildStickerTextViewer from '@/components/sticker/stickerTextEditor/ChildStickerTextViewer.vue'
import StickerTagList from '@/components/sticker/StickerTagList.vue'
import { STICKER_ADD_TO } from '@/utils/constants.js'

const { EXTERNAL } = STICKER_ADD_TO

const props = defineProps({
  childSticker: {
    type: Object,
    required: true,
  },
})

const avatar = computed(() => {
  return props.childSticker.addTo === EXTERNAL
    ? props.childSticker.creatorUnitLogo
    : props.childSticker.creatorAvatar
})
const creator = computed(() => {
  return props.childSticker.addTo === EXTERNAL
    ? props.childSticker.creatorUnitName
    : props.childSticker.creator
})

const isHoverChildSticker = ref(false)
const isHoverIconTag = ref(false)
const isHoverIconStar = ref(false)
const isHoverIconMore = ref(false)

const isShowTagList = ref(false)
const refStickerTagList = ref(null)
</script>
