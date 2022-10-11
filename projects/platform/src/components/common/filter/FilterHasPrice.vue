<template lang="pug">
filter-wrapper(iconName="price" :displayName="$t('RR0094')" :dirty="filterDirty.hasPrice")
  f-contextual-menu(
    v-model:inputSelectValue="hasPrice"
    :selectMode="1"
    :menuTree="menuTree"
  )
</template>

<script setup>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()

const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
const menuTree = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: t('RR0096'),
          selectValue: true
        },
        {
          title: t('RR0097'),
          selectValue: false
        }
      ]
    }
  ]
}))

const hasPrice = computed({
  get: () => store.getters['helper/search/filter'].hasPrice,
  set: (v) => store.dispatch('helper/search/setFilter', { hasPrice: v })
})
</script>
