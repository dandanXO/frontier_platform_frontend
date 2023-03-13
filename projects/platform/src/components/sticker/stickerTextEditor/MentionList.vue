<template lang="pug">
div(class="w-50 py-2 bg-grey-0 drop-shadow-16 rounded")
  div(v-if="items.length" class="max-h-63 overflow-y-scroll")
    div(
      v-for="(item, index) in items"
      class="h-9 px-4 flex items-center gap-x-2 hover:bg-grey-100 cursor-pointer"
      :class="{ 'bg-grey-100': index === selectedIndex }"
      :key="index"
      @click="selectItem(index)"
    )
      img(class="w-6 h-6 rounded-full" src="https://picsum.photos/100")
      span(class="text-body2 text-grey-900") {{ item.name }}
  div(v-else class="h-9 px-4 flex items-center text-body2 text-grey-400") No Result
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },

  command: {
    type: Function,
    required: true,
  },
})

const selectedIndex = ref(0)

watch(
  () => props.items,
  () => (selectedIndex.value = 0)
)

const onKeyDown = ({ event }) => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

const upHandler = () => {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex.value)
}

const selectItem = (index) => {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}

defineExpose({
  onKeyDown,
  upHandler,
  downHandler,
  enterHandler,
  selectItem,
})
</script>
