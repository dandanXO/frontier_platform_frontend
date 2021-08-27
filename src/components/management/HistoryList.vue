<template lang="pug">
div(class="pt-2.5")
  overlay-scrollbar-container(class="h-full")
    div(v-for="history in historyList" class="pl-5 py-5 flex items-center gap-x-10 border-b border-black-400 text-body2 text-primary")
      p {{unixToDate(history.createDate)}}
      p {{history.content}}
</template>

<script>
import { unixToDate } from '@/utils/time-formatting'

export default {
  name: 'HistoryList',
  props: {
    historyList: {
      type: Array,
      required: true
    }
  },
  setup () {
    return {
      unixToDate
    }
  }
}
</script>
