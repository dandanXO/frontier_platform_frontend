<template lang="pug">
filter-wrapper(iconName="color-circle" :displayName="$t('RR0026')" :dirty="filterDirty.color")
  div(class="w-82 h-56.5 px-8 py-7.5 rounded card-shadow grid grid-cols-4 grid-rows-3 gap-2")
    div(
      v-for="color in filterOptions.colorList"
      class="w-15 h-12.5 rounded flex items-center justify-center"
      :class="{ 'border border-black-400': color.value === 'White' }"
      :style="{ 'background-color': `${color.hex}`}"
      @click="select(color.value)"
    )
      svg-icon(v-if="filter.color === color.value" iconName="done" size="24" class="text-black-0")
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'FilterColor',
  components: {
    FilterWrapper
  },
  setup () {
    const store = useStore()

    const filter = computed(() => store.getters['helper/search/filter'])
    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const select = (color) => {
      store.dispatch('helper/search/setFilter', { color: filter.value.color === color ? null : color })
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
