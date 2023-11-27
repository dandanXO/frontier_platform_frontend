<template lang="pug">
div(
  v-if="collection.description || collection.trendBoardCoverImg"
  class="px-7.5 pb-4 md:pb-8 pt-1.5"
)
  f-expansion-panel(
    class="shadow-2 rounded border border-grey-150 overflow-hidden bg-transparent"
  )
    template(#trigger="{ isExpand }")
      div(
        class="group w-full h-14 flex items-center gap-x-2 md:gap-x-6 px-3 md:px-7 cursor-pointer"
        :class="[isExpand ? 'bg-grey-50 hover:bg-grey-150 active:bg-grey-50' : 'bg-grey-0 hover:bg-grey-100 active:bg-grey-150']"
      )
        h5(class="text-body2 md:text-body1 text-grey-900 font-bold cursor-pointer") {{ $t('RR0246') }}
        span(
          v-if="collection.description && !isExpand"
          class="max-w-100 line-clamp-1 text-grey-300 text-caption md:text-body2"
        ) {{ collection.description }}
        span(
          class="text-caption md:text-body2 flex-grow whitespace-nowrap"
          :class="[isExpand ? 'text-grey-400 invisible group-hover:visible' : 'text-primary-400']"
        ) {{ isExpand ? 'Show less' : 'Show more' }}
        div(
          v-if="isExpand"
          class="w-7 h-7 rounded-full flex items-center justify-center bg-grey-150 group-hover:bg-grey-200"
        )
          f-svg-icon(iconName="close" size="24" class="transform text-grey-600")
    template(#content)
      div(
        class="w-full md:h-81 bg-grey-50 p-3 md:py-6 md:px-7 flex justify-between flex-col md:flex-row"
      )
        div(class="w-full md:w-155.5 md:h-full pb-3 md:pb-0")
          f-scrollbar-container(
            v-if="collection.description && isDesktop"
            :sizeAutoCapable="false"
            class="h-full -ml-6.5 px-6.5 break-all text-body2 text-grey-900 leading-1.6"
          )
            pre(
              class="whitespace-pre-wrap"
              :style="{ 'word-break': 'break-word', 'font-family': 'unset' }"
            ) {{ collection.description }}
          pre(
            v-else-if="collection.description"
            class="whitespace-pre-wrap"
            :style="{ 'word-break': 'break-word', 'font-family': 'unset' }"
          ) {{ collection.description }}
          p(v-else class="text-body2 text-grey-900 leading-1.6") {{ $t('FF0008') }}
        collection-trend-board(
          :trendBoardCoverImg="collection.trendBoardCoverImg"
          :trendBoardUrl="collection.trendBoardUrl"
        )
</template>

<script setup lang="ts">
import CollectionTrendBoard from '@/components/common/CollectionTrendBoard.vue'
import type { Collection } from '@frontier/platform-web-sdk'
import { useBreakpoints } from '@frontier/lib'

defineProps<{
  collection: Collection
}>()

const { isDesktop } = useBreakpoints()
</script>
