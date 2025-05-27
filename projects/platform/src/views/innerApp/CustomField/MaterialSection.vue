<template>
  <section class="mb-8">
    <h2 class="text-xl font-bold py-6">{{ title }}</h2>
    <table class="w-full text-sm">
      <TableHeader isListPage />
      <Draggable
        tag="tbody"
        itemKey="itemKey"
        :list="sortedFieldList"
        handle=".drag-handle"
        :animation="150"
        @change="onDragChange"
      >
        <template #item="{ element }">
          <CustomFieldRow
            :field="element"
            :on-remove="removeCustomField"
            :openModal="openModal"
            :fieldNames="
              sortedFieldList.map((field) => ({
                customFieldId: field.customFieldId,
                name: field.name,
              }))
            "
            :updateCustomFieldList="updateCustomFieldList"
          />
        </template>
      </Draggable>
    </table>
    <button type="button" class="flex gap-1 ml-3 py-5" @click="openModal">
      <f-svg-icon class="text-cyan-500-v1" iconName="add" size="24" />
      <p class="text-cyan-500-v1 font-semibold underline text-sm">
        {{ $t('RR0527') }}
      </p>
    </button>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import CustomFieldRow from './CustomFieldRow.vue'
import TableHeader from '@/components/customField/TableHeader.vue'
import { useStore } from 'vuex'
import customFieldApi from '@/apis/customField'
import { CustomFieldTabType } from '@frontier/platform-web-sdk'
import { useNotifyStore } from '../../../stores/notify'
import { VERSION } from '@frontier/constants'
import { useI18n } from 'vue-i18n'
const store = useStore()
const { t } = useI18n()
const organization = computed(() => store.getters['organization/organization'])

interface Props {
  tabType: CustomFieldTabType
  title: string
  fieldList: any[]
  updateCustomFieldList: (newValue: any) => void
}
const notify = useNotifyStore()

const { tabType, title, fieldList, updateCustomFieldList } =
  defineProps<Props>()

const sortedFieldList = ref<any>([])

watch(
  () => fieldList,
  (newValue) => {
    sortedFieldList.value = newValue.sort((a, b) => a.sort - b.sort)
  },
  { immediate: true }
)

async function onDragChange() {
  const res = await customFieldApi.updateCustomFieldSort({
    orgId: organization.value.orgId,
    tabType,
    customFieldIdList: fieldList.map((field) => field.customFieldId),
  })

  updateCustomFieldList(res.data.result)
  notify.showNotifySnackbar({
    title: t('RR0528'),
    messageText: t('RR0529'),
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
}

const removeCustomField = async (customFieldId: number) => {
  const res = await customFieldApi.deleteCustomField({
    orgId: organization.value.orgId,
    customFieldId,
  })
  updateCustomFieldList(res.data.result)

  notify.showNotifySnackbar({
    title: t('RR0528'),
    messageText: t('RR0529'),
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
}

const openModal = (e: any, customFieldId: number | null, type: string) => {
  e.preventDefault()
  const initialField = fieldList.find(
    (field) => field.customFieldId === customFieldId
  )
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-custom-field-setting',
    properties: {
      sectionTitle: title,
      initialField,
      type,
      fieldNames: sortedFieldList.value.map((field) => ({
        customFieldId: field.customFieldId,
        name: field.name,
      })),
      onConfirm: async (data: {
        isPublic: boolean
        name: string
        fieldType: any
        applyTo: any
        customFieldOptionList: any
      }) => {
        if (customFieldId && type === 'edit') {
          const res = await customFieldApi.upsertCustomField({
            orgId: organization.value.orgId,
            customField: {
              customFieldId,
              name: data.name,
              tabType: tabType,
              fieldType: data.fieldType,
              customFieldOptionList: data.customFieldOptionList,
              isPublic: data.isPublic,
              applyTo: data.applyTo,
              sort: 1,
            },
          })
          updateCustomFieldList(res.data.result)
        } else {
          const res = await customFieldApi.upsertCustomField({
            orgId: organization.value.orgId,
            customField: {
              customFieldId: null,
              name: data.name,
              tabType: tabType,
              fieldType: data.fieldType,
              customFieldOptionList: data.customFieldOptionList,
              isPublic: data.isPublic,
              applyTo: data.applyTo,
              sort: 1,
            },
          })
          updateCustomFieldList(res.data.result)
        }
        notify.showNotifySnackbar({
          title: t('RR0528'),
          messageText: t('RR0529'),
          version: VERSION.V2,
          hasCloseButton: false,
          delay: 5000,
        })
      },
    },
  })
}
</script>

<script lang="ts">
export default {
  name: 'MaterialSection',
}
</script>
