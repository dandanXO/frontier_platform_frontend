<template lang="pug">
filter-wrapper(
  iconName="cube"
  :displayName="$t('RR0132')"
  :dirty="filterDirty.hasU3M"
)
  f-contextual-menu(
    v-model:inputSelectValue="hasU3M"
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
          title: t('RR0100'),
          selectValue: true,
        },
        {
          title: t('RR0101'),
          selectValue: false,
        },
      ],
    },
  ],
}))

const hasU3M = computed({
  get: () => store.getters['helper/search/filter'].hasU3M,
  set: (v) => store.dispatch('helper/search/setFilter', { hasU3M: v }),
})
</script>
