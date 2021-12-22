<template lang="pug">
div
  slot(name="activator" :generatePdf="generatePdf")
  template(v-if="isShown")
    teleport(to="body")
      div(class="fixed right-0 transform translate-x-full")
        div(class="flex flex-col" ref="pdfTarget")
          template(v-for="(item, index) in list")
            template(v-for='type in pdfType')
              div(v-if="(currExecOptionIndex === index) && printType(item).includes(type)" class="relative flex w-113 h-56.5 bg-black-0 pr-4 py-3")
                div(class='absolute top-3 left-3.5')
                  img(:src="logo" class='w-8.5 h-8.5 rounded-sm')
                div(class='flex justify-center w-full')
                  div(class='flex flex-col items-center justify-center w-31' :class='{"ml-16": type === "FACE SIDE"}')
                    div(v-if='type === "BACK SIDE"' class="whitespace-nowrap mb-4 text-black-900 font-bold text-body1") {{item.materialNo}}
                    qr-code(:value="type === 'FACE SIDE' ? item.frontierNo : item.relationFrontierNo" :size="100")
                    div(class="whitespace-nowrap text-black-900 text-body2 mt-4 mb-2") {{type}}
                    div(class="whitespace-nowrap text-black-600 text-body2") {{type === 'FACE SIDE' ? item.frontierNo : item.relationFrontierNo}}
                  template(v-if='type === "FACE SIDE"')
                    div(class='flex-none border border-black-400 mx-6 my-5')
                    div(class="flex flex-col justify-center text-black-900 w-56")
                      div(class="mb-2 font-bold text-body2") {{item.materialNo}}
                      div(class="line-clamp-2 text-body2 line-height-1.5") {{item.description}}
                      div(class="line-clamp-2 text-body2 line-height-1.5") {{item.content}}
                      div(class="line-clamp-1 text-body2 line-height-1.5") {{item.materialYarnCount}} {{item.materialDensity}} {{item.materialWidth}}
                      div(class="line-clamp-2 text-body2 line-height-1.5") {{item.finish}}
                      div(class="line-clamp-1 text-body2 line-height-1.5") {{item.materialWeight}}
</template>

<script>
import QrCode from '@/components/common/QrCode'
import domtoimage from 'dom-to-image'
import { ref, computed, nextTick, reactive } from 'vue'
import { jsPDF as JsPDF } from 'jspdf'
import { useStore } from 'vuex'
import useMaterial from '@/composables/useMaterial'
import { SIDE_TYPE } from '@/utils/constants.js'

export default {
  name: 'QrCodeGeneral',
  components: { QrCode },
  setup () {
    const store = useStore()
    const isShown = ref(false)
    const currExecOptionIndex = ref(0)
    const pdfTarget = ref(null)
    const pdfType = ['FACE SIDE', 'BACK SIDE']

    const logo = computed(() => store.getters['organization/orgLogo'])
    const list = reactive([])

    const printType = (material) => {
      const arr = []
      if (material.isDoubleSideMaterial) {
        arr.push(...pdfType)
      } else if (material.sideType === SIDE_TYPE.FACE) {
        arr.push(pdfType[0])
      } else if (material.sideType === SIDE_TYPE.BACK) {
        arr.push(pdfType[1])
      }
      return arr
    }

    const generatePdf = async (materialList) => {
      store.dispatch('helper/pushModalLoading')
      list.length = 0
      list.push(...JSON.parse(JSON.stringify(materialList)))
      isShown.value = true
      currExecOptionIndex.value = 0

      list.forEach((item) => {
        const { materialInfo } = useMaterial(item)
        item.materialWeight = materialInfo.weight.value
        item.materialYarnCount = materialInfo.yarn.value
        item.materialDensity = materialInfo.density.value
        item.materialWidth = materialInfo.width.value
      })

      const scale = 3
      const dataUrls = []

      await asyncForEach(list, async (el, index, arr) => {
        await nextTick()
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

      const PDF_WIDTH = 8
      const PDF_HEIGHT = 4
      const doc = new JsPDF({ unit: 'cm', format: [PDF_HEIGHT, PDF_WIDTH], orientation: 'l' })

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
      list,
      logo,
      pdfType,
      generatePdf,
      isShown,
      pdfTarget,
      printType,
      currExecOptionIndex
    }
  }
}
</script>
