<template lang="pug">
filter-wrapper(
  iconName="co2"
  :displayName="$t('RR0219')"
  :dirty="filterDirty.withOutEcoImpactor"
  :confirmButton="false"
  :disabled="disabled"
)
  p(v-if="disabled" class="max-w-72") {{ $t('VV0047') }}
  f-contextual-menu(
    v-else
    v-model:inputSelectValue="hasU3M"
    :selectMode="CONTEXTUAL_MENU_MODE.SINGLE_CANCEL"
    :menuTree="menuTree"
    class="-mx-5 -my-4"
  )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { CONTEXTUAL_MENU_MODE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { useStore } from 'vuex'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const { t } = useI18n()
const store = useStore()
const filterStore = useFilterStore()
const { filterDirty, filterState } = storeToRefs(filterStore)
const valueAddedService = computed(
  () => store.getters['polling/valueAddedService']
)
const disabled = computed(
  () => !valueAddedService.value.made2flow.planStatus.ACTIVATE
)

const menuTree = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: t('RR0250'),
          selectValue: true,
        },
      ],
    },
  ],
}))

const hasU3M = computed({
  get: () => filterState.value.withOutEcoImpactor,
  set: (v) => {
    filterStore.setFilterStateByProperty('withOutEcoImpactor', v)
    emit('search')
  },
})
</script>
