<template lang="pug">
div(class='fixed z-100 bottom-20.5 inset-x-0 ml-60')
  div(v-if='formalAddedMaterialList.length > 0' class='m-auto w-fit px-15 py-7.5 bg-black-0 rounded-full menu-shadow text-body2 text-primary flex justify-center items-center')
    svg-icon(iconName='cancel' size='24' class='text-black-400 mr-4 cursor-pointer' @click='clearList')
    i18n-t(keypath="RR0073" tag='div' class='mr-7.5')
      template(#number) {{formalAddedMaterialList.length}}
    div(class='flex flex-wrap gap-y-5 divide-x w-fit max-w-127')
      template(v-for='option in options')
        qr-code-general(v-if='option.id === "printQRCode"')
          template(#activator="{ generatePdf }")
            div(
              class='whitespace-nowrap cursor-pointer hover:text-brand px-5'
              @click='generatePdf(formalAddedMaterialList)'
            ) {{option.name}}
        qr-code-a4(v-else-if='option.id === "printCard"')
          template(#activator="{ generatePdf }")
            div(
              class='whitespace-nowrap cursor-pointer hover:text-brand px-5'
              @click='generatePdf(formalAddedMaterialList)'
            ) {{option.name}}
        div(
          v-else
          class='whitespace-nowrap cursor-pointer hover:text-brand px-5'
          @click='handleClick(option)'
        ) {{option.name}}
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import QrCodeA4 from '@/components/qrcode/QrCodeA4'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral'

export default {
  name: 'MultiSelectMenu',
  components: { QrCodeA4, QrCodeGeneral },
  props: {
    options: {
      type: Array
    }
  },
  setup () {
    const store = useStore()
    const formalAddedMaterialList = computed(() => store.getters['assets/formalAddedMaterialList'])
    const clearList = () => store.commit('assets/CLEAR_addedMaterialList')
    const handleClick = (option) => option.func && option.func()

    return {
      formalAddedMaterialList,
      clearList,
      handleClick
    }
  }
}
</script>
