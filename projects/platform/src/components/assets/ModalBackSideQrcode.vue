<template lang="pug">
modal-behavior(
  :header="$t('DD0081')"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="closeModalBehavior"
)
  div(class="w-104")
    i18n-t(
      keypath="DD0010"
      tag="div"
      class="mb-7.5 text-body2 text-grey-900 leading-1.6"
      scope="global"
    )
      template(#DD0111)
        div(
          class="inline-flex items-center text-cyan-400 cursor-pointer"
          @click="printBackSideLabel"
        ) {{ $t('DD0111') }}
          f-svg-icon(iconName="open_in_new" size="15")
    img(src="@/assets/images/back_side.png")
</template>

<script setup>
import { useStore } from 'vuex'
import { printBackSideLabel } from '@/utils/print'

const store = useStore()

const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>
