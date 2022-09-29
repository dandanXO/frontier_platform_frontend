<template lang="pug">
div
  div(@click="isExpand ? collapse() : expand()")
    slot(name="trigger" :isExpand="isExpand")
  slot(v-if="isExpand" name="content")
</template>

<script>
export default {
  name: 'FExpansionPanel'
}
</script>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isExpand: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['expand', 'collapse'])
const isExpand = ref(props.isExpand)

const expand = () => {
  isExpand.value = true
  emit('expand')
}

const collapse = () => {
  isExpand.value = false
  emit('collapse')
}
</script>
