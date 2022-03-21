<template lang="pug">
div(class="w-100 px-8 flex flex-col items-center")
  svg-icon(iconName="check_circle_outline" size="80" class="text-brand mt-7")
  h6(class="text-h6 font-bold text-primary mt-5") {{title}}
  p(class="text-body2 line-height-1.6 text-primary mt-7.5") {{content}}
  p(class="text-body2 line-height-1.6 text-black-700 mt-3") {{nextPayInfo}}
  btn-group(
    class="h-25"
    :primaryText="$t('UU0031')"
    @click:primary="closeModal"
    :secondaryButton="false"
  )
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'ModalPaymentSuccess',
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    nextPayInfo: {
      type: String
    }
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
