<template lang="pug">
modal-behavior(:header="$t('RR0146')")
  div(class="w-116.5 text-body2 leading-1.6 text-primary")
    p(v-if="!message" class="text-center") {{ $t("RR0147") }}
    p(v-else class="break-words") {{ message }}
</template>

<script setup>
defineProps({
  message: {
    required: true
  }
})
</script>
