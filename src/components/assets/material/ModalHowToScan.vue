<template lang="pug">
div(class="w-245")
  div(class="border-t border-b border-black-400 px-8 py-5")
    div(class="flex gap-x-12")
      div(class="w-100 flex flex-col gap-y-5")
        h6(class="text-h6 text-primary font-bold text-center") {{ $t("DD0030") }}
        img(src="@/assets/images/how_to_scan_left.png")
        i18n-t(keypath="DD0032" tag="p" class="text-body2 text-primary leading-1.6 inline-block")
          template(#RR0062)
            qr-code-a4(class="inline-block")
              template(#activator="{ generatePdf }")
                span(class="cursor-pointer text-assist-blue underline" @click="generatePdf(materialList)") {{ $t("RR0062") }}
          template(#RR0061)
            qr-code-general(class="inline-block")
              template(#activator="{ generatePdf }")
                span(class="cursor-pointer text-assist-blue underline" @click="generatePdf(materialList)") {{ $t("RR0061") }}
        div(class="flex flex-col gap-y-2")
          p(class="text-body2 text-primary leading-1.6") {{ $t("DD0004") }}
          p(class="text-body1 text-primary font-bold") {{ uploadMaterialEmail }}
      p(class="text-h6 text-primary font-bold pt-34") or
      div(class="w-100 flex flex-col gap-y-5")
        h6(class="text-h6 text-primary font-bold text-center") {{ $t("DD0031") }}
        img(src="@/assets/images/how_to_scan_right.png")
        div(class="flex flex-col gap-y-2")
          p(class="text-body2 text-primary leading-1.6") {{ $t("DD0004") }}
          p(class="text-body1 text-primary font-bold") {{ uploadMaterialEmail }}
          qr-code-backside-general
            template(#activator="{ generatePdf }")
              span(class="cursor-pointer text-body2 text-assist-blue underline leading-1.6" @click="generatePdf") {{ $t("UU0007") }}
  div(class="h-25 flex justify-center items-center")
    btn(size="md" @click="handleClick") {{ btnText ? btnText : $t("EE0018") }}
</template>

<script>
import QrCodeA4 from '@/components/qrcode/QrCodeA4.vue'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral.vue'
import QrCodeBacksideGeneral from '@/components/qrcode/QrCodeBacksideGeneral.vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  name: 'ModalHowToScan',
  components: {
    QrCodeA4,
    QrCodeGeneral,
    QrCodeBacksideGeneral
  },
  props: {
    btnText: {
      type: String
    },
    clickHandler: {
      type: Function
    },
    materialList: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const uploadMaterialEmail = computed(() => {
      return store.getters['helper/routeLocation'] === 'org'
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    const handleClick = () => {
      typeof props.clickHandler === 'function'
        ? props.clickHandler()
        : store.dispatch('helper/closeModal')
    }

    return {
      handleClick,
      uploadMaterialEmail
    }
  }
}
</script>
