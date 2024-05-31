<template lang="pug"></template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { computed, ref, toRef, onMounted } from 'vue'
import type { Material } from '@frontier/platform-web-sdk'
import type { QrCodePrintLabelSetting } from '@/composables/useAssets'
import {
  PrintLabelSettingMaterialType,
  PrintLabelSettingMaterialInformation,
} from '@/utils/constants'

const props = defineProps<{
  materialList: Material[]
  printLabel: (materials: Material[]) => any
}>()
const store = useStore()

const materialList = toRef(props.materialList)

const printSetting = computed(() => store.getters['user/printLabelSetting'])

const materialTypeConfig = computed(() => {
  const materialTypes = []

  for (const config of PrintLabelSettingMaterialType) {
    const mappedList: string[] = []
    for (const option of config.options) {
      if (
        printSetting.value &&
        printSetting.value[`${config.dataKey}`][`${option.value}`]
      ) {
        mappedList.push(option.value)
      }
    }
    const mappedConfig = {
      key: config.key,
      options: config.options,
      list: ref<string[]>(mappedList),
    }

    materialTypes.push(mappedConfig)
  }

  return materialTypes
})

const materialInformationConfig = computed(() => {
  const mappedList: string[] = []
  for (const option of PrintLabelSettingMaterialInformation.options) {
    if (
      printSetting.value &&
      printSetting.value[`${PrintLabelSettingMaterialInformation.dataKey}`][
        `${option.value}`
      ]
    ) {
      mappedList.push(option.value)
    }
  }

  return {
    options: PrintLabelSettingMaterialInformation.options,
    list: ref<string[]>(mappedList),
  }
})

const materialShow = ref<boolean[]>([])
const fontSizeValue = ref()

const getCurrentSetting = (): QrCodePrintLabelSetting => {
  const fontSizeObject = {
    fontSize: fontSizeValue.value,
  }

  let materialTypeObject = {}
  let index = 0
  for (const config of PrintLabelSettingMaterialType) {
    let dataConfig = {}
    for (const configKey of config.options) {
      dataConfig = {
        ...dataConfig,
        [configKey.value]: materialTypeConfig.value[index].list.value.includes(
          configKey.value
        ),
      }
    }
    index += 1

    materialTypeObject = {
      ...materialTypeObject,
      [config.dataKey]: dataConfig,
    }
  }

  let materialInfoObject = {}
  for (const configKey of PrintLabelSettingMaterialInformation.options) {
    materialInfoObject = {
      ...materialInfoObject,
      [configKey.value]: materialInformationConfig.value.list.value.includes(
        configKey.value
      ),
    }
  }

  const currentSetting = {
    ...fontSizeObject,
    ...materialTypeObject,
    materialInfoOptions: materialInfoObject,
  }

  return currentSetting as unknown as QrCodePrintLabelSetting
}

const handlePrintLabel = async () => {
  store.dispatch('helper/pushModalLoading')
  for (const material of materialList.value) {
    materialShow.value.push(true)
  }
  const printMaterials: Material[] = []
  let index = 0

  if (
    !fontSizeValue.value ||
    fontSizeValue.value < 5 ||
    fontSizeValue.value > 12
  ) {
    store.dispatch('helper/closeModalLoading')
    return null
  }
  for (const material of materialList.value) {
    if (materialShow.value[index]) {
      printMaterials.push(material)
    }
    index += 1
  }

  if (printMaterials.length > 0) {
    props.printLabel(printMaterials)
  }
}

onMounted(async () => {
  //因為業務需求所以跳過整個preview畫面 其他流程不變
  await store.dispatch('user/getPrintLabelSetting')
  store.dispatch('helper/closeModalBehavior')
  fontSizeValue.value = printSetting.value.fontSize
  await handlePrintLabel()
  store.dispatch('helper/closeModalLoading')
})
</script>
