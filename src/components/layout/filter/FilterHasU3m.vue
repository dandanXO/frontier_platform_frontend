<template lang="pug">
filter-wrapper(iconName="price" :displayName="$t('RR0106')" :dirty="filterDirty.hasU3M")
  contextual-menu(
    v-model:selectValue="hasU3M"
    :optionList="filterOptions.hasU3M"
  )
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterHasU3m',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const hasU3M = computed({
      get: () => store.getters['helper/search/filter'].hasU3M,
      set: (v) => store.dispatch('helper/search/setFilter', { hasU3M: v })
    })

    return {
      hasU3M,
      filterDirty,
      filterOptions
    }
  }
}
</script>
