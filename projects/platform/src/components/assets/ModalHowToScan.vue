<template lang="pug">
modal-behavior(
  :header="header"
  :primaryBtnText="primaryBtnText"
  :secondaryBtnText="secondaryBtnText"
  @click:primary="primaryHandler"
  @click:secondary="secondaryHandler"
  data-cy="modal-how-to-scan"
)
  template(#note v-if="materialList && materialList.length > 0")
    div(class="flex items-center text-grey-600 w-170")
      f-svg-icon(iconName="info_outline" size="14" class="mr-1.5")
      i18n-t(
        keypath="DD0032"
        tag="div"
        class="text-caption leading-1.6"
        scope="global"
      )
        template(#RR0062)
          div(
            class="inline-flex items-center text-cyan-400 cursor-pointer"
            @click="printA4Swatch(materialList)"
          ) {{ $t('RR0062') }}
            f-svg-icon(iconName="open_in_new" size="15")
        template(#RR0061)
          div(
            class="inline-flex items-center text-cyan-400 cursor-pointer"
            @click="printGeneralLabel(materialList)"
          ) {{ $t('RR0061') }}
            f-svg-icon(iconName="open_in_new" size="15")
  div(class="w-230")
    div(class="text-h5 font-bold text-grey-900 text-center mb-2.5") {{ title }}
    div(class="text-caption text-grey-600 text-center leading-1.6 mb-6") {{ description || $t('DD0097') }}
    div(class="grid grid-cols-3 gap-7.5")
      div(class="border border-grey-250 rounded-md")
        div(class="h-64 flex items-end justify-center")
          img(src="@/assets/images/upload_step1.png" class="w-60")
        div(class="flex min-h-20 bg-grey-100 rounded-b-md p-4")
          div(
            class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
          ) 1
          div(class="text-grey-900 text-body1 font-bold leading-1.6") {{ $t('DD0082') }}
      div(class="border border-grey-250 rounded-md")
        div(class="h-64 flex items-end justify-center")
          img(src="@/assets/images/upload_step2.png" class="w-60")
        div(class="flex min-h-20 bg-grey-100 rounded-b-md p-4")
          div(
            class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
          ) 2
          div(class="text-grey-900 text-body1 font-bold leading-1.6") {{ $t('DD0083') }}
      div(class="border border-grey-250 rounded-md")
        div(class="h-64 flex items-end justify-center")
          img(src="@/assets/images/upload_step3.png" class="w-60")
        div(class="flex min-h-20 bg-grey-100 rounded-b-md p-4")
          div(
            class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
          ) 3
          div(class="text-grey-900 text-body1 font-bold leading-1.6")
            div {{ $t('DD0084') }}
            i18n-t(keypath="DD0085" tag="div" scope="global")
              template(#RR0008)
                span(
                  class="text-cyan-400 underline cursor-pointer"
                  @click="goToAssets()"
                ) {{ $t('RR0008') }}
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { printGeneralLabel } from '@/utils/print'
import usePrint from '@/composables/material/usePrint'
import type { Material } from '@frontier/platform-web-sdk'

defineProps<{
  header: string
  title: string
  description?: string
  primaryBtnText?: string
  secondaryBtnText?: string
  primaryHandler?: () => void
  secondaryHandler?: () => void
  materialList?: Material[]
}>()

const { goToAssets } = useNavigation()

const { printA4Swatch } = usePrint()
</script>
