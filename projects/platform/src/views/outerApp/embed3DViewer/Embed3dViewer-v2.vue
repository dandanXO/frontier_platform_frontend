<template lang="pug">
model-editor(
  v-if="!!infoResult"
  :dpi="infoResult?.dpi || 600"
  :u3mPath="infoResult?.u3mSpecUrl"
  :baseImgUrl="infoResult?.baseImgUrl"
  :normalImgUrl="infoResult?.normalImgUrl"
  :roughImgUrl="infoResult?.roughImgUrl"
  :dispImgUrl="infoResult?.dispImgUrl"
  :metalImgUrl="infoResult.metalImgUrl"
  :alphaImgUrl="infoResult.alphaImgUrl"
  :frontierNo="infoResult.frontierNo"
  :withClose="false"
)
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useOuterStore } from '@/stores/outer'
import { useRoute } from 'vue-router'
import { type Material3DViewerShare } from '@frontier/platform-web-sdk/src/api'

const outerStore = useOuterStore()
const route = useRoute()

const paramsHash = ref(route.params?.paramsHash)

const infoResult = ref<Material3DViewerShare | null>(null)
outerStore
  .get3dViewShareInfo(paramsHash.value as string)
  .then((res) => {
    infoResult.value = res as unknown as Material3DViewerShare
  })
  .catch((error) => {
    console.error('Error fetching 3D view share info:', error)
  })
onBeforeMount(() => {
  const appVueElement = document.getElementById('appVue')
  if (appVueElement) {
    appVueElement.style.backgroundColor = '#000'
  }
})
onBeforeUnmount(() => {
  const appVueElement = document.getElementById('appVue')
  if (appVueElement) {
    appVueElement.style.backgroundColor = ''
  }
})
</script>

<style scoped></style>
