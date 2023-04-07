<template lang="pug">
div(
  class="w-full h-full flex justify-center"
  :class="{ 'pt-13': breadcrumbList.length === 1 }"
)
  div(v-if="!isLoading" class="w-230 h-fit pb-25 px-4 box-content")
    div(class="flex items-center pt-12 pb-9")
      img(:src="logo" class="w-10 h-10 rounded-full mr-2.5")
      global-breadcrumb-list(
        v-if="breadcrumbList.length > 1"
        :breadcrumbList="breadcrumbList"
        @click:item="$router.push($event.path)"
      )
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-grey-900 font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
        digital-thread-entrance(
          :material="material"
          :drawerOpenFromLocationList="drawerOpenFromLocationList"
        )
    material-detail-external(
      isEmbed
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
import DigitalThreadEntrance from '@/components/sticker/DigitalThreadEntrance.vue'
import useStickerLocationList from '@/composables/useStickerLocationList'

const store = useStore()
const route = useRoute()

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
const isLoading = ref(true)
const share = computed(() => store.getters['embed/share'])
const logo = computed(() => store.getters['embed/logo'])
const material = computed(() => store.getters['embed/material'])
const breadcrumbList = computed(() => {
  return store.getters['embed/materialBreadcrumbList'].map(
    ({ name, nodeKey }, index, array) => {
      if (index !== array.length - 1) {
        return {
          name,
          path: `/embed/${props.sharingKey}/${nodeKey}`,
        }
      } else {
        return {
          name: material.value.materialNo,
          path: `/embed/${props.sharingKey}/material/${nodeKey}`,
        }
      }
    }
  )
})

onMounted(async () => {
  await store.dispatch('embed/getEmbedMaterial', {
    sharingKey: props.sharingKey,
    nodeKey: props.nodeKey,
    rank: Number(route.query.rank),
  })
  isLoading.value = false
})

const drawerOpenFromLocationList = useStickerLocationList(
  breadcrumbList.value.map((item) => item.name)
)
</script>
