<template lang="pug">
div
  material-detail-internal(
    :material="nodeMaterial.material"
    :locationList="locationList"
    class="mx-auto w-230 pb-25"
  )
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MaterialDetailInternal from '@/components/common/material/detail/internal/MaterialDetailInternal.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import useCurrentUnit from '@/composables/useCurrentUnit'
import type { WorkspaceNodeMaterial } from '@frontier/platform-web-sdk'
import { useSearchStore } from '@/stores/search'
import isShowCarbonEmissionValue from '@/utils/material/isShowCarbonEmissionValue'

const props = defineProps<{
  nodeId: string
}>()

const { t } = useI18n()
const { ogNodeId } = useCurrentUnit()
const { getSearchLog } = useSearchStore()
const { ogBaseWorkspaceApi } = useWorkspaceStore()
const { goToWorkspace, goToWorkspaceMaterialDetail } = useNavigation()

const res = await ogBaseWorkspaceApi('getWorkspaceMaterial', {
  nodeId: Number(props.nodeId),
  searchLog: getSearchLog(),
})
if (isShowCarbonEmissionValue(res.data.result.workspaceNodeMaterial.material)) {
  res.data.result.workspaceNodeMaterial.material!.carbonEmission!.co2 = null
  res.data.result.workspaceNodeMaterial.material!.carbonEmission!.land = null
  res.data.result.workspaceNodeMaterial.material!.carbonEmission!.lastUpdateTime =
    null
  res.data.result.workspaceNodeMaterial.material!.carbonEmission!.water = null
}
const nodeMaterial = ref<WorkspaceNodeMaterial>(
  res.data.result.workspaceNodeMaterial
)

const locationList = computed(() => {
  return [
    {
      name: t('FF0001'),
      goTo: () => {
        goToWorkspace({}, ogNodeId.value)
      },
    },
    ...nodeMaterial.value.nodeMeta.locationList.map(
      ({ name, nodeId }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            goTo: () => {
              goToWorkspace({}, nodeId)
            },
          }
        } else {
          return {
            name: nodeMaterial.value.material.itemNo,
            goTo: () => {},
          }
        }
      }
    ),
  ]
})
</script>
