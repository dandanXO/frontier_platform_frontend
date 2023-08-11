<template lang="pug">
modal-behavior(:header="$t('RR0146')")
  div(class="w-80 xl:w-116.5 text-body2 leading-1.6 text-grey-900")
    p(v-if="!message" class="text-center") {{ $t('RR0147') }}
    p(v-else class="break-words") {{ message }}
</template>

<script setup>
defineProps({
  message: {
    required: true,
  },
})
</script>
