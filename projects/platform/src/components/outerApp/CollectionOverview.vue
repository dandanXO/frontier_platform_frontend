<template lang="pug">
div(
  v-if="props.collection.description || props.collection.trendBoard"
  class="px-7.5 pb-4 md:pb-8 pt-1.5 relative"
)
  f-expansion-panel(
    class="relative bg-transparent border rounded shadow-2 border-grey-150"
    :isExpand="localIsExpand"
    @update:isExpand="localIsExpand = $event"
  )
    template(#trigger="{ isExpand }")
      div(
        class="flex items-center justify-between w-full px-3 cursor-pointer h-14 gap-x-2 md:gap-x-6 md:px-7"
        :class="[isExpand ? 'bg-grey-50 hover:bg-grey-150 active:bg-grey-50' : 'bg-grey-0 hover:bg-grey-100 active:bg-grey-150']"
      )
        div(class="flex items-center gap-x-2 md:gap-x-6")
          h5(class="font-bold cursor-pointer text-body2 md:text-body1 text-grey-900") {{ $t('RR0246') }}
          span(
            v-if="collection.description && !isExpand"
            class="max-w-100 line-clamp-1 text-grey-300 text-caption md:text-body2"
          ) {{ collection.description }}
        span(
          class="text-caption md:text-body2 whitespace-nowrap"
          :class="[isExpand ? 'text-grey-400' : 'text-primary-400']"
        ) {{ isExpand ? $t('RR0576') : $t('RR0577') }}

    template(#content)
      div(
        class="flex flex-col justify-between w-full p-3 md:h-81 bg-grey-50 md:py-6 md:px-7 md:flex-row"
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
          :trendBoardCoverImg="collection.trendBoard?.thumbnailUrl"
          :trendBoardUrl="collection.trendBoard?.originalUrl"
        )
  persistant-tooltip(
    v-if="localIsExpand"
    name="hide-overview"
    :descriptionText="$t('RR0574')"
    @handleClose="handleClose"
  )

  persistant-tooltip(
    v-if="!localIsExpand"
    name="show-overview"
    :descriptionText="$t('RR0575')"
    @handleClose="handleClose"
  )
</template>

<script setup lang="ts">
import CollectionTrendBoard from '@/components/common/collection/CollectionTrendBoard.vue'
import type { Collection } from '@frontier/platform-web-sdk'
import { useBreakpoints } from '@frontier/lib'
import { ref } from 'vue'
import PersistantTooltip from './PersistantTooltip.vue'

const props = defineProps<{
  collection: Collection
}>()

const localIsExpand = ref(false)
const { isDesktop } = useBreakpoints()
</script>
