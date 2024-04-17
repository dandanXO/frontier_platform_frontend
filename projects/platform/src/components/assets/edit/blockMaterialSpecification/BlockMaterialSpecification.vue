<template lang="pug">
div
  f-input-tap(
    v-if="values.isDoubleSide || values.isComposite"
    :optionList="sideOptionList"
    v-model:inputValue="currentMaterialSide"
    class="pt-4 pb-3"
  )
  div(class="flex flex-col pt-1 gap-y-8")
    f-input-text(
      v-if="showItemNoAndSeasonFields"
      :textValue="itemNo.value"
      @update:textValue="itemNo.onInput"
      :hintError="displayErrors.itemNo"
      required
      :placeholder="t('MI0010')"
      :label="t('RR0013')"
      class="w-50"
    )
    f-input-container(v-if="showItemNoAndSeasonFields" :label="t('MI0011')")
      template(#slot:suffix)
        f-input-switch(
          :inputValue="isSeasonPublic.value"
          :disabled="!values.seasonInfo.season || values.seasonInfo.year == null"
          @update:inputValue="isSeasonPublic.onInput"
          :label="t('MI0025')"
          class="w-50"
        )
      div(class="flex flex-row gap-x-3")
        f-select-input(
          :selectValue="seasonName.value"
          @update:selectValue="selectSeason"
          :dropdownMenuTree="specOptions.seasonList"
          @addNew="addSeasonOption($event)"
          :placeholder="t('MI0012')"
          :hintError="displayErrors['seasonInfo.season.name']"
          class="w-80"
          :multipleTagInputValidations="[lengthValidate]"
        )
        f-input-text(
          :textValue="seasonYear.value"
          @update:textValue="seasonYear.onInput"
          inputType="number"
          :hintError="displayErrors['seasonInfo.year']"
          :placeholder="t('MI0013')"
          class="w-64"
        )
    face-side-specification(
      v-if="mode === CREATE_EDIT.CREATE || values.isDoubleSide || values.sideType === MaterialSideType.FACE_SIDE"
      v-show="currentMaterialSide === MaterialSideType.FACE_SIDE"
    )
    middle-side-specification(
      v-if="mode === CREATE_EDIT.CREATE || values.middleSide"
      v-show="currentMaterialSide === MATERIAL_SIDE_TYPE.MIDDLE"
    )
    back-side-specification(
      v-if="mode === CREATE_EDIT.CREATE || values.isDoubleSide || values.sideType === MaterialSideType.BACK_SIDE"
      v-show="currentMaterialSide === MATERIAL_SIDE_TYPE.BACK"
    )
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import FaceSideSpecification from '@/components/assets/edit/blockMaterialSpecification/FaceSideSpecification.vue'
import MiddleSideSpecification from '@/components/assets/edit/blockMaterialSpecification/MiddleSideSpecification.vue'
import BackSideSpecification from '@/components/assets/edit/blockMaterialSpecification/BackSideSpecification.vue'
import { MATERIAL_SIDE_TYPE, materialFormServiceKey } from '@/utils/constants'
import { CREATE_EDIT } from '@/utils/constants'
import type { MaterialFormService } from '@/types'

const { t } = useI18n()

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}
const {
  mode,
  values,
  currentMaterialSide,
  selectSeason,
  inputMenu,
  defineInputBinds,
  displayErrors,
} = materialFormService
const { specOptions, addSeasonOption } = inputMenu

const itemNo = defineInputBinds('itemNo')

const seasonName = defineInputBinds('seasonInfo.season.name')
const seasonYear = defineInputBinds('seasonInfo.year')
const isSeasonPublic = defineInputBinds('seasonInfo.isPublic')

const lengthValidate = (str: string) => str.slice(0, 10)

const showItemNoAndSeasonFields = computed(() => {
  if (
    !values.isDoubleSide &&
    currentMaterialSide.value !== MATERIAL_SIDE_TYPE.MIDDLE
  ) {
    return true
  }

  if (currentMaterialSide.value === MATERIAL_SIDE_TYPE.FACE) {
    return true
  }

  return false
})

const sideOptionList = computed(() => {
  const { isComposite, isDoubleSide, sideType } = values
  const list = []

  if (
    isDoubleSide ||
    (isComposite && sideType === MaterialSideType.FACE_SIDE)
  ) {
    list.push({
      label: t('MI0007'),
      selectValue: MATERIAL_SIDE_TYPE.FACE,
      icon: 'front',
      selectedIcon: 'face_full',
    })
  }

  if (
    isDoubleSide ||
    (isComposite && sideType === MaterialSideType.BACK_SIDE)
  ) {
    list.push({
      label: t('MI0009'),
      selectValue: MATERIAL_SIDE_TYPE.BACK,
      icon: 'back',
      selectedIcon: 'back_full',
    })
  }

  if (isComposite) {
    list.push({
      label: t('MI0008'),
      selectValue: MATERIAL_SIDE_TYPE.MIDDLE,
      icon: 'middle',
      selectedIcon: 'middle_full',
    })
  }

  return list
})
</script>

<style scoped></style>
