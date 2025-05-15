<template lang="pug">
div
</template>

<script setup lang="ts">
import { useOuterStore } from '@/stores/outer'
import { storeToRefs } from 'pinia'
import { NodeType } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{
  sharingKey: string
}>()

const router = useRouter()
const route = useRoute()
const outerStore = useOuterStore()
const { getReceivedShareInfo } = outerStore
const { shareInfo } = storeToRefs(outerStore)
const { goToReceivedShare, goToReceivedShareMaterial } = useNavigation()

await getReceivedShareInfo(props.sharingKey)

if (!shareInfo.value) {
  throw 'shareInfo is not found'
}

if (shareInfo.value.nodeType === NodeType.MATERIAL) {
  const open3d = router.currentRoute.value.query.open3d === 'true'
  goToReceivedShareMaterial(
    props.sharingKey,
    shareInfo.value.nodeId,
    undefined,
    open3d,
    route.query
  )
} else {
  goToReceivedShare(props.sharingKey, shareInfo.value.nodeId, route.query)
}
</script>
