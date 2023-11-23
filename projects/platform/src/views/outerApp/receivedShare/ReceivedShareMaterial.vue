<template lang="pug">
div(class="w-full")
  //- BreadCrumb
  global-breadcrumb-list(
    :breadcrumbList="locationList"
    @click:item="$event.goTo()"
    fontSize="text-caption"
  )
  div(class="w-full flex justify-between pt-6 relative")
</template>

<script setup lang="ts">
import { computed, toRefs, reactive } from 'vue'
import { useReceivedShareStore } from '@/stores/receivedShare'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const { goToReceivedShare } = useNavigation()
const { ogBaseReceivedShareApi } = useReceivedShareStore()
const { getSearchLog } = useSearchStore()

const res = await ogBaseReceivedShareApi('getReceivedShareMaterial', {
  sharingKey: props.sharingKey,
  nodeId: Number(props.nodeId),
  searchLog: getSearchLog(),
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
