<template lang="pug">
div(class="w-100")
  div(class="px-8 flex flex-col items-center")
    h6(class="text-h6 text-primary font-bold pb-4") {{ $t("EE0073") }}
    i18n-t(keypath="EE0074" tag="p" class="text-body2 text-primary text-center leading-1.6")
      template(#newline)
        br
      template(#email)
        span(class="text-assist-blue") {{ $t("RR0139") }}
  div(class="h-25 flex justify-center items-center")
    btn(size="md" class="h-10" @click="closeModal") {{ $t("UU0031") }}
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ModalU3mCreateFail',
  setup () {
    const store = useStore()
    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      closeModal
    }
  }
}
</script>
