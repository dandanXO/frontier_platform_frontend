<template lang="pug">
div
  div(@click="isExpand ? collapse() : expand()")
    slot(name="trigger" :isExpand="isExpand")
  transition(appear)
    div(v-show="isExpand")
      slot(name="content")
</template>

<script>
export default {
  name: 'FExpansionPanel',
}
</script>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isExpand: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['expand', 'collapse', 'update:isExpand'])
const isExpand = ref(props.isExpand)

const expand = () => {
  isExpand.value = true
  emit('expand')
  emit('update:isExpand', true)
}

const collapse = () => {
  isExpand.value = false
  emit('collapse')
  emit('update:isExpand', false)
}
</script>
