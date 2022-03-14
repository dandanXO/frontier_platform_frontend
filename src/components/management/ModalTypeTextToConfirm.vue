<template lang="pug">
div(class="w-100")
  div(class="px-8")
    h6(class="text-h6 text-primary font-bold pb-4 text-center") {{title}}
    i18n-t(:keypath="keypath" tag="p" class="text-primary text-center pb-4")
      template(v-slot:[slotName])
        br
        strong {{slotValue}}
    div(class="pb-6 flex justify-center")
      input-text(v-model:textValue="confirmText" class="w-80" size="lg" :placeholder="slotValue")
        template(#errorMsg v-if="isError")
          p(class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{errorMsg}}
    btn-group(
      class="h-25"
      :primaryText="$t('UU0002')"
      @click:primary="closeModal"
      :secondaryText="$t('UU0001')"
      :secondaryButtonDisabled="!confirmText"
      @click:secondary="innerConfirmHandler"
    )
</template>
<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalTypeTextToConfirm',
  props: {
    title: {
      type: String,
      required: true
    },
    keypath: {
      type: String,
      required: true
    },
    slotName: {
      type: String,
      required: true
    },
    slotValue: {
      type: String,
      required: true
    },
    errorMsg: {
      type: String,
      required: true
    },
    confirmHandler: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const store = useStore()

    const confirmText = ref('')
    const isError = ref(false)

    const closeModal = () => store.dispatch('helper/closeModal')

    const innerConfirmHandler = () => {
      if (confirmText.value !== props.slotValue) {
        return (isError.value = true)
      }
      props.confirmHandler()
    }

    watch(
      () => confirmText.value,
      () => {
        isError.value = false
      }
    )

    return {
      confirmText,
      isError,
      innerConfirmHandler,
      closeModal
    }
  }
}
</script>
