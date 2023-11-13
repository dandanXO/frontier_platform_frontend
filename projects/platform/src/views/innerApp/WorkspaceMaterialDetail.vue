<template lang="pug">
div
  material-detail-internal(
    :material="nodeMaterial.material"
    :locationList="breadcrumbList"
    class="mx-auto w-230 pb-25"
  )
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import MaterialDetailInternal from '@/components/common/material/detail/internal/MaterialDetailInternal.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import useCurrentUnit from '@/composables/useCurrentUnit'
import type { WorkspaceNodeMaterial } from '@frontier/platform-web-sdk'

const props = defineProps<{
  nodeId: string
}>()

const { t } = useI18n()
const route = useRoute()
const { ogNodeId } = useCurrentUnit()
const { ogBaseWorkspaceApi } = useWorkspaceStore()
const { goToWorkspace, goToWorkspaceMaterialDetail } = useNavigation()

const res = await ogBaseWorkspaceApi('getWorkspaceMaterial', {
  nodeId: Number(props.nodeId),
  searchLog: {
    keyword: '',
    rank: Number(route.query.rank),
  },
})
const nodeMaterial = ref<WorkspaceNodeMaterial>(
  res.data.result.workspaceNodeMaterial
)

const breadcrumbList = computed(() => {
  return [
    {
      name: t('FF0001'),
      goTo: goToWorkspace.bind(null, {}, ogNodeId.value),
    },
    ...nodeMaterial.value.nodeMeta.locationList.map(
      ({ name, nodeId }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            goTo: goToWorkspace.bind(null, {}, nodeId),
          }
        } else {
          return {
            name: nodeMaterial.value.material.itemNo,
            goTo: goToWorkspaceMaterialDetail.bind(null, {}, nodeId),
          }
        }
      }
    ),
  ]
})
</script>
