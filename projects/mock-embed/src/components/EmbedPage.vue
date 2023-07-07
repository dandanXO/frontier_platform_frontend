<template lang="pug">
#container
  div
    span url
    input(v-model="embedCode")
  #embed-container(v-html="embedCode")
</template>

<script setup lang="ts">
import { ref } from 'vue'

const embedCode = ref('')
</script>

<style scoped>
#container {
  height: 100%;
  width: 100%;
}
#embed-container {
  height: 100%;
  width: 100%;
}
</style>
