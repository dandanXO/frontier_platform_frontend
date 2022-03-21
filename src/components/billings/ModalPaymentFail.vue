<template lang="pug">
div(class="w-100 px-8 flex flex-col items-center")
  svg-icon(iconName="cancel" size="80" class="text-warn mt-7")
  h6(class="text-h6 font-bold text-primary mt-5") {{title}}
  p(class="text-body2 line-height-1.6 text-primary mt-7.5 text-center") {{content}}
  btn-group(
    class="h-25"
    :primaryText="primaryButtonText"
    :primaryButton="!!primaryButtonText"
    @click:primary="primaryHandler"
    :secondaryText="secondaryButtonText"
    :secondaryButton="!!secondaryButtonText"
    @click:secondary="secondaryHandler"
  )
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'ModalPaymentFail',
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    primaryButtonText: {
      type: String,
      default: ''
    },
    primaryHandler: {
      type: Function
    },
    secondaryButtonText: {
      type: String,
      default: ''
    },
    secondaryHandler: {
      type: Function
    },
  },
  setup () {
    const store = useStore()

    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      closeModal
    }
  }
}
</script>
