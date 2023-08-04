<template lang="pug">
f-button(
  size="md"
  type="secondary"
  :disabled="disabled"
  @click="openModalModelEditor"
) {{ $t('UU0006') }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useModelEditor from '@/composables/useModelEditor'
import type { MaterialCustomU3m, MaterialU3m } from '@frontier/platform-web-sdk'
import { U3M_STATUS } from '@/utils/constants'

const props = defineProps<{
  materialId: number
  u3m: MaterialCustomU3m | MaterialU3m
}>()

const status = computed(() => props.u3m.status)
const disabled = computed(() => status.value !== U3M_STATUS.COMPLETED)

const { openModalModelEditor } = useModelEditor({
  materialId: props.materialId,
  u3m: props.u3m,
})
</script>
