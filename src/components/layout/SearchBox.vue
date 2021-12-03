<template lang="pug">
div(class="grid" :class="{ 'border-b border-primary-thin': !isOpenFilterPanel }")
  div(class="justify-self-center my-3.5 w-200 h-11 bg-black-100 rounded-full px-7.5 flex items-center gap-x-4.5")
    div(class="flex-grow flex items-center")
      svg-icon(
        v-if="!keyword" class="pr-1"
        size="24"
        iconName="search"
        class="text-black-400"
      )
      input(
        type="text"
        v-model="keyword"
        :placeholder="$t('RR0053')"
        @keydown.enter="onEnter"
        class="flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 placeholder-black-400 placeholder-text-body2 placeholder-overflow-visible disabled:text-black-600"
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
    div(class="w-0.5 h-4 bg-black-500")
    svg-icon(size="24" iconName="camera_border" class="text-black-900 cursor-pointer")
  slider(v-if="innerTagList.length > 0")
    div(class="flex items-center gap-x-2 pb-5 pl-7.5 ")
      chip(
        v-for="tag in innerTagList"
        size="lg"
        :text="tag.name"
        @click="selectTag(tag)"
        :class="{ 'bg-primary': tag.isSelected }"
      )
  div(v-show="isOpenFilterPanel" class="px-7.5")
    div(class="bg-black-50 p-5 rounded")
      div(class="flex items-end pb-4")
        p(class="text-body1 text-primary") {{$t('RR0085')}}
        p(class="text-caption text-black-500 pl-3 cursor-pointer" @click="resetFilter") {{$t('UU0041')}}
      div(class="flex flex-wrap gap-x-2 gap-y-4")
        filter-category
        filter-content
        filter-pattern
        filter-color
        filter-width-weight
        filter-yarn-density
        filter-finish
        filter-inventory
        filter-has-price
        filter-complete(v-if="searchType === SEARCH_TYPE.ASSETS")
</template>

<script>
import FilterWrapper from '@/components/layout/filter/FilterWrapper'
import FilterContent from '@/components/layout/filter/FilterContent'
import FilterYarnDensity from '@/components/layout/filter/FilterYarnDensity'
import FilterWidthWeight from '@/components/layout/filter/FilterWidthWeight'
import FilterInventory from '@/components/layout/filter/FilterInventory'
import FilterPattern from '@/components/layout/filter/FilterPattern'
import FilterColor from '@/components/layout/filter/FilterColor'
import FilterCategory from '@/components/layout/filter/FilterCategory'
import FilterFinish from '@/components/layout/filter/FilterFinish'
import FilterHasPrice from '@/components/layout/filter/FilterHasPrice'
import FilterComplete from '@/components/layout/filter/FilterComplete'
import { computed, ref, watch } from 'vue'
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
    FilterContent
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
      const tempTagList = multipleSelect(selectedTagList.value, tag)
      store.dispatch('helper/search/setSelectedTagList', tempTagList)
      context.emit('search')
    }

    const onEnter = () => {
      context.emit('search')
    }

    const resetFilter = () => { store.dispatch('helper/search/resetFilter') }

    const multipleSelect = (arr, value) => {
      const tempArr = [...arr]
      const index = tempArr.findIndex(item => JSON.stringify(item) === JSON.stringify(value))

      if (!~index) {
        tempArr.push(value)
      } else {
        tempArr.splice(index, 1)
      }
      return tempArr
    }

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
