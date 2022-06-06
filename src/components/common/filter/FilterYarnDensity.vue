<template lang="pug">
filter-wrapper(
  iconName="fabric_2"
  :displayName="`${$t('RR0023')}/${$t('RR0024')}`"
  :dirty="filterDirty.yarnAndDensity"
  @show="initFormYarnAndDensity"
)
  div(class="w-127 h-113 px-8 py-7.5 rounded card-shadow grid gap-y-7.5")
    div(class="flex flex-col gap-y-5")
      div(class="flex gap-x-1.5")
        input-radio(
          v-model:inputValue="currentYarnType"
          :name="$t('RR0091')"
          :value="YARN_TYPE.WOVEN"
          size="20"
        )
        btn-functional(size="sm" @click="clearYarnWoven") {{ $t("UU0040") }}
      input-container(:label="$t('RR0023')")
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="formYarnAndDensity.wovenWarpYarnCount"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
          svg-icon(iconName="clear" size="20" class="text-primary")
          input-text(
            v-model:textValue="formYarnAndDensity.wovenWeftYarnCount"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
      input-container(:label="$t('RR0024')")
        div(class="flex items-center gap-x-3")
          input-text(
            v-model:textValue="formYarnAndDensity.warpDensity"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
          svg-icon(iconName="clear" size="20" class="text-primary")
          input-text(
            v-model:textValue="formYarnAndDensity.weftDensity"
            :disabled="currentYarnType !== YARN_TYPE.WOVEN"
            class="w-50"
          )
    div(class="flex flex-col gap-y-5")
      div(class="flex gap-x-1.5")
        input-radio(
          v-model:inputValue="currentYarnType"
          :name="$t('RR0092')"
          :value="YARN_TYPE.KNIT"
          size="20"
        )
        btn-functional(size="sm" @click="clearYarnKnit") {{ $t("UU0040") }}
      input-text(
        v-model:textValue="formYarnAndDensity.knitYarnCount"
        :label="$t('RR0023')"
        :disabled="currentYarnType !== YARN_TYPE.KNIT"
        class="w-50"
      )
    btn(size="sm" class="justify-self-center" @click="updateYarnAndDensity") {{ $t("UU0001") }}
</template>

<script>
import FilterWrapper from '@/components/common/filter/FilterWrapper.vue'
import { computed, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'FilterYarnDensity',
  components: {
    FilterWrapper
  },
  setup () {
    const YARN_TYPE = {
      WOVEN: 0,
      KNIT: 1
    }
    const store = useStore()
    const filter = computed(() => store.getters['helper/search/filter'])
    const filterDirty = computed(() => store.getters['helper/search/filterDirty'])
    const currentYarnType = ref(0)
    const formYarnAndDensity = reactive({
      wovenWarpYarnCount: null,
      wovenWeftYarnCount: null,
      knitYarnCount: null,
      warpDensity: null,
      weftDensity: null
    })

    const initFormYarnAndDensity = () => {
      currentYarnType.value = filter.value.knitYarnCount === null
        ? YARN_TYPE.WOVEN
        : YARN_TYPE.KNIT
      Object.keys(formYarnAndDensity).forEach(key => {
        formYarnAndDensity[key] = filter.value[key]
      })
    }
    const updateYarnAndDensity = () => {
      store.dispatch('helper/search/setFilter', formYarnAndDensity)
    }

    const clearYarnWoven = () => {
      formYarnAndDensity.wovenWarpYarnCount = null
      formYarnAndDensity.wovenWeftYarnCount = null
      formYarnAndDensity.warpDensity = null
      formYarnAndDensity.weftDensity = null
    }
    const clearYarnKnit = () => {
      formYarnAndDensity.knitYarnCount = null
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

    return {
      YARN_TYPE,
      filterDirty,
      currentYarnType,
      formYarnAndDensity,
      initFormYarnAndDensity,
      updateYarnAndDensity,
      clearYarnWoven,
      clearYarnKnit
    }
  }
}
</script>
