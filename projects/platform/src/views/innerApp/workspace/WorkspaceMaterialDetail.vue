<template lang="pug">
div
  material-detail-internal(
    :material="nodeMaterial.material"
    :locationList="locationList"
    class="mx-auto pb-25"
  )
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkspaceStore } from '@/stores/workspace'
import MaterialDetailInternal from '@/components/common/material/detail/internal/MaterialDetailInternal.vue'
import useCurrentUnit from '@/composables/useCurrentUnit'
import type { WorkspaceNodeMaterial } from '@frontier/platform-web-sdk'
import { useSearchStore } from '@/stores/search'
import assignCarbonEmissionValue from '@/utils/material/assignCarbonEmissionValue'

const props = defineProps<{
  nodeId: string
}>()
const { t } = useI18n()
const { ogNodeId } = useCurrentUnit()
const { getSearchLog } = useSearchStore()
const { ogBaseWorkspaceApi } = useWorkspaceStore()
const { goToWorkspace } = useNavigation()

const res = await ogBaseWorkspaceApi('getWorkspaceMaterial', {
  nodeId: Number(props.nodeId),
  searchLog: getSearchLog(),
})

const workspaceMaterial = res.data.result.workspaceNodeMaterial

workspaceMaterial.material = assignCarbonEmissionValue(
  workspaceMaterial.material
)

const nodeMaterial = ref<WorkspaceNodeMaterial>(workspaceMaterial)

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
