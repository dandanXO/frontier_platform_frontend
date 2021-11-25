<template lang="pug">
filter-wrapper(iconName="fabric" :displayName="$t('RR0087')" :dirty="filterDirty.category")
  contextual-menu(
    v-model:selectValue="category"
    :optionList="filterOptions.categoryList"
  )
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterCategory',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const category = computed({
      get: () => store.getters['helper/search/filter'].category,
      set: (v) => store.dispatch('helper/search/setFilter', { category: v })
    })

    return {
      category,
      filterDirty,
      filterOptions
    }
  }
}
</script>
