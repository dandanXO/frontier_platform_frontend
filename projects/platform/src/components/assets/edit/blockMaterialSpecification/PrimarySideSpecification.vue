<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  div(class="flex flex-col gap-y-4")
    div(v-if="showCopyAndSyncBtn" class="flex flex-row items-center gap-x-3")
      f-input-switch(
        :inputValue="isAutoSyncFaceToBackSideInfo.value"
        @update:inputValue="isAutoSyncFaceToBackSideInfo.onInput"
        label="Auto sync face-back info"
      )
      div(class="flex flex-row items-center gap-x-1")
        f-button-label(size="lg" @click="copyFaceSideToBackSide") Copy face side info
        f-tooltip-standard(
          :tooltipMessage="$t('Will cover the content of all forms')"
        )
          template(#slot:tooltip-trigger)
            f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
    f-infobar(
      v-if="showInfoBar"
      class="w-full"
      :notifyType="NOTIFY_TYPE.TIPS"
      :display="DISPLAY.BLOCK"
      title="Make building your Material information faster"
    )
      p To help you fill in the specification information quickly and with focus, the system displays only the fields that need to be filled in for this fabric. When you view the material details page, it will be presented in full. Information that is not in this field will be displayed in light gray.
      br
      p If the face and back information are the same, it is recommended to turn on Auto sync face-back info so that you can focus on maintaining the face side information only.
  f-select-input(
    :disabled="disableBackSideFields"
    :selectValue="featureList.value"
    @update:selectValue="featureList.onInput"
    :dropdownMenuTree="specOptions.featureList"
    @addNew="addFeatureOption($event)"
    label="Feature"
    :placeholder="$t('DD0016')"
    :hintError="displayErrors[`${props.primarySideType}.featureList`]"
    multiple
  )
  f-input-container(v-if="!hideBackSideFields" label="Material Info")
    div(class="flex flex-row gap-x-4.5 pt-2")
      div(class="w-1.5 bg-grey-100")
      div(class="flex flex-col gap-y-8 pl-4")
        div(class="flex flex-col")
          div(class="flex text-body2 font-bold")
            p(class="text-grey-900") Material Type
            i(class="text-red-400 pl-0.5") *
          span(class="mt-2 text-grey-600 text-caption") Select the main type first to get appropriate fabric information
          f-input-radio-group(
            :disabled="disableBackSideFields"
            :inputValue="materialType.value"
            @update:inputValue="handleMaterialTypeChange"
            radioSize="24"
            :optionList="materialTypeOptionList"
            class="mt-4"
          )
        div(
          v-if="[MaterialType.LEATHER, MaterialType.NON_WOVEN, MaterialType.TRIM, MaterialType.OTHERS].includes(materialTypeValue)"
          class="flex flex-col gap-y-4"
        )
          f-infobar(
            class="w-130"
            :notifyType="NOTIFY_TYPE.INFO"
            :display="DISPLAY.BLOCK"
            messageText="You have to fill in the width and weight of the specification first, then enter the quantity of yardage remaining & location to get the correct value."
            :action="{ text: $t('RR0123'), handler: openModalSendFeedback }"
          )
          f-infobar(
            v-if="materialTypeValue === MaterialType.OTHERS"
            class="w-130"
            :notifyType="NOTIFY_TYPE.INFO"
            :display="DISPLAY.BLOCK"
            :action="{ text: $t('RR0123'), handler: openModalSendFeedback }"
          )
            p Contact us for asking further material spec fields
            p(class="font-bold text-grey-600") support@frontier.cool
        template(v-if="materialTypeValue != null")
          f-select-input(
            :disabled="disableBackSideFields"
            :selectValue="descriptionList.value"
            @update:selectValue="descriptionList.onInput"
            :dropdownMenuTree="specOptions.descriptionList"
            @addNew="addDescriptionOption($event)"
            label="Material Description"
            :placeholder="'Select or enter keywords related to this weaving / type'"
            :hintError="displayErrors[`${primarySideType}.descriptionList`]"
            multiple
            class="w-full"
          )
          f-input-container(label="Construction")
            template(#slot:suffix)
              f-input-switch(
                :disabled="disableBackSideFields"
                :inputValue="constructionIsPublic.value"
                @update:inputValue="constructionIsPublic.onInput"
                label="Publish"
                class="w-50"
              )
        div(v-if="materialTypeValue === MaterialType.WOVEN" class="flex flex-col gap-y-4")
          f-input-container(label="Density (warp ✕ weft)")
            div(class="flex fle-row items-center gap-x-3")
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWarpDensity.value"
                @update:textValue="wovenConstructionWarpDensity.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.warpDensity`]"
                :placeholder="'Enter your number'"
                class="w-64"
              )
              span x
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWeftDensity.value"
                @update:textValue="wovenConstructionWeftDensity.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.weftDensity`]"
                :placeholder="'Enter your number'"
                class="w-64"
              )
          f-input-container(label="Yarn Size (warp ✕ weft)")
            div(class="flex fle-row items-center gap-x-3")
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWarpYarnSize.value"
                @update:textValue="wovenConstructionWarpYarnSize.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.warpYarnSize`]"
                :placeholder="'Enter your number'"
                class="w-64"
              )
              span x
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWeftYarnSize.value"
                @update:textValue="wovenConstructionWeftYarnSize.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.weftYarnSize`]"
                :placeholder="'Enter your number'"
                class="w-64"
              )
        div(v-if="materialTypeValue === MaterialType.KNIT" class="flex flex-col gap-y-4")
          div(class="pb-5")
            f-input-text(
              :disabled="disableBackSideFields"
              :textValue="knitConstructionMachineType.value"
              @update:textValue="knitConstructionMachineType.onInput"
              :hintError="displayErrors[`${primarySideType}.construction.machineType`]"
              label="Machine Type"
              placeholder="Enter your info"
              hintSupporting="e.g., Warp, Circular, Flat Weft."
              class="w-70"
            )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionWalesPerInch.value"
            @update:textValue="knitConstructionWalesPerInch.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.walesPerInch`]"
            label="Wales"
            placeholder="Enter your number"
            inputType="number"
            addOnRight="inch"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionCoursesPerInch.value"
            @update:textValue="knitConstructionCoursesPerInch.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.coursesPerInch`]"
            label="Courses"
            placeholder="Enter your number"
            inputType="number"
            addOnRight="inch"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionYarnSize.value"
            @update:textValue="knitConstructionYarnSize.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.yarnSize`]"
            label="Yarn size"
            placeholder="Enter your number"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionMachineGaugeInGg.value"
            @update:textValue="knitConstructionMachineGaugeInGg.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.machineGaugeInGg`]"
            inputType="number"
            label="Machine Gauge"
            placeholder="Enter your number"
            addOnRight="gg"
            class="w-70"
          )
        div(
          v-if="materialTypeValue === MaterialType.LEATHER"
          class="flex flex-col gap-y-2"
        )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="leatherConstructionAverageSkinPerMeterSquare.value"
            @update:textValue="leatherConstructionAverageSkinPerMeterSquare.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.averageSkinPerMeterSquare`]"
            label="Average Skin / Hide Size"
            placeholder="Enter your number"
            addOnRight="m²"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="leatherConstructionGrade.value"
            @update:textValue="leatherConstructionGrade.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.grade`]"
            label="grade"
            placeholder="Enter your info"
            class="w-70"
          )
          div(class="pb-5")
            f-input-text(
              :disabled="disableBackSideFields"
              :textValue="leatherConstructionTannage.value"
              @update:textValue="leatherConstructionTannage.onInput"
              :hintError="displayErrors[`${primarySideType}.construction.tannage`]"
              label="Tannage"
              placeholder="Enter your info"
              hintSupporting="e.g., Chrome, Veg, Synthetic, Combination, Wet White."
              class="w-70"
            )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="leatherConstructionThicknessPerMm.value"
            @update:textValue="leatherConstructionThicknessPerMm.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.thicknessPerMm`]"
            label="Thickness"
            placeholder="Enter your number"
            inputType="number"
            addOnRight="mm"
            class="w-70"
          )
        div(
          v-if="materialTypeValue === MaterialType.NON_WOVEN"
          class="flex flex-col gap-y-2"
        )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="nonWovenConstructionBondingMethod.value"
            @update:textValue="nonWovenConstructionBondingMethod.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.bondingMethod`]"
            label="Bonding Method"
            placeholder="Enter your info"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="nonWovenConstructionThicknessPerMm.value"
            @update:textValue="nonWovenConstructionThicknessPerMm.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.thicknessPerMm`]"
            label="Thickness"
            placeholder="Enter your number"
            inputType="number"
            addOnRight="mm"
            class="w-70"
          )
        div(v-if="materialTypeValue === MaterialType.TRIM" class="flex flex-col gap-y-2")
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionOuterDiameter.value"
            @update:textValue="trimConstructionOuterDiameter.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.outerDiameter`]"
            label="Trim Diameter"
            placeholder="Enter your UOM info and units"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionLength.value"
            @update:textValue="trimConstructionLength.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.length`]"
            label="Trim Length"
            placeholder="Enter your UOM info and units"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionThickness.value"
            @update:textValue="trimConstructionThickness.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.thickness`]"
            label="Trim Thickness"
            placeholder="Enter your UOM info and units"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionWidth.value"
            @update:textValue="trimConstructionWidth.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.width`]"
            label="Trim Width"
            placeholder="Enter your UOM info and units"
            class="w-70"
          )
        div(class="flex flex-col gap-y-2")
          div(
            class="flex items-center gap-x-3"
            v-for="(field, index) in constructionCustomPropertyFields"
            :key="field.key"
          )
            f-input-text(
              :disabled="disableBackSideFields"
              v-model:textValue="field.value.name"
              :hintError="displayErrors[`${primarySideType}.constructionCustomPropertyList[${index}].name`]"
              label="custom name"
              class="w-50"
            )
            f-input-text(
              :disabled="disableBackSideFields"
              v-model:textValue="field.value.value"
              :hintError="displayErrors[`${primarySideType}.constructionCustomPropertyList[${index}].value`]"
              label="custom value"
              class="w-50"
            )
            f-input-switch(
              :disabled="disableBackSideFields || !field.value.name || !field.value.value"
              v-model:inputValue="field.value.isPublic"
              label="Publish"
              class="w-50"
            )
            icon-button(
              iconName="delete"
              @click="() => removeConstructionCustomPropertyField(index)"
              :disabled="disableBackSideFields"
            )
          f-button(
            :disabled="disableBackSideFields"
            type="text"
            size="sm"
            prependIcon="add"
            @click="() => pushConstructionCustomPropertyField({ isPublic: false, name: 'Untitled', value: '' })"
          ) Add form
  f-input-container(
    v-if="!hideBackSideFields"
    :label="$t('RR0021')"
    required
    :hintError="contentDisplayError"
  )
    div(class="flex flex-col gap-y-3")
      div(
        v-for="(field, index) in contentFields"
        :key="contentFields[index].key"
        class="flex flex-row items-center gap-x-3"
      )
        f-select-input(
          :disabled="disableBackSideFields"
          :selectValue="field.value.name"
          @update:selectValue="(name) => selectContent(name, index, field.value)"
          :dropdownMenuTree="specOptions.contentList"
          @addNew="addContentOption($event)"
          :placeholder="$t('DD0016')"
          :hintError="Boolean(displayErrors[`${primarySideType}.contentList[${index}].name`])"
          class="w-100"
        )
        f-input-text(
          :disabled="disableBackSideFields"
          v-model:textValue="field.value.percentage"
          inputType="number"
          placeholder="Number"
          addOnRight="%"
          :hintError="Boolean(displayErrors[`${primarySideType}.contentList[${index}].percentage`])"
          class="w-40"
        )
        icon-button(
          iconName="delete"
          :disabled="disableBackSideFields"
          @click="() => removeContentField(index)"
        )
      f-button(
        type="text"
        size="sm"
        prependIcon="add"
        :disabled="disableBackSideFields"
        @click="() => pushContentField({ contentId: null, name: null, percentage: null })"
      ) Add form
  f-input-container(v-if="showWidthAndWeight" label="Width" required)
    div(class="flex flex-row gap-3")
      f-input-text(
        :textValue="cuttableWidth.value"
        @update:textValue="cuttableWidth.onInput"
        :hintError="displayErrors['width.cuttable']"
        placeholder="Enter your number"
        inputType="number"
        label="Cuttable width"
        class="w-72"
        :rightSelectValue="widthUnit.value"
        @update:rightSelectValue="widthUnit.onInput"
        :rightDropdownOption="widthUnitList"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
      f-input-text(
        :disabled="disableBackSideFields"
        :textValue="fullWidth.value"
        @update:textValue="fullWidth.onInput"
        :hintError="displayErrors['width.full']"
        placeholder="Enter your number"
        inputType="number"
        label="Full width"
        class="w-72"
        :rightSelectValue="widthUnit.value"
        @update:rightSelectValue="widthUnit.onInput"
        :rightDropdownOption="widthUnitList"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
  div(v-if="showWidthAndWeight" class="flex flex-row")
    f-input-text(
      :textValue="weightValue.value"
      @update:textValue="weightValue.onInput"
      :hintError="displayErrors['weight.value']"
      placeholder="Enter your number"
      inputType="number"
      label="Weight"
      class="w-72"
      required
      :rightSelectValue="weightUnit.value"
      @update:rightSelectValue="weightUnit.onInput"
      :rightDropdownOption="weightUnitList"
    )
      template(#slot:right-dropdown-trigger="{ selectedMenu }")
        p {{ selectedMenu?.title }}
  f-select-input(
    :disabled="disableBackSideFields"
    :selectValue="finishList.value"
    @update:selectValue="finishList.onInput"
    :dropdownMenuTree="specOptions.finishList"
    @addNew="addFinishOption($event)"
    label="finish"
    :placeholder="$t('DD0016')"
    :hintError="displayErrors[`${primarySideType}.finishList`]"
    multiple
  )
  f-input-container(v-if="mode === CREATE_EDIT.EDIT" :label="$t('EE0040')")
    div(class="flex flex-col gap-y-4")
      f-input-text(
        class="w-72"
        v-model:textValue="pantoneColor"
        placeholder="Ex.g., 11-0102TCX"
        :button="{ type: 'primary', icon: 'add', isFile: false }"
        @click:button="handleAddPantone"
      )
      div(class="grid gap-y-3")
        div(
          v-for="pantone in pantoneValueDisplayList"
          :key="pantone.name"
          class="flex items-center gap-x-3"
        )
          f-tooltip-media(
            placement="right-end"
            :pantone="{ r: pantone.r, g: pantone.g, b: pantone.b }"
            :tooltipTitle="pantone.name"
            :tooltipMessage="pantone.colorName"
          )
            template(#slot:tooltip-trigger)
              div(
                class="rounded w-5.5 h-5.5"
                :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }"
              )
          p(class="text-body2 text-grey-900") {{ pantone.name }}
          f-svg-icon(
            iconName="clear"
            size="20"
            class="text-grey-250 cursor-pointer"
            @click="removePantone(pantone.name, props.primarySideType)"
          )
  f-input-container(label="color")
    div(class="flex flex-row gap-x-4.5")
      div(class="w-1.5 bg-grey-100")
      div(class="flex flex-col gap-y-2")
        f-input-text(
          :disabled="disableBackSideFields"
          :textValue="color.value"
          @input="color.onInput"
          @change="color.onChange"
          @blur="color.onBlur"
          :hintError="displayErrors[`${primarySideType}.colorInfo.color`]"
          :placeholder="'Enter your color'"
          class="w-50"
        )
        div(
          class="flex items-center gap-x-3"
          v-for="(field, index) in colorInfoCustomPropertyFields"
          :key="field.key"
        )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.name"
            :hintError="displayErrors[`${primarySideType}.colorInfo.customPropertyList[${index}].name`]"
            label="color name"
            class="w-50"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.value"
            :hintError="displayErrors[`${primarySideType}.colorInfo.customPropertyList[${index}].value`]"
            label="color value"
            :placeholder="'Enter your info'"
            class="w-50"
          )
          f-input-switch(
            :disabled="disableBackSideFields || !field.value.name || !field.value.value"
            v-model:inputValue="field.value.isPublic"
            label="Publish"
            class="w-50"
          )
          icon-button(
            iconName="delete"
            :disabled="disableBackSideFields"
            @click="() => removeColorInfoCustomPropertyField(index)"
          )
        f-button(
          :disabled="disableBackSideFields"
          type="text"
          size="sm"
          prependIcon="add"
          @click="() => pushColorInfoCustomPropertyField({ isPublic: false, name: 'Untitled', value: '' })"
        ) Add form
      span(
        v-for="(error, index) in colorInfoCustomPropertyDisplayErrors"
        :key="index"
      ) {{ error }}

  f-input-container(label="pattern")
    div(class="flex flex-row gap-x-4.5")
      div(class="w-1.5 bg-grey-100")
      div(class="flex flex-col gap-y-2")
        f-input-text(
          :disabled="disableBackSideFields"
          :textValue="pattern.value"
          @input="pattern.onInput"
          @change="pattern.onChange"
          @blur="pattern.onBlur"
          :hintError="displayErrors[`${primarySideType}.patternInfo.pattern`]"
          placeholder="Enter your pattern"
          class="w-50"
        )
        div(
          class="flex items-center gap-x-3"
          v-for="(field, index) in patternInfoCustomPropertyFields"
          :key="field.key"
        )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.name"
            :hintError="displayErrors[`${props.primarySideType}.patternInfo.customPropertyList[${index}].name`]"
            label="pattern name"
            class="w-50"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.value"
            :hintError="displayErrors[`${props.primarySideType}.patternInfo.customPropertyList[${index}].value`]"
            label="pattern value"
            :placeholder="'Enter your info'"
            class="w-50"
          )
          f-input-switch(
            :disabled="disableBackSideFields || !field.value.name || !field.value.value"
            v-model:inputValue="field.value.isPublic"
            label="Publish"
            class="w-50"
          )
          icon-button(
            iconName="delete"
            :disabled="disableBackSideFields"
            @click="() => removePatternInfoCustomPropertyField(index)"
          )
        f-button(
          :disabled="disableBackSideFields"
          type="text"
          size="sm"
          prependIcon="add"
          @click="() => pushPatternInfoCustomPropertyField({ isPublic: false, name: 'Untitled', value: '' })"
        ) Add form
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from 'vue'
import { useFieldArray } from 'vee-validate'
import { useStore } from 'vuex'
import {
  type MaterialPatternCustomPropertyBase,
  MaterialType,
} from '@frontier/platform-web-sdk'
import { NOTIFY_TYPE, DISPLAY } from '@frontier/constants'
import { CREATE_EDIT } from '@/utils/constants'
import IconButton from '@/components/assets/edit/blockMaterialSpecification/IconButton.vue'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'

const props = defineProps<{
  primarySideType: 'faceSide' | 'backSide'
}>()

const store = useStore()

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}

const {
  mode,
  values,
  inputMenu,
  pantoneList,
  defineInputBinds,
  displayErrors,
  copyFaceSideToBackSide,
  clearMaterialTypeConstructionFields,
  addPantone,
  removePantone,
} = materialFormService
const {
  specOptions,
  addFeatureOption,
  addFinishOption,
  addContentOption,
  addDescriptionOption,
  widthUnitList,
  weightUnitList,
  allContentList,
  materialTypeOptionList,
} = inputMenu

const isAutoSyncFaceToBackSideInfo = defineInputBinds(
  'isAutoSyncFaceToBackSideInfo'
)

const featureList = defineInputBinds(`${props.primarySideType}.featureList`)
const finishList = defineInputBinds(`${props.primarySideType}.finishList`)
const descriptionList = defineInputBinds(
  `${props.primarySideType}.descriptionList`
)
const materialType = defineInputBinds(`${props.primarySideType}.materialType`)
const materialTypeValue = computed(
  () => values[props.primarySideType]?.materialType ?? null
)

const cuttableWidth = defineInputBinds('width.cuttable')
const fullWidth = defineInputBinds('width.full')
const widthUnit = defineInputBinds('width.unit')

const weightValue = defineInputBinds('weight.value')
const weightUnit = defineInputBinds('weight.unit')

// Woven construction
const constructionIsPublic = defineInputBinds(
  `${props.primarySideType}.construction.isPublic`
)
const wovenConstructionWarpDensity = defineInputBinds(
  `${props.primarySideType}.construction.warpDensity`
)
const wovenConstructionWeftDensity = defineInputBinds(
  `${props.primarySideType}.construction.weftDensity`
)
const wovenConstructionWarpYarnSize = defineInputBinds(
  `${props.primarySideType}.construction.warpYarnSize`
)
const wovenConstructionWeftYarnSize = defineInputBinds(
  `${props.primarySideType}.construction.weftYarnSize`
)

// Knit construction
const knitConstructionMachineType = defineInputBinds(
  `${props.primarySideType}.construction.machineType`
)
const knitConstructionWalesPerInch = defineInputBinds(
  `${props.primarySideType}.construction.walesPerInch`
)
const knitConstructionCoursesPerInch = defineInputBinds(
  `${props.primarySideType}.construction.coursesPerInch`
)
const knitConstructionYarnSize = defineInputBinds(
  `${props.primarySideType}.construction.yarnSize`
)
const knitConstructionMachineGaugeInGg = defineInputBinds(
  `${props.primarySideType}.construction.machineGaugeInGg`
)

// Leather construction
const leatherConstructionAverageSkinPerMeterSquare = defineInputBinds(
  `${props.primarySideType}.construction.averageSkinPerMeterSquare`
)
const leatherConstructionGrade = defineInputBinds(
  `${props.primarySideType}.construction.grade`
)
const leatherConstructionTannage = defineInputBinds(
  `${props.primarySideType}.construction.tannage`
)
const leatherConstructionThicknessPerMm = defineInputBinds(
  `${props.primarySideType}.construction.thicknessPerMm`
)

// Non-woven construction
const nonWovenConstructionBondingMethod = defineInputBinds(
  `${props.primarySideType}.construction.bondingMethod`
)
const nonWovenConstructionThicknessPerMm = defineInputBinds(
  `${props.primarySideType}.construction.thicknessPerMm`
)

// Trim construction
const trimConstructionOuterDiameter = defineInputBinds(
  `${props.primarySideType}.construction.outerDiameter`
)
const trimConstructionLength = defineInputBinds(
  `${props.primarySideType}.construction.length`
)
const trimConstructionThickness = defineInputBinds(
  `${props.primarySideType}.construction.thickness`
)
const trimConstructionWidth = defineInputBinds(
  `${props.primarySideType}.construction.width`
)

const {
  fields: contentFields,
  push: pushContentField,
  remove: removeContentField,
  update: updateContentField,
} = useFieldArray<{
  contentId: number | null
  name: string | null
  percentage: number
}>(`${props.primarySideType}.contentList`)

const contentDisplayError = computed(() => {
  const errors = []
  if (displayErrors.value[`${props.primarySideType}.contentList`]) {
    errors.push(displayErrors.value[`${props.primarySideType}.contentList`])
  }

  for (let i = 0; i < contentFields.value.length; i++) {
    const fieldErrors = [
      displayErrors.value[`${props.primarySideType}.contentList[${i}].name`],
      displayErrors.value[
        `${props.primarySideType}.contentList[${i}].percentage`
      ],
    ].filter(Boolean)
    if (fieldErrors.length) {
      errors.push(...fieldErrors)
    }
  }

  return errors.length ? [...new Set(errors)].join(', ') : ''
})

const selectContent = (
  name: string | null,
  index: number,
  fieldValue: {
    contentId: number | null
    name: string | null
    percentage: number
  }
) => {
  if (name == null || name.length === 0) {
    updateContentField(index, { ...fieldValue, contentId: null, name: null })
    return
  }

  const targetContent = allContentList.value.find((c) => c.name === name)
  if (targetContent) {
    updateContentField(index, { ...fieldValue, ...targetContent })
    return
  }

  updateContentField(index, { ...fieldValue, contentId: null, name })
}

const {
  fields: constructionCustomPropertyFields,
  push: pushConstructionCustomPropertyField,
  remove: removeConstructionCustomPropertyField,
  update: updateConstructionCustomPropertyField,
} = useFieldArray<MaterialPatternCustomPropertyBase>(
  `${props.primarySideType}.constructionCustomPropertyList`
)

watch(
  constructionCustomPropertyFields,
  (fields) => {
    fields.forEach((field, index) => {
      if (!field.value.isPublic) {
        return
      }

      if (!field.value.name || !field.value.value) {
        nextTick().then(() => {
          updateConstructionCustomPropertyField(index, {
            ...field.value,
            isPublic: false,
          })
        })
      }
    })
  },
  { deep: true }
)

const pattern = defineInputBinds(`${props.primarySideType}.patternInfo.pattern`)
const {
  fields: patternInfoCustomPropertyFields,
  push: pushPatternInfoCustomPropertyField,
  remove: removePatternInfoCustomPropertyField,
  update: updatePatternInfoCustomPropertyField,
} = useFieldArray<MaterialPatternCustomPropertyBase>(
  `${props.primarySideType}.patternInfo.customPropertyList`
)

watch(
  patternInfoCustomPropertyFields,
  (fields) => {
    fields.forEach((field, index) => {
      if (!field.value.isPublic) {
        return
      }

      if (!field.value.name || !field.value.value) {
        nextTick().then(() => {
          updatePatternInfoCustomPropertyField(index, {
            ...field.value,
            isPublic: false,
          })
        })
      }
    })
  },
  { deep: true }
)

const color = defineInputBinds(`${props.primarySideType}.colorInfo.color`)
const {
  fields: colorInfoCustomPropertyFields,
  push: pushColorInfoCustomPropertyField,
  remove: removeColorInfoCustomPropertyField,
  update: updateColorInfoCustomPropertyField,
} = useFieldArray<MaterialPatternCustomPropertyBase>(
  `${props.primarySideType}.colorInfo.customPropertyList`
)

watch(
  colorInfoCustomPropertyFields,
  (fields) => {
    fields.forEach((field, index) => {
      if (!field.value.isPublic) {
        return
      }

      if (!field.value.name || !field.value.value) {
        nextTick().then(() => {
          updateColorInfoCustomPropertyField(index, {
            ...field.value,
            isPublic: false,
          })
        })
      }
    })
  },
  { deep: true }
)

const pantoneColor = ref<string | null>('')

const showCopyAndSyncBtn = computed(
  () => props.primarySideType === 'backSide' && values.isDoubleSide
)

const showWidthAndWeight = computed(() => {
  if (!values.isDoubleSide) {
    return true
  }

  return props.primarySideType === 'faceSide'
})

const hideBackSideFields = computed(() => {
  if (
    props.primarySideType === 'backSide' &&
    values.isDoubleSide &&
    !values.isComposite
  ) {
    return true
  }
  return false
})

const disableBackSideFields = computed(() => {
  if (
    props.primarySideType === 'backSide' &&
    values.isAutoSyncFaceToBackSideInfo
  ) {
    return true
  }

  return false
})

const showInfoBar = computed(() => {
  if (props.primarySideType === 'backSide' && values.isDoubleSide) {
    return true
  }

  return false
})

const pantoneValueDisplayList = computed(() => {
  return (
    values[props.primarySideType]?.pantoneList?.map((pantoneCode) => {
      const result = pantoneList?.find((p) => p.name === pantoneCode)
      if (!result) {
        throw new Error(`Pantone ${pantoneCode} not found`)
      }
      return result
    }) || []
  )
})

const handleMaterialTypeChange = (v: MaterialType) => {
  clearMaterialTypeConstructionFields(props.primarySideType)
  materialType.value.onInput(v)
}

const handleAddPantone = () => {
  if (!pantoneColor.value) {
    return
  }

  addPantone(pantoneColor.value, props.primarySideType)
  pantoneColor.value = ''
}

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}
</script>

<style scoped></style>
