<template lang="pug">
div(class="fixed inset-0 z-index:modal bg-black-0")
  component(:is="component" v-bind="properties" class="h-screen overflow-y-auto")
</template>

<script>
import MaterialUpload from '@/components/assets/material/edit/MaterialUpload.vue'
import MaterialMerge from '@/components/assets/material/MaterialMerge'
import MaterialMergePreview from '@/components/assets/material/MaterialMergePreview'
import MaterialUploadSuccess from '@/components/assets/material/edit/MaterialUploadSuccess.vue'

export default {
  name: 'ModalFullscreen',
  components: {
    MaterialUpload,
    MaterialMerge,
    MaterialMergePreview,
    MaterialUploadSuccess
  },
  props: {
    component: {
      type: String,
      required: true
    },
    properties: {
      type: Object
    }
  }
}
</script>
