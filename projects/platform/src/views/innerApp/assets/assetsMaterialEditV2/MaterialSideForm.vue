<template>
  <div class="flex flex-col gap-y-4 p-5 bg-green-50-v1 rounded-t-md">
    <!-- Material Type -->
    <f-input-container :label="t('MI0003')" required>
      <f-select-input
        :placeholder="t('RR0588')"
        :selectValue="materialTypeValue.value"
        @update:selectValue="materialTypeValue.onInput"
        :dropdownMenuTree="materialTypeDropdownSource"
        :hintError="getFieldError('materialType')"
        :canAddNew="false"
        emit-value
        map-options
        class="w-full"
      ></f-select-input>
    </f-input-container>

    <!-- Construction Type -->
    <f-input-container
      :label="t('MI0150')"
      required
      v-if="needsConstructionType"
    >
      <f-select-input
        :placeholder="t('MI0152')"
        :selectValue="materialTypeConstructionValue.value?.name"
        @update:selectValue="selectMaterialTypeConstruction"
        @addNew="inputMenu.addMaterialTypeConstructionOption($event)"
        :dropdownMenuTree="constructionTypeDropdownSource"
        :hintError="getFieldError('materialTypeConstruction')"
        emit-value
        map-options
        class="w-full"
      ></f-select-input>
    </f-input-container>

    <!-- Content -->
    <content-field-array
      :material-type-value="materialTypeValue.value"
      :content-fields="contentFields"
      :content-name-dropdown-source="contentNameDropdownSource"
      :content-display-error="contentDisplayError"
      :push-content-field="pushContentField"
      :remove-content-field="removeContentField"
      :select-content-name="selectContentName"
      :get-field-error="getFieldError"
      :input-menu="inputMenu"
      :material-form-service="materialFormService"
    />
  </div>

  <!-- See More -->
  <div
    class="flex flex-col bg-grey-50-v1 rounded-b-md border-t border-green-200-v1"
  >
    <div class="flex justify-end items-center py-2 px-5 h-12">
      <button
        class="text-cyan-500-v1 underline text-sm font-semibold flex flex-row items-center gap-x-1"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? t('EE0245') : t('EE0244') }}
        <f-svg-icon
          size="24"
          iconName="arrow_drop_down"
          :class="{ 'rotate-180': isExpanded }"
        ></f-svg-icon>
      </button>
    </div>

    <!-- Additional Fields -->
    <div v-if="isExpanded" class="flex flex-col gap-y-4 p-3">
      <!-- Material Description -->
      <f-select-input
        :selectValue="descriptionList.value"
        @update:selectValue="descriptionList.onInput"
        :dropdownMenuTree="inputMenu.specOptions.descriptionList"
        @addNew="inputMenu.addDescriptionOption"
        :label="t('MI0023')"
        :placeholder="t('MI0151')"
        :hintError="getFieldError('descriptionList')"
        multiple
        :multipleTagInputValidations="[inputValidate, lengthValidate]"
        class="w-full"
      >
        <template #custom-not-found>
          <custom-not-found />
        </template>
      </f-select-input>

      <!-- Finish -->
      <f-select-input
        :selectValue="finishList.value"
        @update:selectValue="finishList.onInput"
        :dropdownMenuTree="inputMenu.specOptions.finishList"
        @addNew="inputMenu.addFinishOption"
        :label="t('RR0022')"
        :placeholder="t('MI0040')"
        :hintError="getFieldError('finishList')"
        multiple
        :multipleTagInputValidations="[inputValidate, lengthValidate]"
      ></f-select-input>

      <!-- Material Construction Fields -->
      <material-construction-fields
        :is-material-type="isMaterialType"
        :warp-density="warpDensity"
        :weft-density="weftDensity"
        :warp-yarn-size="warpYarnSize"
        :weft-yarn-size="weftYarnSize"
        :knit-machine-type="knitMachineType"
        :knit-wales-per-inch="knitWalesPerInch"
        :knit-courses-per-inch="knitCoursesPerInch"
        :knit-yarn-size="knitYarnSize"
        :knit-machine-gauge="knitMachineGauge"
        :leather-average-skin-per-meter-square="
          leatherAverageSkinPerMeterSquare
        "
        :leather-grade="leatherGrade"
        :leather-tannage="leatherTannage"
        :leather-thickness-per-mm="leatherThicknessPerMm"
        :non-woven-bonding-method="nonWovenBondingMethod"
        :non-woven-thickness-per-mm="nonWovenThicknessPerMm"
        :trim-outer-diameter="trimOuterDiameter"
        :trim-length="trimLength"
        :trim-thickness="trimThickness"
        :trim-width="trimWidth"
        :get-field-error="getFieldError"
      />

      <!-- Pantone Color -->
      <pantone-color-selector
        :pantone-value-display-list="pantoneValueDisplayList"
        :pantone-dropdown-menu-tree="pantoneDropdownMenuTree"
        :remove-pantone="removePantone"
        :handle-pantone-selection="handlePantoneSelection"
        :handle-pantone-search="handlePantoneSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { materialFormServiceKey } from '@/utils/constants'
import { type PantoneColor } from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import ContentFieldArray from './ContentFieldArray.vue'
import MaterialConstructionFields from './MaterialConstructionFields.vue'
import PantoneColorSelector from './PantoneColorSelector.vue'
import { useMaterialSide } from './composables/useMaterialSide'

interface Props {
  side: 'faceSide' | 'backSide'
  pantoneList: PantoneColor[]
  pantoneDropdownMenuTree: any
  isExpanded: boolean
}

interface Emits {
  (e: 'update:isExpanded', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Inject the material form service
const materialFormService = inject(
  materialFormServiceKey
) as MaterialFormService

// Access inputMenu from materialFormService
const { inputMenu } = materialFormService

// Use the material side composable
const {
  // Content
  contentFields,
  pushContentField,
  removeContentField,
  selectContentName,
  contentDisplayError,

  // Material Type
  materialTypeValue,
  materialTypeConstructionValue,
  selectMaterialTypeConstruction,
  needsConstructionType,
  isMaterialType,

  // Dropdown Sources
  materialTypeDropdownSource,
  constructionTypeDropdownSource,
  contentNameDropdownSource,

  // Form Fields
  descriptionList,
  warpDensity,
  weftDensity,
  warpYarnSize,
  weftYarnSize,
  finishList,

  // Knit Fields
  knitMachineType,
  knitWalesPerInch,
  knitCoursesPerInch,
  knitYarnSize,
  knitMachineGauge,

  // Leather Fields
  leatherAverageSkinPerMeterSquare,
  leatherGrade,
  leatherTannage,
  leatherThicknessPerMm,

  // Non-woven Fields
  nonWovenBondingMethod,
  nonWovenThicknessPerMm,

  // Trim Fields
  trimOuterDiameter,
  trimLength,
  trimThickness,
  trimWidth,

  // Pantone
  pantoneColor,
  pantoneValueDisplayList,
  removePantone,
  handlePantoneSelection,

  // Utilities
  getFieldError,
} = useMaterialSide({
  side: props.side,
  materialFormService,
  inputMenu,
  pantoneList: props.pantoneList,
})

// Validation rules
const inputValidate = (str: string) => str.replace(/,/g, '')
const lengthValidate = (str: string) => str.slice(0, 500)

// Handle pantone search
const handlePantoneSearch = (query: string) => {
  // This will be handled by the parent component
  // We can emit this event if needed
}

// Computed for isExpanded
const isExpanded = computed({
  get: () => props.isExpanded,
  set: (value: boolean) => emit('update:isExpanded', value),
})
</script>
