<template lang="pug">
div(
  class="relative w-full rounded-md drop-shadow-8 overflow-hidden"
  @mouseenter="isHoverSticker = true"
  @mouseleave="isHoverSticker = false"
)
  div(
    class="absolute top-0 left-0 w-1 h-full"
    :class="{ 'bg-forestgreen-300': sticker.addTo === EXTERNAL, 'bg-grey-300': sticker.addTo === INTERNAL }"
  )
  //- Sticker
  div(
    class="px-5 pt-2.5 pb-3.5 bg-grey-0"
    @click="isExpandChildStickerList = !isExpandChildStickerList"
  )
    //- Header
    div(class="flex items-center justify-between pb-5")
      sticker-label-add-to(:addTo="sticker.addTo")
      div(class="flex items-center gap-x-4")
        div(
          class="group flex items-center gap-x-1 cursor-pointer text-grey-300"
          :class="{ '!text-grey-600': isHoverSticker && !isHoverIconSticker && !isExpandChildStickerList, '!text-primary-400': isHoverIconSticker || isExpandChildStickerList }"
          @mouseenter="isHoverIconSticker = true"
          @mouseleave="isHoverIconSticker = false"
        )
          f-svg-icon(iconName="sticker" size="20" :tooltip="$t('TT0094')")
          span(
            v-if="isHoverSticker || childStickerList.length > 0 || isExpandChildStickerList"
            class="text-body2"
          ) {{ childStickerList.length }}
        div(
          class="group flex items-center gap-x-1 cursor-pointer text-grey-300"
          :class="{ '!text-grey-600': isHoverSticker && !isHoverIconTag && !isShowTagList, '!text-primary-400': isHoverIconTag || isShowTagList }"
          @mouseenter="isHoverIconTag = true"
          @mouseleave="isHoverIconTag = false"
          @click.stop="isShowTagList = !isShowTagList"
        )
          f-svg-icon(iconName="tag" size="20" :tooltip="$t('TT0096')")
          span(
            v-if="isHoverSticker || sticker.tagList.length > 0 || isShowTagList"
            class="text-body2"
          ) {{ sticker.tagList.length }}
        div(
          class="group flex items-center gap-x-1 cursor-pointer text-grey-300"
          :class="{ '!text-grey-600': isHoverSticker && !isHoverIconStar, '!text-primary-400': isHoverIconStar }"
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
                :class="{ '!text-grey-600': isHoverSticker && !isHoverIconMore, '!text-primary-400': isHoverIconMore || isExpand }"
              )
            template(#content)
              f-list
                f-list-item {{ $t('TT0055') }}
    //- Content
    sticker-text-viewer(:content="sticker.content" :addTo="sticker.addTo")
    //- Tag List
    sticker-tag-list(
      ref="refStickerTagList"
      v-if="(sticker.tagList.length !== 0 && isHoverIconTag) || isShowTagList"
      :stickerId="sticker.stickerId"
      :stickerTagList="sticker.tagList"
    )
    //- Footer
    div(
      v-if="!refStickerTagList?.isEditingTagList"
      class="flex items-center gap-x-2 pt-5"
      @click.stop
    )
      f-avatar(
        :imageUrl="avatar"
        :type="sticker.addTo === EXTERNAL ? 'org' : 'user'"
        :labelColor="sticker.creatorUnitLabelColor"
        size="sm"
      )
      p(class="text-caption text-grey-900 font-bold leading-1.6") {{ creator }}
        span(class="text-caption text-grey-300 font-normal") ・{{ $dayjs.unix(sticker.createDate).format('MMM DD, YYYY [at] hh:mm A') }}
    //- Button - Add child sticker
    f-button(
      v-if="!refStickerTagList?.isEditingTagList && isHoverSticker && !isExpandChildStickerList"
      type="secondary"
      size="sm"
      prependIcon="add"
      class="w-full mt-2.5"
      @click="isCreatingChildSticker = true"
    ) {{ $t('TT0092') }}
  //- Child Sticker List
  div(v-if="isExpandChildStickerList" class="bg-grey-50 py-4 pl-12 pr-5")
    //- Empty state
    div(
      v-if="childStickerList.length === 0 && !isCreatingChildSticker"
      class="flex items-center gap-x-1"
    )
      f-svg-icon(iconName="sticker" size="16" class="text-grey-400")
      p(class="text-caption text-grey-400") {{ $t('TT0103') }}
    template(v-for="(childSticker, index) in childStickerList")
      child-sticker-card(:childSticker="childSticker")
      hr(v-if="index !== childStickerList.length - 1" class="text-grey-150 my-3.5")
    child-sticker-text-editor(
      v-if="isCreatingChildSticker"
      :stickerId="sticker.stickerId"
      :class="{ 'pt-3': childStickerList.length !== 0 }"
      @close="isCreatingChildSticker = false"
    )
    //- Button - Add child sticker
    div(
      v-if="isHoverSticker && isExpandChildStickerList && !isCreatingChildSticker"
      class="-ml-8 pt-2"
      @click="isCreatingChildSticker = true"
    )
      f-button(type="secondary" size="sm" prependIcon="add" class="w-full") {{ $t('TT0092') }}
</template>

<script setup>
import { ref, computed } from 'vue'
import StickerLabelAddTo from '@/components/sticker/StickerLabelAddTo.vue'
import StickerTextViewer from '@/components/sticker/stickerTextEditor/StickerTextViewer.vue'
import StickerTagList from '@/components/sticker/StickerTagList.vue'
import ChildStickerTextEditor from '@/components/sticker/stickerTextEditor/ChildStickerTextEditor.vue'
import ChildStickerCard from '@/components/sticker/ChildStickerCard.vue'
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

const isHoverSticker = ref(false)
const isHoverIconSticker = ref(false)
const isHoverIconTag = ref(false)
const isHoverIconStar = ref(false)
const isHoverIconMore = ref(false)

const isExpandChildStickerList = ref(false)
const isCreatingChildSticker = ref(false)
const childStickerList = props.sticker.childStickerList

const isShowTagList = ref(false)
const refStickerTagList = ref(null)
</script>
