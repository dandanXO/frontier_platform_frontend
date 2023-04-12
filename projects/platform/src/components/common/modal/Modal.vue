<template lang="pug">
div(
  class="fixed inset-0 z-modal w-screen h-screen bg-grey-900/40 flex justify-center items-center"
)
  div(class="w-screen h-screen" @click="closable && close()")
  div(class="absolute bg-grey-0 rounded shadow-32")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center")
      p(v-if="header !== ''" class="text-h6 font-bold text-grey-900") {{ header }}
      f-svg-icon(
        v-if="closable"
        iconName="clear"
        size="24"
        class="justify-self-end cursor-pointer text-grey-600"
        @click="close"
      )
    component(:is="component" v-bind="properties")
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Modal',
  components: {
    ModalPreviewAttachment: defineAsyncComponent(() =>
      import(
        '@/components/common/material/attachment/ModalPreviewAttachment.vue'
      )
    ),
    ModalU3mRecut: defineAsyncComponent(() =>
      import('@/components/assets/modalU3mRecut/ModalU3mRecut.vue')
    ),
    ModalMaterialMerge: defineAsyncComponent(() =>
      import('@/components/assets/merge/ModalMaterialMerge.vue')
    ),
    ModalMaterialMergePreview: defineAsyncComponent(() =>
      import('@/components/assets/merge/ModalMaterialMergePreview.vue')
    ),
    ModalChoosePlan: defineAsyncComponent(() =>
      import('@/components/billings/ModalChoosePlan.vue')
    ),
    ModalPlanIntroduction: defineAsyncComponent(() =>
      import('@/components/billings/ModalPlanIntroduction.vue')
    ),
    ModalPreviewInvoice: defineAsyncComponent(() =>
      import('@/components/billings/ModalPreviewInvoice.vue')
    ),
    ModalNewFeatureReminder: defineAsyncComponent(() =>
      import('@/components/common/ModalNewFeatureReminder.vue')
    ),
  },
  props: {
    component: {
      type: String,
      required: true,
    },
    header: {
      type: String,
      default: '',
    },
    properties: {
      type: Object,
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const store = useStore()
    const close = () => {
      store.dispatch('helper/closeModal')
    }

    return {
      close,
    }
  },
}
</script>
