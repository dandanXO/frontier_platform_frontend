<template lang="pug">
div(class="grid")
  div(
    class="justify-self-center my-3.5 w-[min(calc(100vw_-_40px),800px)] h-11 bg-grey-50 rounded-full px-7.5 flex items-center gap-x-4.5"
  )
    div(class="flex-grow flex items-center" data-cy="search-box")
      f-svg-icon(
        v-if="!keyword"
        class="pr-1 text-grey-250"
        size="24"
        iconName="search"
      )
      input(
        type="text"
        :value="keyword"
        :placeholder="$t('RR0053')"
        @input="typing"
        @keydown.enter="handleSearch"
        class="placeholder:text-grey-600-v1 placeholder:overflow-visible flex-grow w-full outline-none bg-transparent overflow-hidden text-grey-900 text-body1 disabled:text-grey-600"
      )
      f-svg-icon(
        v-if="!!keyword"
        size="24"
        iconName="clear"
        class="text-grey-250 cursor-pointer"
        @click="searchStore.setKeyword('')"
      )
    div(class="w-0.5 h-4 bg-grey-250")
    f-svg-icon(
      size="24"
      iconName="filter_border"
      class="cursor-pointer"
      :class="[isOpenFilterPanel || isFilterDirty ? 'text-primary-400' : 'text-grey-900']"
      @click="isOpenFilterPanel = !isOpenFilterPanel"
      :tooltipMessage="$t('RR0085')"
    )
  div(v-if="innerTagList.length > 0" class="mb-5 px-7.5 overflow-hidden")
    slider
      div(class="flex items-center gap-x-2")
        f-label(
          v-for="tag in innerTagList"
          size="lg"
          @click="selectTag(tag)"
          :active="tag.isSelected"
          :key="tag.name"
        ) {{ tag.name }}
  div(v-if="isOpenFilterPanel" class="px-7.5")
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
        filter-country(@search="handleSearch")
        filter-certificate(
          @search="handleSearch"
          v-if="filterOption.certificateList"
        )
</template>

<script setup lang="ts">
import Slider from '@/components/common/Slider.vue'
import FilterMaterialType from '@/components/common/filter/FilterMaterialType.vue'
import FilterMaterialDescription from '@/components/common/filter/FilterMaterialDescription.vue'
import FilterContent from '@/components/common/filter/FilterContent.vue'
import FilterYarnDensity from '@/components/common/filter/FilterYarnDensity.vue'
import FilterWidth from '@/components/common/filter/FilterWidth.vue'
import FilterWeight from '@/components/common/filter/FilterWeight.vue'
import FilterInventory from '@/components/common/filter/FilterInventory.vue'
import FilterPattern from '@/components/common/filter/FilterPattern.vue'
import FilterColor from '@/components/common/filter/FilterColor.vue'
import FilterFinish from '@/components/common/filter/FilterFinish.vue'
import FilterHasU3m from '@/components/common/filter/FilterHasU3m.vue'
import FilterEco from '@/components/common/filter/FilterEco.vue'
import FilterAssetStatus from '@/components/common/filter/FilterAssetStatus.vue'
import FilterPrice from '@/components/common/filter/FilterPrice.vue'
import FilterCountry from '@/components/common/filter/FilterCountry.vue'
import FilterCertificate from './filter/FilterCertificate.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { SEARCH_TYPE } from '@/utils/constants'
import { useSearchStore } from '@/stores/search'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import type { SearchAITag } from '@frontier/platform-web-sdk'
import { isEqual } from '@frontier/lib'
import debounce from 'debounce'

interface InnerTag extends SearchAITag {
  isSelected: boolean
}

defineProps<{
  searchType: SEARCH_TYPE
}>()

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { isFilterDirty, filterOption } = storeToRefs(filterStore)
const searchStore = useSearchStore()
const { keyword, tagList, selectedTagList } = storeToRefs(searchStore)
const isOpenFilterPanel = ref(false)
const innerTagList = computed<InnerTag[]>(() => {
  return tagList.value.map((tag) => ({
    ...tag,
    isSelected: selectedTagList.value.some(
      (selectedTag) => selectedTag.name === tag.name
    ),
  }))
})

const selectTag = (tag: InnerTag) => {
  const tempTag = { name: tag.name, type: tag.type }
  const tempTagList = [...selectedTagList.value]
  const index = tempTagList.findIndex((item) => isEqual(item, tempTag))

  if (!~index) {
    tempTagList.push(tempTag)
  } else {
    tempTagList.splice(index, 1)
  }

  searchStore.setSelectedTagList(tempTagList)
  emit('search')
}

const debounceSearchAITag = debounce(searchStore.getAITags, 300)

const typing = (e: Event) => {
  const target = e.target as HTMLInputElement
  const v = target.value
  searchStore.setKeyword(v)
  if (v.trim() === '') {
    searchStore.setTagList([])
    searchStore.setSelectedTagList([])
    return
  }
  debounceSearchAITag()
}

const resetFilterHandler = () => {
  if (isFilterDirty.value) {
    filterStore.resetFilterState()
    emit('search')
  }
}

const handleSearch = () => {
  searchStore.setKeyword(searchStore.keyword?.trim() ?? null)
  emit('search')
}

onBeforeUnmount(() => {
  searchStore.setTagList([])
  searchStore.setSelectedTagList([])
})
</script>
