<template lang="pug">
div
  material-detail-internal(
    :material="material"
    :breadcrumbList="breadcrumbList"
    class="mx-auto w-230 pb-25"
  )
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
// import { useRoute } from 'vue-router'
import MaterialDetailInternal from '@/components/common/material/detail/internal/MaterialDetailInternal.vue'
import { useAssetsStore } from '@/stores/assets'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const store = useStore()
// const route = useRoute()
const { parsePath } = useNavigation()
const assetsStore = useAssetsStore()
const { material } = storeToRefs(assetsStore)

// await assetsStore.getAssetsMaterial(route.params.materialId)

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const breadcrumbList = computed(() => {
  const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
  return [
    {
      name: t('RR0008'),
      path: parsePath(`${prefix}/assets`),
    },
    {
      name: material.value.itemNo,
      path: parsePath(`${prefix}/assets/:materialId`),
    },
  ]
})
</script>
