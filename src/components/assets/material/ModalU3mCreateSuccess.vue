<template lang="pug">
div(class="w-100")
  div(class="px-8 flex flex-col items-center")
    h6(class="text-h6 text-primary font-bold pb-4") {{$t("RR0132")}}
    i18n-t(keypath="EE0070" tag="p" class="text-body2 text-primary text-center line-height-1.6")
      template(#assets)
        strong {{$t("RR0008")}}
  div(class="h-25 flex justify-center items-center")
    btn(size="md" class="h-10" @click="closeModal") {{$t("UU0031")}}
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ModalU3mCreateSuccess',
  setup () {
    const store = useStore()
    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      closeModal
    }
  }
}
</script>
