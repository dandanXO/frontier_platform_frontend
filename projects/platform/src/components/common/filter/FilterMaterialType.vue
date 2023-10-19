<template lang="pug">
filter-wrapper(
  iconName="category"
  :displayName="$t('MI0003')"
  :dirty="filterDirty.materialTypeList"
  :confirmButton="false"
)
  f-contextual-menu(
    v-model:inputSelectValue="materialTypeList"
    :selectMode="CONTEXTUAL_MENU_MODE.MULTIPLE"
    :menuTree="menuTree"
    class="-mx-5 -my-4"
  )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { computed } from 'vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const { t } = useI18n()
const filterStore = useFilterStore()
const { filterDirty, filterState } = storeToRefs(filterStore)

const menuTree = computed(() => {
  return {
    blockList: [
      {
        menuList: [
          t('RR0091'),
          t('RR0092'),
          t('MI0018'),
          t('MI0020'),
          t('Composite'),
          t('MI0021'),
          t('MI0022'),
        ].map((displayName, index) => ({
          title: displayName,
          selectValue: index + 1,
        })),
      },
    ],
  }
})

const materialTypeList = computed({
  get: () => filterState.value.materialTypeList,
  set: (v) => {
    filterStore.setFilterStateByProperty('materialTypeList', v)
    emit('search')
  },
})
</script>
