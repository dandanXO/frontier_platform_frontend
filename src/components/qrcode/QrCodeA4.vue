<template lang="pug">
div
  slot(name="activator" :generatePdf="generatePdf")
  template(v-if="isShown")
    teleport(to="body")
      div(class="fixed right-0 transform translate-x-full")
        div(class="flex flex-col" ref="pdfTarget")
          template(v-for="(item, index) in list")
            div(v-if="currExecOptionIndex === index" class="relative flex flex-col justify-between items-center w-148.5 h-210.5 bg-black-0 px-10 py-10")
              div(class="flex w-full")
                img(:src="logo" class="mr-7 w-12.5 h-12.5 rounded-sm flex-shrink-0")
                div(class="text-caption text-primary w-full grid gap-y-3")
                  div(class="text-body1 font-bold") {{item.materialNo}}
                  div {{$t('RR0014')}} : {{item.description}}
                  div {{$t('RR0021')}} : {{item.content}}
                  div {{$t('RR0023')}} : {{item.materialYarnCount}}
                  div {{$t('RR0024')}} : {{item.materialDensity}}
                  div {{$t('RR0025')}} : {{item.pattern}}
                  div {{$t('RR0026')}} : {{item.color}}
                  div {{$t('RR0015')}} : {{item.materialWeight}}
                  div {{$t('RR0019')}} : {{item.materialWidth}}
                  div {{$t('RR0022')}} : {{item.finish}}
                div(class="flex flex-col flex-shrink-0 items-center text-primary")
                  span(class="whitespace-nowrap text-caption mb-2.5 font-bold" :class="[item.sideType === SIDE_TYPE.FACE ? '' : backSideClass]") {{item.sideType === SIDE_TYPE.FACE ? $t('DD0046') : $t('DD0047') }}
                  qr-code(:value="item.frontierNo" :size="60")
                  span(class="whitespace-nowrap text-caption mt-2.5 scale-90") {{item.frontierNo}}
              div(
                class="text-black-600 relative flex flex-col items-center justify-center w-full h-97 bg-cover"
                :style="{'background-image': 'url('+ require('@/assets/images/pdf-outline.png') +')'}"
              )
                span(class="whitespace-nowrap text-caption mb-2.5") {{item.sideType === SIDE_TYPE.FACE ? $t('DD0046') : $t('DD0047') }}
                span(class="whitespace-nowrap text-caption") {{$t('DD0050')}}
              div(class="flex flex-col justify-start items-start w-full")
                span(class="mb-2 font-bold text-caption") {{org.orgName}}
                span(class="text-caption") {{org.address}}
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
  name: 'QrCodeA4',
  components: { QrCode },
  setup () {
    const store = useStore()
    const isShown = ref(false)
    const currExecOptionIndex = ref(0)
    const pdfTarget = ref(null)
    const backSideClass = 'text-black-0 py-1.5 px-2 bg-primary rounded-sm'

    const org = computed(() => store.getters['organization/organization'])
    const logo = computed(() => store.getters['organization/orgLogo'])
    const list = reactive([])

    const generatePdf = async (materialList) => {
      store.dispatch('helper/pushModalLoading')
      list.length = 0
      isShown.value = true
      currExecOptionIndex.value = 0

      materialList.forEach(material => {
        const tempMaterial = typeof material === 'string' ? JSON.parse(material) : material
        const { isDoubleSideMaterial, frontierNo, relationFrontierNo } = tempMaterial

        if (isDoubleSideMaterial) {
          list.push({
            ...tempMaterial,
            frontierNo,
            sideType: SIDE_TYPE.FACE
          })
          list.push({
            ...tempMaterial,
            frontierNo: relationFrontierNo,
            sideType: SIDE_TYPE.BACK
          })
        } else {
          list.push(tempMaterial)
        }
      })

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

      const PDF_WIDTH = 21
      const PDF_HEIGHT = 29.7
      const doc = new JsPDF({ unit: 'cm', format: 'a4', orientation: 'p' })

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
      doc.setProperties({ title: 'new Report' })

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
      org,
      logo,
      backSideClass,
      generatePdf,
      isShown,
      pdfTarget,
      currExecOptionIndex,
      SIDE_TYPE
    }
  }
}
</script>
