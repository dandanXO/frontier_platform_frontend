<template lang="pug">
div
  div(@click="isExpand ? collapse() : expand()")
    slot(name="trigger" :isExpand="isExpand")
  slot(v-if="isExpand" name="content")
</template>

<script>
export default {
  name: 'ExpansionPanel'
}
</script>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['expand', 'collapse'])
const isExpand = ref(false)

const expand = () => {
  isExpand.value = true
  emit('expand')
}

const collapse = () => {
  isExpand.value = false
  emit('collapse')
}
</script>
