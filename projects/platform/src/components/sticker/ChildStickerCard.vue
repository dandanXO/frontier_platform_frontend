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
      sticker-header-icon(
        iconName="tag"
        :isHoverSticker="isHoverChildSticker"
        :isActive="isShowTagList"
        :amount="childSticker.tagList.length"
        :activeTooltip="$t('TT0097')"
        :inactiveTooltip="$t('TT0096')"
        @click.stop="isShowTagList = !isShowTagList"
      )
      sticker-header-icon(
        :iconName="isStarred ? 'starred' : 'star'"
        :isHoverSticker="isHoverChildSticker"
        :isActive="isStarred"
        :activeTooltip="$t('TT0099')"
        :inactiveTooltip="$t('TT0098')"
        :class="{ '!text-yellow-400': isStarred }"
        @click.stop="toggleStarred"
      )
      f-popper(
        placement="left"
        class="flex items-center gap-x-1 cursor-pointer text-grey-300"
        @mouseenter="isHoverIconMore = true"
        @mouseleave="isHoverIconMore = false"
        @click.stop
      )
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
    v-if="isShowTagList"
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
import { ref, computed, watch } from 'vue'
import ChildStickerTextViewer from '@/components/sticker/stickerTextEditor/ChildStickerTextViewer.vue'
import StickerTagList from '@/components/sticker/StickerTagList.vue'
import StickerHeaderIcon from '@/components/sticker/StickerHeaderIcon.vue'
import { STICKER_ADD_TO } from '@/utils/constants.js'
import { useStore } from 'vuex'

const { EXTERNAL } = STICKER_ADD_TO
const store = useStore()
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
const isHoverIconMore = ref(false)

const isShowTagList = ref(false)
const refStickerTagList = ref(null)

const isStarred = ref(props.childSticker.isStarred)
const toggleStarred = () => {
  isStarred.value = !isStarred.value
  const stickerId = props.childSticker.stickerId
  isStarred.value
    ? store.dispatch('sticker/starSticker', stickerId)
    : store.dispatch('sticker/unstarSticker', stickerId)
}

const isFilterTagListDirty = computed(
  () => store.getters['sticker/isFilterTagListDirty']
)
watch(
  () => isFilterTagListDirty.value,
  () => {
    if (isFilterTagListDirty.value && props.childSticker.tagList.length > 0) {
      isShowTagList.value = true
    }
  },
  {
    immediate: true,
  }
)
</script>
