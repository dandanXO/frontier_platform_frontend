<template lang="pug">
div(class="h-full flex flex-col bg-grey-100")
  div(class="pt-7 pb-4 pl-7.5")
    p(class="text-h5 font-bold") Digital threads
  sticker-board-channel-list(v-model:currentChannelId="currentChannelId")
  div(class="flex-grow bg-grey-0")
    p {{ currentChannelId }}
</template>

<script setup>
import StickerBoardChannelList from '@/components/sticker/StickerBoardChannelList.vue'
import { STICKER_BOARD_CHANNEL_ID } from '@/utils/constants.js'
import { ref } from 'vue'

const currentChannelId = ref(STICKER_BOARD_CHANNEL_ID.ALL)
</script>
