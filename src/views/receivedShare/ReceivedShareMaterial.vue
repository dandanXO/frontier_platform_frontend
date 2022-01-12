<template lang="pug">
div(class="pt-13 w-full h-full flex justify-center")
  div(v-if="!isLoading" class="w-230 h-fit pb-25")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{`${material.materialNo} ${material.description}`}}
        svg-icon(iconName="clone" class="text-black-700 cursor-pointer" size="24" @click="cloneReceivedShare([share.workspaceNodeId])")
    material-detail-external(:material="material" :isCanDownloadU3M="share.isCanDownloadU3M")
  div(v-else class="h-full flex justify-center items-center")
    svg-icon(iconName="loading" size="92" class="text-brand-dark")
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import MaterialDetailExternal from '@/components/layout/materialDetail/MaterialDetailExternal.vue'
import useReceivedShare from '@/composables/useReceivedShare.js'

export default {
  name: 'ReceivedShareMaterial',
  components: {
    MaterialDetailExternal
  },
  setup () {
    const store = useStore()
    const { cloneReceivedShare } = useReceivedShare()

    const isLoading = ref(true)
    const share = computed(() => store.getters['share/share'])
    const material = computed(() => store.getters['share/material'])

    onMounted(async () => {
      await store.dispatch('share/getShareReceivedMaterial', { sharingKey: share.value.sharingKey, workspaceNodeId: share.value.workspaceNodeId })
      isLoading.value = false
    })

    return {
      isLoading,
      material,
      share,
      cloneReceivedShare
    }
  }
}

</script>
