<template lang="pug">
modal-behavior(
  :header="$t('RR0234')"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
  :footer="!isMobile"
)
  div(class="w-[min(540px,calc(100vw_-_80px_-_40px))]")
    indicator-methodology
</template>

<script setup lang="ts">
import IndicatorMethodology from '@/components/billings/IndicatorMethodology.vue'
import { useBreakpoints } from '@frontier/lib'

const { isMobile } = useBreakpoints()
</script>
