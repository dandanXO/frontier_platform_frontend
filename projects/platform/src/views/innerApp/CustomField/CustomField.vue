<template>
  <div class="flex flex-col h-full gap-8 px-8 py-16">
    <div class="flex flex-col gap-3">
      <p class="text-2xl font-bold">{{ t('RR0518') }}</p>
      <div class="max-w-[600px] text-sm">
        <p class="text-grey-700-v1">
          {{ t('RR0519') }}
        </p>
        <p class="font-semibold underline text-cyan-500-v1">
          {{ t('RR0520') }}
        </p>
      </div>
    </div>
    <AllForm />
  </div>
</template>

<script lang="ts" setup>
import AllForm from './AllForm.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
