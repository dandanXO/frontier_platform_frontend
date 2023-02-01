<template lang="pug">
span(class="w-[1px] h-6" :class="[bgColor]")
</template>

<script setup lang="ts">
const props = defineProps<{ color: 'white' | 'black' }>()
const bgColor = props.color === 'white' ? 'bg-grey-150' : 'bg-grey-700'
</script>

<style scoped></style>
