<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  div(class="flex flex-col gap-y-4")
    div(v-if="showCopyAndSyncBtn" class="flex flex-row items-center gap-x-3")
      f-input-switch(
        :inputValue="isAutoSyncFaceToBackSideInfo.value"
        @update:inputValue="isAutoSyncFaceToBackSideInfo.onInput"
        :label="$t('MI0047')"
      )
      div(class="flex flex-row items-center gap-x-1")
        f-button-label(size="lg" @click="copyFaceSideToBackSide") {{ $t('MI0048') }}
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
      :title="$t('MI0045')"
      :messageText="$t('MI0046')"
    )
  f-select-input(
    :disabled="disableBackSideFields"
    :selectValue="featureList.value"
    @update:selectValue="featureList.onInput"
    :dropdownMenuTree="specOptions.featureList"
    @addNew="addFeatureOption($event)"
    :label="$t('MI0014')"
    :placeholder="$t('MI0015')"
    :hintError="displayErrors[`${props.primarySideType}.featureList`]"
    multiple
    :multipleTagInputValidations="[inputValidate, lengthValidate]"
  )
  f-input-container(v-if="!hideBackSideFields" :label="$t('MI0016')")
    div(class="flex flex-row gap-x-4.5 pt-2")
      div(class="w-1.5 bg-grey-100")
      div(class="flex flex-col gap-y-8 pl-4")
        div(class="flex flex-col")
          div(class="flex text-body2 font-bold")
            p(class="text-grey-900") {{ $t('MI0003') }}
            i(class="text-red-400 pl-0.5") *
          span(class="mt-2 text-grey-600 text-caption") {{ $t('MI0017') }}
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
            :messageText="$t('MI0083')"
            :action="{ text: $t('RR0123'), handler: openModalSendFeedback }"
          )
          f-infobar(
            v-if="materialTypeValue === MaterialType.OTHERS"
            class="w-130"
            :notifyType="NOTIFY_TYPE.INFO"
            :display="DISPLAY.BLOCK"
            :action="{ text: $t('RR0123'), handler: openModalSendFeedback }"
          )
            p {{ $t('MI0084') }}
        template(v-if="materialTypeValue != null")
          f-select-input(
            :disabled="disableBackSideFields"
            :selectValue="descriptionList.value"
            @update:selectValue="descriptionList.onInput"
            :dropdownMenuTree="specOptions.descriptionList"
            @addNew="addDescriptionOption($event)"
            :label="$t('MI0023')"
            :placeholder="$t('MI0024')"
            :hintError="displayErrors[`${primarySideType}.descriptionList`]"
            multiple
            :multipleTagInputValidations="[inputValidate, lengthValidate]"
            class="w-full"
          )
          f-input-container(:label="$t('MI0026')")
            template(#slot:suffix)
              f-input-switch(
                :disabled="disableBackSideFields"
                :inputValue="constructionIsPublic.value"
                @update:inputValue="constructionIsPublic.onInput"
                :label="$t('MI0025')"
                class="w-50"
              )
        div(v-if="materialTypeValue === MaterialType.WOVEN" class="flex flex-col gap-y-4")
          f-input-container(
            :label="`${$t('MI0027')}(${$t('MI0028')} ✕ ${$t('MI0029')})`"
          )
            div(class="flex flex-row items-center gap-x-3")
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWarpDensity.value"
                @update:textValue="wovenConstructionWarpDensity.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.warpDensity`]"
                :placeholder="$t('MI0030')"
                class="w-64"
              )
              span x
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWeftDensity.value"
                @update:textValue="wovenConstructionWeftDensity.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.weftDensity`]"
                :placeholder="$t('MI0030')"
                class="w-64"
              )
          f-input-container(
            :label="`${$t('RR0023')}(${$t('MI0028')} ✕ ${$t('MI0029')})`"
          )
            div(class="flex fle-row items-center gap-x-3")
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWarpYarnSize.value"
                @update:textValue="wovenConstructionWarpYarnSize.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.warpYarnSize`]"
                :placeholder="$t('MI0030')"
                class="w-64"
              )
              span x
              f-input-text(
                :disabled="disableBackSideFields"
                :textValue="wovenConstructionWeftYarnSize.value"
                @update:textValue="wovenConstructionWeftYarnSize.onInput"
                :hintError="displayErrors[`${primarySideType}.construction.weftYarnSize`]"
                :placeholder="$t('MI0030')"
                class="w-64"
              )
        div(v-if="materialTypeValue === MaterialType.KNIT" class="flex flex-col gap-y-4")
          div(class="pb-5")
            f-input-text(
              :disabled="disableBackSideFields"
              :textValue="knitConstructionMachineType.value"
              @update:textValue="knitConstructionMachineType.onInput"
              :hintError="displayErrors[`${primarySideType}.construction.machineType`]"
              :label="$t('MI0031')"
              :placeholder="$t('MI0030')"
              :hintSupport="$t('MI0069')"
              class="w-70"
            )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionWalesPerInch.value"
            @update:textValue="knitConstructionWalesPerInch.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.walesPerInch`]"
            :label="$t('MI0032')"
            :placeholder="$t('MI0030')"
            inputType="number"
            :addOnRight="$t('RR0020')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionCoursesPerInch.value"
            @update:textValue="knitConstructionCoursesPerInch.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.coursesPerInch`]"
            :label="$t('MI0033')"
            :placeholder="$t('MI0030')"
            inputType="number"
            :addOnRight="$t('RR0020')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionYarnSize.value"
            @update:textValue="knitConstructionYarnSize.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.yarnSize`]"
            :label="$t('RR0023')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="knitConstructionMachineGaugeInGg.value"
            @update:textValue="knitConstructionMachineGaugeInGg.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.machineGaugeInGg`]"
            inputType="number"
            :label="$t('MI0068')"
            :placeholder="$t('MI0030')"
            :addOnRight="$t('MI0070')"
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
            :label="$t('MI0071')"
            :placeholder="$t('MI0030')"
            :addOnRight="$t('MI0075')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="leatherConstructionGrade.value"
            @update:textValue="leatherConstructionGrade.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.grade`]"
            :label="$t('MI0072')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
          div(class="pb-5")
            f-input-text(
              :disabled="disableBackSideFields"
              :textValue="leatherConstructionTannage.value"
              @update:textValue="leatherConstructionTannage.onInput"
              :hintError="displayErrors[`${primarySideType}.construction.tannage`]"
              :label="$t('MI0073')"
              :placeholder="$t('MI0030')"
              :hintSupport="$t('MI0076')"
              class="w-70"
            )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="leatherConstructionThicknessPerMm.value"
            @update:textValue="leatherConstructionThicknessPerMm.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.thicknessPerMm`]"
            :label="$t('MI0074')"
            :placeholder="$t('MI0030')"
            inputType="number"
            :addOnRight="$t('MI0077')"
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
            :label="$t('MI0078')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="nonWovenConstructionThicknessPerMm.value"
            @update:textValue="nonWovenConstructionThicknessPerMm.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.thicknessPerMm`]"
            :label="$t('MI0074')"
            :placeholder="$t('MI0030')"
            inputType="number"
            :addOnRight="$t('MI0077')"
            class="w-70"
          )
        div(v-if="materialTypeValue === MaterialType.TRIM" class="flex flex-col gap-y-2")
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionOuterDiameter.value"
            @update:textValue="trimConstructionOuterDiameter.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.outerDiameter`]"
            :label="$t('MI0079')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionLength.value"
            @update:textValue="trimConstructionLength.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.length`]"
            :label="$t('MI0080')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionThickness.value"
            @update:textValue="trimConstructionThickness.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.thickness`]"
            :label="$t('MI0081')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            :textValue="trimConstructionWidth.value"
            @update:textValue="trimConstructionWidth.onInput"
            :hintError="displayErrors[`${primarySideType}.construction.width`]"
            :label="$t('MI0082')"
            :placeholder="$t('MI0030')"
            class="w-70"
          )
        div(v-if="materialTypeValue != null" class="flex flex-col gap-y-2")
          div(
            class="flex items-center gap-x-3"
            v-for="(field, index) in constructionCustomPropertyFields"
            :key="field.key"
            :class="[{'mt-4': index>0}]"
          ) 
            f-input-text(
              :disabled="disableBackSideFields"
              v-model:textValue="field.value.name"
              :hintError="displayErrors[`${primarySideType}.constructionCustomPropertyList[${index}].name`]"
              :placeholder="$t('MI0030')"
              label="Custom Name"
              :onInputValidations="[inputValidate, (str: string) => str.slice(0, 15)]"
              class="w-50"
            )
            f-input-text(
              :disabled="disableBackSideFields"
              v-model:textValue="field.value.value"
              :hintError="displayErrors[`${primarySideType}.constructionCustomPropertyList[${index}].value`]"
              :placeholder="$t('MI0044')"
              label="Custom Value"
              class="w-50"
            )
            f-input-switch(
              :disabled="disableBackSideFields || !field.value.name || !field.value.value"
              v-model:inputValue="field.value.isPublic"
              :label="$t('MI0025')"
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
          ) {{ $t('MI0034') }}
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
          :placeholder="$t('MI0035')"
          :hintError="Boolean(displayErrors[`${primarySideType}.contentList[${index}].name`])"
          class="w-100"
          :multipleTagInputValidations="[inputValidate, lengthValidate]"
          :data-cy="'contentText'"
        )
        f-input-text(
          :disabled="disableBackSideFields"
          v-model:textValue="field.value.percentage"
          inputType="number"
          :placeholder="$t('MI0043')"
          addOnRight="%"
          :hintError="Boolean(displayErrors[`${primarySideType}.contentList[${index}].percentage`])"
          class="w-40"
          data-cy="contentTextValue"
        )
        f-svg-icon(
          v-if="index === 0"
          class="text-grey-600 cursor-pointer"
          size="24"
          iconName="add_box"
          :disabled="disableBackSideFields"
          @click="pushContentField({ contentId: null, name: null, percentage: null })"
        )
        f-svg-icon(
          v-else
          class="text-grey-600 cursor-pointer"
          size="20"
          iconName="delete"
          :disabled="disableBackSideFields"
          @click="() => removeContentField(index)"
        )
  f-input-container(v-if="showWidthAndWeight" :label="$t('RR0088')" required)
    div(class="flex flex-row gap-3")
      f-input-text(
        :textValue="cuttableWidth.value"
        @update:textValue="cuttableWidth.onInput"
        :hintError="displayErrors['width.cuttable']"
        :placeholder="$t('MI0037')"
        inputType="number"
        :label="$t('RR0019')"
        class="w-72"
        :rightSelectValue="widthUnit.value"
        @update:rightSelectValue="widthUnit.onInput"
        :rightDropdownOption="widthUnitList"
        data-cy="cuttableWidthText"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
      f-input-text(
        :disabled="disableBackSideFields"
        :textValue="fullWidth.value"
        @update:textValue="fullWidth.onInput"
        :hintError="displayErrors['width.full']"
        :placeholder="$t('MI0038')"
        inputType="number"
        :label="$t('MI0036')"
        class="w-72"
        :rightSelectValue="widthUnit.value"
        @update:rightSelectValue="widthUnit.onInput"
        :rightDropdownOption="widthUnitList"
        data-cy="fullWidthText"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
  f-input-container(v-if="showWidthAndWeight" required :label="$t('RR0015')")
    template(#slot:suffix)
      f-tooltip-standard(class="flex-start")
        template(#slot:tooltip-content)
          i18n-t(keypath="MI0142")
            template(#newline)
              br
        template(#slot:tooltip-trigger)
          f-svg-icon(
            iconName="info_outline"
            class="cursor-pointer text-grey-600"
            size="14"
          )
    div(class="flex flex-col gap-y-2.5")
      f-input-text(
        :textValue="weightValue.value"
        @update:textValue="weightValue.onInput"
        :hintError="displayErrors['weight.value']"
        :placeholder="$t('MI0039')"
        inputType="number"
        class="w-72"
        required
        :rightSelectValue="weightUnit.value"
        @update:rightSelectValue="weightUnit.onInput"
        :rightDropdownOption="weightUnitList"
        data-cy="WeightText"
      )
        template(#slot:right-dropdown-trigger="{ selectedMenu }")
          p {{ selectedMenu?.title }}
      div(class="flex flex-row items-center gap-x-4 mt-4")
        f-input-checkbox(
          v-for="weightItem in weightCheckboxItems"
          :key="weightItem.unit"
          :class="{ 'order-first': weightUnit.value === weightItem.unit }"
          binary
          :disabled="weightUnit.value === weightItem.unit"
          :label="weightItem.label"
          :inputValue="weightItem.field.value"
          @update:inputValue="weightItem.field.onInput"
        )
  f-select-input(
    :disabled="disableBackSideFields"
    :selectValue="finishList.value"
    @update:selectValue="finishList.onInput"
    :dropdownMenuTree="specOptions.finishList"
    @addNew="addFinishOption($event)"
    :label="$t('RR0022')"
    :placeholder="$t('MI0040')"
    :hintError="displayErrors[`${primarySideType}.finishList`]"
    multiple
    :multipleTagInputValidations="[inputValidate, lengthValidate]"
  )
  f-input-container(v-if="mode === CREATE_EDIT.EDIT" :label="$t('EE0040')")
    div(class="flex flex-col gap-y-4")
      f-input-text(
        class="w-72"
        v-model:textValue="pantoneColor"
        :placeholder="$t('MI0067')"
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
  f-input-container(:label="$t('RR0026')")
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
          :placeholder="$t('MI0041')"
          class="w-50"
        )
        div(
          class="flex items-center gap-x-3"
          v-for="(field, index) in colorInfoCustomPropertyFields"
          :key="field.key"
          :class="[{'mt-4': index > 0}]"
        )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.name"
            :hintError="displayErrors[`${primarySideType}.colorInfo.customPropertyList[${index}].name`]"
            label="name"
            :placeholder="$t('MI0030')"
            class="w-50"
            :onInputValidations="[inputValidate, (str: string) => str.slice(0, 15)]"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.value"
            :hintError="displayErrors[`${primarySideType}.colorInfo.customPropertyList[${index}].value`]"
            label="value"
            :placeholder="$t('MI0044')"
            class="w-50"
          )
          f-input-switch(
            :disabled="disableBackSideFields || !field.value.name || !field.value.value"
            v-model:inputValue="field.value.isPublic"
            :label="$t('MI0025')"
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
        ) {{ $t('MI0034') }}

  f-input-container(:label="$t('RR0025')")
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
          :placeholder="$t('MI0042')"
          class="w-50"
        )
        div(
          class="flex items-center gap-x-3"
          v-for="(field, index) in patternInfoCustomPropertyFields"
          :key="field.key"
          :class="[{'mt-4': index > 0}]"
        )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.name"
            :hintError="displayErrors[`${props.primarySideType}.patternInfo.customPropertyList[${index}].name`]"
            :placeholder="$t('MI0030')"
            label="name"
            class="w-50"
            :onInputValidations="[inputValidate, (str: string) => str.slice(0, 15)]"
          )
          f-input-text(
            :disabled="disableBackSideFields"
            v-model:textValue="field.value.value"
            :hintError="displayErrors[`${props.primarySideType}.patternInfo.customPropertyList[${index}].value`]"
            label="value"
            :placeholder="$t('MI0044')"
            class="w-50"
          )
          f-input-switch(
            :disabled="disableBackSideFields || !field.value.name || !field.value.value"
            v-model:inputValue="field.value.isPublic"
            :label="$t('MI0025')"
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
        ) {{ $t('MI0034') }}
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref, watch, onMounted } from 'vue'
import { useFieldArray } from 'vee-validate'
import { useStore } from 'vuex'
import {
  type MaterialPatternCustomPropertyBase,
  MaterialType,
} from '@frontier/platform-web-sdk'
import { NOTIFY_TYPE, DISPLAY } from '@frontier/constants'
import { WeightUnit } from '@frontier/platform-web-sdk'
import { CREATE_EDIT } from '@/utils/constants'
import IconButton from '@/components/assets/edit/blockMaterialSpecification/IconButton.vue'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'
import useEnumText from '@/composables/useEnumText'

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
  validate,
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

// multiple chips rules
const inputValidate = (str: string) => str.replace(/,/g, '')
const lengthValidate = (str: string) => str.slice(0, 500)

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
const isShowWeightGsm = defineInputBinds('weightDisplaySetting.isShowWeightGsm')
const isShowWeightOz = defineInputBinds('weightDisplaySetting.isShowWeightOz')
const isShowWeightGy = defineInputBinds('weightDisplaySetting.isShowWeightGy')
const isShowWeightGm = defineInputBinds('weightDisplaySetting.isShowWeightGm')

const { weightUnitText } = useEnumText()
const weightCheckboxItems = computed(() =>
  [
    { field: isShowWeightGsm.value, unit: WeightUnit.GSM },
    { field: isShowWeightOz.value, unit: WeightUnit.OZ },
    { field: isShowWeightGy.value, unit: WeightUnit.GY },
    { field: isShowWeightGm.value, unit: WeightUnit.GM },
  ].map((item) => ({
    ...item,
    label: weightUnitText.value[item.unit],
  }))
)
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
    values[props.primarySideType]?.pantoneNameList?.map((pantoneName) => {
      const result = pantoneList?.find((p) => p.name === pantoneName)
      if (!result) {
        throw new Error(`Pantone ${pantoneName} not found`)
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
onMounted(() => {
  validate()
})
</script>

<style scoped></style>
