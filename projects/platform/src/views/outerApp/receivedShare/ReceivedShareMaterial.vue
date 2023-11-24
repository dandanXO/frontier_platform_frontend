<style lang="scss" scoped>
.rwd {
  &-outer-external {
    &-content {
      @apply flex;
      @apply desktop:flex-row flex-col;
      @apply desktop:justify-between;
      @apply desktop:gap-y-0 gap-y-10;
    }
    &-material {
      &-image {
        @apply desktop:w-[57%] w-full;
        @apply desktop:sticky desktop:top-10;
      }
      &-info {
        @apply desktop:w-[40%] w-full;
      }
    }
  }
}
</style>

<template lang="pug">
div(class="w-full mx-auto rwd-outer-external-container")
  //- BreadCrumb
  global-breadcrumb-list(
    :breadcrumbList="locationList"
    @click:item="$event.goTo()"
    fontSize="text-caption"
    class="mt-8 mb-6"
  )
  div(v-if="!isDesktop" class="mb-6")
    //- Org Name
    p(class="text-body2 text-grey-900 mb-3") {{ nodeMeta.unitName }}
    //- Item No
    h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
  div(class="relative w-full rwd-outer-external-content")
    material-detail-external-image(
      :material="material"
      class="rwd-outer-external-material-image h-fit"
    )
    div(class="rwd-outer-external-material-info mb-24")
      div(v-if="isDesktop" class="mb-6")
        //- Org Name
        p(class="text-body2 text-grey-900 mb-3") {{ nodeMeta.unitName }}
        //- Item No
        h4(class="text-h4 text-grey-900 font-bold") {{ material.itemNo }}
      //- Material Info
      material-detail-info(
        :material="material"
        :publishedDate="shareInfo?.shareDate"
      )
</template>

<script setup lang="ts">
import { computed, toRefs, reactive } from 'vue'
import { useReceivedShareStore } from '@/stores/receivedShare'
import { useSearchStore } from '@/stores/search'
import useNavigation from '@/composables/useNavigation'
import MaterialDetailExternalImage from '@/components/common/material/detail/external/MaterialDetailExternalImage.vue'
import MaterialDetailInfo from '@/components/common/material/detail/external/MaterialDetailInfo.vue'
import { storeToRefs } from 'pinia'
import { useBreakpoints } from '@frontier/lib'

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const { isDesktop } = useBreakpoints()
const { goToReceivedShare } = useNavigation()
const receivedShareStore = useReceivedShareStore()
const { ogBaseReceivedShareApi } = receivedShareStore
const { shareInfo } = storeToRefs(receivedShareStore)
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
