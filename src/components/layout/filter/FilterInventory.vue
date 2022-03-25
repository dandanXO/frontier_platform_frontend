<template lang="pug">
filter-wrapper(
  iconName="stock"
  :displayName="$t('RR0093')"
  :dirty="filterDirty.inventory"
  @show="init"
)
  div(class="w-131 h-50.5 px-8 py-7.5 rounded card-shadow grid gap-y-13")
    filter-range(
      v-model:range="inputRange"
      :min="filterOptions.inventory.min"
      :max="filterOptions.inventory.max"
      :label="$t('RR0109')"
    )
      template(v-if="[SEARCH_TYPE.ASSETS, SEARCH_TYPE.WORKSPACE].includes(searchType)" #right)
        input-radio-group(
          v-model:inputValue="inventoryUnit"
          :optionList="inventoryOptionList"
        )
    btn(size="sm" class="justify-self-center" @click="update") {{ $t("UU0001") }}
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper.vue'
import FilterRange from '@/components/layout/filter/FilterRange.vue'
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { INVENTORY_UNIT, SEARCH_TYPE } from '@/utils/constants.js'

export default {
  name: 'FilterInventory',
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
    const inventoryOptionList = Object
      .entries(INVENTORY_UNIT)
      .map(([key, value]) => ({
        name: key,
        value
      }))

    const filter = computed(() => store.getters['helper/search/filter'])
    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const filterOptions = computed(() => store.getters['helper/search/filterOptions'])

    const inputRange = ref([null, null])
    const inventoryUnit = ref(inventoryOptionList[0].value)

    const init = () => {
      const { inventory: { unit, quantity } } = filter.value
      inventoryUnit.value = unit || inventoryOptionList[0].value
      inputRange.value = [quantity.min, quantity.max]
    }

    const update = () => {
      const [min, max] = inputRange.value
      store.dispatch('helper/search/setFilter', {
        inventory: {
          unit: inventoryUnit.value,
          quantity: {
            min,
            max,
            isInfinity: max > filterOptions.value.inventory.max
          }
        }
      })
    }

    return {
      filterDirty,
      filterOptions,
      inputRange,
      init,
      update,
      inventoryUnit,
      inventoryOptionList,
      SEARCH_TYPE
    }
  }
}
</script>
