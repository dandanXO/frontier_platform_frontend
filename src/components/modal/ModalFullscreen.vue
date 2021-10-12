<template lang="pug">
div(class="fixed inset-0 z-index:modal bg-black-0")
  component(:is="component" class="h-screen overflow-y-auto")
</template>

<script>
import MaterialUpload from '@/components/assets/material/edit/MaterialUpload.vue'

export default {
  name: 'ModalFullscreen',
  components: {
    MaterialUpload
  },
  props: {
    component: {
      type: String,
      required: true
    }
  }
}
</script>
