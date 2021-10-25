<template lang="pug">
div(class="flex flex-col")
  slot(name="activator" :generatePdf="generatePdf")
  div(v-if="isShown" class="fixed right-0 transform translate-x-full")
    div(class="flex flex-col" ref="pdfTarget")
      template(v-for="(option,index) in options")
        div(v-if="printFront(option)" class="relative flex items-center w-113 h-56.5 bg-black-0 px-8 py-8")
          img(:src="require('@/assets/images/gat.png')" class="absolute top-2 left-2")
          div(class="mr-8 flex flex-col items-center  pl-5")
            qr-code(:value="'1234567'" :size="90")
            div(class="flex flex-col items-center")
              span(class="whitespace-nowrap") FACE SIDE
              span(class="whitespace-nowrap") B210712195
          div(class="flex flex-col")
            div
              span(class="mb-2 text-black-900 font-bold text-h5") FT10441
            div
              span(class="line-clamp text-sm" v-for="data in datas[index]") {{data}}
        div(v-if="printBack(option)" class="relative flex flex-col items-center w-113 h-56.5 bg-black-0 px-8 py-8")
          img(:src="require('@/assets/images/gat.png')" class="absolute top-2 left-2")
          span(class="mb-2 text-black-900 font-bold text-h5") FT10441
          qr-code(:value="'1234567'" :size="90")
          div(class="flex flex-col items-center")
            span(class="whitespace-nowrap") BACK SIDE
            span(class="whitespace-nowrap") B210712195
</template>

<script>
import QrCode from '@/components/common/QrCode'
import domtoimage from 'dom-to-image'
import { ref } from '@vue/reactivity'
import { jsPDF } from 'jspdf'
import { nextTick } from '@vue/runtime-core'

export default {
  name: 'QrCodeGeneral',
  components: {
    QrCode
  },
  props: {
    options: {
      type: Array,
      default: () => { return [0] }
    },
    datas: Array
  },
  setup () {
    const isShown = ref(false)
    const TYPE = {
      SINGLE_FRONT: 0,
      SINGLE_BACK: 1,
      DOUBLE: 2
    }
    const pdfTarget = ref(null)
    const PDF_WIDTH = 8
    const PDF_HEIGHT = 4
    const scale = 3
    const printFront = (type) => {
      return ((type === TYPE.SINGLE_FRONT) || (type === TYPE.DOUBLE))
    }
    const printBack = (type) => {
      return ((type === TYPE.SINGLE_BACK) || (type === TYPE.DOUBLE))
    }

    const generatePdf = () => {
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
            const pdfNum = pdfTarget.value.children.length
            // eslint-disable-next-line new-cap
            const doc = new jsPDF({ unit: 'cm', format: [PDF_HEIGHT, PDF_WIDTH], orientation: 'l' })
            for (let i = 0; i < pdfNum; i++) {
              doc.addImage(dataUrl, 'JPEG', 0, -i * PDF_HEIGHT, PDF_WIDTH, PDF_HEIGHT * pdfNum)
              if (i !== (pdfNum - 1)) {
                doc.addPage()
              }
            }
            doc.output('dataurlnewwindow')
            isShown.value = false
          })
      })
    }
    return {
      isShown,
      generatePdf,
      pdfTarget,
      printFront,
      printBack
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
