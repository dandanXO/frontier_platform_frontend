<template lang="pug">
filter-wrapper(iconName="paper" :displayName="$t('RR0098')" :dirty="filterDirty.complete")
  contextual-menu(
    v-model:selectValue="complete"
    :optionList="filterOptions.completeList"
  )
</template>

<script>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterComplete',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const complete = computed({
      get: () => store.getters['helper/search/filter'].complete,
      set: (v) => store.dispatch('helper/search/setFilter', { complete: v })
    })

    return {
      complete,
      filterDirty,
      filterOptions
    }
  }
}
</script>
