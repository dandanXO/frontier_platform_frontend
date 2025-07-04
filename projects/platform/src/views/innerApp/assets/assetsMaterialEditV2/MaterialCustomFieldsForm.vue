<template>
  <f-accordion
    v-if="props.fields.length > 0"
    :title="$t('RR0598')"
    class="bg-white col-span-2"
    variant="compact"
    :headerTooltip="{
      title: $t('RR0598'),
      desc: $t('RR0598'),
    }"
  >
    <div class="grid grid-cols-1 gap-x-2 gap-y-4 p-3">
      <!-- Material Edit Custom Fields -->
      <div
        v-for="(field, index) in props.fields"
        :key="field.customFieldId || index"
      >
        <f-input-container
          v-if="field.customFieldId"
          :label="field.name"
          :required="false"
        >
          <!-- Text Field -->
          <f-input-textarea
            v-if="field.fieldType === FType.SINGLE_LINE_TEXT"
            :textValue="
              customFieldBindings.get(field.customFieldId)?.value?.value
            "
            @update:textValue="handleCustomFieldInput(field, $event)"
          />

          <!-- Numeric Input -->
          <f-input-text
            v-if="field.fieldType === FType.NUMERIC_INPUT"
            :textValue="
              customFieldBindings.get(field.customFieldId)?.value?.value
            "
            @update:textValue="handleCustomFieldInput(field, $event)"
            inputType="number"
          />

          <!-- Single Select Dropdown -->
          <f-select-input
            v-if="field.fieldType === FType.SINGLE_SELECT_DROPDOWN"
            :selectValue="
              customFieldBindings.get(field.customFieldId)?.value?.value ??
              (customFieldBindings.get(field.customFieldId)?.value === null
                ? null
                : '')
            "
            @update:selectValue="handleCustomFieldInput(field, $event)"
            :dropdownMenuTree="
              formatDropdownOptions(field.customFieldOptionList || [])
            "
            :canAddNew="false"
            emit-value
            map-options
          />

          <!-- Multi Select Dropdown -->
          <f-select-input
            v-if="field.fieldType === FType.MULTI_SELECT_DROPDOWN"
            :selectValue="
              (
                customFieldBindings.get(field.customFieldId)?.value
                  ?.value || []
              ).map((v: any) => v?.value ?? v)
            "
            @update:selectValue="handleCustomFieldInput(field, $event)"
            :dropdownMenuTree="
              formatDropdownOptions(field.customFieldOptionList || [])
            "
            :canAddNew="false"
            multiple
            emit-value
            map-options
          />

          <!-- Single Select Radio Button -->
          <f-input-radio-group
            v-if="field.fieldType === FType.SINGLE_SELECT_RADIO_BUTTON"
            :input-value="
              customFieldBindings.get(field.customFieldId)?.value?.value ??
              customFieldBindings.get(field.customFieldId)?.value
            "
            @update:input-value="handleCustomFieldInput(field, $event)"
            :option-list="formatRadioOptions(field.customFieldOptionList || [])"
            direction="vertical"
          />
        </f-input-container>
      </div>
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFieldArray } from 'vee-validate'
import {
  type CustomField,
  CustomFieldType as FType,
} from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'
import FAccordion from '@frontier/ui-component/src/FAccordion/FAccordion.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FInputText from '@frontier/ui-component/src/FInput/FInputText/FInputText.vue'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FInputRadioGroup from '@frontier/ui-component/src/FInput/FInputRadioGroup/FInputRadioGroup.vue'
import FInputTextarea from '@frontier/ui-component/src/FInput/FInputTextarea/FInputTextarea.vue'

interface Props {
  fields: CustomField[]
  formService: MaterialFormService
  fieldListName: 'pricingList' | 'specificationList'
}

const props = defineProps<Props>()

const { push: pushCustomField } = useFieldArray(
  `customFieldList.${props.fieldListName}`
)

onMounted(() => {
  if (props.fields.length > 0) {
    const formCustomFields =
      props.formService.values.customFieldList?.[props.fieldListName] || []
    props.fields.forEach((specField) => {
      if (specField.customFieldId === null) {
        return
      }
      const exists = formCustomFields.some(
        (f: any) => f.customFieldId === specField.customFieldId
      )
      if (!exists) {
        pushCustomField({
          customFieldId: specField.customFieldId,
          value: null,
        })
      }
    })
  }
})

const handleCustomFieldInput = (field: CustomField, event: any) => {
  if (field.customFieldId === null) {
    return
  }
  const binding = customFieldBindings.value.get(field.customFieldId)
  if (binding && binding.value) {
    let valueToStore = event

    if (
      field.fieldType === FType.SINGLE_SELECT_DROPDOWN ||
      field.fieldType === FType.SINGLE_SELECT_RADIO_BUTTON
    ) {
      valueToStore = event
    } else if (field.fieldType === FType.MULTI_SELECT_DROPDOWN) {
      valueToStore = Array.isArray(event) ? event : []
    } else {
      valueToStore = event
    }

    binding.value.onInput(valueToStore)
  }
}

const customFieldBindings = computed(() => {
  const bindings = new Map<number, any>()
  const formCustomFields =
    props.formService.values.customFieldList?.[props.fieldListName] || []

  props.fields.forEach((specField) => {
    if (specField.customFieldId === null) {
      return
    }
    let fieldIndex = formCustomFields.findIndex(
      (f: any) => f.customFieldId === specField.customFieldId
    )

    if (fieldIndex === -1) {
      fieldIndex = formCustomFields.length
    }

    bindings.set(
      specField.customFieldId,
      props.formService.defineInputBinds(
        `customFieldList.${props.fieldListName}[${fieldIndex}].value`
      )
    )
  })
  return bindings
})

const formatDropdownOptions = (options: any[]) => {
  return {
    blockList: [
      {
        menuList: options.map((opt: any) => ({
          title: opt.text,
          selectValue: opt.customFieldOptionId,
          customFieldOptionId: opt.customFieldOptionId,
        })),
      },
    ],
  }
}

const formatRadioOptions = (options: any[]) => {
  return options.map((opt: any) => ({
    name: opt.text,
    value: opt.customFieldOptionId,
  }))
}
</script>
