<template lang="pug">
div(class="pt-2.5 h-full")
  overlay-scrollbar-container(class="h-full")
    div(v-for="history in historyList" class="pl-5 py-5 flex items-center gap-x-10 border-b border-black-400 text-body2 text-primary")
      p {{$dayjs.unix(history.createDate).format('YYYY/MM/DD')}}
      p {{history.content}}
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'HistoryList',
  setup () {
    const store = useStore()
    const historyList = computed(() => store.getters['helper/routeLocation'] === 'org' ? store.getters['organization/historyList'] : store.getters['group/historyList'])
    return {
      historyList
    }
  }
}
</script>
