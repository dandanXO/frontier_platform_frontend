<template lang="pug">
span(class="w-px h-8.5 bg-grey-700" :class="size === 'sm' ? 'h-6' : 'h-8.5'")
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ size?: 'sm' | 'lg' }>()
const size = computed(() => props.size || 'sm')
</script>

<style scoped></style>
