<template lang="pug">
div(
  class="flex-shrink-0"
  :style="{ background: 'linear-gradient(180deg, #0F7F73 0%, #0A6665 207.69%)' }"
)
  div(class="h-13 px-7.5 flex flex-row gap-4 items-center")
    p(class="font-bold text-h6 text-grey-0") {{ $t('TT0132') }}
    div(
      class="flex flex-row gap-2 items-center px-2 h-6"
      :style="{ background: '#0A6665', 'box-shadow': 'inset 0px 1px 3px rgba(0, 0, 0, 0.25)', 'border-radius': '21px' }"
    )
      div(class="w-3 h-3 rounded-sm" :style="{ background: ogLabelColor }")
      span(class="text-body2 text-grey-100") {{ ogName }}
    f-tooltip-standard(
      :tooltipMessage="$t('TT0173')"
      boundaryReference="search-table-header"
    )
      template(#slot:tooltip-trigger)
        div(
          class="w-6 h-6 rounded hover:bg-primary-700 flex justify-center items-center cursor-pointer"
          @click="store.dispatch('helper/pushModal', { component: 'modal-thread-board-feature-reminder' })"
        )
          f-svg-icon(iconName="question" size="16" class="text-grey-50")
  bookmark-bar
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import useCurrentUnit from '@/composables/useCurrentUnit'
import BookmarkBar from '@/components/threadBoard/bookmark/BookmarkBar.vue'

const { ogName, ogLabelColor } = useCurrentUnit()
const store = useStore()
</script>

<style></style>
