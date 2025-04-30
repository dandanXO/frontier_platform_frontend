<template lang="pug">
material-detail-external-outer(
  :material="material"
  :nodeMeta="nodeMeta"
  :locationList="locationList"
  :showReachOutEmailCategory="reachOutEmailCategory.EmbededDetailPage"
)
</template>

<script setup lang="ts">
import { computed, toRefs, reactive } from 'vue'
import { useOuterStore } from '@/stores/outer'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'
import MaterialDetailExternalOuter from '@/components/common/material/detail/external/MaterialDetailExternalOuter.vue'
import { reachOutEmailCategory } from '@/utils/constants'

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const { goToEmbed } = useNavigation()
const outerStore = useOuterStore()
const { getSearchLog } = useSearchStore()

const res = await outerStore.ogBaseEmbedApi('getEmbedMaterial', {
  sharingKey: props.sharingKey,
  nodeId: Number(props.nodeId),
  searchLog: getSearchLog(),
  privateInfo: outerStore.getPrivateInfo(),
})

const { material, nodeMeta } = toRefs(
  reactive(res.data.result.workspaceNodeMaterial)
)

const locationList = computed(() => {
  return nodeMeta.value.locationList.map(({ name, nodeId }, index, array) => {
    if (index !== array.length - 1) {
      return {
        name,
        goTo: () => {
          goToEmbed(props.sharingKey, nodeId)
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
