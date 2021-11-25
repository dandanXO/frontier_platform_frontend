<template lang="pug">
filter-wrapper(iconName="pattern" :displayName="$t('RR0025')" :dirty="filterDirty.pattern")
  div(class="w-153 h-100.5 px-8 py-7.5 rounded card-shadow grid gap-y-2.5")
    div(v-for="pattenGroup in filterOptions.patternList")
      p(class="text-body1 font-bold text-primary border-b border-black-400 pb-2 mb-3") {{pattenGroup.key}}
      div(class="grid grid-cols-5 gap-x-3 gap-y-5")
        div(
          v-for="pattern in pattenGroup.list"
          class="w-25"
          @click="select(pattern.value)"
        )
          div(class="h-15 rounded overflow-hidden" :class="{ 'border-2 border-brand': filter.pattern === pattern.value }")
            img(class="w-full h-full" :src="pattern.img")
          p(class="text-body2 text-primary text-center pt-1.5") {{pattern.value}}
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterPattern',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filter = computed(() => store.getters['helper/search/filter'])
    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const select = (pattern) => {
      store.dispatch('helper/search/setFilter', { pattern: filter.value.pattern === pattern ? null : pattern })
    }

    return {
      filter,
      filterDirty,
      filterOptions,
      select
    }
  }
}
</script>
