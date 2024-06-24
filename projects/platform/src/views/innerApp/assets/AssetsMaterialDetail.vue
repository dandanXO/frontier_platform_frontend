<template lang="pug">
div
  material-detail-internal(
    v-if="material"
    :material="material"
    :locationList="locationList"
    class="mx-auto w-230 pb-25"
  )
</template>

<script setup lang="ts">
import MaterialDetailInternal from '@/components/common/material/detail/internal/MaterialDetailInternal.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAssetsStore } from '@/stores/assets'
import useNavigation from '@/composables/useNavigation'
import { useSearchStore } from '@/stores/search'
import isShowCarbonEmissionValue from '@/utils/material/isShowCarbonEmissionValue'

const props = defineProps<{
  materialId: string
}>()

const { t } = useI18n()
const { goToAssets, goToAssetMaterialDetail } = useNavigation()
const { ogBaseAssetsApi } = useAssetsStore()
const { getSearchLog } = useSearchStore()

const { data } = await ogBaseAssetsApi('getAssetsMaterial', {
  materialId: Number(props.materialId),
  searchLog: getSearchLog(),
})
if (isShowCarbonEmissionValue(data.result?.material)) {
  data.result.material!.carbonEmission!.co2 = null
  data.result.material!.carbonEmission!.land = null
  data.result.material!.carbonEmission!.lastUpdateTime = null
  data.result.material!.carbonEmission!.water = null
}
const material = ref(data.result.material)

const locationList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: material.value?.itemNo ?? '',
      goTo: goToAssetMaterialDetail.bind(null, {}, Number(props.materialId)),
    },
  ]
})
</script>
