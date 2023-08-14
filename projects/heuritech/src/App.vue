<template lang="pug">
div(class="h-full flex flex-col relative")
  header(
    class="flex justify-between items-center px-30 py-5 sticky top-0 z-40 bg-grey-0"
    :class="{ 'shadow-4': isScrolling }"
  )
    img(
      class="w-15 h-15"
      src="https://www.heuritech.com/wp-content/uploads/2021/03/heuritech_min.svg"
    )
    div(class="flex items-center gap-x-8")
      a(href="https://www.heuritech.com/heuritech-suite/") SOLUTIONS
      a(href="https://www.heuritech.com/our-success-stories/") CUSTOMERS
      a(href="https://www.heuritech.com/heuritech-suite/#") RESOURCES
      a(
        href="https://www.heuritech.com/get-a-demo/"
        class="py-3 px-4 bg-grey-900 rounded-full text-grey-200"
      ) BOOK DEMO
  main(class="flex-grow")
    router-view
modal-pipeline
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ModalPipeline from '@/components/modal/ModalPipeline.vue'

const isScrolling = ref(false)
const checkIfScrolling = () => {
  isScrolling.value = document.querySelector('html')!.scrollTop > 0
}

onMounted(() => {
  window.addEventListener('scroll', checkIfScrolling)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkIfScrolling)
})
</script>
