<template lang="pug">
filter-wrapper(iconName="deal" :displayName="$t('RR0022')" :dirty="filterDirty.finishList")
  contextual-menu(
    v-model:selectValue="finishList"
    multiSelect
    :optionList="filterOptions.finishList"
  )
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterFinish',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const finishList = computed({
      get: () => store.getters['helper/search/filter'].finishList,
      set: (v) => store.dispatch('helper/search/setFilter', { finishList: v })
    })

    return {
      finishList,
      filterDirty,
      filterOptions
    }
  }
}
</script>
