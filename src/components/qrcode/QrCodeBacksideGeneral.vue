<template lang="pug">
div
  slot(name="activator" :generatePdf="generatePdf")
  div(class="fixed right-0 transform translate-x-full")
    div(ref="pdfTarget")
      div(class="relative flex items-center w-113 h-56.5 bg-black-0 px-8 py-8 ")
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
import { nextTick } from '@vue/runtime-core'

export default {
  name: 'QrCodeBacksideGeneral',
  components: {
    QrCode
  },
  props: {
  },
  setup () {
    const isShown = ref(false)
    const pdfTarget = ref(null)
    const scale = 5
    const generatePdf = async () => {
      isShown.value = true
      nextTick(async () => {
        await domtoimage.toJpeg(pdfTarget.value, {
          quality: 1.5,
          width: pdfTarget.value.clientWidth * scale,
          height: pdfTarget.value.clientHeight * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left'
          }
        })
          .then(function (dataUrl) {
            // eslint-disable-next-line new-cap
            const doc = new jsPDF({ unit: 'cm', format: [4, 8], orientation: 'l' })
            doc.addImage(dataUrl, 'JPEG', 0, 0, 8, 4)
            doc.output('dataurlnewwindow')
            isShown.value = false
          })
      })
    }
    return {
      generatePdf,
      pdfTarget
    }
  }
}
</script>
