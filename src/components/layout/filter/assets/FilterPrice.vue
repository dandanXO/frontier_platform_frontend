<template lang="pug">
filter-wrapper(iconName="price" :displayName="$t('RR0094')" :dirty="filterDirty.hasPrice")
  contextual-menu(
    v-model:selectValue="hasPrice"
    :optionList="filterOptions.priceList"
  )
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterPrice',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const hasPrice = computed({
      get: () => store.getters['helper/search/filter'].hasPrice,
      set: (v) => store.dispatch('helper/search/setFilter', { hasPrice: v })
    })

    return {
      hasPrice,
      filterDirty,
      filterOptions
    }
  }
}
</script>
