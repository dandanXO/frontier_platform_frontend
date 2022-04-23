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
  props: {
    nodeKey: {
      type: [Number, String],
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const { receivedShareCloneByNodeKey } = useReceivedShare()

    const isLoading = ref(true)
    const share = computed(() => store.getters['receivedShare/share'])
    const material = computed(() => store.getters['receivedShare/material'])
    const breadcrumbList = computed(() => {
      const materialBreadcrumbList = store.getters['receivedShare/materialBreadcrumbList']
      const list = []
      for (let i = 0; i <= materialBreadcrumbList.length - 1; i++) {
        const { name, nodeKey } = materialBreadcrumbList[i]
        if (i !== materialBreadcrumbList.length - 1) {
          list.push({
            name,
            path: `/received-share/collection?sharingKey=${share.value.sharingKey}&nodeKey=${nodeKey}`
          })
        } else {
          list.push({
            name: material.value.materialNo,
            path: `/received-share/material/${nodeKey}?sharingKey=${share.value.sharingKey}`
          })
        }
      }
      return list
    })

    onMounted(async () => {
      await store.dispatch('receivedShare/getShareReceivedMaterial', { sharingKey: share.value.sharingKey, nodeKey: props.nodeKey })
      isLoading.value = false
    })

    return {
      isLoading,
      material,
      share,
      receivedShareCloneByNodeKey,
      breadcrumbList
    }
  }
}

</script>
