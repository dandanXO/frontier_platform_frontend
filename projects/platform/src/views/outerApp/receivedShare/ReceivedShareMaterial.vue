<template lang="pug">
material-detail-outer-external(
  :material="material"
  :nodeMeta="nodeMeta"
  :locationList="locationList"
)
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOuterStore } from '@/stores/outer'
import useNavigation from '@/composables/useNavigation'
import MaterialDetailOuterExternal from '@/components/common/material/detail/external/MaterialDetailOuterExternal.vue'

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const { goToReceivedShare } = useNavigation()
const outerStore = useOuterStore()
const { getReceivedShareMaterial } = outerStore

await getReceivedShareMaterial(props.sharingKey, Number(props.nodeId))
const material = computed(() => outerStore.material!)
const nodeMeta = computed(() => outerStore.nodeMeta!)

const locationList = computed(() => {
  return nodeMeta.value.locationList.map(({ name, nodeId }, index, array) => {
    if (index !== array.length - 1) {
      return {
        name,
        goTo: () => {
          goToReceivedShare(props.sharingKey, nodeId)
        },
      }
    } else {
      return {
        name: material.value.itemNo!,
        goTo: () => {},
      }
    }
  })
})
</script>
