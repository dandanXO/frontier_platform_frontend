<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(v-if="!isLoading" class="px-5 md:px-0 md:w-230 h-fit pb-25")
    material-detail-external-header(
      :breadcrumbList="breadcrumbList"
      :material="material"
      :canClone="false"
    )
      template(#slot:logo)
        img(:src="logo" class="w-10 h-10 rounded-full mr-2.5")
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
import MaterialDetailExternalHeader from '@/components/common/material/detail/MaterialDetailExternalHeader.vue'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'

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
</script>
