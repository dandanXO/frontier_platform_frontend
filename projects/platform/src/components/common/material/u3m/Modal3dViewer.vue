<template lang="pug">
model-editor(
  :dpi="u3m.dpi"
  :u3mPath="u3m.u3mSpecUrl"
  :baseImgUrl="u3m.baseImgUrl"
  :normalImgUrl="u3m.normalImgUrl"
  :roughImgUrl="u3m.roughImgUrl"
  :dispImgUrl="u3m.dispImgUrl"
  :metalImgUrl="u3m.metalImgUrl"
  :material="material"
  :withColorSetting="$store.getters['permission/enable3DViewerColor']"
  :alphaImgUrl="u3m.alphaImgUrl"
  :orgId="orgId"
  @close="$store.dispatch('helper/closeModalBehavior')"
)
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type {
  Material,
  MaterialCustomU3m,
  MaterialU3m,
} from '@frontier/platform-web-sdk'
import useLogSender from '@/composables/useLogSender'

const props = defineProps<{
  materialId: number
  material: Material
  u3m: Required<MaterialCustomU3m | MaterialU3m>
}>()

const store = useStore()

const orgId = computed(() => store.getters['organization/orgId'] as number)

const logSender = useLogSender()

logSender.createViewerLog(props.materialId)
</script>
