<template lang="pug">
div(class="w-full h-full flex justify-center" :class="{ 'pt-13': breadcrumbList.length === 1 }")
  div(v-if="!isLoading" class="w-230 h-fit pb-25 px-4 box-content")
    div(class="flex items-center pt-12 pb-9")
      img(:src="logo" class="w-10 h-10 rounded-full mr-2.5")
      breadcrumb(v-if="breadcrumbList.length > 1" :breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
    material-detail-external(:material="material" :isCanDownloadU3M="share.isCanDownloadU3M")
  div(v-else class="h-full flex justify-center items-center")
    svg-icon(iconName="loading" size="92" class="text-brand-dark")

div(class="fixed z-footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
  img(src="@/assets/images/frontier_logo.png" class="w-20.5 h-4 mr-2")
  p(class="text-body2 text-primary") {{ $t("GG0004") }}
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'

const store = useStore()

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
const isLoading = ref(true)
const share = computed(() => store.getters['embed/share'])
const logo = computed(() => store.getters['embed/logo'])
const material = computed(() => store.getters['embed/material'])
const breadcrumbList = computed(() => {
  return store.getters['embed/materialBreadcrumbList'].map(({ name, nodeKey }, index, array) => {
    if (index !== array.length - 1) {
      return {
        name,
        path: `/embed/${props.sharingKey}/${nodeKey}`
      }
    } else {
      return {
        name: material.value.materialNo,
        path: `/embed/${props.sharingKey}/material/${nodeKey}`
      }
    }
  })
})

onMounted(async () => {
  await store.dispatch('embed/getEmbedMaterial', { sharingKey: props.sharingKey, nodeKey: props.nodeKey })
  isLoading.value = false
})
</script>
