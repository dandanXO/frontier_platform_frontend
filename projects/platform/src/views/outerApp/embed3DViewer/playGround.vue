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
)
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { type Material3DViewerShare } from '@frontier/platform-web-sdk/src/api'
import { useAssetsStore } from '@/stores/assets'

const { ogBaseAssetsApi } = useAssetsStore()

const getMaterial = async (materialId: number) => {
  const { data } = await ogBaseAssetsApi('getAssetsMaterial', {
    materialId,
  })
  return data.result.material
}

// const paramsHash = ref(route.params?.paramsHash)

const infoResult = ref<Material3DViewerShare | null>(null)
onMounted(async () => {
  const material = await getMaterial(179449)
  infoResult.value = {
    u3mSpecUrl: material.u3m.u3mSpecUrl,
    baseImgUrl: material.u3m.baseImgUrl,
    normalImgUrl: material.u3m.normalImgUrl,
    roughImgUrl: material.u3m.roughImgUrl,
    dispImgUrl: material.u3m.dispImgUrl,
    metalImgUrl: material.u3m.metalImgUrl,
    alphaImgUrl: material.u3m.alphaImgUrl,
    frontierNo: material.faceSide.frontierNo,
    dpi: 600,
  } as Material3DViewerShare
})
onBeforeUnmount(() => {
  const appVueElement = document.getElementById('appVue')
  if (appVueElement) {
    appVueElement.style.backgroundColor = ''
  }
})
</script>

<style scoped></style>
