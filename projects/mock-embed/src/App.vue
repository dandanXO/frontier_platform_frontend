<template lang="pug">
main
  div
    input#two(
      type="radio"
      v-model="embedType"
      :value="EMBED_TYPE['3D_VIEWER']"
    )
    label(for="two") {{ '3D Viewer' }}
    input#one(type="radio" v-model="embedType" :value="EMBED_TYPE.PAGE")
    label(for="one") {{ 'Page' }}
  embed-3D-viewer(v-if="embedType === EMBED_TYPE['3D_VIEWER']")
  embed-page(v-if="embedType === EMBED_TYPE.PAGE")
</template>

<script setup lang="ts">
import Embed3DViewer from '@/components/Embed3DViewer.vue'
import EmbedPage from '@/components/EmbedPage.vue'
import { ref } from 'vue'

const EMBED_TYPE = {
  '3D_VIEWER': 0,
  PAGE: 1,
}

const embedType = ref(EMBED_TYPE['3D_VIEWER'])
</script>

<style scoped>
main {
  height: 100%;
  width: 100%;
}
</style>
