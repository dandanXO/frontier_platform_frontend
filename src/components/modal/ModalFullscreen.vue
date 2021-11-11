<template lang="pug">
div(class="fixed inset-0 z-index:modal bg-black-0")
  suspense
    component(:is="component" v-bind="properties" class="h-screen overflow-y-auto")
    template(#fallback)
      modal-loading
</template>

<script>
import { defineAsyncComponent } from 'vue'
import ModalLoading from '@/components/modal/ModalLoading'

export default {
  name: 'ModalFullscreen',
  components: {
    ModalLoading,
    MaterialUpload: defineAsyncComponent(() => import('@/components/assets/material/edit/MaterialUpload.vue')),
    MaterialEdit: defineAsyncComponent(() => import('@/components/assets/material/edit/MaterialEdit.vue')),
    MaterialMerge: defineAsyncComponent(() => import('@/components/assets/material/MaterialMerge')),
    MaterialMergePreview: defineAsyncComponent(() => import('@/components/assets/material/MaterialMergePreview')),
    MaterialUploadSuccess: defineAsyncComponent(() => import('@/components/assets/material/edit/MaterialUploadSuccess.vue'))
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
