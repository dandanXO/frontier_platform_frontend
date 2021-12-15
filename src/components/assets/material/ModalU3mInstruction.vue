<template lang="pug">
div(class="w-168 px-8")
  div(class="text-primary text-h6 font-bold text-center mb-7.5") {{$t("RR0132")}}
  div(class="text-primary text-body2 text-center mb-7.5") {{$t("EE0083")}}
  div(class="grid grid-cols-2 gap-12 mb-5")
    div(class="col-span-1")
      img(src="@/assets/images/u3m.png")
    div(class="col-span-1 text-primary text-body2") {{$t("EE0066")}}
  btn-group(
    class="h-25"
    :secondaryButton="false"
    :primaryText="isAllowCreate ? $t('UU0020') : $t('UU0032')"
    @click:primary="isAllowCreate ? openModalU3mPriview() : openModalHowToScan()"
  )
</template>

<script>
import { U3M_STATUS } from '@/utils/constants'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from '@vue/runtime-core'

export default {
  name: 'ModalU3mInstruction',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const isAllowCreate = computed(() => material.value.u3m.status === U3M_STATUS.INITIAL)

    const openModalHowToScan = () => {
      store.dispatch('helper/replaceModal', {
        component: 'modal-how-to-scan',
        header: t('DD0043')
      })
    }

    const openModalU3mPriview = () => {
      store.dispatch('helper/replaceModal', {
        component: 'modal-u3m-priview',
        header: t('EE0067')
      })
    }

    return {
      isAllowCreate,
      openModalHowToScan,
      openModalU3mPriview
    }
  }
}
</script>
