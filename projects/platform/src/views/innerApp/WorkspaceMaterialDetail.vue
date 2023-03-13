<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    material-detail-internal-header(
      :breadcrumbList="breadcrumbList"
      :material="material"
      @goToEdit="editMaterial(material.materialId, material.sourceAssetLocation)"
    )
    material-detail-internal(:material="material")
</template>

<script setup>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import useWorkspace from '@/composables/useWorkspace'
import MaterialDetailInternal from '@/components/common/material/detail/MaterialDetailInternal.vue'
import MaterialDetailInternalHeader from '@/components/common/material/detail/MaterialDetailInternalHeader.vue'

const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { editMaterial } = useWorkspace()
const { parsePath, prefixPath } = useNavigation()

await store.dispatch('workspace/getWorkspaceMaterial', {
  nodeKey: props.nodeKey,
  rank: Number(route.query.rank),
})

const material = computed(() => store.getters['workspace/material'])
const breadcrumbList = computed(() => {
  const defaultWorkspaceNodeKey =
    store.getters['workspace/defaultWorkspaceNodeKey']
  return [
    {
      name: t('FF0001'),
      path: parsePath(
        `${prefixPath.value}/workspace/${defaultWorkspaceNodeKey}`
      ),
    },
    ...store.getters['workspace/materialBreadcrumbList'].map(
      ({ name, nodeKey }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            path: parsePath(`${prefixPath.value}/workspace/${nodeKey}`),
          }
        } else {
          return {
            name: material.value.materialNo,
            path: parsePath(`${prefixPath.value}/workspace/material/:nodeKey`),
          }
        }
      }
    ),
  ]
})
</script>
