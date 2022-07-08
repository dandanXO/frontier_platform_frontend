<template lang="pug">
filter-wrapper(iconName="fabric" :displayName="$t('RR0087')" :dirty="filterDirty.category")
  contextual-menu(
    v-model:inputSelectValue="category"
    :selectMode="1"
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
  const { categoryList } = store.getters['code/filterOptionList']
  return {
    blockList: [
      {
        menuList: categoryList.map(({ key, list }) => ({
          title: key,
          blockList: [
            {
              menuList: list.map(({ displayName, value }) => ({
                title: displayName,
                selectValue: value
              }))
            }
          ]
        }))
      }
    ]
  }
})

const category = computed({
  get: () => store.getters['helper/search/filter'].category,
  set: (v) => store.dispatch('helper/search/setFilter', { category: v })
})
</script>
