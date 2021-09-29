<template lang="pug">
div(class="fixed inset-0 z-index:modal bg-black-0")
  component(:is="component")
</template>

<script>
import MaterialUpload from '@/components/material/MaterialUpload.vue'

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
