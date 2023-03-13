<template lang="pug">
div(
  class="group w-full h-39.5 bg-grey-0 hover:bg-grey-50 border border-grey-150 drop-shadow-2 pl-5 pt-3.5 pr-3.5 pb-2"
)
  div(class="pb-1 flex items-center gap-x-2.5")
    img(class="w-8 h-8 rounded" :src="material.coverImg")
    p(class="text-body2 text-grey-800") {{ `#${material.materialNo}` }}
  div(class="pb-1 flex items-center gap-x-2")
    span(
      class="text-body2 font-bold leading-1.6 group-hover:text-primary-400"
      :class="[uncreated ? 'text-grey-300 py-2' : 'text-grey-900']"
    ) {{ digitalThread.digitalThreadName }}
    span(
      v-if="digitalThread.unreadStickerQty > 0"
      class="h-4.5 px-1.5 bg-primary-400 text-caption font-bold text-grey-0 rounded-xl flex items-center"
    ) {{ digitalThread.unreadStickerQty }}
    f-avatar-group(
      v-if="!uncreated"
      :itemList="orgItemList"
      type="org"
      size="sm"
    )
  div(class="pb-1 flex items-center gap-x-4")
    div(class="flex items-center gap-x-1.5 text-grey-600")
      f-svg-icon(iconName="sticker" size="14")
      span(class="text-caption") {{ digitalThread.stickerStatistics.totalQty }}
    div(class="flex items-center gap-x-1.5 text-grey-600")
      f-svg-icon(iconName="starred" size="14" class="text-yellow-400")
      span(class="text-caption") {{ digitalThread.tagList.length }}
    div(class="flex items-center gap-x-1.5 text-grey-600")
      f-svg-icon(iconName="tag" size="14")
      span(class="text-caption") {{ digitalThread.stickerStatistics.starredQty }}
    div(
      v-if="digitalThread.stickerStatistics.externalQty > 0 || digitalThread.stickerStatistics.internalQty > 0"
      class="pl-2 flex items-center gap-x-1"
    )
      div(
        v-if="digitalThread.stickerStatistics.externalQty > 0"
        class="w-1 h-4 rounded-[18px] bg-forestgreen-300"
      )
      div(
        v-if="digitalThread.stickerStatistics.internalQty > 0"
        class="w-1 h-4 rounded-[18px] bg-grey-300"
      )
  div(v-if="!uncreated" class="flex justify-between")
    p(class="text-caption leading-1.6 text-grey-300 pt-2.5") {{ $t('RR0065') }} {{ $dayjs.unix(digitalThread.createDate).format('MMM DD, YYYY [at] hh:mm A') }}
    f-avatar-group(
      v-if="!uncreated"
      :itemList="digitalThread.participantList.map(({ name, avatar }) => ({ name, imageUrl: avatar }))"
      type="org"
      size="sm"
      placement="top"
    )
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  digitalThread: {
    type: Object,
    required: true,
  },
})

const material = computed(() => store.getters['sticker/material'])
const uncreated = computed(
  () => props.digitalThread.digitalThreadSideId === null
)
const orgItemList = computed(() => {
  const {
    materialOwnerUnitName,
    materialOwnerUnitLogo,
    creatorUnitName,
    creatorUnitLogo,
  } = props.digitalThread

  const itemList = [
    {
      name: materialOwnerUnitName,
      imageUrl: materialOwnerUnitLogo,
    },
  ]

  if (materialOwnerUnitName !== creatorUnitName) {
    itemList.push({
      name: creatorUnitName,
      imageUrl: creatorUnitLogo,
    })
  }

  return itemList
})
</script>
