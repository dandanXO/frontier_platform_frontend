<template lang="pug">
fullscreen-header
  template(#left)
    h5(class="text-h5 text-grey-900 font-bold") {{ $t('OO0066') }}
  template(#right)
    btn-group(
      :primaryText="$t('UU0026')"
      @click:primary="closeModal"
      :secondaryButton="false"
    )
  template(#content)
    div(class="w-260 mx-auto py-25")
      img(src="@/assets/images/price_list_new.jpg")
</template>

<script>
import { useStore } from 'vuex'
import FullscreenHeader from '@/components/common/FullScreenHeader.vue'

export default {
  name: 'Plan',
  components: {
    FullscreenHeader
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
