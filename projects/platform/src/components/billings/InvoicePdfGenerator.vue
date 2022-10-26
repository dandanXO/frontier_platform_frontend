<template lang="pug">
div
  slot(name="activator" :generatePdf="generatePdf")
  template(v-if="isShown")
    teleport(to="body")
      div(class="fixed right-0 transform translate-x-full")
        div(class="flex flex-col" ref="refPdfWrapper")
          template(v-for="(serviceItemList, index) in serviceItemListByPage")
            div(v-if="currExecOptionIndex === index" class="w-149 h-194 bg-grey-0 pt-6")
              div(class="text-grey-900 flex justify-between px-8 mb-3")
                div(class="text-body2")
                  img(src="@/assets/images/frontier_logo.png" class="w-35 h-6 mb-4")
                  div(class="min-w-87")
                    div(class="flex justify-between items-center mb-1 h-5")
                      p {{ $t('OO0090') }}:
                    div(class="py-2.5")
                      div(class="font-bold mb-2") {{ invoiceInfo.recipient }}
                      div(class="grid gap-1.5")
                        div {{ invoiceInfo.address }}
                        div {{ addressDetail }}
                        div {{ invoiceInfo.email }}
                div(class="text-right")
                  div(class="text-h6 mb-3") INVOICE
                  div(class="text-caption mb-2") {{ $t('OO0081') }} {{ invoiceInfo.invoiceNumber }}
                  div(class="text-caption") {{ $t('OO0082') }}: {{ invoiceInfo.invoiceDate }}
                  div(class="text-body2 text-grey-900 font-bold mt-19.5") {{ $t('OO0128') }} {{ index + 1 }}/{{ serviceItemListByPage.length }}
              div(class="relative")
                div(
                  class="flex bg-primary-0 px-8 py-2 text-caption font-bold text-grey-900"
                )
                  div(style="width: 50%") {{ $t('RR0014') }}
                  div(class="text-center" style="width: 30%") {{ $t('OO0091') }}
                  div(class="text-center" style="width: 20%") {{ $t('OO0093') }}
                div(class="h-77.5 px-8 my-5")
                  div(class="flex flex-col gap-2.5")
                    div(
                      v-for="item in serviceItemList"
                      class="flex text-caption text-grey-900"
                    )
                      div(style="width: 50%")
                        div(class="mb-1.5") {{ item.title }}
                        div(class="text-grey-600") {{ item.periodDate }}
                      div(class="text-center" style="width: 30%") {{ item.listPrice }}
                      div(class="text-center" style="width: 20%") {{ invoiceInfo.currency }} ${{ item.price.toFixed(2) }}
                div(class="border-t border-grey-200 mx-8")
              div(class="px-8 mt-3 flex justify-between")
                div
                  div(class="mb-3 text-grey-900 text-caption") {{ $t('OO0094') }}:
                  div(
                    class="grid grid-cols-2 grid-rows-3 w-fit gap-y-2 gap-x-4.5 leading-none text-grey-600 text-caption"
                  )
                    div {{ $t('OO0095') }}
                    div **** **** **** {{ invoiceInfo.cardInfo.lastFour }}
                    div {{ $t('OO0054') }}
                    div {{ invoiceInfo.cardInfo.expiredDate }}
                    div {{ $t('OO0055') }}
                    div {{ invoiceInfo.cardInfo.cardHolderName }}
                div(class="relative h-full")
                  div(class="text-caption text-grey-900 text-right pr-5")
                    span(class="font-bold mr-3") {{ $t('OO0096') }}
                    span {{ invoiceInfo.currency }}${{ calcSubtotal(serviceItemList) }}
                  div(
                    v-if="index + 1 === serviceItemListByPage.length"
                    class="absolute -right-8 top-14.5 w-60 py-2 px-10 bg-primary-0 text-grey-900 text-body2"
                  )
                    span(class="font-bold mr-5") {{ $t('OO0034') }}
                    span {{ invoiceInfo.totalPrice }}
              div(class="px-8 text-caption w-fit ml-auto mt-13.5 mb-7.5")
                div(class="inline-block mr-6")
                  span(class="font-bold text-grey-600 mr-1") {{ $t('OO0097') }}:
                  span(class="text-grey-600 whitespace-nowrap") +886-2-27528855
                div(class="inline-block")
                  span(class="font-bold text-grey-600 mr-1") {{ $t('OO0098') }}:
                  span(class="text-grey-600 whitespace-nowrap") info@frontier.cool
                div(class="text-grey-600 mt-3 whitespace-nowrap") Fuxing N. Rd., Suite 7-3, Taipei City, Taiwan
</template>

<script>
import domtoimage from 'dom-to-image'
import { ref, nextTick, reactive, computed } from 'vue'
import { jsPDF as JsPDF } from 'jspdf'
import { useStore } from 'vuex'

export default {
  name: 'InvoicePdfGenerator',
  setup() {
    const store = useStore()
    const isShown = ref(false)
    const currExecOptionIndex = ref(0)
    const refPdfWrapper = ref(null)
    const serviceItemListByPage = reactive([])
    const invoiceInfo = ref(null)
    const countryName = computed(
      () =>
        store.getters['code/countryList'].find(
          (country) => country.countryCode === invoiceInfo.value.countryCode
        )?.name
    )
    const addressDetail = computed(() =>
      [invoiceInfo.value.zipCode, invoiceInfo.value.city, countryName.value]
        .filter((v) => !!v)
        .join(', ')
    )

    const generatePdf = async (invoiceId) => {
      store.dispatch('helper/pushModalLoading')
      serviceItemListByPage.length = 0
      currExecOptionIndex.value = 0
      const result = await store.dispatch('organization/getInvoiceDetail', {
        invoiceId,
      })
      invoiceInfo.value = result.invoiceInfo

      isShown.value = true

      const itemsPerPage = 8
      const totalPage = Math.ceil(
        invoiceInfo.value.serviceItemList.length / itemsPerPage
      )

      for (let i = 0; i < totalPage; i++) {
        const part = invoiceInfo.value.serviceItemList.slice(
          i * itemsPerPage,
          itemsPerPage * (i + 1)
        )
        serviceItemListByPage.push(part)
      }

      const scale = 3
      const dataUrls = []

      await asyncForEach(serviceItemListByPage, async (el, index, arr) => {
        await nextTick()
        const dataUrl = await domtoimage.toJpeg(refPdfWrapper.value, {
          quality: 1,
          width: refPdfWrapper.value.clientWidth * scale,
          height: refPdfWrapper.value.clientHeight * scale,
          style: {
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
          },
        })

        dataUrls.push({
          dataUrl,
          num: refPdfWrapper.value.children.length,
        })
        currExecOptionIndex.value++
      })

      const PDF_WIDTH = 21
      const PDF_HEIGHT = 29.7
      const doc = new JsPDF({ unit: 'cm', format: 'a4', orientation: 'p' })

      await asyncForEach(dataUrls, async (el, index, arr) => {
        for (let i = 0; i < el.num; i++) {
          doc.addImage(
            el.dataUrl,
            'JPEG',
            0,
            -i * PDF_HEIGHT,
            PDF_WIDTH,
            PDF_HEIGHT * el.num
          )
          if (i !== el.num - 1) {
            doc.addPage()
          }
        }
        if (index !== arr.length - 1) {
          doc.addPage()
        }
      })
      doc.setProperties({ title: 'Invoice' })

      window.open(doc.output('bloburl').toString())

      isShown.value = false
      store.dispatch('helper/closeModalLoading')
    }

    const calcSubtotal = (items) =>
      items.reduce((prev, current) => prev + current.price, 0)

    // We need this function because the build-in forEach won't confirm the generated Pdf orders when calling async function
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    return {
      serviceItemListByPage,
      generatePdf,
      isShown,
      refPdfWrapper,
      currExecOptionIndex,
      calcSubtotal,
      invoiceInfo,
      countryName,
      addressDetail,
    }
  },
}
</script>
