<template lang="pug">
filter-wrapper(
  iconName="stock"
  :displayName="$t('RR0094')"
  :dirty="filterDirty.price"
  @show="init"
)
  div(class="w-131 h-50.5 px-8 py-7.5 rounded card-shadow grid gap-y-13")
    filter-range(
      v-model:range="inputRange"
      :min="filterOptions.price.min"
      :max="filterOptions.price.max"
      :label="$t('RR0095')"
    )
    btn(size="sm" class="justify-self-center" @click="update") {{$t('UU0001')}}
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper'
import FilterRange from '@/components/layout/filter/FilterRange'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { SEARCH_TYPE } from '@/utils/constants.js'

export default {
  name: 'FilterPrice',
  components: {
    FilterWrapper,
    FilterRange
  },
  props: {
    searchType: {
      type: Number
    }
  },
  setup () {
    const store = useStore()

    const filter = computed(() => store.getters['helper/search/filter'])
    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const inputRange = ref([null, null])

    const init = () => {
      const { price } = filter.value
      inputRange.value = [price.min, price.max]
    }

    const update = () => {
      const [min, max] = inputRange.value
      store.dispatch('helper/search/setFilter', {
        price: {
          min,
          max,
          isInfinity: max > filterOptions.value.price.max
        }
      })
    }

    return {
      filterDirty,
      filterOptions,
      inputRange,
      init,
      update,
      SEARCH_TYPE
    }
  }
}
</script>
