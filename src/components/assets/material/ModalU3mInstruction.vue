<template lang="pug">
div(class="w-168 px-8")
  div(class="text-primary text-h6 font-bold text-center mb-7.5") {{ $t("RR0132") }}
  div(class="text-primary text-body2 text-center mb-7.5") {{ $t("EE0083") }}
  div(class="grid grid-cols-2 gap-12 mb-5")
    div(class="col-span-1")
      img(src="@/assets/images/u3m.png")
    i18n-t(keypath="EE0066" tag="p" class="col-span-1 text-primary text-body2 leading-1.6")
      template(#newline)
        br
  btn-group(
    class="h-25"
    :secondaryButton="false"
    :primaryText="innerBtnText"
    @click:primary="innerBtnClickHandler"
  )
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from '@vue/runtime-core'

export default {
  name: 'ModalU3mInstruction',
  props: {
    btnText: {
      type: String
    },
    btnClickHandler: {
      type: Function
    },
    isAllowCreate: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()

    const innerBtnText = computed(() => props.btnText !== undefined ? props.btnText : t('UU0031'))
    const innerBtnClickHandler = computed(() => props.btnClickHandler !== undefined ? props.btnClickHandler : closeModal)

    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      innerBtnText,
      innerBtnClickHandler
    }
  }
}
</script>
