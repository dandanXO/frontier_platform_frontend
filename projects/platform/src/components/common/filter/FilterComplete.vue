<template lang="pug">
filter-wrapper(iconName="paper" :displayName="$t('RR0098')" :dirty="filterDirty.complete")
  f-contextual-menu(
    v-model:inputSelectValue="complete"
    :selectMode="1"
    :menuTree="menuTree"
  )
</template>

<script setup>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { FILTER_COMPLETE } from '@/utils/constants'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
const menuTree = computed(() => {
  return {
    blockList: [
      {
        menuList: Object.keys(FILTER_COMPLETE).map(key => {
          const { text, value } = FILTER_COMPLETE[key]
          return {
            title: text,
            selectValue: value
          }
        })
      }
    ]
  }
})

const complete = computed({
  get: () => store.getters['helper/search/filter'].complete,
  set: (v) => store.dispatch('helper/search/setFilter', { complete: v })
})
</script>
