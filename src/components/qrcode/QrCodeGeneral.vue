<template lang="pug">
div(class="flex flex-col"
    ref="pdfTarget")
  div(v-if="options.includes('f')" class="relative flex items-center w-113 h-56.5 bg-black-0 px-8 py-8")
    img(:src="require('@/assets/images/gat.png')" class="absolute top-2 left-2")
    div(class="mr-8 flex flex-col items-center  pl-5")
      qr-code(:value="'1234567'" :size="90")
      div(class="flex flex-col items-center")
        span(class="whitespace-nowrap") FACE SIDE
        span(class="whitespace-nowrap") B210712195
    div(class="flex flex-col")
      span(class="mb-2 text-black-900 font-bold text-h5") FT10441
      span(class="line-clamp text-sm") One line text
      span(class="line-clamp text-sm") Text with overflow Text with overflow Text with overflow Text with overflow Text with overflow Text with overflow
      span(class="line-clamp text-sm") Text with overflow Text with overflow Text with overflow Text with overflow Text with overflow Text with overflow
      span(class="line-clamp text-sm") One line text
      span(class="line-clamp text-sm") Text with overflow Text with overflow Text with overflow Text with overflow Text with overflow Text with overflow
      span(class="line-clamp text-sm") One line text
  div(v-if="options.includes('b')" class="relative flex flex-col items-center w-113 h-56.5 bg-black-0 px-8 py-8")
    img(:src="require('@/assets/images/gat.png')" class="absolute top-2 left-2")
    span(class="mb-2 text-black-900 font-bold text-h5") FT10441
    qr-code(:value="'1234567'" :size="90")
    div(class="flex flex-col items-center")
      span(class="whitespace-nowrap") FACE SIDE
      span(class="whitespace-nowrap") B210712195
</template>

<script>
import QrCode from '@/components/common/QrCode'
import domtoimage from 'dom-to-image'
import { ref } from '@vue/reactivity'
import { jsPDF } from 'jspdf'

export default {
  name: 'QrCodeGeneral',
  components: {
    QrCode
  },
  props: {
    options: {
      type: Array,
      default: () => { return ['f', 'b'] }
    }
  },
  setup () {
    const pdfTarget = ref(null)
    const PDF_WIDTH = 8
    const PDF_HEIGHT = 4
    const generatePdf = async () => {
      await domtoimage.toJpeg(pdfTarget.value, { quality: 0.95 })
        .then(function (dataUrl) {
          var link = document.createElement('a')
          link.download = 'my-image-name.jpeg'
          link.href = dataUrl
          link.click()
          const pdfNum = pdfTarget.value.children.length
          // eslint-disable-next-line new-cap
          const doc = new jsPDF({ unit: 'cm', format: [PDF_HEIGHT, PDF_WIDTH], orientation: 'l' })
          for (let i = 0; i < pdfNum; i++) {
            doc.addImage(dataUrl, 'JPEG', 0, -i * PDF_HEIGHT, PDF_WIDTH, PDF_HEIGHT * pdfNum)
            if (i !== (pdfNum - 1)) {
              doc.addPage()
            }
          }
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

<style lang="scss" scoped>
.line-clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
