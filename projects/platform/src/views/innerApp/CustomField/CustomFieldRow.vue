<template>
  <tr class="border-b border-grey-50-v1">
    <td class="p-3 h-16 drag-handle cursor-grab select-none w-0">
      <f-svg-icon class="mx-auto" iconName="drag_indicator" size="20" />
    </td>
    <td class="p-3 h-16 w-0">
      <div class="flex items-center justify-center">
        <f-input-toggle
          :value="editableField.isPublic"
          @update:value="handleEdit(editableField.name, $event)"
          primaryColor="bg-[#065f46]"
        />
      </div>
    </td>
    <td class="p-3 h-16 gap-1">
      <div class="w-full flex items-center gap-3">
        <f-input-text
          class="flex-1"
          :textValue="editableField.name"
          @update:textValue="handleEdit($event, editableField.isPublic)"
          :clearable="false"
        />
        <InputCounterError
          v-if="errors.name === MAX_LENGTH_ERROR"
          :text="editableField.name"
          :maxLength="80"
        />
        <InputErrorTooltip
          :desc="errors.name === MAX_LENGTH_ERROR ? '' : errors.name"
        />
      </div>
    </td>
    <td class="p-3 h-16">
      <div class="flex items-center justify-between gap-1">
        <p>
          {{ formattedField.fieldType }}
        </p>
        <div
          v-if="
            [
              CustomFieldType.SINGLE_SELECT_RADIO_BUTTON,
              CustomFieldType.SINGLE_SELECT_DROPDOWN,
              CustomFieldType.MULTI_SELECT_DROPDOWN,
            ].includes(Number(field.fieldType))
          "
          class="border border-green-200-v1 px-3 py-2 !font-bold text-green-500-v1 hover:text-green-500-v1 hover:brightness-110 whitespace-nowrap cursor-pointer rounded"
          @click.prevent="openModal($event, field.customFieldId, 'edit')"
        >
          {{ $t('RR0524') }}
        </div>
      </div>
    </td>
    <td class="p-3 h-16 max-w-[320px]">{{ formattedField.applyTo }}</td>
    <td class="p-3 h-16 w-0">
      <div class="flex space-x-3 items-center">
        <button
          type="button"
          class="border border-red-200-v1 rounded p-1"
          @click="deleteRow(field.customFieldId)"
        >
          <f-svg-icon
            class="text-red-500-v1"
            iconName="delete_forever"
            size="24"
          />
        </button>
        <button
          type="button"
          class="border border-green-200-v1 rounded p-1"
          @click="openModal($event, field.customFieldId, 'duplicate')"
        >
          <f-svg-icon class="text-green-500-v1" iconName="copy" size="24" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { NOTIFY_TYPE } from '@/utils/constants'
import type { CustomField } from '@frontier/platform-web-sdk'
import {
  formatApplyTo,
  formatFieldType,
  isValidString,
  MAX_LENGTH_ERROR,
} from '@/utils/customField'
import customFieldApi from '@/apis/customField'
import { z } from 'zod'
import { CustomFieldType } from '@frontier/platform-web-sdk'
import { VERSION } from '@frontier/constants'
import { useNotifyStore } from '../../../stores/notify'
import InputCounterError from '@/components/customField/InputCounterError.vue'
import InputErrorTooltip from '@/components/customField/InputErrorTooltip.vue'
import { useI18n } from 'vue-i18n'
import debounce from 'lodash/debounce'

interface Props {
  onRemove: (customFieldId: number) => void
  openModal: (event: any, customFieldId: number | null, type: string) => void
  field: CustomField
  fieldNames: { customFieldId: number; name: string }[]
  isDragChange?: boolean
  updateCustomFieldList: (newValue: any) => void
}

const notify = useNotifyStore()
const { onRemove, openModal, field, fieldNames, updateCustomFieldList } =
  defineProps<Props>()

const formattedField = computed(() => {
  return {
    ...field,
    fieldType: formatFieldType(field.fieldType),
    applyTo: formatApplyTo(field.applyTo),
  }
})

const store = useStore()
const { t } = useI18n()
const organization = computed(() => store.getters['organization/organization'])

const editableField = ref({
  name: field.name,
  isPublic: field.isPublic,
})

onMounted(() => {
  editableField.value.name = field.name
  editableField.value.isPublic = field.isPublic
})

watch(
  () => field.name,
  (newValue) => {
    editableField.value.name = newValue
  }
)

watch(
  () => field.isPublic,
  (newValue) => {
    editableField.value.isPublic = newValue
  }
)

const editableFieldSchema = z.object({
  name: z
    .string()
    .min(1, t('WW0002'))
    .max(80, MAX_LENGTH_ERROR)
    .refine((name) => {
      return !fieldNames.some(
        (fieldName) =>
          fieldName.name === name &&
          fieldName.customFieldId !== field.customFieldId
      )
    }, t('WW0001'))
    .refine((name) => {
      return isValidString(name)
    }, t('RR0531', { characters: '|\\":;' })),
  isPublic: z.boolean(),
})

const errors = reactive({
  name: '',
  isPublic: '',
})

const handleEdit = (name: string, isPublic: boolean) => {
  editableField.value.name = name
  editableField.value.isPublic = isPublic
  handleSubmit(name, isPublic)
}

const handleSubmit = debounce(async (name: any, isPublic: any) => {
  const { success, error } = editableFieldSchema.safeParse({
    name,
    isPublic,
  })

  errors.name = ''
  errors.isPublic = ''

  if (!success) {
    for (const issue of error.issues) {
      errors[issue.path[0]] = issue.message
    }
    return
  }
  try {
    const res = await customFieldApi.upsertCustomField({
      orgId: organization.value.orgId,
      customField: {
        ...field,
        name,
        isPublic,
      },
    })

    notify.showNotifySnackbar({
      title: t('RR0528'),
      messageText: t('RR0529'),
      version: VERSION.V2,
      hasCloseButton: false,
      delay: 5000,
    })

    updateCustomFieldList(res.data.result)
  } catch (error) {
    console.error('Error updating custom field:', error)
  }
}, 500)

const deleteRow = async (customFieldId: any) => {
  const result = await new Promise((resolve) => {
    store.dispatch('helper/pushModalConfirm', {
      type: NOTIFY_TYPE.ALERT,
      header: t('RR0532'),
      contentText: t('RR0533'),
      primaryBtnText: t('RR0535'),
      primaryBtnHandler: resolve.bind(undefined, 'confirm'),
      secondaryBtnText: t('RR0534'),
      secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
      version: VERSION.V2,
    })
  })
  if (result === 'confirm') {
    onRemove(customFieldId)
  }
}
</script>
