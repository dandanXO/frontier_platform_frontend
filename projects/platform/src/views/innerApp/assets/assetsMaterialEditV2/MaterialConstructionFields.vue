<template>
  <!-- Construction Publish Toggle -->
  <div class="flex flex-col gap-y-4">
    <div class="flex items-center gap-x-3">
      <span class="text-sm font-medium text-gray-900">{{ t('MI0026') }}</span>
      <f-input-switch
        :inputValue="constructionIsPublic.value"
        @update:inputValue="constructionIsPublic.onInput"
        :label="t('MI0025')"
        class="w-50"
      />
    </div>
  </div>

  <!-- Density (only for WOVEN materials) -->
  <f-input-container
    v-if="isMaterialType(MaterialType.WOVEN)"
    :label="`${t('MI0027')}(${t('MI0028')} ✕ ${t('MI0029')})`"
  >
    <div class="flex flex-row items-center gap-x-3 w-full">
      <f-input-text
        :textValue="warpDensity.value"
        @update:textValue="warpDensity.onInput"
        :hintError="getFieldError('construction.warpDensity')"
        :placeholder="t('MI0030')"
        class="flex-1"
      />
      <span>x</span>
      <f-input-text
        :textValue="weftDensity.value"
        @update:textValue="weftDensity.onInput"
        :hintError="getFieldError('construction.weftDensity')"
        :placeholder="t('MI0030')"
        class="flex-1"
      />
    </div>
  </f-input-container>

  <!-- Yarn Size (only for WOVEN materials) -->
  <f-input-container
    v-if="isMaterialType(MaterialType.WOVEN)"
    :label="`${t('RR0023')}(${t('MI0028')} ✕ ${t('MI0029')})`"
  >
    <div class="flex flex-row items-center gap-x-3 w-full">
      <f-input-text
        :textValue="warpYarnSize.value"
        @update:textValue="warpYarnSize.onInput"
        :hintError="getFieldError('construction.warpYarnSize')"
        :placeholder="t('MI0030')"
        class="flex-1"
      />
      <span>x</span>
      <f-input-text
        :textValue="weftYarnSize.value"
        @update:textValue="weftYarnSize.onInput"
        :hintError="getFieldError('construction.weftYarnSize')"
        :placeholder="t('MI0030')"
        class="flex-1"
      />
    </div>
  </f-input-container>

  <!-- Knit specific fields -->
  <div v-if="isMaterialType(MaterialType.KNIT)" class="flex flex-col gap-y-4">
    <f-input-text
      :textValue="knitMachineType.value"
      @update:textValue="knitMachineType.onInput"
      :hintError="getFieldError('construction.machineType')"
      :label="t('MI0031')"
      :placeholder="t('MI0030')"
      :hintSupport="t('MI0069')"
      class="w-full"
    />
    <f-input-text
      :textValue="knitWalesPerInch.value"
      @update:textValue="knitWalesPerInch.onInput"
      :hintError="getFieldError('construction.walesPerInch')"
      :label="t('MI0032')"
      :placeholder="t('MI0030')"
      inputType="number"
      :addOnRight="t('RR0020')"
      class="w-full"
    />
    <f-input-text
      :textValue="knitCoursesPerInch.value"
      @update:textValue="knitCoursesPerInch.onInput"
      :hintError="getFieldError('construction.coursesPerInch')"
      :label="t('MI0033')"
      :placeholder="t('MI0030')"
      inputType="number"
      :addOnRight="t('RR0020')"
      class="w-full"
    />
    <f-input-text
      :textValue="knitYarnSize.value"
      @update:textValue="knitYarnSize.onInput"
      :hintError="getFieldError('construction.yarnSize')"
      :label="t('RR0023')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
    <f-input-text
      :textValue="knitMachineGauge.value"
      @update:textValue="knitMachineGauge.onInput"
      :hintError="getFieldError('construction.machineGaugeInGg')"
      inputType="number"
      :label="t('MI0068')"
      :placeholder="t('MI0030')"
      :addOnRight="t('MI0070')"
      class="w-full"
    />
  </div>

  <!-- Leather specific fields -->
  <div
    v-if="isMaterialType(MaterialType.LEATHER)"
    class="flex flex-col gap-y-4"
  >
    <f-input-text
      :textValue="leatherAverageSkinPerMeterSquare.value"
      @update:textValue="leatherAverageSkinPerMeterSquare.onInput"
      :hintError="getFieldError('construction.averageSkinPerMeterSquare')"
      :label="t('MI0071')"
      :placeholder="t('MI0030')"
      :addOnRight="t('MI0075')"
      class="w-full"
    />
    <f-input-text
      :textValue="leatherGrade.value"
      @update:textValue="leatherGrade.onInput"
      :hintError="getFieldError('construction.grade')"
      :label="t('MI0072')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
    <f-input-text
      :textValue="leatherTannage.value"
      @update:textValue="leatherTannage.onInput"
      :hintError="getFieldError('construction.tannage')"
      :label="t('MI0073')"
      :placeholder="t('MI0030')"
      :hintSupport="t('MI0076')"
      class="w-full"
    />
    <f-input-text
      :textValue="leatherThicknessPerMm.value"
      @update:textValue="leatherThicknessPerMm.onInput"
      :hintError="getFieldError('construction.thicknessPerMm')"
      :label="t('MI0074')"
      :placeholder="t('MI0030')"
      inputType="number"
      :addOnRight="t('MI0077')"
      class="w-full"
    />
  </div>

  <!-- Non-woven specific fields -->
  <div
    v-if="isMaterialType(MaterialType.NON_WOVEN)"
    class="flex flex-col gap-y-4"
  >
    <f-input-text
      :textValue="nonWovenBondingMethod.value"
      @update:textValue="nonWovenBondingMethod.onInput"
      :hintError="getFieldError('construction.bondingMethod')"
      :label="t('MI0078')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
    <f-input-text
      :textValue="nonWovenThicknessPerMm.value"
      @update:textValue="nonWovenThicknessPerMm.onInput"
      :hintError="getFieldError('construction.thicknessPerMm')"
      :label="t('MI0074')"
      :placeholder="t('MI0030')"
      inputType="number"
      :addOnRight="t('MI0077')"
      class="w-full"
    />
  </div>

  <!-- Trim specific fields -->
  <div v-if="isMaterialType(MaterialType.TRIM)" class="flex flex-col gap-y-4">
    <f-input-text
      :textValue="trimOuterDiameter.value"
      @update:textValue="trimOuterDiameter.onInput"
      :hintError="getFieldError('construction.outerDiameter')"
      :label="t('MI0079')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
    <f-input-text
      :textValue="trimLength.value"
      @update:textValue="trimLength.onInput"
      :hintError="getFieldError('construction.length')"
      :label="t('MI0080')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
    <f-input-text
      :textValue="trimThickness.value"
      @update:textValue="trimThickness.onInput"
      :hintError="getFieldError('construction.thickness')"
      :label="t('MI0081')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
    <f-input-text
      :textValue="trimWidth.value"
      @update:textValue="trimWidth.onInput"
      :hintError="getFieldError('construction.width')"
      :label="t('MI0082')"
      :placeholder="t('MI0030')"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { MaterialType } from '@frontier/platform-web-sdk'
import FInputText from '@frontier/ui-component/src/FInput/FInputText/FInputText.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FInputSwitch from '@frontier/ui-component/src/FInput/FInputSwitch/FInputSwitch.vue'

interface Props {
  // Material Type
  isMaterialType: (type: MaterialType) => boolean

  // Construction Publish
  constructionIsPublic: any

  // Woven Fields
  warpDensity: any
  weftDensity: any
  warpYarnSize: any
  weftYarnSize: any

  // Knit Fields
  knitMachineType: any
  knitWalesPerInch: any
  knitCoursesPerInch: any
  knitYarnSize: any
  knitMachineGauge: any

  // Leather Fields
  leatherAverageSkinPerMeterSquare: any
  leatherGrade: any
  leatherTannage: any
  leatherThicknessPerMm: any

  // Non-woven Fields
  nonWovenBondingMethod: any
  nonWovenThicknessPerMm: any

  // Trim Fields
  trimOuterDiameter: any
  trimLength: any
  trimThickness: any
  trimWidth: any

  // Utilities
  getFieldError: (fieldPath: string) => string | undefined
}

defineProps<Props>()

const { t } = useI18n()
</script>
