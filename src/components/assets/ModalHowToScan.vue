<template lang="pug">
modal-behavior(
  :header="header"
  :primaryBtnText="primaryBtnText"
  :secondaryBtnText="secondaryBtnText"
  @click:primary="primaryHandler"
  @click:secondary="secondaryHandler"
)
  template(#note v-if="materialList.length > 0")
    div(class="flex items-center text-black-800 w-170")
      svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      i18n-t(keypath="DD0032" tag="div" class="text-caption leading-1.6" scope="global")
        template(#RR0062)
          div(class="inline-flex items-center text-assist-blue cursor-pointer" @click="printA4Card(materialList)") {{ $t("RR0062") }}
            svg-icon(iconName="open_in_new" size="15")
        template(#RR0061)
          div(class="inline-flex items-center text-assist-blue cursor-pointer" @click="printGeneralLabel(materialList)") {{ $t("RR0061") }}
            svg-icon(iconName="open_in_new" size="15")
  div(class="w-230")
    div(class="text-h5 font-bold text-primary text-center mb-2.5") {{ title }}
    div(class="text-caption text-black-800 text-center leading-1.6 mb-6") {{ description || $t("DD0097") }}
    div(class="grid grid-cols-3 gap-7.5")
      div(class="border border-black-400 card-shadow rounded-md")
        div(class="h-64 flex items-end justify-center")
          img(src="@/assets/images/upload_step1.png" class="w-60")
        div(class="flex min-h-20 bg-black-200 rounded-b-md p-4")
          div(class="mr-2 flex-shrink-0 bg-black-0 text-black-500 rounded-full w-6 h-6 flex items-center justify-center") 1
          div(class="text-primary text-body1 font-bold leading-1.6") {{ $t("DD0082") }}
      div(class="border border-black-400 card-shadow rounded-md")
        div(class="h-64 flex items-end justify-center")
          img(src="@/assets/images/upload_step2.png" class="w-60")
        div(class="flex min-h-20 bg-black-200 rounded-b-md p-4")
          div(class="mr-2 flex-shrink-0 bg-black-0 text-black-500 rounded-full w-6 h-6 flex items-center justify-center") 2
          div(class="text-primary text-body1 font-bold leading-1.6") {{ $t("DD0083") }}
      div(class="border border-black-400 card-shadow rounded-md")
        div(class="h-64 flex items-end justify-center")
          img(src="@/assets/images/upload_step3.png" class="w-60")
        div(class="flex min-h-20 bg-black-200 rounded-b-md p-4")
          div(class="mr-2 flex-shrink-0 bg-black-0 text-black-500 rounded-full w-6 h-6 flex items-center justify-center") 3
          div(class="text-primary text-body1 font-bold leading-1.6")
            div {{ $t("DD0084") }}
            i18n-t(keypath="DD0085" tag="div" scope="global")
              template(#RR0008)
                span(class="text-assist-blue underline cursor-pointer" @click="goToAssets") {{ $t("RR0008") }}
</template>

<script setup>
import useNavigation from '@/composables/useNavigation'
import { printA4Card, printGeneralLabel } from '@/utils/print'

defineProps({
  header: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  primaryBtnText: {
    type: String
  },
  secondaryBtnText: {
    type: String
  },
  primaryHandler: {
    type: Function
  },
  secondaryHandler: {
    type: Function
  },
  materialList: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const { goToAssets } = useNavigation()
</script>
