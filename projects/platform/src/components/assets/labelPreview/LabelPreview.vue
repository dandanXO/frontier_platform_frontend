<template lang="pug">
div(
  v-if="type === 'face' && faceSideMaterial"
  class="w-[300px] h-[167px] mr-4 bg-[#ffffff] px-2 pt-2 pb-1 flex flex-col overflow-hidden"
)
  template(v-if="onlyQrcodeImage")
    div(class="flex flex-col items-center justify-center w-full h-full")
      div(:id="`qr-code-${index}-face`" class="relative")
      div
        p(class="text-[10px] bold") {{ $t('DD0046') }} - {{ faceSideMaterial.frontierNo }}
  template(v-else)
    div(
      class="text-[10px]"
      v-if="!isTexpertsRule && setting.materialInfoOptions.isPrintOrgName"
    ) {{ orgName }}
    div(class="flex flex-row overflow-hidden")
      div(
        class="w-[83px] h-full flex flex-col"
        :class="[{ 'justify-between': !isTexpertsRule }]"
      )
        div(v-if="isTexpertsRule" class="flex justify-center w-full")
          img(:src="logo" class="object-cover w-8 h-8 rounded")
        div(
          class="flex flex-row w-full mt-2 mb-2"
          :class="[isTexpertsRule ? 'justify-center' : 'justify-start']"
        )
          div(:id="`qr-code-${index}-face`" class="relative")
        div(
          class="flex flex-col w-full"
          :class="[{ 'mb-[3px]': !isTexpertsRule }, isTexpertsRule ? 'items-center' : 'items-start']"
        )
          p(class="text-[10px] bold") {{ $t('DD0046') }}
          p(
            class="text-[10px] text-grey-600"
            v-if="setting.materialInfoOptions.isPrintFrontierNo || isTexpertsRule"
          ) {{ faceSideMaterial.frontierNo }}
      div(class="w-px h-[150px] bg-grey-250 mx-2")
      div(class="w-[195px] h-full max-h-full flex flex-col overflow-hidden")
        p(class="mb-2 font-bold") {{ material.itemNo }}
        div(
          v-for="info in getPrintLabelItems({ sideType: MaterialSideType.FACE_SIDE, material: material }, setting)"
          class="flex w-full"
          :key="info"
        )
          p(:class="fontSizeOptions[fontSizeIndex]") {{ info }}
        div(class="flex flex-row")
          div(
            v-for="key in Object.keys(carbonEmissions)"
            class="flex flex-row items-center"
            :key="key"
          )
            img(
              v-if="setting.ecoImpactorOptions[emissionsSettingMapper[key]] && carbonEmissions[key].value"
              :src="emissionsIconMapper[key]"
              :class="[iconSizeOptions[fontSizeIndex], 'mr-[2px]']"
            )
            p(
              v-if="setting.ecoImpactorOptions[emissionsSettingMapper[key]] && carbonEmissions[key].value"
              :class="fontSizeOptions[fontSizeIndex]"
            ) {{ `${carbonEmissions[key].value} ${t(emissionsTextCodeMapper[key])}` }}
        div(class="flex flex-row")
          p(
            v-if="setting.ecoImpactorOptions.isPrintCapturedTime && material.carbonEmission && material.carbonEmission.lastUpdateTime"
            :class="fontSizeOptions[fontSizeIndex]"
          ) {{ t('BB0141', { date: toYYYYMMDDFormat(material.carbonEmission.lastUpdateTime), time: toHHMMAFormat(material.carbonEmission.lastUpdateTime) }) }}
div(
  v-else-if="type === 'face' && !faceSideMaterial"
  class="w-[300px] h-[167px] border border-dotted border-grey-250 mr-4 flex flex-row justify-center bg-[#f9f9f9]"
)
  div(class="flex items-center")
    p(class="text-[12px] text-grey-250") {{ $t('MM0045') }}
div(
  v-if="type === 'back' && backSideMaterial"
  class="w-[300px] h-[167px] ml-4 bg-[#ffffff] px-2 pt-2 pb-1 flex flex-col overflow-hidden"
)
  div(
    class="text-[10px]"
    v-if="!isTexpertsRule && setting.materialInfoOptions.isPrintOrgName"
  ) {{ orgName }}
  div(class="flex flex-row overflow-hidden")
    template(v-if="onlyQrcodeImage")
      div(class="flex flex-col items-center justify-center w-full h-full")
        div(:id="`qr-code-${index}-back`" class="relative")
        div
          p(class="text-[10px] bold") {{ $t('DD0047') }} - {{ backSideMaterial.frontierNo }}
    template(v-else)
      div(
        class="w-[83px] h-full flex flex-col"
        :class="[{ 'justify-between': !isTexpertsRule }]"
      )
        div(v-if="isTexpertsRule" class="flex justify-center w-full")
          img(:src="logo" class="object-cover w-8 h-8 rounded")
        div(
          class="flex flex-row w-full mt-2 mb-2"
          :class="[isTexpertsRule ? 'justify-center' : 'justify-start']"
        )
          div(:id="`qr-code-${index}-back`" class="relative")
        div(
          class="flex flex-col w-full"
          :class="[{ 'mb-[3px]': !isTexpertsRule }, isTexpertsRule ? 'items-center' : 'items-start']"
        )
          p(class="text-[10px] bold") {{ $t('DD0047') }}
          p(
            class="text-[10px] text-grey-600"
            v-if="setting.materialInfoOptions.isPrintFrontierNo || isTexpertsRule"
          ) {{ backSideMaterial.frontierNo }}
      div(class="w-px h-[150px] bg-grey-250 mx-2")
      div(class="w-[195px] h-full max-h-full flex flex-col overflow-hidden")
        p(class="mb-2 font-bold") {{ material.itemNo }}
        div(
          v-for="info in getPrintLabelItems({ sideType: MaterialSideType.BACK_SIDE, material: material }, setting)"
          :key="info"
        )
          p(:class="fontSizeOptions[fontSizeIndex]") {{ info }}
        div(class="flex flex-row")
          div(
            v-for="key in Object.keys(carbonEmissions)"
            class="flex flex-row items-center"
            :key="key"
          )
            img(
              v-if="setting.ecoImpactorOptions[emissionsSettingMapper[key]] && carbonEmissions[key].value"
              :src="emissionsIconMapper[key]"
              :class="[iconSizeOptions[fontSizeIndex], 'mr-[2px]']"
            )
            p(
              v-if="setting.ecoImpactorOptions[emissionsSettingMapper[key]] && carbonEmissions[key].value"
              :class="fontSizeOptions[fontSizeIndex]"
            ) {{ `${carbonEmissions[key].value} ${t(emissionsTextCodeMapper[key])}` }}
        p(
          v-if="setting.ecoImpactorOptions.isPrintCapturedTime && material.carbonEmission && material.carbonEmission.lastUpdateTime"
          :class="fontSizeOptions[fontSizeIndex]"
        ) {{ t('BB0141', { date: toYYYYMMDDFormat(material.carbonEmission.lastUpdateTime), time: toHHMMAFormat(material.carbonEmission.lastUpdateTime) }) }}
div(
  v-else-if="type === 'back' && !backSideMaterial"
  class="w-[300px] h-[167px] border border-dotted border-grey-250 ml-4 flex flex-row justify-center bg-[#f9f9f9]"
)
  div(class="flex items-center")
    p(class="text-[12px] text-grey-250") {{ $t('MM0046') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, toRef, onMounted, watch, nextTick } from 'vue'
import type { Material } from '@frontier/platform-web-sdk'
import usePrint from '@/composables/material/usePrint'
import { type QrCodePrintLabelSetting } from '@/composables/useAssets'
import { getMaterialBySide } from '@/utils/material/getMaterialBySide'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import materialInfoForDisplay from '@/utils/material/materialInfoForDisplay'
import { toYYYYMMDDFormat, toHHMMAFormat } from '@frontier/lib/src/utils/date'
import water from '@/assets/images/water.png'
import co2 from '@/assets/images/co2.png'
import land from '@/assets/images/land.png'

const props = defineProps<{
  onlyQrcodeImage?: boolean
  material: Material
  type: string
  index: number
  size: number
  setting: QrCodePrintLabelSetting
  reloadQrcode: number
}>()

const { t } = useI18n()
const { makeQrCode, getPrintLabelItems } = usePrint()
const store = useStore()

const logo = computed<string>(() => store.getters['organization/orgLogo'])
const orgId = computed<number>(() => store.getters['organization/orgId'])
const orgName = computed<number>(
  () => store.getters['organization/organization'].orgName
)
const material = toRef(props.material)
const faceSideMaterial = computed(() =>
  getMaterialBySide(material.value, MaterialSideType.FACE_SIDE)
)
const backSideMaterial = computed(() =>
  getMaterialBySide(material.value, MaterialSideType.BACK_SIDE)
)
const type = toRef(props.type)
const index = toRef(props.index)
const size = toRef(props, 'size')
const setting = computed<QrCodePrintLabelSetting>(() => props.setting)
const fontSizeIndex = computed<number>(() => {
  const value =
    props.setting && props.setting.fontSize ? props.setting.fontSize : 5

  return value - 5
})
const fontSizeOptions = [
  'text-[8.5px]',
  'text-[9.5px]',
  'text-[10.5px]',
  'text-[11.5px]',
  'text-[12.5px]',
  'text-[13.5px]',
  'text-[14.5px]',
  'text-[15.5px]',
]
const iconSizeOptions = [
  'w-[8.5px] h-[8.5px]',
  'w-[9.5px] h-[9.5px]',
  'w-[10.5px] h-[10.5px]',
  'w-[11.5px] h-[11.5px]',
  'w-[12.5px] h-[12.5px]',
  'w-[13.5px] h-[13.5px]',
  'w-[14.5px] h-[14.5px]',
  'w-[15.5px] h-[15.5px]',
]
const carbonEmissions = computed(() => {
  const carbonEmissionsInfo = materialInfoForDisplay.carbonEmission(
    material.value.carbonEmission
  )

  return carbonEmissionsInfo
})
const emissionsTextCodeMapper = {
  water: 'RR0216',
  co2: 'RR0215',
  land: 'RR0218',
}
const emissionsIconMapper = { water, co2, land }
const emissionsSettingMapper = {
  water: 'isPrintWaterDepletion',
  co2: 'isPrintGHG',
  land: 'isPrintLandUse',
}

const isTexpertsRule = computed<boolean>(
  () => store.getters['permission/isTexpertsRule']
)
const randerQrcode = async () => {
  const qrCode = document.getElementById(`qr-code-${index.value}-${type.value}`)
  if (qrCode) {
    const frontierNumber =
      type.value === 'face'
        ? material.value.faceSide?.frontierNo
        : material.value.backSide?.frontierNo
    // org ID: 1694 customize 不需要logo在中間
    await makeQrCode(
      `${frontierNumber}`,
      `qr-code-${index.value}-${type.value}`,
      size.value,
      true,
      isTexpertsRule.value ? '' : logo.value
    )
  }
}
watch(
  () => props.reloadQrcode,
  async () => {
    await nextTick()
    randerQrcode()
  }
)
onMounted(async () => {
  randerQrcode()
})
</script>
