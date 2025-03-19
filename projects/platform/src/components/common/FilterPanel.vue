<template lang="pug">
div
  div(class="bg-grey-50 p-5 rounded")
    div(class="flex items-end pb-4")
      p(class="text-body1 text-grey-900") {{ $t('RR0085') }}
      p(
        class="text-caption text-grey-250 pl-3 cursor-pointer"
        @click="resetFilterHandler"
      ) {{ $t('UU0041') }}
    div(class="flex flex-wrap gap-x-2 gap-y-4")
      filter-material-type(@search="handleSearch")
      filter-material-description(@search="handleSearch")
      filter-content(@search="handleSearch")
      filter-pattern(@search="handleSearch")
      filter-color(@search="handleSearch")
      filter-width(@search="handleSearch")
      filter-weight(@search="handleSearch")
      filter-yarn-density(@search="handleSearch")
      filter-finish(@search="handleSearch")
      filter-inventory(:searchType="searchType" @search="handleSearch")
      filter-price(@search="handleSearch")
      filter-has-u3m(@search="handleSearch")
      filter-eco(
        v-if="[SEARCH_TYPE.ASSETS, SEARCH_TYPE.WORKSPACE].includes(searchType)"
        @search="handleSearch"
      )
      filter-asset-status(
        v-if="searchType === SEARCH_TYPE.ASSETS"
        @search="handleSearch"
      )
      filter-country(
        v-if="searchType === SEARCH_TYPE.INNER_EXTERNAL"
        @search="handleSearch"
      )
</template>

<script setup lang="ts">
import { SEARCH_TYPE } from '@/utils/constants'
import FilterMaterialType from '@/components/common/filter/FilterMaterialType.vue'
import FilterMaterialDescription from '@/components/common/filter/FilterMaterialDescription.vue'
import FilterContent from '@/components/common/filter/FilterContent.vue'
import FilterPattern from '@/components/common/filter/FilterPattern.vue'
import FilterColor from '@/components/common/filter/FilterColor.vue'
import FilterWidth from '@/components/common/filter/FilterWidth.vue'
import FilterWeight from '@/components/common/filter/FilterWeight.vue'
import FilterYarnDensity from '@/components/common/filter/FilterYarnDensity.vue'
import FilterFinish from '@/components/common/filter/FilterFinish.vue'
import FilterInventory from '@/components/common/filter/FilterInventory.vue'
import FilterPrice from '@/components/common/filter/FilterPrice.vue'
import FilterHasU3m from '@/components/common/filter/FilterHasU3m.vue'
import FilterEco from '@/components/common/filter/FilterEco.vue'
import FilterAssetStatus from '@/components/common/filter/FilterAssetStatus.vue'
import FilterCountry from '@/components/common/filter/FilterCountry.vue'

defineProps<{
  searchType: SEARCH_TYPE
}>()

const emit = defineEmits<{
  (e: 'search'): void
  (e: 'resetFilter'): void
}>()

const handleSearch = () => {
  emit('search')
}

const resetFilterHandler = () => {
  emit('resetFilter')
}
</script>
