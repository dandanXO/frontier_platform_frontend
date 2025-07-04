<template>
  <div class="grid grid-cols-2 gap-x-2 gap-y-4 col-span-2 items-start">
    <TCInput
      :title="$t('RR0019')"
      variant="Label Right"
      :modelValue="cuttableWidth.value"
      @update:modelValue="cuttableWidth.onInput"
      :menuTree="tcWidthUnitMenuTree"
      :initialSelectedValue="widthUnit.value"
      :placeholder="$t('MI0037')"
      :description="
        materialFormService.displayErrors.value['width.cuttable'] || ''
      "
      :negative="!!materialFormService.displayErrors.value['width.cuttable']"
      @select="(item: any) => widthUnit.onInput(item.selectValue)"
      required
      inputType="number"
    ></TCInput>
    <TCInput
      :title="$t('MI0036')"
      variant="Label Right"
      :modelValue="fullWidth.value"
      @update:modelValue="fullWidth.onInput"
      :menuTree="tcWidthUnitMenuTree"
      :initialSelectedValue="widthUnit.value"
      :placeholder="$t('MI0038')"
      :description="materialFormService.displayErrors.value['width.full'] || ''"
      :negative="!!materialFormService.displayErrors.value['width.full']"
      @select="(item: any) => widthUnit.onInput(item.selectValue)"
      inputType="number"
    ></TCInput>
    <TCInput
      :title="$t('RR0015')"
      variant="Label Right"
      :modelValue="weightValueBinding.value"
      @update:modelValue="weightValueBinding.onInput"
      :menuTree="tcWeightUnitMenuTree"
      :initialSelectedValue="weightUnitBinding.value"
      :placeholder="$t('RR0599')"
      :description="
        materialFormService.displayErrors.value['weight.value'] || ''
      "
      :negative="!!materialFormService.displayErrors.value['weight.value']"
      @select="(item: any) => weightUnitBinding.onInput(item.selectValue)"
      class="col-span-2"
      required
      inputType="number"
    ></TCInput>

    <f-input-container :label="$t('MI0011')" class="col-span-2">
      <div class="flex gap-x-2 items-start">
        <f-select-input
          class="w-[256px]"
          :dropdownMenuTree="specOptions.seasonList"
          emit-value
          map-options
          :selectValue="seasonName.value"
          @update:selectValue="selectSeason"
          @addNew="addSeasonOption($event)"
          :placeholder="$t('RR0600')"
          :hintError="
            materialFormService.displayErrors.value['seasonInfo.season.name']
          "
        ></f-select-input>
        <f-input-text
          :textValue="seasonYear.value"
          @update:textValue="seasonYear.onInput"
          inputType="number"
          class="w-[256px]"
          :placeholder="$t('RR0341')"
          :hintError="
            materialFormService.displayErrors.value['seasonInfo.year']
          "
        ></f-input-text>
        <div class="flex items-center gap-2 flex-1 h-[42px]">
          <f-input-toggle
            :value="seasonIsPublic.value"
            size="small"
            @update:value="seasonIsPublic.onInput"
          />
          <span class="text-sm text-grey-900">{{ $t('RR0521') }}</span>
        </div>
      </div>
    </f-input-container>

    <div class="col-span-2 flex flex-col gap-2">
      <f-input-textarea
        :textValue="remarksValue.value"
        @update:textValue="remarksValue.onInput"
        :label="$t('RR0029')"
        :placeholder="$t('MI0054')"
        class="w-full"
      ></f-input-textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { materialFormServiceKey } from '@/utils/constants'
import type { MaterialFormService } from '@/types'
import TCInput from '@/components/TCInput/TCInput.vue'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FInputText from '@frontier/ui-component/src/FInput/FInputText/FInputText.vue'

import FInputTextarea from '@frontier/ui-component/src/FInput/FInputTextarea/FInputTextarea.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'

// Inject the material form service
const materialFormService = inject(
  materialFormServiceKey
) as MaterialFormService

// Bindings for material specification fields from the materialFormService instance
const cuttableWidth = materialFormService.defineInputBinds('width.cuttable')
const fullWidth = materialFormService.defineInputBinds('width.full')
const widthUnit = materialFormService.defineInputBinds('width.unit')
const weightValueBinding = materialFormService.defineInputBinds('weight.value')
const weightUnitBinding = materialFormService.defineInputBinds('weight.unit')
const seasonName = materialFormService.defineInputBinds(
  'seasonInfo.season.name'
)
const seasonYear = materialFormService.defineInputBinds('seasonInfo.year')
const seasonIsPublic = materialFormService.defineInputBinds(
  'seasonInfo.isPublic'
)
const remarksValue = materialFormService.defineInputBinds('internalInfo.remark')

// Access inputMenu and selectSeason from materialFormService
const { inputMenu, selectSeason } = materialFormService
const { specOptions, addSeasonOption } = inputMenu

// Menu trees for the dropdowns
const tcWidthUnitMenuTree = computed(() => ({
  blockList: [
    {
      menuList:
        inputMenu.widthUnitList.value.menuTree.blockList[0].menuList.map(
          (unit: any) => ({ title: unit.title, selectValue: unit.selectValue })
        ),
    },
  ],
}))

const tcWeightUnitMenuTree = computed(() => ({
  blockList: [
    {
      menuList:
        inputMenu.weightUnitList.value.menuTree.blockList[0].menuList.map(
          (unit: any) => ({ title: unit.title, selectValue: unit.selectValue })
        ),
    },
  ],
}))
</script>
