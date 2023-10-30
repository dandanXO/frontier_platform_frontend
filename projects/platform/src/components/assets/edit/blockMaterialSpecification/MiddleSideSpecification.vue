<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  f-infobar(
    class="w-full"
    :notifyType="NOTIFY_TYPE.TIPS"
    :display="DISPLAY.BLOCK"
    title="Make building your Material information faster"
    messageText="To help you fill in the specification information quickly and with focus, the system displays only the fields that need to be filled in for this fabric. When you view the material details page, it will be presented in full. Information that is not in this field will be displayed in light gray."
  )
  f-select-input(
    :selectValue="middleSideFeatureList.value"
    @update:selectValue="middleSideFeatureList.onInput"
    :dropdownMenuTree="specOptions.featureList"
    @addNew="addFeatureOption($event)"
    label="features"
    :placeholder="$t('DD0016')"
    :hintError="displayErrors['middleSide.featureList']"
    multiple
  )
  f-select-input(
    :selectValue="middleSideFinishList.value"
    @update:selectValue="middleSideFinishList.onInput"
    :dropdownMenuTree="specOptions.finishList"
    @addNew="addFinishOption($event)"
    label="finish"
    :placeholder="$t('DD0016')"
    :hintError="displayErrors['middleSide.finishList']"
    multiple
  )
  div(
    class="flex items-center gap-x-3"
    v-for="(field, index) in middleSideCustomPropertyFields"
    :key="field.key"
  )
    f-input-text(
      v-model:textValue="field.value.name"
      :hintError="displayErrors[`middleSide.customPropertyList[${index}].name`]"
      label="name"
      class="w-50"
    )
    f-input-text(
      v-model:textValue="field.value.value"
      :hintError="displayErrors[`middleSide.customPropertyList[${index}].value`]"
      label="value"
      class="w-50"
    )
    f-input-checkbox(
      binary
      v-model:inputValue="field.value.isPublic"
      label="public"
      class="w-50"
    )
    icon-button(
      iconName="delete"
      @click="() => removeMiddleSideCustomPropertyField(index)"
    )
  icon-button(
    iconName="add"
    @click="() => pushMiddleSideCustomPropertyField({ isPublic: false, name: '', value: '' })"
  )
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { useFieldArray } from 'vee-validate'
import { NOTIFY_TYPE, DISPLAY } from '@frontier/constants'
import type { MaterialPatternCustomPropertyBase } from '@frontier/platform-web-sdk'
import IconButton from '@/components/assets/edit/blockMaterialSpecification/IconButton.vue'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}

const { inputMenu, defineInputBinds, displayErrors } = materialFormService
const { specOptions, addFeatureOption, addFinishOption } = inputMenu

const middleSideFeatureList = defineInputBinds('middleSide.featureList')
const middleSideFinishList = defineInputBinds('middleSide.finishList')
const {
  fields: middleSideCustomPropertyFields,
  push: pushMiddleSideCustomPropertyField,
  remove: removeMiddleSideCustomPropertyField,
} = useFieldArray<MaterialPatternCustomPropertyBase>(
  'middleSide.customPropertyList'
)
</script>

<style scoped></style>
