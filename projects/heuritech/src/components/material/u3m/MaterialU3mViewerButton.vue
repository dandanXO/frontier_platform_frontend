<template lang="pug">
f-button(
  size="md"
  type="secondary"
  :disabled="disabled"
  @click="openModal3DViewer"
) {{ $t('UU0006') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import { U3M_STATUS } from '@/utils/constants'
import { useModalStore } from '@/stores/modal'

const props = defineProps<{
  materialId: number
  u3m: MaterialCustomU3m | MaterialU3m
}>()

const modalStore = useModalStore()

const status = computed(() => props.u3m.status)
const disabled = computed(() => status.value !== U3M_STATUS.COMPLETED)

const openModal3DViewer = () => {
  modalStore.openModalBehavior({
    component: 'modal-3d-viewer',
    properties: {
      materialId: props.materialId,
      u3m: props.u3m,
    },
  })
}
</script>
