<template lang="pug">
div
</template>

<script setup lang="ts">
import { useReceivedShareStore } from '@/stores/receivedShare'
import { storeToRefs } from 'pinia'
import { NodeType } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'

const props = defineProps<{
  sharingKey: string
}>()

const receivedShareStore = useReceivedShareStore()
const { getReceivedShareInfo } = receivedShareStore
const { shareInfo } = storeToRefs(receivedShareStore)
const { goToReceivedShare, goToReceivedShareMaterial } = useNavigation()

await getReceivedShareInfo(props.sharingKey)

if (!shareInfo.value) {
  throw 'shareInfo is not found'
}

if (shareInfo.value.nodeType === NodeType.MATERIAL) {
  goToReceivedShareMaterial(props.sharingKey, shareInfo.value.nodeId)
} else {
  goToReceivedShare(props.sharingKey, shareInfo.value.nodeId)
}
</script>
