<template lang="pug">
f-accordion(
  :title="$t('RR0587')"
  className="[&_#f-accordion-title]:text-lg [&_#f-accordion-header]:p-5"
)
  div(class="flex flex-col gap-4")
    div(v-for="spec in customFieldsSpecs" class="flex w-full gap-4" :key="spec.key")
      template(v-if="spec.type !== CustomFieldType.MULTI_SELECT_DROPDOWN")
        div(class="flex flex-row items-center gap-2 min-w-50 w-50")
          p(class="text-base font-bold break-words text-secondary-text cursor-text") {{ spec.name }}
        expandable-text(
          containerClass="break-words cursor-text"
          class="flex-1 text-sm text-primary-inverse"
        ) {{ spec.value || $t('RR0561') }}
      template(v-else)
        div(class="flex flex-row items-center gap-2 min-w-50 w-50")
          p(class="text-base font-bold break-words text-secondary-text cursor-text") {{ spec.name }}
        div(class="flex flex-row flex-wrap gap-2")
          f-tag(
            v-for="tag in spec.value.split(', ')"
            :key="`multi-select-custom-field-value-${spec.key}-${tag}`"
            size="md"
            :clickable="false"
          ) {{ tag }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import {
  CustomFieldType,
  type CustomField,
  type MaterialCustomField,
} from '@frontier/platform-web-sdk'
import ExpandableText from './ExpandableText.vue'

interface Spec {
  name: string
  value: string
  key: string
  type: CustomFieldType
}
interface Props {
  customFields?: CustomField[]
  materialCustomFields?: MaterialCustomField[]
}

const props = defineProps<Props>()

function mapMaterialCustomFieldsToSpecs(
  materialCustomFields: MaterialCustomField[],
  customFields: CustomField[]
): Spec[] {
  return materialCustomFields.map((field) => ({
    name: field.name,
    value: field.valueForDisplay,
    key: `custom-field-${field.customFieldId!}`,
    type:
      customFields.find((f) => f.customFieldId === field.customFieldId)
        ?.fieldType ?? CustomFieldType.SINGLE_LINE_TEXT,
  }))
}

const customFieldsSpecs = computed<Spec[]>(() => {
  if (!props.customFields) {
    return []
  }

  if (props.materialCustomFields) {
    return mapMaterialCustomFieldsToSpecs(
      props.materialCustomFields,
      props.customFields
    )
  }
  return []
})
</script>
