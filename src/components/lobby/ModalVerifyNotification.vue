<template lang="pug">
div(class="w-100 px-8 text-center")
  h6(class="text-h6 text-primary font-bold pb-4") {{$t('AA0030')}}
  p(class="text-body2 text-primary line-height-1.6 pb-1.5") {{$t('AA0052')}}
  p(class="text-body2 text-assist-blue line-height-1.6 cursor-pointer" @click="resendVerifyEmail") {{$t('UU0056')}}
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
  name: 'ModalVerifyNotification',
  setup () {
    const store = useStore()

    const resendVerifyEmail = () => store.dispatch('user/resendVerifyEmail')
    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      resendVerifyEmail,
      closeModal
    }
  }
}
</script>
