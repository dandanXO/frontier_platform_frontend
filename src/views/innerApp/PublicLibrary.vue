<template lang="pug">
h1 I'm {{$route.name}} Page
div(class="flex flex-col p-10")
  div(class="flex items-center mb-4 justify-between")
    btn(size="md" class="h-10 mr-10" @click="generateBacksideGenearal") Print Backside General QRCode
  div(class="flex items-center")
    btn(size="md" class="h-10 mr-10" @click="generateFrontside") Print General QRCode
    div(class="flex items-center")
      input(class="mr-2" id="frontside" type="checkbox", value="f", v-model="options")
      label(class="mr-2" for="frontside") frontside
      input(class="mr-2" id="backside" type="checkbox", value="b", v-model="options")
      label(class="mr-2" for="backside") backside
div(v-if="showBacksideGeneral" class="absolute right-0 transform translate-x-full border-2 border-black-200")
  qr-code-backside-general(class="target" ref="qrcodeBacksideGeneral")
div(v-if="showFrontside" class="absolute right-0 transform translate-x-full border-2 border-black-200")
  qr-code-general(class="target" ref="qrcodeGeneral" :options="options")
router-link-extending(tag="h1" to="/") Back To Lobby Page
</template>

<script>
import QrCodeBacksideGeneral from '@/components/qrcode/QrCodeBacksideGeneral'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral'
import { ref } from '@vue/reactivity'
import { nextTick } from '@vue/runtime-core'
export default {
  name: 'Management',
  components: {
    QrCodeBacksideGeneral,
    QrCodeGeneral
  },
  setup () {
    const qrcodeBacksideGeneral = ref(null)
    const qrcodeGeneral = ref(null)
    const showBacksideGeneral = ref(false)
    const showFrontside = ref(false)
    const options = ref([])
    const generateBacksideGenearal = () => {
      showBacksideGeneral.value = true
      nextTick(async () => {
        await qrcodeBacksideGeneral.value.generatePdf()
        showBacksideGeneral.value = false
      })
    }

    const generateFrontside = () => {
      showFrontside.value = true
      nextTick(async () => {
        await qrcodeGeneral.value.generatePdf()
        showFrontside.value = false
      })
    }
    return {
      qrcodeBacksideGeneral,
      qrcodeGeneral,
      generateBacksideGenearal,
      generateFrontside,
      showBacksideGeneral,
      showFrontside,
      options
    }
  }
}
</script>
