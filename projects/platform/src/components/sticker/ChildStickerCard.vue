<template lang="pug">
div(
  @mouseenter="isHoverChildSticker = true"
  @mouseleave="isHoverChildSticker = false"
)
  //- Header
  div(class="flex items-center justify-between pb-4")
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
            :tooltipMessage="$t('TT0100')"
            class="text-grey-300"
            :class="{ '!text-grey-600': isHoverChildSticker && !isHoverIconMore, '!text-primary-400': isHoverIconMore || isExpand }"
          )
        template(#content="{ collapsePopper }")
          f-list
            f-list-item(@click="collapsePopper(); openModalStickerDetail()") {{ $t('TT0055') }}
  //- Content
  common-sticker-text-viewer(
    :content="childSticker.content"
    editorClass="outline-none text-body2 leading-1.6 text-grey-900"
  )
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
    class="flex items-center pt-4"
    @click.stop
  )
    sticker-creator-info(:sticker="childSticker")
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StickerCreatorInfo from '@/components/sticker/StickerCreatorInfo.vue'
import CommonStickerTextViewer from '@/components/sticker/stickerTextEditor/CommonStickerTextViewer.vue'
import StickerTagList from '@/components/sticker/StickerTagList.vue'
import StickerHeaderIcon from '@/components/sticker/StickerHeaderIcon.vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({
  childSticker: {
    type: Object,
    required: true,
  },
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

const filterTagList = computed(() => store.getters['sticker/filter'].tagList)
watch(
  () => filterTagList.value,
  () => {
    isShowTagList.value = filterTagList.value.some((filterTag) =>
      props.childSticker.tagList.some((tag) => tag === filterTag)
    )
  },
  { immediate: true, deep: true }
)

const openModalStickerDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-sticker-detail',
    properties: {
      sticker: props.childSticker,
    },
  })
}
</script>
