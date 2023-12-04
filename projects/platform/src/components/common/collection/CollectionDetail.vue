<template lang="pug">
div(class="w-151.5 h-52.5 flex justify-between")
  div(class="w-94.5 flex flex-col")
    p(class="font-bold text-grey-900 leading-1.6 pb-4") {{ $t('RR0014') }}
    f-scrollbar-container(
      v-if="collection.description"
      class="flex-grow -ml-6.5 px-6.5 break-all text-body2 text-grey-900 leading-1.6"
    )
      pre(
        class="whitespace-pre-wrap"
        :style="{ 'word-break': 'break-word', 'font-family': 'unset' }"
      ) {{ collection.description }}
    p(v-else class="text-body2 text-grey-900 leading-1.6") {{ $t('FF0008') }}
  div(class="w-44 flex flex-col")
    p(class="font-bold text-grey-900 leading-1.6 pb-4") {{ $t('RR0249') }}
    a(
      v-if="collection.trendBoard"
      :href="collection.trendBoard.originalUrl"
      target="_blank"
      class="flex-grow flex flex-col bg-grey-250 rounded overflow-hidden"
    )
      div(class="h-32.5 relative")
        img(
          :src="collection.trendBoard.thumbnailUrl"
          class="w-full h-full object-contain"
        )
        f-svg-icon(
          iconName="open_in_new"
          size="24"
          class="text-grey-0 absolute top-1 left-1"
        )
      div(class="flex-grow bg-grey-50 flex items-center justify-center")
        p(class="text-caption text-grey-900 w-37.5 line-clamp-1 !break-all") {{ collection.trendBoard.displayName }}
    div(v-else class="flex-grow flex flex-col rounded overflow-hidden")
      div(class="h-32.5 bg-grey-250 flex items-center justify-center")
        f-svg-icon(iconName="file" size="50" class="text-grey-0")
      div(class="flex-grow bg-grey-50 flex items-center justify-center")
        p(class="text-caption text-grey-250") {{ $t('RR0247') }}
</template>

<script setup lang="ts">
import type { Collection } from '@frontier/platform-web-sdk'

defineProps<{
  collection: Collection
}>()
</script>
