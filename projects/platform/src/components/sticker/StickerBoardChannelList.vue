<template lang="pug">
div(class="flex items-center h-10 pl-7.5 pr-6")
  //- All & My Org Part
  div(class="grid grid-flow-col")
    sticker-board-channel(
      v-for="channel in channelGeneral"
      :channel="channel"
      :isActive="channel.channelId === innerCurrentChannelId"
      :pinable="false"
      :closeable="false"
      @click="innerCurrentChannelId = channel.channelId"
      class="font-bold"
      :class="[channel.channelId === STICKER_BOARD_CHANNEL_ID.ALL ? '!w-fit' : '!w-32.5']"
      :isAllTab="channel.channelId === STICKER_BOARD_CHANNEL_ID.ALL"
    )
      template(
        #logo="{ isActive }"
        v-if="channel.channelId === STICKER_BOARD_CHANNEL_ID.ALL"
      )
        f-svg-icon(
          iconName="all"
          size="16"
          :class="[isActive ? 'text-primary-400' : 'text-grey-300']"
        )
      template(
        v-if="channel.channelId === STICKER_BOARD_CHANNEL_ID.MY_ORG"
        #logo
      )
        div(class="relative")
          img(src="https://picsum.photos/300" class="w-5 h-5 rounded-full")
          div(
            class="absolute -bottom-px -right-px border border-grey-0 rounded-sm bg-primary-500 w-2.5 h-2.5"
          )
    div(v-if="channelPinned.length > 0" class="w-px h-5 bg-grey-150 self-end mb-2.5")
  div(class="w-px h-6 bg-primary-middle self-end mb-1.5")
  //- Scrollable Part
  f-scrollbar-container(
    ref="refScrollbar"
    :sizeAutoCapable="false"
    direction="horizontal"
    class="flex-grow relative h-18 pt-7 -mt-6 flex flex-col justify-end"
    @scroll="checkToEnableDirectionBtn"
    @overflowAmountChanged="handleOverflowAmountChange"
  )
    //- Set FScrollbarContainer class="h-18 pt-7 -mt-6" is because tooltip need space(height) to show.
    div(class="items-end grid grid-flow-col justify-start")
      div(
        v-show="channelPinned.length > 0"
        ref="refChannelPinned"
        class="grid grid-flow-col"
      )
        sticker-board-channel(
          v-for="(channel, index) in channelPinned"
          :key="channel.name"
          :channel="channel"
          :isActive="channel.channelId === innerCurrentChannelId"
          isPinned
          @unpin="unpin(index)"
          @click="innerCurrentChannelId = channel.channelId"
          @close="close(index, channelPinned)"
        )
      div(ref="refChannelOpened" class="grid grid-flow-col")
        sticker-board-channel(
          v-for="(channel, index) in channelOpened"
          :key="channel.name"
          :channel="channel"
          :isActive="channel.channelId === innerCurrentChannelId"
          @click="innerCurrentChannelId = channel.channelId"
          @pin="pin(index)"
          @close="close(index, channelOpened)"
        )
  //- Arrow Controller
  div(class="grid grid-cols-2 gap-2.5 items-center ml-3")
    f-svg-icon(
      iconName="keyboard_arrow_left"
      size="24"
      :class="[isLeftBtnClickable ? 'text-grey-600 cursor-pointer active:text-primary-400' : 'text-grey-200']"
      @click="left"
    )
    f-svg-icon(
      iconName="keyboard_arrow_right"
      size="24"
      :class="[isRightBtnClickable ? 'text-grey-600 cursor-pointer active:text-primary-400' : 'text-grey-200']"
      @click="right"
    )
  div(class="bg-grey-150 w-px h-5 mx-2.5")
  //- Archive Box
  f-popper(placement="bottom-end")
    template(#trigger)
      f-svg-icon(
        iconName="archive_box"
        size="24"
        class="cursor-pointer text-grey-600 hover:text-primary-400"
      )
    template(#content)
      f-list(class="w-94 px-2")
        div(class="h-9 pl-3 flex items-center mb-1")
          p(class="text-body2 text-grey-900 font-bold") Archived box ({{ channelInbox.length }})
        div(
          v-if="channelInbox.length === 0"
          class="flex flex-col justify-center items-center pt-6.5 pb-9"
        )
          p(class="text-body1 text-grey-700 pb-5") No organization
          p(class="text-grey-400 text-body2 inline text-center w-60 leading-1.4")
            span Tap
            f-svg-icon(
              iconName="archive"
              size="24"
              class="text-grey-600 inline-block mx-1"
            )
            span on the organization tab to close it in here.
        f-scrollbar-container(v-else class="max-h-105 -mx-1.5 px-1.5")
          div(class="grid gap-y-1")
            div(
              v-for="(item, index) in channelInbox"
              class="pl-2 pr-4 h-12 flex items-center justify-between hover:bg-grey-100 cursor-pointer rounded"
            )
              img(v-if="item.orgLogo" :src="item.orgLogo" class="w-8 h-8 rounded-full")
              p(
                class="pl-4 flex-grow line-clamp-1 !break-all text-grey-900 text-body2 cursor-pointer"
              ) {{ item.orgName }}
              div(class="w-15 flex justify-between items-center")
                f-svg-icon(
                  iconName="pin_border"
                  size="24"
                  class="text-grey-600 hover:text-primary-400"
                  @click.stop="pin(index, channelInbox)"
                )
                f-svg-icon(
                  iconName="unarchive"
                  size="24"
                  class="text-grey-600 hover:text-primary-400"
                  @click.stop="open(index)"
                )
</template>

<script setup>
import Sortable from 'sortablejs'
import StickerBoardChannel from '@/components/sticker/StickerBoardChannel.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { STICKER_BOARD_CHANNEL_ID } from '@/utils/constants.js'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['update:currentChannelId'])
const props = defineProps({
  currentChannelId: {
    type: [String, Number],
    required: true,
  },
})

const innerCurrentChannelId = computed({
  get: () => props.currentChannelId,
  set: (v) => emit('update:currentChannelId', v),
})

const channel = computed(() => store.getters['stickerBoard/channel'])
const channelGeneral = [
  { orgName: 'All', channelId: STICKER_BOARD_CHANNEL_ID.ALL },
  { orgName: 'My Org', channelId: STICKER_BOARD_CHANNEL_ID.MY_ORG },
]
const channelOpened = computed(() => channel.value.opened)
const channelPinned = computed(() => channel.value.pinned)
const channelInbox = computed(() => channel.value.inbox)

const refScrollbar = ref(null)

const pin = (index, sourceList = channelOpened.value) => {
  channelPinned.value.unshift(sourceList[index])
  sourceList.splice(index, 1)
  refScrollbar.value.instance.scroll({ x: 0, y: 0 }, 500)
}

const unpin = (index) => {
  channelOpened.value.unshift(channelPinned.value[index])
  channelPinned.value.splice(index, 1)
}

const close = (index, sourceList) => {
  const temp = sourceList[index]
  channelInbox.value.push(temp)
  sourceList.splice(index, 1)

  if (temp.channelId === innerCurrentChannelId.value) {
    if (sourceList.length === 0) {
      innerCurrentChannelId.value = STICKER_BOARD_CHANNEL_ID.ALL
    } else if (index === sourceList.length) {
      innerCurrentChannelId.value = sourceList[sourceList.length - 1].channelId
    } else if (index < sourceList.length) {
      innerCurrentChannelId.value = sourceList[index].channelId
    } else {
      innerCurrentChannelId.value = sourceList[0].channelId
    }
  }
}

const open = async (index) => {
  const temp = channelInbox.value[index]
  channelOpened.value.push(temp)
  channelInbox.value.splice(index, 1)
  await nextTick()
  refScrollbar.value.instance.scroll({ x: '100%', y: 0 }, 500)
}

const isLeftBtnClickable = ref(false)
const isRightBtnClickable = ref(false)

const checkToEnableDirectionBtn = (scrollInfo) => {
  isLeftBtnClickable.value = scrollInfo ? scrollInfo.ratio.x !== 0 : false
  isRightBtnClickable.value = scrollInfo ? scrollInfo.ratio.x !== 1 : true
}

const handleOverflowAmountChange = (overflowAmount) => {
  if (overflowAmount.x === 0) {
    isLeftBtnClickable.value = false
    isRightBtnClickable.value = false
  }
}

const left = () => {
  refScrollbar.value.instance.scroll({ x: '-= 664px', y: 0 }, 500)
}

const right = () => {
  refScrollbar.value.instance.scroll({ x: '+= 664px', y: 0 }, 500)
}

const refChannelPinned = ref(null)
const refChannelOpened = ref(null)

let willInsertAfterValueCount = 0 // if value > 0, willInsertAfter = true; else if < 0, willInsertAfter = false
onMounted(() => {
  checkToEnableDirectionBtn()
  Sortable.create(refChannelPinned.value, {
    onMove: (event) => {
      if (event.willInsertAfter) {
        willInsertAfterValueCount++
      } else {
        willInsertAfterValueCount--
      }
    },
    onEnd: async (event) => {
      const { oldIndex, newIndex } = event
      if (oldIndex !== newIndex) {
        await store.dispatch('stickerBoard/changeChannelPosition', {
          sourceChannelId: channelPinned.value[oldIndex].channelId,
          targetChannelId: channelPinned.value[newIndex].channelId,
          willInsertAfter: willInsertAfterValueCount > 0,
        })
        willInsertAfterValueCount = 0
      }
    },
  })
  Sortable.create(refChannelOpened.value, {
    onMove: (event) => {
      if (event.willInsertAfter) {
        willInsertAfterValueCount++
      } else {
        willInsertAfterValueCount--
      }
    },
    onEnd: async (event) => {
      const { oldIndex, newIndex } = event
      if (oldIndex !== newIndex) {
        await store.dispatch('stickerBoard/changeChannelPosition', {
          sourceChannelId: channelOpened.value[oldIndex].channelId,
          targetChannelId: channelOpened.value[newIndex].channelId,
          willInsertAfter: willInsertAfterValueCount > 0,
        })
        willInsertAfterValueCount = 0
      }
    },
  })
})
</script>
