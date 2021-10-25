<template lang="pug">
div(class="flex flex-col")
  slot(name="activator" :generatePdf="generatePdf")
  div(class="fixed right-0 transform translate-x-full")
    div(class="flex flex-col" ref="pdfTarget")
      template(v-for="(option,index) in options")
        div(v-if="printFront(option)"  class="relative flex flex-col  justify-between items-center w-148.5 h-210.5 bg-black-0 px-10 py-10")
          div(class="flex w-full")
            img(:src="require('@/assets/images/gat.png')" class="mr-7 w-12.5 h-12.5")
            div(class="w-full grid grid-cols-1 grid-rows-9 gap-y-2")
              span(class="text-caption") {{`Description : ${datas[index].description}`}}
              span(class="text-caption") {{`Content : ${datas[index].content}`}}
              span(class="text-caption") {{`Yarn Size : ${datas[index].yarnSize}`}}
              span(class="text-caption") {{`Density : ${datas[index].density}`}}
              span(class="text-caption") {{`Pattern : ${datas[index].pattern}`}}
              span(class="text-caption") {{`Color : ${datas[index].color}`}}
              span(class="text-caption") {{`Weight : ${datas[index].weight}`}}
              span(class="text-caption") {{`Cuttable Width : ${datas[index].cuttableWidth}`}}
              span(class="text-caption") {{`Finish : ${datas[index].finish}`}}
            qr-code(:value="'1234567'" :size="60")
          div(class="relative flex flex-col items-center justify-center w-full h-87")
            span(class="text-black-600 whitespace-nowrap text-caption mb-2.5") FACE SIDE
            span(class="text-black-600 whitespace-nowrap text-caption") Printed from Frontier's Online
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute top-0 left-0 text-black-600")
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute bottom-0 left-0 text-black-600 transform -rotate-90")
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute top-0 right-0 text-black-600 transform rotate-90")
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute bottom-0 right-0 text-black-600 transform rotate-180")
          div(class="flex flex-col justify-start items-start w-full")
            span(class="mb-2 font-bold text-caption") {{datas[index].companyName}}
            span(class="text-caption") {{datas[index].address}}
        div(v-if="printBack(option)"  class="relative flex flex-col  justify-between items-center w-148.5 h-210.5 bg-black-0 px-10 py-10")
          div(class="flex w-full")
            img(:src="require('@/assets/images/gat.png')" class="mr-7 w-12.5 h-12.5")
            div(class="w-full grid grid-cols-1 grid-rows-9 gap-y-2")
              span(class="text-caption") {{`Description : ${datas[index].description}`}}
              span(class="text-caption") {{`Content : ${datas[index].content}`}}
              span(class="text-caption") {{`Yarn Size : ${datas[index].yarnSize}`}}
              span(class="text-caption") {{`Density : ${datas[index].density}`}}
              span(class="text-caption") {{`Pattern : ${datas[index].pattern}`}}
              span(class="text-caption") {{`Color : ${datas[index].color}`}}
              span(class="text-caption") {{`Weight : ${datas[index].weight}`}}
              span(class="text-caption") {{`Cuttable Width : ${datas[index].cuttableWidth}`}}
              span(class="text-caption") {{`Finish : ${datas[index].finish}`}}
            qr-code(:value="'1234567'" :size="60")
          div(class="relative flex flex-col items-center justify-center w-full h-87")
            span(class="text-black-600 whitespace-nowrap text-caption mb-2.5") BACK SIDE
            span(class="text-black-600 whitespace-nowrap text-caption") Printed from Frontier's Online
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute top-0 left-0 text-black-600")
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute bottom-0 left-0 text-black-600 transform -rotate-90")
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute top-0 right-0 text-black-600 transform rotate-90")
            img(:src="`${require('@/assets/images/corner.png')}`" class="w-7.5 h-7.5 absolute bottom-0 right-0 text-black-600 transform rotate-180")
          div(class="flex flex-col justify-start items-start w-full")
            span(class="mb-2 font-bold text-caption") {{datas[index].companyName}}
            span(class="text-caption") {{datas[index].address}}
</template>

<script>
import QrCode from '@/components/common/QrCode'
import domtoimage from 'dom-to-image'
import { ref } from '@vue/reactivity'
import { jsPDF } from 'jspdf'
import { nextTick } from '@vue/runtime-core'

export default {
  name: 'QrCodeA4',
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
    const printFront = (type) => {
      return ((type === TYPE.SINGLE_FRONT) || (type === TYPE.DOUBLE))
    }
    const printBack = (type) => {
      return ((type === TYPE.SINGLE_BACK) || (type === TYPE.DOUBLE))
    }
    const pdfTarget = ref(null)
    const PDF_WIDTH = 21
    const PDF_HEIGHT = 29.7
    const scale = 3
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
            const pdfNum = pdfTarget.value.children.length
            // eslint-disable-next-line new-cap
            const doc = new jsPDF({ unit: 'cm', format: 'a4', orientation: 'p' })
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
