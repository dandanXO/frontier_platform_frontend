<template lang="pug">
div(class="w-100")
  h6(class="text-center text-h6 text-primary font-bold pb-4") {{ $t("RR0107") }}
  p(class="text-center text-body2 text-primary leading-1.6") {{ $t("RR0108") }}
  div(class="h-25 flex justify-center items-center")
    btn(size="md" @click="closeModalError") {{ $t("UU0031") }}
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'ModalError',
  setup () {
    const store = useStore()
    const closeModalError = () => {
      window.location.reload()
      store.dispatch('helper/closeModalError')
    }
    return {
      closeModalError
    }
  }
}
</script>
