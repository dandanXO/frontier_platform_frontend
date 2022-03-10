<template lang="pug">
div( class="w-149 h-194")
  div(class="text-primary flex justify-between px-8 mb-3")
    div(class="text-body2")
      div(class="flex items-center mb-4")
        img(src="@/assets/images/frontier_logo.png" class="w-35 mr-4.5")
        invoice-pdf-generator
          template(#activator="{ generatePdf }")
            div(class="flex items-center text-assist-blue cursor-pointer" @click="generatePdf(innerInvoice.invoiceId)")
              svg-icon(iconName="picture_as_pdf")
              span(class="ml-1 text-caption font-bold") {{$t("OO0084")}}
      div(class="min-w-87")
        div(class="flex justify-between items-center mb-1 h-5")
          p {{$t("OO0090")}}:
          btn-functional(@click="pushModalEditBillingInfo") {{$t("RR0054")}}
        div(class="py-2.5 border border-black-400 rounded px-2")
          div(class="font-bold mb-2") {{innerInvoice.recipient}}
          div(class="grid gap-1.5")
            div {{innerInvoice.address}}
            div {{addressDetail}}
            div {{innerInvoice.email}}
    div(class="text-right")
      div(class="text-h6 mb-3") INVOICE
      div(class="text-caption mb-2") {{$t("OO0081")}} {{innerInvoice.invoiceNumber}}
      div(class="text-caption") {{$t("OO0082")}}: {{innerInvoice.invoiceDate}}
  div(class="relative")
    div(class="flex bg-brand-light px-8 py-2 text-caption font-bold text-primary")
      div(style="width: 50%") {{$t("RR0014")}}
      div(class="text-center" style="width: 30%") {{$t("OO0091")}}
      div(class="text-center" style="width: 20%") {{$t("OO0093")}}
    overlay-scrollbar-container(class="h-77.5 px-8 my-5")
      div(class="flex flex-col gap-2.5")
        div(v-for="item in innerInvoice.serviceItemList" class="flex text-caption text-primary")
          div(style="width: 50%")
            div(class="mb-1.5") {{item.title}}
            div(class="text-black-600") {{item.periodDate}}
          div(class="text-center" style="width: 30%") {{item.listPrice}}
          div(class="text-center" style="width: 20%") {{item.price}}
    div(class="border-t border-black-500 mx-8")
  div(class="px-8 mt-3 flex justify-between")
    div
      div(class="mb-3 text-primary text-caption") {{$t("OO0094")}}:
      div(class="grid grid-cols-2 grid-rows-3 w-fit gap-y-2 gap-x-4.5 leading-none text-black-700 text-caption")
        div {{$t("OO0095")}}
        div **** **** **** {{innerInvoice.cardInfo.lastFour}}
        div {{$t("OO0054")}}
        div {{innerInvoice.cardInfo.expiredDate}}
        div {{$t("OO0055")}}
        div {{innerInvoice.cardInfo.cardHolderName}}
    div(class="relative h-full")
      div(class="text-caption text-primary text-right pr-5")
        span(class="font-bold mr-3") {{$t("OO0096")}}
        span {{innerInvoice.currency}}${{subtotalPrice}}
      div(class="absolute -right-8 top-14.5 w-60 py-2 px-10 bg-brand-light text-primary text-body2")
        span(class="font-bold mr-5") {{$t("OO0034")}} 
        span {{innerInvoice.totalPrice}}
  div(class="px-8 text-caption w-fit ml-auto mt-13.5 mb-7.5")
    div(class="inline-block mr-6")
      span(class="font-bold text-black-700 mr-1") {{$t("OO0097")}}:
      span(class="text-black-600") +886-2-27528855
    div(class="inline-block")
      span(class="font-bold text-black-700 mr-1") {{$t("OO0098")}}:
      span(class="text-black-600") info@frontier.cool
    div(class="text-black-600 mt-3") Fuxing N. Rd., Suite 7-3, Taipei City, Taiwan
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import InvoicePdfGenerator from '@/components/billings/InvoicePdfGenerator.vue'

export default {
  name: 'ModalPreviewInvoice',
  components: { InvoicePdfGenerator },
  props: {
    invoiceInfo: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const store = useStore()
    const innerInvoice = ref(props.invoiceInfo)
    const countryName = computed(() => store.getters['code/countryList'].find(country => country.countryCode === innerInvoice.value.countryCode)?.name)
    const subtotalPrice = computed(() => innerInvoice.value.serviceItemList.reduce((prev, current) => prev + current.price, 0))
    const addressDetail = computed(() => [innerInvoice.value.zipCode, innerInvoice.value.city, countryName.value].filter(v => !!v).join(', '))

    const pushModalEditBillingInfo = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-edit-billing-info',
        properties: {
          billingInfo: innerInvoice.value,
          actionHandler: async (billingInfo) => {
            store.dispatch('helper/pushModalLoading')
            const { invoiceInfo } = await store.dispatch('organization/updateInvoiceBillingInfo', { ...billingInfo, invoiceId: props.invoiceInfo.invoiceId })
            innerInvoice.value = invoiceInfo
            store.dispatch('helper/closeModalLoading')
            store.dispatch('helper/closeModal')
          }
        }
      })
    }

    return {
      subtotalPrice,
      innerInvoice,
      countryName,
      addressDetail,
      pushModalEditBillingInfo
    }
  }
}
</script>
