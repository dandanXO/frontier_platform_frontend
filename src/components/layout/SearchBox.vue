<style lang="scss" scoped>
.hide-scroll-bar {
  &::-webkit-scrollbar {
    // Chrome, Safari and Opera
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

<template lang="pug">
div(class="grid" :class="{ 'border-b border-primary-thin': !isOpenFilterPanel }")
  div(class="justify-self-center my-3.5 w-200 h-11 bg-black-100 rounded-full px-7.5 flex items-center gap-x-4.5")
    div(class="flex-grow flex items-center")
      svg-icon(
        v-if="isEmpty" class="pr-1"
        size="24"
        iconName="search"
        class="text-black-400"
      )
      input(
        type="text"
        :value="textValue"
        :placeholder="$t('RR0053')"
        @input="typing"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.enter="onEnter"
        class="flex-grow outline-none bg-transparent overflow-hidden text-primary text-body2 placeholder-black-400 placeholder-text-body2 placeholder-overflow-visible disabled:text-black-600"
      )
      svg-icon(
        v-if="!isEmpty"
        size="24"
        iconName="clear"
        class="text-black-500 cursor-pointer"
        @click="clear"
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
  div(v-if="innerTagList.length > 0" class="flex items-center gap-x-2 overflow-x-auto hide-scroll-bar pb-5 pl-7.5")
    chip(
      v-for="tag in innerTagList"
      size="lg"
      :text="tag.name"
      @click="selectTag(tag)"
      :class="{ 'bg-primary': tag.isSelected }"
    )
  div(v-if="isOpenFilterPanel" class="px-7.5")
    div(class="bg-black-50 p-5 rounded")
      div(class="flex items-end pb-4")
        p(class="text-body1 text-primary") {{$t('RR0085')}}
        p(class="text-caption text-black-500 pl-3 cursor-pointer" @click="clearAllFilter") {{$t('UU0041')}}
      div(class="flex flex-wrap gap-x-2 gap-y-4")
        filter-wrapper(iconName="fabric" :displayName="$t('RR0087')")
        filter-wrapper(iconName="ingredient" :displayName="$t('RR0021')" :dirty="filterDirty.contentList")
          list(class="min-w-57.5 absolute z-10 top-full left-0 transform translate-y-2 bg-black-0")
            overlay-scrollbar-container(class="max-h-72")
              list-item(
                v-for="content in filterOptions.contentList"
                :class="{ 'bg-black-200': content.isSelected }"
                @click="filterMultipleSelectHandler('contentList', content.value)"
                class="justify-between"
              )
                p {{content.displayName}}
                svg-icon(v-if="content.isSelected" iconName="done" size="20" class="text-brand")
        filter-wrapper(iconName="pattern" :displayName="$t('RR0025')")
        filter-wrapper(iconName="color-circle" :displayName="$t('RR0026')")
        filter-wrapper(iconName="measure" :displayName="`${$t('RR0088')}/${$t('RR0015')}`")
        filter-wrapper(iconName="fabric_2" :displayName="`${$t('RR0023')}/${$t('RR0024')}`")
        filter-wrapper(iconName="deal" :displayName="$t('RR0022')" :dirty="filterDirty.finishList")
          list(class="min-w-57.5 absolute z-10 top-full left-0 transform translate-y-2 bg-black-0")
            overlay-scrollbar-container(class="max-h-72")
              list-item(
                v-for="finish in filterOptions.finishList"
                :class="{ 'bg-black-200': finish.isSelected }"
                @click="filterMultipleSelectHandler('finishList', finish.value)"
                class="justify-between"
              )
                p {{finish.displayName}}
                svg-icon(v-if="finish.isSelected" iconName="done" size="20" class="text-brand")
        filter-wrapper(iconName="stock" :displayName="$t('RR0093')")
        filter-wrapper(iconName="price" :displayName="$t('RR0094')")
        filter-wrapper(iconName="paper" :displayName="$t('RR0098')" :dirty="filterDirty.complete")
          list(class="min-w-57.5 absolute z-10 top-full left-0 transform translate-y-2 bg-black-0")
            overlay-scrollbar-container(class="max-h-72")
              list-item(
                v-for="complete in filterOptions.completeList"
                :class="{ 'bg-black-200': complete.code === innerFilter.complete }"
                @click="filterSingleSelectHandler('complete', complete.code)"
                class="justify-between"
              )
                p {{complete.text}}
                svg-icon(v-if="complete.code === innerFilter.complete" iconName="done" size="20" class="text-brand")

</template>

<script>
import useInput from '@/composables/useInput'
import FilterWrapper from '@/components/layout/FilterWrapper'
import { toRefs, computed, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'SearchBox',
  components: {
    FilterWrapper
  },
  props: {
    textValue: {
      type: String,
      required: true
    },
    tagList: {
      type: Array,
      default: () => []
    },
    selectedTagList: {
      type: Array,
      default: () => []
    },
    filter: {
      type: Object,
      default: () => { }
    }
  },
  emits: ['update:textValue', 'update:selectedTagList', 'update:filter', 'blur', 'search', 'resetFilter'],
  setup (props, context) {
    const store = useStore()
    const { textValue } = toRefs(props)
    const { isFocus, onFocus, onBlur, clear, typing, isEmpty } = useInput({ context, textValue })
    const isOpenFilterPanel = ref(false)

    const innerTagList = computed(() => {
      return props.tagList.map(tag => ({
        ...tag,
        isSelected: props.selectedTagList.some(selectedTag => selectedTag.name === tag.name)
      }))
    })

    const innerFilter = computed({
      get: () => props.filter,
      set: (v) => context.emit('update:filter', v)
    })

    const filterOptions = computed(() => {
      const filterOptionList = store.getters['code/filterOptionList']

      return {
        contentList: filterOptionList.contentList.map(content => ({
          ...content,
          isSelected: innerFilter.value.contentList.some(value => value === content.value)
        })),
        finishList: filterOptionList.finishList.map(finish => ({
          ...finish,
          isSelected: innerFilter.value.finishList.some(value => value === finish.value)
        })),
        completeList: filterOptionList.completeList
      }
    })

    const filterDirty = computed(() => {
      return {
        contentList: innerFilter.value.contentList.length !== 0,
        finishList: innerFilter.value.finishList.length !== 0,
        complete: !!innerFilter.value.complete
      }
    })

    const selectTag = (tag) => {
      delete tag.isSelected
      const tempTagList = multipleSelect(props.selectedTagList, tag)

      context.emit('update:selectedTagList', tempTagList)
      context.emit('search')
    }

    const onEnter = () => {
      context.emit('search')
    }

    const clearAllFilter = () => {
      context.emit('resetFilter')
      context.emit('search')
    }

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

    const filterMultipleSelectHandler = (key, value) => {
      innerFilter.value[key] = multipleSelect(innerFilter.value[key], value)
      context.emit('search')
    }

    const filterSingleSelectHandler = (key, value) => {
      if (innerFilter.value[key] === value) {
        innerFilter.value[key] = null
      } else {
        innerFilter.value[key] = value
      }
      context.emit('search')
    }

    return {
      isFocus,
      onFocus,
      onBlur,
      clear,
      typing,
      isEmpty,
      selectTag,
      innerTagList,
      onEnter,
      isOpenFilterPanel,
      innerFilter,
      filterOptions,
      filterMultipleSelectHandler,
      filterSingleSelectHandler,
      clearAllFilter,
      filterDirty
    }
  }
}
</script>
