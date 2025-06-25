<template>
  <tr class="border-b border-grey-50-v1">
    <td
      class="w-0 h-16 p-3 select-none"
      :class="rolePermission ? 'drag-handle cursor-grab' : 'cursor-default'"
    >
      <f-svg-icon class="mx-auto" iconName="drag_indicator" size="20" />
    </td>
    <td class="w-0 h-16 p-3">
      <div class="flex items-center justify-center">
        <f-input-toggle
          :value="editableField.isPublic"
          @update:value="handleEdit(editableField.name, $event)"
          primaryColor="bg-[#065f46]"
          :disabled="!rolePermission"
        />
      </div>
    </td>
    <td class="h-16 gap-1 p-3">
      <div class="flex items-center w-full gap-3">
        <f-input-text
          class="flex-1"
          :textValue="editableField.name"
          @update:textValue="handleEdit($event, editableField.isPublic)"
          :clearable="false"
          :disabled="!rolePermission"
          :version="VERSION.V2"
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
    <td class="h-16 p-3">
      <div class="flex items-center justify-between gap-1">
        <p>
          {{ formattedField.fieldType }}
        </p>
        <f-button
          v-if="
            [
              CustomFieldType.SINGLE_SELECT_RADIO_BUTTON,
              CustomFieldType.SINGLE_SELECT_DROPDOWN,
              CustomFieldType.MULTI_SELECT_DROPDOWN,
            ].includes(Number(field.fieldType))
          "
          type="text"
          class="border border-green-200-v1 px-3 py-2 !font-bold text-green-500-v1 whitespace-nowrap rounded disabled:border-grey-400-v1 disabled:text-grey-400-v1 hover:disabled:text-grey-400-v1"
          @click.prevent="openModal($event, field.customFieldId, 'edit')"
          :disabled="!rolePermission"
          :class="[
            rolePermission
              ? 'cursor-pointer hover:text-green-500-v1 hover:brightness-110'
              : 'cursor-default',
          ]"
          >{{ $t('RR0524') }}
        </f-button>
      </div>
    </td>
    <td class="p-3 h-16 max-w-[320px]">{{ formattedField.applyTo }}</td>
    <td class="w-0 h-16 p-3">
      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="p-1 border rounded"
          :class="rolePermission ? 'border-red-200-v1' : ' border-grey-400-v1'"
          :disabled="!rolePermission"
          @click="deleteRow(field.customFieldId)"
        >
          <f-svg-icon
            :class="rolePermission ? 'text-red-500-v1' : ' text-grey-400-v1'"
            iconName="delete_forever"
            size="24"
          />
        </button>
        <button
          type="button"
          class="p-1 border rounded"
          :class="
            rolePermission ? 'border-green-200-v1' : ' border-grey-400-v1'
          "
          :disabled="!rolePermission"
          @click="openModal($event, field.customFieldId, 'duplicate')"
        >
          <f-svg-icon
            :class="rolePermission ? 'text-green-500-v1' : ' text-grey-400-v1'"
            iconName="copy"
            size="24"
          />
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
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'

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
const rolePermission = computed(() => {
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]
  return permissionList.includes(FUNC_ID.CUSTOM_FIDLE_EDIT)
})
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
      // notifyType: NOTIFY_TYPE.WARNING,
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
