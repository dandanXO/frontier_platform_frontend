<template lang="pug">
div(class="flex flex-col")
  slot(name="activator" :generatePdf="generatePdf")
  div(v-if="isShown" class="fixed right-0 transform translate-x-full")
    div(class="flex flex-col" ref="pdfTarget")
      template(v-for="(option,index) in options")
        div(v-if="(currExecOptionIndex ===index) && printFront(option)" class="relative flex items-center w-113 h-56.5 bg-black-0 px-8 py-8")
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
        div(v-if="(currExecOptionIndex ===index) && printBack(option)" class="relative flex flex-col items-center w-113 h-56.5 bg-black-0 px-8 py-8")
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
import { jsPDF as JsPDF } from 'jspdf'
import { nextTick } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  name: 'QrCodeGeneral',
  components: {
    QrCode
  },
  props: {
    options: {
      type: Array,
      default: () => { return [0] },
      closeHandler: {
        type: Function,
        required: true
      }
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
    const pdfTarget = ref(null)
    const printFront = (type) => {
      return ((type === TYPE.SINGLE_FRONT) || (type === TYPE.DOUBLE))
    }
    const printBack = (type) => {
      return ((type === TYPE.SINGLE_BACK) || (type === TYPE.DOUBLE))
    }

    const generatePdf = async () => {
      store.dispatch('helper/openModalLoading')
      isShown.value = true
      currExecOptionIndex.value = 0
      const scale = 3
      // eslint-disable-next-line new-cap

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

      const PDF_WIDTH = 8
      const PDF_HEIGHT = 4
      const doc = new JsPDF({ unit: 'cm', format: [PDF_HEIGHT, PDF_WIDTH], orientation: 'l' })

      await asyncForEach(dataUrls, async (el, index, arr) => {
        console.log(index, el.num)
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
      window.open(doc.output('bloburl').toString())
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
      isShown,
      generatePdf,
      pdfTarget,
      printFront,
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
