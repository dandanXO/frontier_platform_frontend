<template lang="pug">
div(class="flex flex-col gap-y-10")
  div(class="flex flex-col gap-y-7.5")
    f-select-input(
      :selectValue="publicTagList.value"
      @update:selectValue="publicTagList.onInput"
      :dropdownMenuTree="menuTreePublicTag"
      @addNew="addNewTag($event, menuTreePublicTag)"
      :label="$t('RR0027')"
      :placeholder="$t('RR0288')"
      :hintError="displayErrors['tagInfo.tagList']"
      :hintSupporting="$t('MI0050')"
      multiple
      :multipleTagInputValidations="[inputValidate, lengthValidate]"
    )
    f-select-input(
      :selectValue="certificationTagIdList.value"
      @update:selectValue="certificationTagIdList.onInput"
      :canAddNew="false"
      :dropdownMenuTree="specOptions.certificateList"
      :label="$t('MI0051')"
      :placeholder="$t('MI0052')"
      :hintError="displayErrors['tagInfo.certificationTagIdList']"
      multiple
      :multipleTagInputValidations="[inputValidate, lengthValidate]"
    )
  div(class="flex flex-col gap-y-7.5 bg-grey-50 rounded px-15 py-12.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('RR0289') }}
    f-select-input(
      :selectValue="privateTagList.value"
      @update:selectValue="privateTagList.onInput"
      :dropdownMenuTree="menuTreePrivateTag"
      @addNew="addNewTag($event, menuTreePrivateTag)"
      :label="$t('RR0028')"
      :placeholder="$t('RR0290')"
      :hintError="displayErrors['internalInfo.tagList']"
      :hintSupporting="$t('MI0053')"
      multiple
      :multipleTagInputValidations="[inputValidate, lengthValidate]"
    )
    f-input-textarea(
      :textValue="remark.value"
      @update:textValue="remark.onInput"
      :hintError="displayErrors['internalInfo.remark']"
      :label="$t('RR0029')"
      :placeholder="$t('MI0054')"
      class="w-full"
    )
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'

// multiple chips rules
const inputValidate = (str: string) => str.replace(/,/g, '')
const lengthValidate = (str: string) => str.slice(0, 500)

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}
const { inputMenu, defineInputBinds, displayErrors } = materialFormService
const { specOptions, addNewTag, menuTreePublicTag, menuTreePrivateTag } =
  inputMenu

const publicTagList = defineInputBinds('tagInfo.tagList')
const certificationTagIdList = defineInputBinds(
  'tagInfo.certificationTagIdList'
)
const privateTagList = defineInputBinds('internalInfo.tagList')
const remark = defineInputBinds('internalInfo.remark')
</script>

<style scoped></style>
