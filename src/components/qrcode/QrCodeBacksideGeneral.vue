<template lang="pug">
div(class="relative flex items-center w-113 h-56.5 bg-black-0 px-8 py-8"
    ref="pdfTarget")
  qr-code(class="mr-8" :value="'1234567'" :size="100")
  div(class="flex flex-col bg-black-0")
    span(class="mb-2 text-black-900 font-bold text-h5") Scan Back Side
    span(class="text-h6") please put this QR Code on your upper right of swatch/hanger and scan altogether for every scan file.
  div(class="absolute bottom-2.5 right-2.5 text-black-500 test") Frontier.cool
</template>

<script>
import QrCode from '@/components/common/QrCode'
// import html2pdf from 'html2pdf.js'
import domtoimage from 'dom-to-image'
import { ref } from '@vue/reactivity'
import { jsPDF } from 'jspdf'

export default {
  name: 'QrCodeBacksideGeneral',
  components: {
    QrCode
  },
  props: {
  },
  setup () {
    const pdfTarget = ref(null)
    const generatePdf = async () => {
      await domtoimage.toJpeg(pdfTarget.value, { quality: 0.95 })
        .then(function (dataUrl) {
          // eslint-disable-next-line new-cap
          const doc = new jsPDF({ unit: 'cm', format: [4, 8], orientation: 'l' })
          doc.addImage(dataUrl, 'JPEG', 0, 0, 8, 4)
          doc.save('myfile.pdf')
        })
    }
    return {
      generatePdf,
      pdfTarget
    }
  }
}
</script>
