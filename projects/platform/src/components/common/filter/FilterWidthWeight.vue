<template lang="pug">
filter-wrapper(
  iconName="measure"
  :displayName="`${$t('RR0088')}/${$t('RR0015')}`"
  :dirty="filterDirty.widthAndWeightGsm"
  @expand="initWidthAndWeight"
)
  div(class="w-95 rounded shadow-16 py-4")
    filter-range(
      v-model:range="inputRangeWidth"
      :min="filterOptions.width.min"
      :max="filterOptions.width.max"
      :label="$t('RR0086')"
    )
    div(class="border-t border-grey-150 mt-4.5 mb-4")
    filter-range(
      v-model:range="inputRangeWeight"
      :min="filterOptions.weightGsm.min"
      :max="filterOptions.weightGsm.max"
      :label="$t('RR0090')"
    )
    div(class="flex justify-end px-5 mt-2")
      f-button(
        size="sm"
        class="justify-self-center"
        :disabled="disabled"
        @click="updateWidthAndWeightGsm"
      ) {{ $t('UU0001') }}
</template>

<script>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import FilterRange from '@/components/common/filter/FilterRange.vue'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'FilterWidthWeight',
  components: {
    FilterWrapper,
    FilterRange,
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
    const disabled = computed(() => {
      const [widthMin, widthMax] = inputRangeWidth.value
      const [weightMin, weightMax] = inputRangeWeight.value
      return (
        widthMin > widthMax ||
        widthMax < widthMin ||
        weightMin > weightMax ||
        weightMax < weightMin
      )
    })

    const inputRangeWidth = ref([null, null])
    const inputRangeWeight = ref([null, null])

    const initWidthAndWeight = () => {
      const { width, weightGsm } = filter.value
      inputRangeWidth.value = [width.min, width.max]
      inputRangeWeight.value = [weightGsm.min, weightGsm.max]
    }

    const updateWidthAndWeightGsm = () => {
      const [widthMin, widthMax] = inputRangeWidth.value
      const [weightMin, weightMax] = inputRangeWeight.value
      store.dispatch('helper/search/setFilter', {
        width: {
          min: widthMin,
          max: widthMax,
          isInfinity: widthMax > filterOptions.value.width.max,
        },
        weightGsm: {
          min: weightMin,
          max: weightMax,
          isInfinity: weightMax > filterOptions.value.weightGsm.max,
        },
      })
    }

    return {
      disabled,
      inputRangeWidth,
      inputRangeWeight,
      filterDirty,
      filterOptions,
      initWidthAndWeight,
      updateWidthAndWeightGsm,
    }
  },
}
</script>
