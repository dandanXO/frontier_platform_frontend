<template lang="pug">
h1 I'm {{$route.name}} Page
div(class="flex flex-col p-10")
  div(class="flex items-center")
    qr-code-general(:options="options" :datas="generalDatas")
      template(#activator="{ generatePdf }")
        btn(size="md" class="h-10 mr-10" @click="generatePdf") Print General QRCode
    qr-code-a4(:options="options" :datas="a4Datas")
      template(#activator="{ generatePdf }")
        btn(size="md" class="h-10 mr-10" @click="generatePdf") Print A4 QRCode
    qr-code-backside-general(:options="options")
      template(#activator="{ generatePdf }")
        btn(size="md" class="h-10 mr-10" @click="generatePdf") Print Backside General QRCode
router-link-extending(tag="h1" to="/") Back To Lobby Page
</template>

<script>
import QrCodeBacksideGeneral from '@/components/qrcode/QrCodeBacksideGeneral'
import QrCodeGeneral from '@/components/qrcode/QrCodeGeneral'
import QrCodeA4 from '@/components/qrcode/QrCodeA4'
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'

export default {
  name: 'Management',
  components: {
    QrCodeBacksideGeneral,
    QrCodeGeneral,
    QrCodeA4
  },
  setup () {
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
      id: 'ED15736',
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

    const options = ref([2, 0, 1, 2, 0, 1])

    return {
      options,
      generalDatas,
      a4Datas
    }
  }
}
</script>
