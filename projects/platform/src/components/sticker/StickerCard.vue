<template lang="pug">
div(
  class="relative w-full shadow-2 hover:shadow-4"
  @mouseenter="isHoverSticker = true"
  @mouseleave="isHoverSticker = false"
)
  div(
    class="absolute z-1 top-0 left-0 w-1 h-full rounded-l-md"
    :class="{ 'bg-forestgreen-300': sticker.addTo === EXTERNAL, 'bg-grey-300': sticker.addTo === INTERNAL }"
  )
  //- Sticker
  div(
    class="relative px-5 pt-2.5 pb-3.5 bg-grey-0 rounded-r-md"
    @click="expandChildStickerList"
  )
    //- Unread Hint
    div(
      v-if="sticker.hasNewAddOrUpdate"
      class="absolute top-1/2 -left-4 w-2 h-2 rounded-full"
      :class="{ 'bg-forestgreen-300': sticker.addTo === EXTERNAL, 'bg-grey-300': sticker.addTo === INTERNAL }"
    )
    //- Header
    div(class="flex items-center justify-between pb-5")
      sticker-label-add-to(:addTo="sticker.addTo")
      div(class="flex items-center gap-x-4")
        sticker-header-icon(
          iconName="sticker"
          :isHoverSticker="isHoverSticker"
          :isActive="isExpandChildStickerList"
          :amount="childStickerList.length"
          :activeTooltip="$t('TT0095')"
          :inactiveTooltip="$t('TT0094')"
          :hasUnread="sticker.hasChildStickerUnread"
        )
        sticker-header-icon(
          iconName="tag"
          :isHoverSticker="isHoverSticker"
          :isActive="isShowTagList"
          :amount="sticker.tagList.length"
          :activeTooltip="$t('TT0097')"
          :inactiveTooltip="$t('TT0096')"
          @click.stop="isShowTagList = !isShowTagList"
        )
        sticker-header-icon(
          :iconName="isStarred ? 'starred' : 'star'"
          :isHoverSticker="isHoverSticker"
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
              :tooltip="$t('TT0100')"
              class="text-grey-300"
              :class="{ '!text-grey-600': isHoverSticker && !isHoverIconMore, '!text-primary-400': isHoverIconMore || isExpand }"
            )
          template(#content="{ collapsePopper }")
            f-list
              f-list-item(@click="collapsePopper(); openModalStickerDetail()") {{ $t('TT0055') }}
    //- Content
    common-sticker-text-viewer(
      :content="sticker.content"
      editorClass="outline-none bg-grey-0 text-body2 leading-1.6 text-grey-900"
    )
    //- Tag List
    sticker-tag-list(
      ref="refStickerTagList"
      v-if="isShowTagList"
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
      v-if="!isFilterDirty && !refStickerTagList?.isEditingTagList && isHoverSticker && !isExpandChildStickerList"
      type="secondary"
      size="sm"
      prependIcon="add"
      class="w-full mt-2.5"
      :disabled="digitalThread.hasMaterialDeleted"
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
    template(
      v-for="(childSticker, index) in childStickerList"
      :key="childSticker.stickerId"
    )
      child-sticker-card(:childSticker="childSticker")
      hr(v-if="index !== childStickerList.length - 1" class="text-grey-150 my-3.5")
    child-sticker-create(
      v-if="isCreatingChildSticker"
      :order="sticker.childStickerList.length + 1"
      :stickerId="sticker.stickerId"
      :addTo="sticker.addTo"
      :class="{ 'pt-3': childStickerList.length !== 0 }"
      @close="isCreatingChildSticker = false"
    )
    //- Button - Add child sticker
    div(
      v-if="!isFilterDirty && isHoverSticker && isExpandChildStickerList && !isCreatingChildSticker"
      class="-ml-8 pt-2"
      @click="isCreatingChildSticker = true"
    )
      f-button(
        type="secondary"
        size="sm"
        prependIcon="add"
        class="w-full"
        :disabled="digitalThread.hasMaterialDeleted"
      ) {{ $t('TT0092') }}
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StickerLabelAddTo from '@/components/sticker/StickerLabelAddTo.vue'
import CommonStickerTextViewer from '@/components/sticker/stickerTextEditor/CommonStickerTextViewer.vue'
import StickerHeaderIcon from '@/components/sticker/StickerHeaderIcon.vue'
import StickerTagList from '@/components/sticker/StickerTagList.vue'
import ChildStickerCreate from '@/components/sticker/ChildStickerCreate.vue'
import ChildStickerCard from '@/components/sticker/ChildStickerCard.vue'
import { STICKER_ADD_TO } from '@/utils/constants'
import { useStore } from 'vuex'

const { EXTERNAL, INTERNAL } = STICKER_ADD_TO
const store = useStore()
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

const digitalThread = computed(() => store.getters['sticker/digitalThread'])

const isHoverSticker = ref(false)
const isHoverIconMore = ref(false)

const isExpandChildStickerList = ref(false)
const expandChildStickerList = () => {
  if (isFilterDirty.value) {
    return
  }
  isExpandChildStickerList.value = !isExpandChildStickerList.value

  isExpandChildStickerList.value &&
    childStickerList.value.length > 0 &&
    store.dispatch('sticker/readChildSticker', props.sticker.stickerId)
}

const isCreatingChildSticker = ref(false)
const childStickerList = computed(() => props.sticker.childStickerList || [])

const isShowTagList = ref(false)
const refStickerTagList = ref(null)

const isStarred = ref(props.sticker.isStarred)
const toggleStarred = () => {
  isStarred.value = !isStarred.value
  const stickerId = props.sticker.stickerId
  isStarred.value
    ? store.dispatch('sticker/starSticker', stickerId)
    : store.dispatch('sticker/unstarSticker', stickerId)
}

const isFilterDirty = computed(() => store.getters['sticker/isFilterDirty'])
const isFilterTagListDirty = computed(
  () => store.getters['sticker/isFilterTagListDirty']
)
watch(
  /**
   * 因為 isFilterDirty 的值會先改變，但 childStickerList 的值得等 API 回傳，
   * 所以如果監聽 isFilterDirty 是不準確的
   */
  () => childStickerList.value,
  () => {
    // 有使用篩選且篩選結果包含 Child Sticker 故自動展開 Child Sticker List
    if (isFilterDirty.value && childStickerList.value.length > 0) {
      isExpandChildStickerList.value = true
    }
    if (isFilterTagListDirty.value && props.sticker.tagList.length > 0) {
      isShowTagList.value = true
    }
  }
)
watch(
  () => isFilterDirty.value,
  () => {
    if (!isFilterDirty.value) {
      isExpandChildStickerList.value = false
      isShowTagList.value = false
    }
  }
)

const openModalStickerDetail = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-sticker-detail',
    properties: {
      sticker: props.sticker,
    },
  })
}
</script>
