<template lang="pug">
div(class="w-full h-full flex justify-center" :class="{ 'pt-13': breadcrumbList.length === 1 }")
  div(v-if="!isLoading" class="w-230 h-fit pb-25")
    breadcrumb(v-if="breadcrumbList.length > 1" class="pt-12 pb-9" :breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
        tooltip(placement="bottom")
          template(#trigger)
            svg-icon(iconName="clone" class="text-black-700 cursor-pointer hover:text-brand" size="24" @click="receivedShareCloneByNodeKey(nodeKey)")
          template(#content)
            p(class="text-caption text-primary px-3 py-1") {{ $t("RR0056") }}
    material-detail-external(:material="material" :isCanDownloadU3M="share.isCanDownloadU3M")
  div(v-else class="h-full flex justify-center items-center")
    svg-icon(iconName="loading" size="92" class="text-brand-dark")
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'

const props = defineProps({
  sharingKey: {
    type: String,
    required: true
  },
  nodeKey: {
    type: String,
    required: true
  }
})

const store = useStore()
const { receivedShareCloneByNodeKey } = useReceivedShare()

const isLoading = ref(true)
const share = computed(() => store.getters['receivedShare/share'])
const material = computed(() => store.getters['receivedShare/material'])
const breadcrumbList = computed(() => {
  return store.getters['receivedShare/materialBreadcrumbList'].map(({ name, nodeKey }, index, array) => {
    if (index !== array.length - 1) {
      return {
        name,
        path: `/received-share/${props.sharingKey}/${nodeKey}`
      }
    } else {
      return {
        name: material.value.materialNo,
        path: `/received-share/${props.sharingKey}/material/${nodeKey}`
      }
    }
  })
})

onMounted(async () => {
  await store.dispatch('receivedShare/getShareReceivedMaterial', { sharingKey: props.sharingKey, nodeKey: props.nodeKey })
  isLoading.value = false
})
</script>
