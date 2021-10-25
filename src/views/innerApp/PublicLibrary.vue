<template lang="pug">
h1 I'm {{$route.name}} Page
div(class="flex flex-col p-10")
<<<<<<< HEAD
  div(class="flex items-center")
    qr-code-general(:options="options" :datas="generalDatas")
      template(#activator="{ generatePdf}")
        btn(size="md" class="h-10 mr-10" @click="generatePdf") Print General QRCode
    qr-code-a4( :options="options" :datas="a4Datas")
      template(#activator="{ generatePdf}")
        btn(size="md" class="h-10 mr-10" @click="generatePdf") Print A4 QRCode
    qr-code-backside-general(:options="options")
      template(#activator="{ generatePdf}")
        btn(size="md" class="h-10 mr-10" @click="generatePdf") Print Backside General QRCode
div(v-if="showFrontside" class="absolute right-0 transform translate-x-full border-2 border-black-200")
=======
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
>>>>>>> ed950b536885ca24d943cf98fd4fa541708ee5d2
router-link-extending(tag="h1" to="/") Back To Lobby Page
</template>

<script>
import QrCodeBacksideGeneral from '@/components/qrcode/QrCodeBacksideGeneral'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral'
<<<<<<< HEAD
import QrCodeA4 from '@/components/qrcode/QrCodeA4'
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
=======
import { ref } from '@vue/reactivity'
import { nextTick } from '@vue/runtime-core'
>>>>>>> ed950b536885ca24d943cf98fd4fa541708ee5d2
export default {
  name: 'Management',
  components: {
    QrCodeBacksideGeneral,
<<<<<<< HEAD
    QrCodeGeneral,
    QrCodeA4
=======
    QrCodeGeneral
>>>>>>> ed950b536885ca24d943cf98fd4fa541708ee5d2
  },
  setup () {
    const qrcodeBacksideGeneral = ref(null)
    const qrcodeGeneral = ref(null)
<<<<<<< HEAD
    const qrcodeA4 = ref(null)
    const showBacksideGeneral = ref(false)
    const showFrontside = ref(false)

    const tmpGeneralDatas = ref([
      'Kahki black',
      'Woven-Y/D Heather Twill xxxxxxx xxxxxxxxxx xxxxxxxxxxxxxxxxxxxx',
      '100%  Cotton xxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxx...',
      '7 x 7 42 x 35 52”',
      'Soft and Pre-shrinking xxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxx...',
      '310g/m² ( 9.14oz/y² )'])

    const generalDatas = computed(() => {
      return new Array(options.value.length).fill([...tmpGeneralDatas.value])
    })

    const tmpA4Datas = reactive({
      id: 'FT10441',
      description: 'Woven-Y/D Heather Twill',
      content: '100%  Cotton',
      yarnSize: '7 x 7',
      density: '42 x 34',
      pattern: 'Kahki',
      color: 'black',
      weight: '310g/m² ( 9.14oz/y² )',
      cuttableWidth: '52”',
      finish: 'Soft and Pre-shrinkinggg',
      companyName: 'GAT',
      address: '57 Fuxing N. Rd., Suite 703, Taipei, 105,Taiwan'
    })

    const a4Datas = computed(() => {
      return new Array(options.value.length).fill(JSON.parse(JSON.stringify(tmpA4Datas)))
    })

    const options = ref([2, 1])

    return {
      qrcodeBacksideGeneral,
      qrcodeGeneral,
      qrcodeA4,
      showBacksideGeneral,
      showFrontside,
      options,
      generalDatas,
      a4Datas
=======
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
>>>>>>> ed950b536885ca24d943cf98fd4fa541708ee5d2
    }
  }
}
</script>
