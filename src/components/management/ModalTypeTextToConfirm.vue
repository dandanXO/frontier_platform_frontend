<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="$t('UU0013')"
  :primaryBtnDisabled="confirmText !== props.slotValue"
  :textBtnText="$t('UU0026')"
  @click:primary="innerConfirmHandler"
  @click:text="closeModal"
)
  div(class="w-94")
    i18n-t(:keypath="keypath" tag="p" class="text-primary mb-4 text-body2 leading-1.6")
      template(v-slot:[slotName])
        br
        strong {{ slotValue }}
    input-text(v-model:textValue="confirmText" class="w-full" size="lg" :placeholder="slotValue")
      template(#errorMsg v-if="isError")
        p(class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{ errorMsg }}
</template>
<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
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
})

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
</script>
