<template lang="pug">
div(
  class="w-full h-full flex justify-center"
  :class="{ 'pt-13': breadcrumbList.length === 1 }"
)
  div(v-if="!isLoading" class="w-230 h-fit pb-25")
    material-detail-external-header(
      :breadcrumbList="breadcrumbList"
      :material="material"
      @clone="receivedShareCloneByNodeKey(nodeKey)"
    )
    material-detail-external(
      :material="material"
      :isCanDownloadU3M="share.isCanDownloadU3M"
    )
  div(v-else class="h-full flex justify-center items-center")
    f-svg-icon(iconName="loading" size="92" class="text-primary-500")
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'
import MaterialDetailExternalHeader from '@/components/common/material/detail/MaterialDetailExternalHeader.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'

const props = defineProps({
  sharingKey: {
    type: String,
    required: true,
  },
  nodeKey: {
    type: String,
    required: true,
  },
})

const store = useStore()
const route = useRoute()
const { receivedShareCloneByNodeKey } = useReceivedShare()

const isLoading = ref(true)
const share = computed(() => store.getters['receivedShare/share'])
const material = computed(() => store.getters['receivedShare/material'])
const breadcrumbList = computed(() => {
  return store.getters['receivedShare/materialBreadcrumbList'].map(
    ({ name, nodeKey }, index, array) => {
      if (index !== array.length - 1) {
        return {
          name,
          path: `/received-share/${props.sharingKey}/${nodeKey}`,
        }
      } else {
        return {
          name: material.value.materialNo,
          path: `/received-share/${props.sharingKey}/material/${nodeKey}`,
        }
      }
    }
  )
})

onMounted(async () => {
  await store.dispatch('receivedShare/getShareReceivedMaterial', {
    sharingKey: props.sharingKey,
    nodeKey: props.nodeKey,
    rank: Number(route.query.rank),
  })
  isLoading.value = false
})
</script>
