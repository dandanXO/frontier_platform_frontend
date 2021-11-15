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
    MaterialMerge: defineAsyncComponent(() => import('@/components/assets/material/MaterialMerge')),
    MaterialMergePreview: defineAsyncComponent(() => import('@/components/assets/material/MaterialMergePreview'))
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
