<template lang="pug">
modal-behavior(
  :header="$t('RR0234')"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="w-145")
    indicator-methodology
</template>

<script setup lang="ts">
import IndicatorMethodology from '@/components/billings/IndicatorMethodology.vue'
</script>
