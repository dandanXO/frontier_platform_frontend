<template lang="pug">
#container
  div
    span url
    input(v-model="embedCode")
  #embed-container(v-html="embedCode")
</template>

<script setup lang="ts">
import { ref } from 'vue'

const embedCode = ref(
  '<iframe width="100%" height="100%" src="http://localhost:8080/embed/102FF4/1-dsds" title="Frontier.cool" frameborder="0"></iframe>'
)
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
