<template lang="pug">
div(class="text-black font-bold text-xl") {{ $t('UU0191') }}
div(class="flex justify-center items-center")
  f-svg-icon(iconName="upload_now" size="104")
div
  div(class="w-full bg-grey-50-v1 h-4 overflow-hidden rounded-full")
    div(
      class="bg-green-500-v1 transition-all duration-300 h-4 rounded-full"
      :style="{ width: `${progressPercentage}%` }"
    )

  div(class="text-red-500-v1 text-xs flex justify-between mt-2") 
    div(class="") {{ $t('UU0192') }}
    div(class="text-body2 text-black font-bold") {{ progressPercentage }}%

button(
  @click="onHandleCancel"
  class="hover:bg-red-50-v1 h-auto py-2 w-full border border-red-200 rounded-xl text-red-500-v1 font-bold flex justify-center"
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
