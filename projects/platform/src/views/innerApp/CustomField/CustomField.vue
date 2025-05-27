<template>
  <div class="px-8 py-16 h-full flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <p class="text-2xl font-bold">{{ $t('RR0518') }}</p>
      <div class="max-w-[600px] text-sm">
        <p class="text-grey-700-v1">
          {{ $t('RR0519') }}
        </p>
        <p class="text-cyan-500-v1 font-semibold underline">
          {{ $t('RR0520') }}
        </p>
      </div>
    </div>
    <AllForm />
  </div>
</template>

<script lang="ts" setup>
import AllForm from './AllForm.vue'
</script>
