<template lang="pug">
modal-behavior(:header="$t('RR0146')" :footer="!isMobile")
  div(
    class="w-[min(446px,calc(100vw_-_80px_-_40px))] text-body2 leading-1.6 text-grey-900"
  )
    p(v-if="!message" class="text-center") {{ $t('RR0147') }}
    p(v-else class="break-words") {{ message }}
</template>

<script setup lang="ts">
import { useBreakpoints } from '@frontier/lib'

defineProps<{
  message: string | null
}>()

const { isMobile } = useBreakpoints()
</script>
