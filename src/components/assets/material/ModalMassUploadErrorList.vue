<template lang="pug">
div(class="w-135")
  div
    div(class="mb-4 text-center text-primary text-h6 font-bold") {{ $t("DD0042") }}
    overlay-scrollbar-container(class="max-h-89.5")
      div(v-for="error in errorList" class="mx-8 flex gap-3 border-b border-black-400 py-2.5 text-body2 text-primary leading-1.6")
        div(class="w-27 font-bold flex-shrink-0 break-all") {{ error.key }}
        div {{ error.value }}
  btn-group(
    class="h-25"
    :secondaryButton="false"
    :primaryText="$t('UU0026')"
    @click:primary="closeModal"
  )
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ModalMassUploadErrorList',
  props: {
    errorList: {
      type: Array,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const closeModal = () => { store.dispatch('helper/closeModal') }

    return {
      closeModal
    }
  }
}
</script>
