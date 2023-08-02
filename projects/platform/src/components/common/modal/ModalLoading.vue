<template lang="pug">
div(
  class="fixed inset-0 z-loading w-screen h-screen bg-grey-900/70 flex justify-center items-center"
)
  div(
    class="flex flex-col items-center justify-center w-49 h-28 px-13 py-7 rounded"
    :class="[theme === THEME.LIGHT ? 'bg-grey-0 shadow-32' : 'bg-grey-800']"
  )
    f-svg-icon(
      iconName="loading"
      size="92"
      class="text-primary-500"
      :style="{ minHeight: '28px' }"
    )
    p(
      class="text-body2 pt-3.5"
      :class="[theme === THEME.LIGHT ? 'text-grey-900' : 'text-grey-100']"
    ) {{ $t('RR0162') }}
</template>

<script setup lang="ts">
import { THEME } from '@/utils/constants'

withDefaults(
  defineProps<{
    theme?: `${THEME}`
  }>(),
  {
    theme: THEME.LIGHT,
  }
)
</script>
