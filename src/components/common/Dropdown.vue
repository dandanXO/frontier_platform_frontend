<template lang="pug">
div(ref="rootElement" class="dropdown relative cursor-pointer" @click="isExpand ? collapse() : expand()")
  slot(name="displayItem" :isExpand="isExpand" :currentIndex="currentIndex" :option="options[currentIndex]")
  slot(name="dropdownList" v-if="isExpand" :select="select" :currentIndex="currentIndex")
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Dropdown',
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  setup () {
    const isExpand = ref(false)
    const currentIndex = ref(0)
    const rootElement = ref(null)

    const expand = () => {
      document.addEventListener('click', captureOutsideClick)
      isExpand.value = true
    }

    const collapse = () => {
      document.removeEventListener('click', captureOutsideClick)
      isExpand.value = false
    }

    const captureOutsideClick = (e) => {
      if (e.target.closest('.dropdown') !== rootElement.value) {
        collapse()
      }
    }

    const select = (e, index) => {
      e.stopPropagation()

      currentIndex.value = index
      collapse()
    }

    return {
      isExpand,
      currentIndex,
      expand,
      collapse,
      select,
      rootElement
    }
  }
}
</script>
