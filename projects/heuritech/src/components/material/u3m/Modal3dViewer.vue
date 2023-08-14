<template lang="pug">
model-editor(
  :dpi="u3m.dpi"
  :u3mPath="u3m.u3mSpecUrl"
  :baseImgUrl="u3m.baseImgUrl"
  :normalImgUrl="u3m.normalImgUrl"
  :roughImgUrl="u3m.roughImgUrl"
  :dispImgUrl="u3m.dispImgUrl"
  @close="modalStore.closePipeline"
)
</template>

<script setup lang="ts">
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import ModelEditor from '@frontier/3d-viewer/src/components/ModelEditor.vue'
import { useModalStore } from '@/stores/modal'

const props = defineProps<{
  materialId: number
  u3m: Required<MaterialCustomU3m | MaterialU3m>
}>()

const modalStore = useModalStore()
</script>
