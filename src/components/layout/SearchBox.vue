<template lang="pug">
div(class="grid")
  div(class="justify-self-center my-3.5 w-200 h-11 bg-black-100 rounded-full px-7.5 flex items-center gap-x-4.5")
    div(class="flex-grow flex items-center")
      svg-icon(
        v-if="!keyword"
        class="pr-1 text-black-400"
        size="24"
        iconName="search"
      )
      input(
        type="text"
        v-model="keyword"
        :placeholder="$t('RR0053')"
        @keydown.enter="onEnter"
        class="placeholder:text-black-500 placeholder:overflow-visible flex-grow outline-none bg-transparent overflow-hidden text-primary text-body1 disabled:text-black-600"
      )
      svg-icon(
        v-if="!!keyword"
        size="24"
        iconName="clear"
        class="text-black-500 cursor-pointer"
        @click="keyword = ''"
      )
    div(class="w-0.5 h-4 bg-black-500")
    svg-icon(
      size="24"
      iconName="filter_border"
      class="cursor-pointer"
      :class="[isOpenFilterPanel ? 'text-brand' : 'text-black-900']"
      @click="isOpenFilterPanel = !isOpenFilterPanel"
    )
    //- div(class="w-0.5 h-4 bg-black-500")
    //- svg-icon(size="24" iconName="camera_border" class="text-black-900 cursor-pointer")
  slider(v-if="innerTagList.length > 0")
    div(class="flex items-center gap-x-2 pb-5 pl-7.5 ")
      chip(
        v-for="tag in innerTagList"
        size="lg"
        :text="tag.name"
        @click="selectTag(tag)"
        :active="tag.isSelected"
      )
  div(v-show="isOpenFilterPanel" class="px-7.5")
    div(class="bg-black-50 p-5 rounded")
      div(class="flex items-end pb-4")
        p(class="text-body1 text-primary") {{ $t("RR0085") }}
        p(class="text-caption text-black-500 pl-3 cursor-pointer" @click="resetFilter") {{ $t("UU0041") }}
      div(class="flex flex-wrap gap-x-2 gap-y-4")
        filter-category
        filter-content
        filter-pattern
        filter-color
        filter-width-weight
        filter-yarn-density
        filter-finish
        filter-inventory(:searchType="searchType")
        filter-has-price(v-if="[SEARCH_TYPE.ASSETS, SEARCH_TYPE.WORKSPACE].includes(searchType)")
        filter-price(v-if="[SEARCH_TYPE.PUBLIC_LIBRARY, SEARCH_TYPE.SHARE].includes(searchType)")
        filter-complete(v-if="searchType === SEARCH_TYPE.ASSETS")
        filter-has-u3m(v-if="searchType !== SEARCH_TYPE.ASSETS")
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper.vue'
import FilterContent from '@/components/layout/filter/FilterContent.vue'
import FilterYarnDensity from '@/components/layout/filter/FilterYarnDensity.vue'
import FilterWidthWeight from '@/components/layout/filter/FilterWidthWeight.vue'
import FilterInventory from '@/components/layout/filter/FilterInventory.vue'
import FilterPattern from '@/components/layout/filter/FilterPattern.vue'
import FilterColor from '@/components/layout/filter/FilterColor.vue'
import FilterCategory from '@/components/layout/filter/FilterCategory.vue'
import FilterFinish from '@/components/layout/filter/FilterFinish.vue'
import FilterHasPrice from '@/components/layout/filter/FilterHasPrice.vue'
import FilterHasU3m from '@/components/layout/filter/FilterHasU3m.vue'
import FilterComplete from '@/components/layout/filter/FilterComplete.vue'
import FilterPrice from '@/components/layout/filter/FilterPrice.vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { SEARCH_TYPE } from '@/utils/constants'

export default {
  name: 'SearchBox',
  components: {
    FilterWrapper,
    FilterYarnDensity,
    FilterWidthWeight,
    FilterInventory,
    FilterPattern,
    FilterColor,
    FilterCategory,
    FilterFinish,
    FilterHasPrice,
    FilterComplete,
    FilterContent,
    FilterHasU3m,
    FilterPrice
  },
  props: {
    searchType: {
      type: Number,
      required: true
    }
  },
  emits: ['blur', 'search'],
  setup (props, context) {
    const store = useStore()
    const keyword = computed({
      get: () => store.getters['helper/search/keyword'],
      set: (v) => store.dispatch('helper/search/setKeyword', v)
    })
    let timer
    const isOpenFilterPanel = ref(false)
    const filter = computed(() => store.getters['helper/search/filter'])
    const tagList = computed(() => store.getters['helper/search/tagList'])
    const selectedTagList = computed(() => store.getters['helper/search/selectedTagList'])
    const innerTagList = computed(() => {
      return tagList.value.map(tag => ({
        ...tag,
        isSelected: selectedTagList.value.some(selectedTag => selectedTag.name === tag.name)
      }))
    })

    const selectTag = (tag) => {
      delete tag.isSelected
      const tempTagList = [...selectedTagList.value]
      const index = tempTagList.findIndex(item => JSON.stringify(item) === JSON.stringify(tag))

      if (!~index) {
        tempTagList.push(tag)
      } else {
        tempTagList.splice(index, 1)
      }

      store.dispatch('helper/search/setSelectedTagList', tempTagList)
      context.emit('search')
    }

    const onEnter = () => {
      context.emit('search')
    }

    const resetFilter = () => { store.dispatch('helper/search/resetFilter') }

    watch(
      () => filter.value,
      () => {
        context.emit('search')
      },
      {
        deep: true
      }
    )

    watch(
      () => keyword.value,
      () => {
        clearTimeout(timer)
        timer = undefined
        if (keyword.value !== '') {
          timer = setTimeout(() => {
            store.dispatch('helper/search/getAITags', { searchKeyword: keyword.value })
          }, 300)
        } else {
          store.dispatch('helper/search/resetTagList')
          store.dispatch('helper/search/resetSelectedTagList')
        }
      },
      {
        immediate: true
      }
    )

    onBeforeUnmount(() => {
      store.dispatch('helper/search/resetTagList')
      store.dispatch('helper/search/resetSelectedTagList')
    })

    return {
      keyword,
      selectTag,
      innerTagList,
      onEnter,
      isOpenFilterPanel,
      filter,
      resetFilter,
      SEARCH_TYPE
    }
  }
}
</script>
