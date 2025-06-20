<template lang="pug">
//- div(class="text-xl font-bold text-black") {{ $t('UU0191') }}
div(class="flex items-center justify-center")
  f-svg-icon(iconName="upload_now" size="104")
div
  div(class="w-full h-4 overflow-hidden rounded-full bg-grey-50-v1")
    div(
      class="h-4 transition-all duration-300 rounded-full bg-green-500-v1"
      :style="{ width: `${progressPercentage}%` }"
    )

  div(class="flex justify-between mt-2 text-xs text-red-500-v1") 
    div(class="") {{ $t('UU0192') }}
    div(class="font-bold text-black text-body2") {{ progressPercentage }}%

button(
  @click="onHandleCancel"
  class="flex justify-center w-full h-auto py-2 font-bold border border-red-200 hover:bg-red-50-v1 rounded-xl text-red-500-v1"
) 
  div(class="mr-1")
    f-svg-icon(iconName="stop_upload" size="24")
  div {{ $t('UU0193') }}
</template>

<script setup lang="ts">
import { THEME } from '@/utils/constants'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

const progressPercentage = computed(() => {
  const ratio =
    store.state.assets.progressLoaded / store.state.assets.progressTotal
  return isNaN(ratio * 100) ? 0 : Math.round(ratio * 100)
})

withDefaults(
  defineProps<{
    theme?: `${THEME}`
    hasUpload?: boolean
    onHandleCancel?: () => void
  }>(),
  {
    theme: THEME.LIGHT,
    hasUpload: false,
  }
)
</script>
