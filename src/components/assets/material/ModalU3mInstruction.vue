<template lang="pug">
div(class="w-168 px-8")
  div(class="text-primary text-h6 font-bold text-center mb-7.5") {{$t("RR0132")}}
  div(class="text-primary text-body2 text-center mb-7.5") {{$t("EE0083")}}
  div(class="grid grid-cols-2 gap-12 mb-5")
    div(class="col-span-1")
      img(src="@/assets/images/u3m.png")
    i18n-t(keypath="EE0066" tag="p" class="col-span-1 text-primary text-body2 line-height-1.6")
      template(#newline)
        br
  btn-group(
    class="h-25"
    :secondaryButton="false"
    :primaryText="btnText"
    @click:primary="btnClickHandler()"
  )
</template>

<script>
import { U3M_STATUS } from '@/utils/constants'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from '@vue/runtime-core'

export default {
  name: 'ModalU3mInstruction',
  props: {
    isAllowCreate: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const { u3m: { status } } = material.value

    const btnText = computed(() => {
      if (props.isAllowCreate) {
        if (status === U3M_STATUS.UNQUALIFIED) {
          return t('UU0032')
        } else if (status === U3M_STATUS.INITIAL) {
          return t('UU0020')
        } else {
          return t('UU0031')
        }
      } else {
        return t('UU0031')
      }
    })

    const btnClickHandler = computed(() => {
      if (props.isAllowCreate) {
        if (status === U3M_STATUS.UNQUALIFIED) {
          return openModalHowToScan
        } else if (status === U3M_STATUS.INITIAL) {
          return openModalU3mPreview
        } else {
          return closeModal
        }
      } else {
        return closeModal
      }
    })

    const openModalHowToScan = () => {
      store.dispatch('helper/replaceModal', {
        component: 'modal-how-to-scan',
        header: t('DD0043')
      })
    }

    const openModalU3mPreview = () => {
      store.dispatch('helper/replaceModal', {
        component: 'modal-u3m-preview',
        header: t('EE0067')
      })
    }

    const closeModal = () => store.dispatch('helper/closeModal')

    return {
      btnText,
      btnClickHandler,
      openModalHowToScan,
      openModalU3mPreview
    }
  }
}
</script>
