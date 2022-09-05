<template lang="pug">
f-table(
  v-model:pagination="pagination"
  :headers="headers"
  :items="currentList"
  rowHeight="60px"
  class="mt-2.5"
)
  template(v-slot="{ item, prop }")
    template(v-if="prop === 'date'") 
      div {{ $dayjs.unix(item.createDate).format("YYYY/MM/DD") }}
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'HistoryList',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const pagination = reactive({
      currentPage: 1,
      totalPage: computed(() => Math.ceil(historyList.value.length / pagination.perPageCount)),
      perPageCount: 8
    })
    const historyList = computed(() => store.getters['helper/routeLocation'] === 'org' ? store.getters['organization/historyList'] : store.getters['group/historyList'])
    const currentList = computed(() => {
      const { currentPage, perPageCount } = pagination
      return historyList.value.slice((currentPage - 1) * perPageCount, currentPage * perPageCount)
    })

    const headers = [
      {
        prop: 'date',
        label: t('BB0109'),
        colSpan: 'col-span-2'
      },
      {
        prop: 'content',
        label: t('BB0110'),
        colSpan: 'col-span-10'
      }
    ]

    return {
      headers,
      currentList,
      pagination
    }
  }
}
</script>
