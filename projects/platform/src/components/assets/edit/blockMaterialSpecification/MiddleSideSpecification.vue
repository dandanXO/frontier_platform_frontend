<template lang="pug">
div(class="flex flex-col gap-y-7.5")
  f-infobar(
    class="w-full"
    :notifyType="NOTIFY_TYPE.TIPS"
    :display="DISPLAY.BLOCK"
    :title="$t('MI0045')"
    :messageText="$t('MI0046')"
  )
  f-select-input(
    :selectValue="middleSideFeatureList.value"
    @update:selectValue="middleSideFeatureList.onInput"
    :dropdownMenuTree="specOptions.featureList"
    @addNew="addFeatureOption($event)"
    :label="$t('MI0014')"
    :placeholder="$t('MI0015')"
    :hintError="displayErrors['middleSide.featureList']"
    multiple
  )
  f-select-input(
    :selectValue="middleSideFinishList.value"
    @update:selectValue="middleSideFinishList.onInput"
    :dropdownMenuTree="specOptions.finishList"
    @addNew="addFinishOption($event)"
    :label="$t('RR0022')"
    :placeholder="$t('MI0040')"
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
      :placeholder="$t('MI0030')"
      label="Custom Name"
      class="w-50"
    )
    f-input-text(
      v-model:textValue="field.value.value"
      :hintError="displayErrors[`middleSide.customPropertyList[${index}].value`]"
      :placeholder="$t('MI0044')"
      label="Custom Value"
      class="w-50"
    )
    f-input-switch(
      :disabled="!field.value.name || !field.value.value"
      v-model:inputValue="field.value.isPublic"
      :label="$t('MI0025')"
      class="w-50"
    )
    icon-button(
      iconName="delete"
      @click="() => removeMiddleSideCustomPropertyField(index)"
    )
  f-button(
    :disabled="disableBackSideFields"
    type="text"
    size="sm"
    prependIcon="add"
    @click="() => pushMiddleSideCustomPropertyField({ isPublic: false, name: '', value: '' })"
  ) {{ $t('MI0034') }}
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
