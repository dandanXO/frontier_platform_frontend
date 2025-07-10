<template>
  <f-input-container
    :label="t('RR0021')"
    required
    v-if="materialTypeValue != null"
    :hintError="contentDisplayError"
  >
    <div
      v-for="(field, index) in contentFields"
      :key="field.key"
      :class="
        contentFields.length > 1
          ? 'grid grid-cols-[1fr_1fr_auto] items-center gap-x-2'
          : 'grid grid-cols-[1fr_1fr] items-center gap-x-2'
      "
      :style="{ marginTop: index > 0 ? '6px' : '0' }"
    >
      <f-select-input
        :placeholder="t('RR0591')"
        :selectValue="field.value.name"
        @update:selectValue="selectContentName($event, index, field.value)"
        @addNew="inputMenu.addContentOption($event)"
        :dropdownMenuTree="contentNameDropdownSource"
        :hintError="getFieldError(`contentList[${index}].name`)"
        :hasError="!field.value.name"
        emit-value
        map-options
      ></f-select-input>
      <f-input-text
        v-model:textValue="field.value.percentage"
        inputType="number"
        :placeholder="t('MI0043')"
        addOnRight="%"
        :hintError="getFieldError(`contentList[${index}].percentage`)"
        :hasError="!field.value.percentage"
        data-cy="content-text-value"
      ></f-input-text>
      <!-- prettier-ignore -->
      <f-svg-icon
        v-if="contentFields.length > 1"
        class="text-grey-600 cursor-pointer"
        size="20"
        iconName="delete"
        @click="async () => {
          const currentIndex = index; // Capture index
          removeContentField(currentIndex);
          try {
            await materialFormService.validate();
          } catch (e) {
            console.error('[DELETE CLICKED] Validation FAILED after removing index:', currentIndex, e);
          }
        }"
      />
    </div>
  </f-input-container>
  <f-button
    type="text"
    size="sm"
    @click="
      pushContentField({
        contentId: null,
        name: null,
        percentage: '',
      })
    "
    class="!text-cyan-500-v1 text-sm font-medium underline self-start !p-0"
  >
    <f-svg-icon iconName="add" size="24" class="text-cyan-500-v1" />
    {{ t('RR0592') }}
  </f-button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FInputText from '@frontier/ui-component/src/FInput/FInputText/FInputText.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FButton from '@frontier/ui-component/src/FButton/FButton.vue'
import FSvgIcon from '@frontier/ui-component/src/FSvgIcon/FSvgIcon.vue'
import type { MaterialFormService } from '@/types'

interface ContentItem {
  contentId: number | null
  name: string | null
  percentage: string
}

interface Props {
  materialTypeValue: any
  contentFields: any[]
  contentNameDropdownSource: any
  contentDisplayError: string | undefined
  pushContentField: (item: ContentItem) => void
  removeContentField: (index: number) => void
  selectContentName: (
    name: string | null,
    index: number,
    currentFieldData: ContentItem
  ) => void
  getFieldError: (fieldPath: string) => string | undefined
  inputMenu: any
  materialFormService: MaterialFormService
}

defineProps<Props>()

const { t } = useI18n()
</script>
