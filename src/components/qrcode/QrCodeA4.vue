<template lang="pug">
div(class="flex flex-col")
  slot(name="activator" :generatePdf="generatePdf")
  div(v-if="isShown" class="fixed right-0 transform translate-x-full")
    div(class="flex flex-col" ref="pdfTarget")
      template(v-for="(option,index) in options")
        div(v-if="currExecOptionIndex ===index && printFront(option)"  class="relative flex flex-col  justify-between items-center w-148.5 h-210.5 bg-black-0 px-10 py-10")
          div(class="flex w-full")
            img(:src="require('@/assets/images/gat.png')" class="mr-7 w-12.5 h-12.5")
            div(class="w-full grid grid-cols-1 grid-rows-9 gap-y-2")
              span(class="text-body2 font-bold") {{datas[index].id}}
              span(class="text-caption") {{`Description : ${datas[index].description}`}}
              span(class="text-caption") {{`Content : ${datas[index].content}`}}
              span(class="text-caption") {{`Yarn Size : ${datas[index].yarnSize}`}}
              span(class="text-caption") {{`Density : ${datas[index].density}`}}
              span(class="text-caption") {{`Pattern : ${datas[index].pattern}`}}
              span(class="text-caption") {{`Color : ${datas[index].color}`}}
              span(class="text-caption") {{`Weight : ${datas[index].weight}`}}
              span(class="text-caption") {{`Cuttable Width : ${datas[index].cuttableWidth}`}}
              span(class="text-caption") {{`Finish : ${datas[index].finish}`}}
            div(class="flex flex-col items-center")
              span(class="text-black-600 whitespace-nowrap text-caption py-1 px-1 mb-2.5 font-bold") FACE SIDE
              qr-code(:value="'1234567'" :size="60")
              span(class="whitespace-nowrap text-caption  mt-2.5") B210712195
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
        div(v-if="currExecOptionIndex ===index && printBack(option)"  class="relative flex flex-col  justify-between items-center w-148.5 h-210.5 bg-black-0 px-10 py-10")
          div(class="flex w-full")
            img(:src="require('@/assets/images/gat.png')" class="mr-7 w-12.5 h-12.5")
            div(class="w-full grid grid-cols-1 grid-rows-9 gap-y-2")
              span(class="text-body2 font-bold") {{datas[index].id}}
              span(class="text-caption") {{`Description : ${datas[index].description}`}}
              span(class="text-caption") {{`Content : ${datas[index].content}`}}
              span(class="text-caption") {{`Yarn Size : ${datas[index].yarnSize}`}}
              span(class="text-caption") {{`Density : ${datas[index].density}`}}
              span(class="text-caption") {{`Pattern : ${datas[index].pattern}`}}
              span(class="text-caption") {{`Color : ${datas[index].color}`}}
              span(class="text-caption") {{`Weight : ${datas[index].weight}`}}
              span(class="text-caption") {{`Cuttable Width : ${datas[index].cuttableWidth}`}}
              span(class="text-caption") {{`Finish : ${datas[index].finish}`}}
            div(class="flex flex-col items-center")
              span(class="text-black-0 whitespace-nowrap text-caption py-1 px-1 mb-2.5 bg-primary font-bold rounded-sm") BACK SIDE
              qr-code(:value="'1234567'" :size="60")
              span(class="whitespace-nowrap text-caption  mt-2.5") B210712195
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
import { useStore } from 'vuex'
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
  setup (props) {
    const store = useStore()
    const isShown = ref(false)
    const currExecOptionIndex = ref(0)
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
    const generatePdf = async () => {
      store.dispatch('helper/openModalLoading')
      isShown.value = true
      currExecOptionIndex.value = 0
      const scale = 3
      const dataUrls = []
      await asyncForEach(props.options, async (el, index, arr) => {
        await nextTick(async () => {
          const dataUrl = await domtoimage.toJpeg(pdfTarget.value, {
            quality: 1.5,
            width: pdfTarget.value.clientWidth * scale,
            height: pdfTarget.value.clientHeight * scale,
            style: {
              transform: 'scale(' + scale + ')',
              transformOrigin: 'top left'
            }
          })
          dataUrls.push({
            dataUrl,
            num: pdfTarget.value.children.length
          })
          currExecOptionIndex.value++
        })
      })

      const PDF_WIDTH = 21
      const PDF_HEIGHT = 29.7
      // eslint-disable-next-line new-cap
      const doc = new jsPDF({ unit: 'cm', format: 'a4', orientation: 'p' })

      await asyncForEach(dataUrls, async (el, index, arr) => {
        for (let i = 0; i < el.num; i++) {
          doc.addImage(el.dataUrl, 'JPEG', 0, -i * PDF_HEIGHT, PDF_WIDTH, PDF_HEIGHT * el.num)
          if (i !== (el.num - 1)) {
            doc.addPage()
          }
        }
        if (index !== (arr.length - 1)) {
          doc.addPage()
        }
      })
      doc.output('dataurlnewwindow')
      isShown.value = false
      store.dispatch('helper/closeModalLoading')
    }

    // We need this function because the build-in forEach won't confirm the generated Pdf orders when calling async function
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    return {
      generatePdf,
      pdfTarget,
      printFront,
      isShown,
      printBack,
      currExecOptionIndex
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
