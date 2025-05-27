<template>
  <modal-behavior
    :header="
      type === 'edit'
        ? $t('RR0547')
        : initialField
        ? $t('RR0546', { sectionname: sectionTitle })
        : $t('RR0536', { sectionname: sectionTitle })
    "
    :primaryBtnText="$t('UU0018')"
    :secondaryBtnText="$t('UU0002')"
    :primaryBtnDisabled="primaryBtnDisabled"
    @click:primary="handleSubmit"
    @click:secondary="store.dispatch('helper/closeModal')"
    modalClass="max-w-[1024px] w-full min-h-[600px]"
    version="v2"
  >
    <table class="w-full h-full text-sm">
      <TableHeader />
      <tbody>
        <tr class="border-b border-grey-50-v1">
          <td class="p-3 h-16 text-center align-top pt-5">
            <f-input-toggle
              :value="form.isPublic"
              @update:value="form.isPublic = $event"
              primaryColor="bg-[#065f46]"
            />
          </td>
          <td class="p-3 h-16 gap-1 align-top">
            <div>
              <f-input-text
                :textValue="form.name"
                @update:textValue="
                  form.name = $event;
                  checkInputError()
                "
                :hintError="Boolean(errors.name)"
                :placeholder="$t('RR0543')"
                class="w-full"
                @blur="handleBlur"
              />
            </div>
          </td>
          <td class="h-16 align-top">
            <p class="p-3 mt-2" v-if="type === 'edit'">
              {{ formatFieldType(form.fieldType) }}
            </p>
            <div class="p-3" v-else>
              <f-select-input
                :selectValue="form.fieldType"
                @update:selectValue="form.fieldType = $event"
                :dropdownMenuTree="columnTypeMenuTree"
                :placeholder="$t('RR0544')"
                :canAddNew="false"
                :hintError="Boolean(errors.fieldType)"
                :labelNeeded="false"
                :clearable="false"
              />
            </div>
          </td>
          <td class="p-3 h-16 gap-1 align-top">
            <p class="mt-2" v-if="type === 'edit'">
              {{ formatApplyTo(form.applyTo) }}
            </p>
            <f-select-input
              v-else
              class="w-[300px]"
              :selectValue="form.applyTo"
              @update:selectValue="form.applyTo = $event"
              :dropdownMenuTree="materialTypeMenuTree"
              :placeholder="$t('RR0545')"
              :multiple="true"
              :canAddNew="false"
              :hintError="Boolean(errors.applyTo)"
              :labelNeeded="false"
              :version="'v2'"
            />
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>
            <div
              v-if="
                [
                  CustomFieldType.SINGLE_SELECT_RADIO_BUTTON,
                  CustomFieldType.SINGLE_SELECT_DROPDOWN,
                  CustomFieldType.MULTI_SELECT_DROPDOWN,
                ].includes(Number(form.fieldType))
              "
            >
              <Draggable
                class="pb-4 max-h-96 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar pr-1.5 -mr-1.5"
                :list="sortedCustomFieldOptionList"
                item-key="key"
                handle=".handle"
                :animation="150"
                @change="swapField"
                chosenClass="chosenClass"
              >
                <template #item="{ element, index }">
                  <div
                    class="flex items-center gap-2 p-3 border-b border-grey-50-v1"
                  >
                    <span class="handle" style="cursor: grab">
                      <f-svg-icon
                        class="mx-auto"
                        iconName="drag_indicator"
                        size="20"
                      />
                    </span>
                    <span>
                      <div
                        v-if="
                          Number(form.fieldType) ===
                          CustomFieldType.SINGLE_SELECT_RADIO_BUTTON
                        "
                        class="w-6 h-6 min-w-6 min-h-6 rounded-full border border-grey-200-v1"
                      />
                      <div
                        v-if="
                          Number(form.fieldType) ===
                          CustomFieldType.MULTI_SELECT_DROPDOWN
                        "
                        class="w-6 h-6 min-w-6 min-h-6 rounded border border-grey-200-v1"
                      />
                    </span>
                    <div class="w-full">
                      <f-input-text
                        ref="optionInputRef"
                        :textValue="element.text"
                        @update:textValue="
                          element.text = $event;
                          checkInputError()
                        "
                        :hintError="
                          Boolean(errors.customFieldOptionList[index]?.text)
                        "
                        :placeholder="
                          customFieldPlaceholder(form.fieldType, index)
                        "
                        :clearable="false"
                        class="w-[99%]"
                        @keydown.enter="
                          ;[
                            CustomFieldType.SINGLE_SELECT_DROPDOWN,
                            CustomFieldType.MULTI_SELECT_DROPDOWN,
                          ].includes(Number(form.fieldType))
                            ? add()
                            : null
                        "
                        @blur="handleBlur"
                      />
                    </div>
                    <button
                      v-if="
                        [
                          CustomFieldType.SINGLE_SELECT_DROPDOWN,
                          CustomFieldType.MULTI_SELECT_DROPDOWN,
                        ].includes(Number(form.fieldType))
                      "
                      class="flex items-center justify-center h-10 w-10 min-h-10 min-w-10 border border-red-200-v1 rounded"
                      type="button"
                      @click="remove(index)"
                    >
                      <f-svg-icon
                        class="text-red-500-v1"
                        iconName="close"
                        size="24"
                      />
                    </button>
                  </div>
                </template>
              </Draggable>

              <button
                v-if="
                  [
                    CustomFieldType.SINGLE_SELECT_DROPDOWN,
                    CustomFieldType.MULTI_SELECT_DROPDOWN,
                  ].includes(Number(form.fieldType))
                "
                type="button"
                class="flex gap-1"
                @click="add"
              >
                <f-svg-icon class="text-cyan-500-v1" iconName="add" size="24" />
                <p class="text-cyan-500-v1 font-semibold underline text-sm">
                  {{ $t('UU0035') }}
                </p>
              </button>
            </div>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </modal-behavior>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import TableHeader from '@/components/customField/TableHeader.vue'
import Draggable from 'vuedraggable'
import { customFieldSchema } from '@/views/innerApp/CustomField/useCustomerFieldFrom'
import {
  formatApplyTo,
  formatFieldType,
  FIELD_TYPE_OPTIONS,
  APPLY_TO_OPTIONS,
  customFieldPlaceholder,
} from '@/utils/customField'
import { CustomFieldType } from '@frontier/platform-web-sdk'

const props = defineProps<{
  type: string
  sectionTitle: string
  fieldNames?: { customFieldId: number; name: string }[]
  initialField?: {
    customFieldId: number
    name: string
    fieldType: number
    applyTo: string[]
    isPublic: boolean
    customFieldOptionList: {
      customFieldOptionId: number
      text: string
      sort: number
    }[]
  }
}>()
const emit = defineEmits<{
  (e: 'search'): void
}>()

const { t } = useI18n()
const store = useStore()

type Form = {
  isPublic: boolean
  name: string
  fieldType: number | null
  applyTo: string[]
  customFieldOptionList: {
    customFieldOptionId?: number | null
    text: string
    sort: number
  }[]
}

const primaryBtnDisabled = computed(() => {
  return !form.name || !form.fieldType || form.applyTo.length < 1
})

const form = reactive<Form>({
  isPublic: false,
  name: '',
  fieldType: null,
  applyTo: [],
  customFieldOptionList: [],
})

const sortedCustomFieldOptionList = computed(() => {
  return [...form.customFieldOptionList].sort((a, b) => a.sort - b.sort)
})

const errors = reactive({
  isPublic: '',
  name: '',
  fieldType: '',
  applyTo: '',
  customFieldOptionList: [],
})

const resetErrors = () => {
  errors.isPublic = ''
  errors.name = ''
  errors.fieldType = ''
  errors.applyTo = ''
  errors.customFieldOptionList = []
}
const checkInputError = () =>{
  const result = customFieldSchema(
    props.fieldNames || [],
    props.initialField && props.type === 'edit'
      ? props.initialField.customFieldId
      : null
  ).safeParse(form)
  errors.isPublic = ''
  errors.name = ''
  errors.fieldType = ''
  errors.applyTo = ''
  errors.customFieldOptionList = []

  if (!result.success) {
    for (const issue of result.error.issues) {
      if (
        issue.path[0] === 'customFieldOptionList' &&
        typeof issue.path[1] === 'number'
      ) {
        const index = issue.path[1]
        if (!errors.customFieldOptionList[index]) {
          errors.customFieldOptionList[index] = {}
        }
        const fieldKey = issue.path.slice(2).join('.')
        errors.customFieldOptionList[index][fieldKey] = issue.message
      } else {
        errors[issue.path[0]] = issue.message
      }
    }
  }
}
const handleBlur = () => {
  checkInputError()
}

const handleSubmit = () => {
  const result = customFieldSchema(
    props.fieldNames || [],
    props.initialField && props.type === 'edit'
      ? props.initialField.customFieldId
      : null
  ).safeParse(form)
  errors.isPublic = ''
  errors.name = ''
  errors.fieldType = ''
  errors.applyTo = ''
  errors.customFieldOptionList = []

  if (!result.success) {
    for (const issue of result.error.issues) {
      if (
        issue.path[0] === 'customFieldOptionList' &&
        typeof issue.path[1] === 'number'
      ) {
        const index = issue.path[1]
        if (!errors.customFieldOptionList[index]) {
          errors.customFieldOptionList[index] = {}
        }
        const fieldKey = issue.path.slice(2).join('.')
        errors.customFieldOptionList[index][fieldKey] = issue.message
      } else {
        errors[issue.path[0]] = issue.message
      }
    }
  } else {
    emit('confirm', {
      isPublic: form.isPublic,
      name: form.name,
      fieldType: form.fieldType,
      applyTo: form.applyTo,
      customFieldOptionList: form.customFieldOptionList,
    })

    store.dispatch('helper/closeModal')
  }
}

const columnTypeMenuTree = computed(() => {
  return {
    blockList: [
      {
        menuList: FIELD_TYPE_OPTIONS,
      },
    ],
  }
})

const materialTypeMenuTree = computed(() => {
  return {
    blockList: [
      {
        menuList: APPLY_TO_OPTIONS,
      },
    ],
  }
})

onMounted(() => {
  if (props.initialField) {
    form.isPublic = props.initialField.isPublic
    form.name = props.initialField.name
    form.fieldType = props.initialField.fieldType
    form.applyTo = props.initialField.applyTo
    form.customFieldOptionList = props.initialField.customFieldOptionList
  }
})

watch(
  () => form.fieldType,
  (newVal) => {
    if (
      form.customFieldOptionList.length < 1 &&
      (newVal === 3 || newVal === 4 || newVal === 5)
    ) {
      form.customFieldOptionList = [
        { customFieldOptionId: null, text: '', sort: 1 },
        { customFieldOptionId: null, text: '', sort: 2 },
      ]
    } else if (props.type !== 'edit' && (newVal === 1 || newVal === 2)) {
      form.customFieldOptionList = []
    }
  },
  { immediate: true }
)

const optionInputRef = ref(null)

const add = () => {
  form.customFieldOptionList.push({
    customFieldOptionId: null,
    text: '',
    sort: form.customFieldOptionList.length + 1,
  })

  nextTick(() => {
    optionInputRef.value.focus()
  })
}

const remove = (index: any) => {
  form.customFieldOptionList.splice(index, 1)
}

const swapField = (evt: any) => {
  const { oldIndex, newIndex } = evt.moved
  const movedItem = form.customFieldOptionList.splice(oldIndex, 1)[0]
  form.customFieldOptionList.splice(newIndex, 0, movedItem)
  form.customFieldOptionList.forEach((item, index) => {
    item.sort = index + 1
  })
  checkInputError()
}
</script>

<style scoped lang="scss">
.chosenClass{
  background-color: #fff;
  @apply rounded;
  @apply px-2;
}

@-moz-document url-prefix() {
  .custom-scrollbar {
    scrollbar-width: 4px;
    scrollbar-color: #dedede #f3f3f3;
    padding-right: 0.75rem;
    margin-right: -0.75rem;
  }
}
/* Chrome, Edge, and Safari */
.custom-scrollbar::-webkit-scrollbar {
  @apply w-1
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply rounded-full bg-grey-50-v1
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply rounded-full bg-grey-100-v1
}
</style>
