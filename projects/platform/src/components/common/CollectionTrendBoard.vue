<template lang="pug">
div(
  class="relative w-97.5 h-69 rounded bg-grey-250 flex items-center justify-center flex-shrink-0"
)
  div(v-if="trendBoardCoverImg" class="rounded w-full h-full px-7.5 py-6 bg-grey-100")
    div(
      class="w-full h-full bg-contain bg-no-repeat bg-center rounded bg-grey-0"
      :style="{ backgroundImage: `url(${trendBoardCoverImg})` }"
    )
    a(
      :href="trendBoardUrl"
      target="_blank"
      class="absolute right-3.5 bottom-3.5 w-7 h-7 bg-grey-0 flex items-center justify-center rounded border border-grey-250"
    )
      f-svg-icon(iconName="open_in_new" class="text-grey-600" size="24")
  div(v-else)
    f-svg-icon(iconName="file" size="110" class="text-grey-0 mx-auto")
    p(class="text-body1 font-bold text-grey-50 pt-3") {{ $t('RR0247') }}
</template>

<script setup lang="ts">
defineProps<{
  trendBoardCoverImg?: string
  trendBoardUrl?: string
}>()
</script>
