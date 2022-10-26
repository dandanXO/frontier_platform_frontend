<template lang="pug">
filter-wrapper(
  iconName="pattern"
  :displayName="$t('RR0025')"
  :dirty="filterDirty.pattern"
)
  div(class="px-5 py-4 rounded card-shadow grid gap-y-2.5")
    div(v-for="pattenGroup in filterOptions.patternList")
      p(class="text-body1 font-bold text-grey-900 border-b border-grey-200 pb-2 mb-3") {{ pattenGroup.key }}
      div(class="grid grid-cols-5 gap-x-3 gap-y-5")
        div(
          v-for="pattern in pattenGroup.list"
          class="w-25"
          @click="select(pattern.value)"
        )
          div(
            class="h-15 rounded overflow-hidden"
            :class="{ 'border-2 border-primary-400': filter.pattern === pattern.value }"
          )
            img(class="w-full h-full" :src="pattern.img")
          p(class="text-body2 text-grey-900 text-center pt-1.5") {{ pattern.value }}
</template>

<script>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterPattern',
  components: {
    FilterWrapper,
  },
  setup() {
    const store = useStore()

    const filter = computed(() => store.getters['helper/search/filter'])
    const filterDirty = computed(
      () => store.getters['helper/search/filterDirty']
    )
    const filterOptions = computed(
      () => store.getters['helper/search/filterOptions']
    )

    const select = (pattern) => {
      store.dispatch('helper/search/setFilter', {
        pattern: filter.value.pattern === pattern ? null : pattern,
      })
    }

    return {
      filter,
      filterDirty,
      filterOptions,
      select,
    }
  },
}
</script>
