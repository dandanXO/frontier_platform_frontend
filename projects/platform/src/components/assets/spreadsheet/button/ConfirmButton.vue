<template lang="pug">
f-button(type="primary" size="md") {{ $t('UU0001') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
