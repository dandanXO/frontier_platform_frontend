<template lang="pug">
filter-wrapper(
  iconName="co2"
  :displayName="$t('RR0254')"
  :dirty="filterDirty.made2Flow"
  :disabled="disabled"
)
  p(v-if="disabled" class="max-w-72") {{ $t("VV0047") }}
  f-contextual-menu(
    v-else
    v-model:inputSelectValue="made2Flow"
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
const valueAddedService = computed(() => store.getters['polling/valueAddedService'])
const disabled = computed(() => !valueAddedService.value.made2flow.planStatus.ACTIVATE)
const menuTree = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: t('RR0250'),
          selectValue: 1
        }
      ]
    }
  ]
}))

const made2Flow = computed({
  get: () => store.getters['helper/search/filter'].made2Flow,
  set: (v) => store.dispatch('helper/search/setFilter', { made2Flow: v })
})
</script>
