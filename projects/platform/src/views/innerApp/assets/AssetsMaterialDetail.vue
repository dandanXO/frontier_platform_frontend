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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAssetsStore } from '@/stores/assets'
import { storeToRefs } from 'pinia'
import useNavigation from '@/composables/useNavigation'

const props = defineProps<{
  materialId: string
}>()

const { t } = useI18n()
const { goToAssets, goToAssetMaterialDetail } = useNavigation()
const assetsStore = useAssetsStore()
const { material } = storeToRefs(assetsStore)

await assetsStore.getAssetsMaterial(Number(props.materialId))

const locationList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: material.value?.itemNo ?? '',
      goTo: goToAssetMaterialDetail.bind(null, Number(props.materialId)),
    },
  ]
})
</script>
