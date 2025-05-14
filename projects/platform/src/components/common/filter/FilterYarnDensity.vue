<template lang="pug">
filter-wrapper(
  iconName="yarn"
  :displayName="`${$t('RR0023')}/${$t('RR0024')}`"
  :dirty="filterDirty.densityAndYarn"
  :confirmDisabled="disabled"
  @confirm="updateYarnAndDensity"
)
  div(class="w-111")
    div(class="flex flex-col gap-y-5")
      div(class="flex gap-x-1.5")
        f-input-radio(
          v-model:inputValue="currentYarnType"
          :label="$t('RR0091')"
          :value="YARN_TYPE.WOVEN"
          iconSize="20"
        )
        f-button-label(size="sm" @click="clearYarnWoven") {{ $t('UU0040') }}
      f-input-container(:label="$t('RR0024')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="woven.warpDensity"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
          f-svg-icon(iconName="clear" size="20" class="text-grey-900")
          f-input-text(
            v-model:textValue="woven.weftDensity"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
      f-input-container(:label="$t('RR0023')")
        div(class="flex items-center gap-x-3")
          f-input-text(
            v-model:textValue="woven.warpYarnSize"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
          f-svg-icon(iconName="clear" size="20" class="text-grey-900")
          f-input-text(
            v-model:textValue="woven.weftYarnSize"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
    div(class="border-t border-grey-150 my-4 -mx-5")
    div(class="flex flex-col gap-y-5")
      div(class="flex gap-x-1.5")
        f-input-radio(
          v-model:inputValue="currentYarnType"
          :label="$t('RR0092')"
          :value="YARN_TYPE.KNIT"
          iconSize="20"
        )
        f-button-label(size="sm" @click="clearYarnKnit") {{ $t('UU0040') }}
      f-input-text(
        v-model:textValue="knit.knitYarnSize"
        :label="$t('RR0023')"
        :disabled="currentYarnType !== YARN_TYPE.KNIT"
        class="w-50"
      )
</template>

<script setup lang="ts">
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { ref, watch, reactive, computed } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { clone } from 'ramda'

const emit = defineEmits<{
  (e: 'search'): void
}>()

const filterStore = useFilterStore()
const { filterState, filterDirty } = storeToRefs(filterStore)

const YARN_TYPE = {
  WOVEN: 0,
  KNIT: 1,
}

const { densityAndYarn } = clone(filterState.value)
const woven = reactive(densityAndYarn.woven)
const knit = reactive(densityAndYarn.knit)
const currentYarnType = ref(
  knit.knitYarnSize === null ? YARN_TYPE.WOVEN : YARN_TYPE.KNIT
)

const disabled = computed(() => {
  if (currentYarnType.value === YARN_TYPE.WOVEN) {
    return (
      (woven.warpDensity === null || woven.warpDensity === '') &&
      (woven.weftDensity === null || woven.weftDensity === '') &&
      (woven.warpYarnSize === null || woven.warpYarnSize === '') &&
      (woven.weftYarnSize === null || woven.weftYarnSize === '')
    )
  } else {
    // YARN_TYPE.KNIT
    return knit.knitYarnSize === null || knit.knitYarnSize === ''
  }
})

const updateYarnAndDensity = () => {
  filterStore.setFilterStateByProperty('densityAndYarn', { woven, knit })
  emit('search')
}

const clearYarnWoven = () => {
  Object.keys(woven).forEach((key) => {
    woven[key as keyof typeof woven] = null
  })
}
const clearYarnKnit = () => {
  knit.knitYarnSize = null
}

watch(
  () => currentYarnType.value,
  () => {
    if (currentYarnType.value === YARN_TYPE.WOVEN) {
      clearYarnKnit()
    } else {
      clearYarnWoven()
    }
  }
)
</script>
