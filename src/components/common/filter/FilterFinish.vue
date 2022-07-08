<template lang="pug">
filter-wrapper(iconName="deal" :displayName="$t('RR0022')" :dirty="filterDirty.finishList")
  contextual-menu(
    v-model:inputSelectValue="finishList"
    :selectMode="3"
    :menuTree="menuTree"
  )
</template>

<script setup>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
const menuTree = computed(() => {
  const { finishList } = store.getters['code/filterOptionList']
  return {
    blockList: [
      {
        menuList: finishList.map(({ displayName, value }) => ({
          title: displayName,
          selectValue: value
        }))
      }
    ]
  }
})

const finishList = computed({
  get: () => store.getters['helper/search/filter'].finishList,
  set: (v) => store.dispatch('helper/search/setFilter', { finishList: v })
})
</script>
