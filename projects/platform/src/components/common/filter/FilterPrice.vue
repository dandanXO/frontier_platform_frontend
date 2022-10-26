<template lang="pug">
filter-wrapper(
  iconName="price"
  :displayName="$t('RR0094')"
  :dirty="filterDirty.price"
  @expand="init"
)
  div(class="w-131 py-4 rounded card-shadow")
    filter-range(
      v-model:range="inputRange"
      :min="filterOptions.price.min"
      :max="filterOptions.price.max"
      :label="$t('RR0095')"
    )
    div(class="flex justify-end px-5 mt-2")
      f-button(size="sm" @click="update") {{ $t('UU0001') }}
</template>

<script>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import FilterRange from '@/components/common/filter/FilterRange.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { SEARCH_TYPE } from '@/utils/constants.js'

export default {
  name: 'FilterPrice',
  components: {
    FilterWrapper,
    FilterRange,
  },
  props: {
    searchType: {
      type: Number,
    },
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
          isInfinity: max > filterOptions.value.price.max,
        },
      })
    }

    return {
      filterDirty,
      filterOptions,
      inputRange,
      init,
      update,
      SEARCH_TYPE,
    }
  },
}
</script>
