<template lang="pug">
modal-behavior(
  :primaryBtnDisabled="disablePrintBtn()"
  :header="$t('MM0038')"
  :primaryBtnText="$t('MM0042')"
  :primaryBtnIcon="'open_in_new'"
  :secondaryBtnText="hasSetSetting ? $t('MM0049') : $t('MM0041')"
  :secondaryBtnIcon="hasSetSetting ? 'check' : ''"
  :secondaryBtnDisabled="hasSetSetting"
  @click:primary="handlePrintLabel"
  @click:secondary="handleSetDefault"
)
  div(class="flex mx-[-21px] my-[-21px]")
    div(class="w-200")
      f-scrollbar-container(class="w-fit max-h-103 box-content relative")
        div(v-for="(material, index) in materialList")
          div(
            class="h-52 w-full flex flex-row border border-transparent border-b-grey-200"
            :class="[materialShowConfigs.value[index] ? 'opacity-100' : 'opacity-75']"
          )
            div(
              class="w-25 border border-transparent border-r-grey-200 flex flex-col items-center justify-center"
            )
              p(class="text-[12px] font-bold text-grey-400") {{ index + 1 }}
              label(class="cursor-pointer")
                f-svg-icon(
                  :iconName="materialShowConfigs.value[index] ? 'check_box' : 'check_box_outline_blank'"
                  :size="`24`"
                  :class="materialShowConfigs.value[index] ? 'text-primary-400' : 'text-grey-250'"
                )
                input(
                  type="checkbox"
                  class="hidden"
                  :checked="materialShowConfigs[index]"
                  :value="index"
                  @input="checkMaterial($event)"
                  :disabled="false"
                )
            div(class="w-175 bg-grey-150 flex flex-row items-center justify-center")
              label-preview(
                :type="'face'"
                :index="index + 1"
                :material="material"
                :size="62"
                :setting="currentLabelSetting"
                :reloadQrcode="needReloadQrcode"
              )
              label-preview(
                :type="'back'"
                :index="index + 1"
                :material="material"
                :size="62"
                :setting="currentLabelSetting"
                :reloadQrcode="needReloadQrcode"
              )
    div(class="w-60 max-h-103 overflow-y-scroll")
      div(
        class="w-full py-3 px-3 flex flex-row justify-between border border-transparent border-b-grey-150"
      )
        p(class="text-sm font-bold") {{ $t('RR0054') }}
        p(class="text-xs text-grey-600") {{ $t('MM0040', { number: countMaterials }) }}
      div(
        class="w-full px-3 pt-4 pb-6 justify-between border border-transparent border-b-grey-150"
      )
        p(class="text-xs font-bold mb-2") {{ $t('MM0043') }} {{ fontSizeValue }}px
        f-input-slider(
          :canReset="false"
          :defaultRange="fontSizeDefaultRange"
          :min="5"
          :max="12"
          v-model:range="fontSizeValue"
          ref="fontSzieSliderRef"
        )
      div(class="w-full px-3 pt-4 pb-3 justify-between")
        p(class="text-xs font-bold mb-2") {{ $t('MM0039') }}
        div(class="border border-transparent border-b-grey-150 mb-5 pb-3")
          p(class="text-[10px] font-bold mb-2 text-grey-400") {{ $t('MI0003') }}
          div(v-for="(materialType, index) in materialTypeConfig" class="")
            f-expansion-panel(class="hover:bg-grey-150 rounded mb-2")
              template(#trigger="{ isExpand }")
                div(
                  class="h-8 flex items-center justify-between px-1.5 rounded"
                  :class="[isExpand ? 'bg-grey-150' : '']"
                )
                  div(class="flex")
                    f-svg-icon(
                      iconName="keyboard_arrow_right"
                      size="16"
                      class="transform text-grey-900 mr-1"
                      :class="[isExpand ? 'rotate-90' : '']"
                    )
                    p(class="text-xs text-grey-900 font-bold") {{ materialType.key }}
                  p(class="text-xs text-grey-400") {{ $t('MM0040', { number: materialType.list.value.length }) }}
              template(#content)
                div(class="bg-grey-100 rounded px-1.5 py-2")
                  f-input-checkbox(
                    v-for="(option, index) in materialType.options"
                    :key="index"
                    v-model:inputValue="materialType.list.value"
                    :label="option.label"
                    :value="option.value"
                    @update:inputValue="setAbleToUpdateSetting"
                  )
        div(class="border border-transparent border-b-grey-150 mb-5 pb-3")
          p(class="text-[10px] font-bold mb-2 text-grey-400") {{ $t('MI0001') }}
          f-input-checkbox(
            v-for="(option, index) in materialInformationConfig.options"
            :key="index"
            v-model:inputValue="materialInformationConfig.list.value"
            :label="option.label"
            :value="option.value"
            class="px-1"
            @update:inputValue="setAbleToUpdateSetting"
          )
        div(class="border border-transparent border-b-grey-150 mb-5 pb-3")
          p(class="text-[10px] font-bold mb-2 text-grey-400") {{ $t('RR0219') }}
          f-input-checkbox(
            v-for="(option, index) in ecoImpactorConfig.options"
            :key="index"
            v-model:inputValue="ecoImpactorConfig.list.value"
            :label="option.label"
            :value="option.value"
            class="px-1"
            @update:inputValue="setAbleToUpdateSetting"
          )
        div(class="text-[10px] font-bold mb-2 text-grey-400")
          i18n-t(
            keypath="MM0048"
            class="text-[10px] font-bold mb-2 text-grey-400"
            scope="global"
          )
            template(#UU0078)
              span(class="text-cyan-400 cursor-pointer" @click="") {{ $t('UU0078') }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, ref, toRef, onMounted } from 'vue'
import { useField } from 'vee-validate'
import { type Material } from '@frontier/platform-web-sdk'
import { type QrCodePrintLabelSetting } from '@/composables/useAssets'
import type { FInputSlider } from '@frontier/ui-component'
import LabelPreview from '@/components/assets/labelPreview/LabelPreview.vue'
import {
  PrintLabelSettingMaterialType,
  PrintLabelSettingEcoImpactor,
  PrintLabelSettingMaterialInformation,
} from '@/utils/constants'

const props = defineProps<{
  materialList: Material[]
  printLabel: (materials: Material[], setting: QrCodePrintLabelSetting) => any
  updateSetting: (setting: QrCodePrintLabelSetting) => void
}>()
const needReloadQrcode = ref(0)
const { value: fontSizeValue, errorMessage } = useField<number>(
  'fontSize',
  (value) => {
    if (!value) {
      return 'Font size is required'
    }
    if (value < 5 || value > 12) {
      return 'Font size must be between 5 - 12'
    }

    return true
  }
)
// mounted前必須要有數值不能是undefind
fontSizeValue.value = 5
const fontSizeDefaultRange = ref(5)
const fontSzieSliderRef = ref<InstanceType<typeof FInputSlider> | null>(null)
const { t } = useI18n()
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

const ecoImpactorConfig = computed(() => {
  const mappedList: string[] = []
  for (const option of PrintLabelSettingEcoImpactor.options) {
    if (
      printSetting.value &&
      printSetting.value[`${PrintLabelSettingEcoImpactor.dataKey}`][
        `${option.value}`
      ]
    ) {
      mappedList.push(option.value)
    }
  }

  return {
    options: PrintLabelSettingEcoImpactor.options,
    list: ref<string[]>(mappedList),
  }
})

const hasSetSetting = ref<boolean>(false)

const setHasSetting = (status: boolean): void => {
  hasSetSetting.value = status
}

const setAbleToUpdateSetting = (): void => setHasSetting(false)

const countMaterials = computed(() => {
  let count = 0

  for (const config of materialTypeConfig.value) {
    count += config.list.value.length
  }

  return count
})

const materialShow = ref<boolean[]>([])

const materialShowConfigs = computed(() => {
  for (const material of materialList.value) {
    materialShow.value.push(true)
  }

  return materialShow
})

const disablePrintBtn = () => {
  return !materialShow.value.some((item) => item)
}

const checkMaterial = (e: Event) => {
  if (!e.target) {
    return
  }
  const target = e.target as HTMLInputElement

  if (materialShow.value && (target.value as unknown as number) >= 0) {
    materialShow.value[target.value as unknown as number] =
      !materialShow.value[target.value as unknown as number]
  }
}

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

  let ecoImpactorObject = {}
  for (const configKey of PrintLabelSettingEcoImpactor.options) {
    ecoImpactorObject = {
      ...ecoImpactorObject,
      [configKey.value]: ecoImpactorConfig.value.list.value.includes(
        configKey.value
      ),
    }
  }

  const currentSetting = {
    ...fontSizeObject,
    ...materialTypeObject,
    materialInfoOptions: materialInfoObject,
    ecoImpactorOptions: ecoImpactorObject,
  }

  return currentSetting as unknown as QrCodePrintLabelSetting
}

const currentLabelSetting = computed<QrCodePrintLabelSetting>(() =>
  getCurrentSetting()
)

const handleSetDefault = () => {
  store.dispatch('helper/pushModalLoading')
  if (
    !fontSizeValue.value ||
    fontSizeValue.value < 5 ||
    fontSizeValue.value > 12
  ) {
    store.dispatch('helper/closeModalLoading')
    return null
  }

  const currentSetting = getCurrentSetting()

  props.updateSetting(currentSetting)

  setHasSetting(true)
  store.dispatch('helper/closeModalLoading')
}

const handlePrintLabel = async () => {
  store.dispatch('helper/pushModalLoading')
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

  const currentSetting = getCurrentSetting()
  if (printMaterials.length > 0) {
    props
      .printLabel(
        printMaterials,
        currentSetting as unknown as QrCodePrintLabelSetting
      )
      .then(() => {
        // 強制觸發 vue的子組件watch rerander qrcode img 的作法
        needReloadQrcode.value = Math.random()
      })
  }

  store.dispatch('helper/closeModalLoading')
}

onMounted(async () => {
  await store.dispatch('user/getPrintLabelSetting')

  fontSizeValue.value = printSetting.value.fontSize
  fontSizeDefaultRange.value = printSetting.value.fontSize
  fontSzieSliderRef.value?.setValue(printSetting.value.fontSize)
})
</script>
