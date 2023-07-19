<template lang="pug">
div(class="grid grid-cols-3 bg-grey-800 py-4")
  tap-status(
    class="col-start-2 justify-self-center"
    :cropMode="cropMode"
    @update:cropMode="(v) => emit('update:cropMode', v)"
  )
  div(class="col-start-3 justify-self-end pr-8")
    f-button(
      :theme="THEME.DARK"
      type="text"
      size="sm"
      prependIcon="restore_original_state"
      @click="emit('restore')"
    ) {{ $t('EE0149') }}
</template>

<script setup lang="ts">
import TapStatus from '@/components/assets/modalU3mRecut/TapStatus.vue'
import { THEME, type CROP_MODE } from '@/utils/constants'

defineProps<{ cropMode: CROP_MODE }>()

const emit = defineEmits<{
  (e: 'restore'): void
  (e: 'update:cropMode', v: CROP_MODE): void
}>()
</script>

<style scoped></style>
