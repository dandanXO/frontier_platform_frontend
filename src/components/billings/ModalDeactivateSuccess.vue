<template lang="pug">
div(class="w-100 px-8 flex flex-col items-center")
  svg-icon(iconName="check_circle_outline" size="80" class="text-brand mt-7")
  h6(class="text-h6 font-bold text-primary mt-5") {{$t('OO0039')}}
  p(class="text-body2 line-height-1.6 text-brand-dark font-bold mt-6.5") {{$t('OO0058')}}
  p(class="text-body2 line-height-1.6 text-brand-dark font-bold mt-1") {{plan.deactivatedDate}}
  i18n-t(keypath="OO0126" tag="p" class="text-black-500 font-bold text-body2 mt-4.5")
    template(#OO0127)
      span(class="text-assist-blue") {{$t('OO0127')}}
  btn-group(
    class="h-25"
    :primaryText="$t('UU0026')"
    @click:primary="closeModal"
    :secondaryButton="false"
  )
</template>

<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
export default {
  name: 'ModalDeactivateSuccess',
  setup () {
    const store = useStore()

    const plan = computed(() => store.getters['organization/plan'])

    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      plan,
      closeModal
    }
  }
}
</script>
