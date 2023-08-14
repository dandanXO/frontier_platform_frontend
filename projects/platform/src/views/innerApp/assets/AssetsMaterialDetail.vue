<template lang="pug">
div
  div(class="mx-auto w-230 h-fit pb-25")
    material-detail-internal-header(
      :breadcrumbList="breadcrumbList"
      :material="material"
      @goToEdit="goToAssetMaterialEdit(material)"
    )
    material-detail-internal(:material="material")
</template>

<script>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MaterialDetailInternal from '@/components/common/material/detail/MaterialDetailInternal.vue'
import MaterialDetailInternalHeader from '@/components/common/material/detail/MaterialDetailInternalHeader.vue'

export default {
  name: 'AssetsMaterialDetail',
  components: {
    MaterialDetailInternal,
    MaterialDetailInternalHeader,
  },
  async setup() {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath, goToAssetMaterialEdit } = useNavigation()

    await store.dispatch('assets/getMaterial', {
      materialId: route.params.materialId,
    })

    const material = computed(() => store.getters['assets/material'])
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbList = computed(() => {
      const prefix =
        routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
      return [
        {
          name: t('DD0044'),
          path: parsePath(`${prefix}/assets`),
        },
        {
          name: material.value.materialNo,
          path: parsePath(`${prefix}/assets/:materialId`),
        },
      ]
    })
    return {
      material,
      breadcrumbList,
      goToAssetMaterialEdit,
    }
  },
}
</script>
