<template lang="pug">
filter-wrapper(
  iconName="fabric"
  :displayName="$t('RR0087')"
  :dirty="filterDirty.category"
)
  f-contextual-menu(
    class="w-40"
    v-model:inputSelectValue="category"
    :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_CANCEL"
    :menuTree="menuTree"
  )
</template>

<script setup>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'

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
                selectValue: value,
              })),
            },
          ],
        })),
      },
    ],
  }
})

const category = computed({
  get: () => store.getters['helper/search/filter'].category,
  set: (v) => store.dispatch('helper/search/setFilter', { category: v }),
})
</script>
