<template>
  <f-accordion :title="t('MI0005')" class="bg-white">
    <div class="grid grid-cols-2 gap-x-2 gap-y-5 items-start">
      <material-specification-shared-fields />
      <!-- New Sides Section -->
      <div
        class="col-span-2 flex flex-col gap-y-2 p-3 bg-white border border-grey-200-v1 rounded-lg"
      >
        <!-- Tabs -->
        <sides-tabs :material="material" v-model="activeSide" />

        <!-- Tab Content -->
        <div v-if="activeSide === 'faceSide'">
          <material-side-form
            side="faceSide"
            :pantone-list="pantoneList"
            :pantone-dropdown-menu-tree="pantoneDropdownMenuTree"
            v-model:is-expanded="isFaceSideExpanded"
          />
        </div>

        <div v-if="activeSide === 'middleSide'">
          <div class="flex flex-col gap-y-4 p-3 bg-green-50-v1 rounded-t-md">
            <!-- Info Bar -->
            <f-infobar
              class="w-full"
              :notifyType="NOTIFY_TYPE.TIPS"
              :display="DISPLAY.BLOCK"
              :title="t('MI0045')"
              :messageText="t('MI0046')"
            />
          </div>
          <!-- See More -->
          <div
            class="flex flex-col bg-grey-50-v1 rounded-b-md border-t border-green-200-v1"
          >
            <div class="flex justify-end items-center py-2 px-5 h-12">
              <button
                class="text-cyan-500-v1 underline text-sm font-semibold flex flex-row items-center gap-x-1"
                @click="isMiddleSideExpanded = !isMiddleSideExpanded"
              >
                {{ isMiddleSideExpanded ? t('EE0245') : t('EE0244') }}
                <f-svg-icon
                  size="24"
                  iconName="arrow_drop_down"
                  :class="{ 'rotate-180': isMiddleSideExpanded }"
                ></f-svg-icon>
              </button>
            </div>

            <!-- Additional Fields -->
            <div v-if="isMiddleSideExpanded" class="flex flex-col gap-y-4 p-3">
              <!-- Features -->
              <f-input-container :label="t('MI0014')" required>
                <f-select-input
                  :selectValue="middleSideFeatureList.value"
                  @update:selectValue="middleSideFeatureList.onInput"
                  :dropdownMenuTree="inputMenu.specOptions.featureList"
                  @addNew="inputMenu.addFeatureOption"
                  :placeholder="t('RR0288')"
                  :hintError="
                    materialFormService.displayErrors.value[
                      'middleSide.featureList'
                    ]
                  "
                  multiple
                  :multipleTagInputValidations="[inputValidate, lengthValidate]"
                  data-cy="features-input"
                ></f-select-input>
              </f-input-container>

              <!-- Finish List -->
              <f-input-container :label="t('RR0593')">
                <f-select-input
                  :selectValue="middleSideFinishList.value"
                  @update:selectValue="middleSideFinishList.onInput"
                  :dropdownMenuTree="inputMenu.specOptions.finishList"
                  @addNew="inputMenu.addFinishOption"
                  :placeholder="t('MI0040')"
                  :hintError="
                    materialFormService.displayErrors.value[
                      'middleSide.finishList'
                    ]
                  "
                  multiple
                  :multipleTagInputValidations="[inputValidate, lengthValidate]"
                  data-cy="finish-info"
                ></f-select-input>
              </f-input-container>

              <!-- Material Description -->
              <!-- Not available for middle side -->
              <!-- <f-select-input
                :selectValue="middleSideDescriptionList.value"
                @update:selectValue="middleSideDescriptionList.onInput"
                :dropdownMenuTree="inputMenu.specOptions.descriptionList"
                @addNew="inputMenu.addDescriptionOption"
                :label="t('MI0023')"
                :placeholder="t('MI0151')"
                :hintError="
                  materialFormService.displayErrors.value[
                    'middleSide.descriptionList'
                  ]
                "
                multiple
                :multipleTagInputValidations="[inputValidate, lengthValidate]"
                class="w-full"
              >
                <template #custom-not-found>
                  <custom-not-found />
                </template>
              </f-select-input> -->
            </div>
          </div>
        </div>

        <div v-if="activeSide === 'backSide'">
          <material-side-form
            side="backSide"
            :pantone-list="pantoneList"
            :pantone-dropdown-menu-tree="pantoneDropdownMenuTree"
            v-model:is-expanded="isBackSideExpanded"
          />
        </div>
      </div>

      <!-- Custom Fields Accordion -->
      <material-custom-fields-form
        :fields="specificationCustomFields"
        :form-service="materialFormService"
        field-list-name="specificationList"
      />
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { computed, ref, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFieldArray } from 'vee-validate'
import { NOTIFY_TYPE, DISPLAY, materialFormServiceKey } from '@/utils/constants'
import {
  type Material,
  type PantoneColor,
  type CustomField,
} from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FAccordion from '@frontier/ui-component/src/FAccordion/FAccordion.vue'
import FInfobar from '@frontier/ui-component/src/FNotify/FInfobar/FInfobar.vue'
import MaterialSpecificationSharedFields from './MaterialSpecificationSharedFields.vue'
import SidesTabs from './SidesTabs.vue'
import MaterialSideForm from './MaterialSideForm.vue'
import { useAssetsStore } from '@/stores/assets'
import MaterialCustomFieldsForm from './MaterialCustomFieldsForm.vue'

interface Props {
  material: Material
  pantoneList: PantoneColor[]
}

const props = defineProps<Props>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { t } = useI18n()
const assetsStore = useAssetsStore()
const materialOptions = ref()

// Inject the material form service
const materialFormService = inject(
  materialFormServiceKey
) as MaterialFormService

// Access inputMenu from materialFormService
const { inputMenu } = materialFormService

const { push: pushCustomField } = useFieldArray(
  'customFieldList.specificationList'
)

onMounted(async () => {
  materialOptions.value = await assetsStore.getMaterialOptions()

  if (specificationCustomFields.value.length > 0) {
    const formCustomFields =
      materialFormService.values.customFieldList?.specificationList || []
    specificationCustomFields.value.forEach((specField) => {
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

// Active side state
const activeSide = ref('faceSide')

// Expanded states
const isFaceSideExpanded = ref(false)
const isMiddleSideExpanded = ref(false)
const isBackSideExpanded = ref(false)

// Pantone color input
const pantoneColor = ref('')

// Validation rules
const inputValidate = (str: string) => str.replace(/,/g, '')
const lengthValidate = (str: string) => str.slice(0, 500)

// Middle Side Bindings
const middleSideFeatureList = materialFormService.defineInputBinds(
  'middleSide.featureList'
)
const middleSideFinishList = materialFormService.defineInputBinds(
  'middleSide.finishList'
)
const middleSideDescriptionList = materialFormService.defineInputBinds(
  'middleSide.descriptionList'
)

// Pantone Functions
const faceSidePantoneValueDisplayList = computed(() => {
  return (
    materialFormService.values.faceSide?.pantoneNameList?.map(
      (pantoneName: string) => {
        const pantone = props.pantoneList.find(
          (pant) => pant.name === pantoneName
        )
        if (!pantone) {
          throw new Error(`Pantone ${pantoneName} not found`)
        }
        return pantone
      }
    ) || []
  )
})

const backSidePantoneValueDisplayList = computed(() => {
  return (
    materialFormService.values.backSide?.pantoneNameList?.map(
      (pantoneName: string) => {
        const pantone = props.pantoneList.find(
          (pant) => pant.name === pantoneName
        )
        if (!pantone) {
          throw new Error(`Pantone ${pantoneName} not found`)
        }
        return pantone
      }
    ) || []
  )
})

const removeFaceSidePantone = (pantone: string) => {
  materialFormService.removePantone(pantone, 'faceSide')
}

const removeBackSidePantone = (pantone: string) => {
  materialFormService.removePantone(pantone, 'backSide')
}

const handlePantoneSelection = (value: string) => {
  if (value && value.trim()) {
    // Add to the currently active side
    if (activeSide.value === 'faceSide') {
      materialFormService.addPantone(value.trim(), 'faceSide')
    } else if (activeSide.value === 'backSide') {
      materialFormService.addPantone(value.trim(), 'backSide')
    }
    pantoneColor.value = ''
  }
}

// Memoized pantone data for performance
const memoizedPantoneData = ref<{
  groupedPantones: { [key: string]: PantoneColor[] }
  lastPantoneListLength: number
} | null>(null)

const getGroupedPantones = () => {
  // Check if we can reuse memoized data
  if (
    memoizedPantoneData.value &&
    memoizedPantoneData.value.lastPantoneListLength === props.pantoneList.length
  ) {
    return memoizedPantoneData.value.groupedPantones
  }

  // Group pantones by major color name for better organization
  const groupedPantones: { [key: string]: PantoneColor[] } = {}

  props.pantoneList.forEach((pantone) => {
    const majorColor = pantone.majorColorName || 'Other'
    if (!groupedPantones[majorColor]) {
      groupedPantones[majorColor] = []
    }
    groupedPantones[majorColor].push(pantone)
  })

  // Sort within each group
  Object.keys(groupedPantones).forEach((majorColor) => {
    groupedPantones[majorColor].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Memoize the result
  memoizedPantoneData.value = {
    groupedPantones,
    lastPantoneListLength: props.pantoneList.length,
  }

  return groupedPantones
}

// Search state for filtering
const pantoneSearchQuery = ref('')

const pantoneDropdownMenuTree = computed(() => {
  const groupedPantones = getGroupedPantones()

  let filteredCategories = Object.entries(groupedPantones).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  // Apply search filter if there's a query
  if (pantoneSearchQuery.value.trim()) {
    const query = pantoneSearchQuery.value.toLowerCase()
    filteredCategories = filteredCategories
      .map(([majorColor, pantones]) => {
        const filteredPantones = pantones.filter(
          (pantone) =>
            pantone.name.toLowerCase().includes(query) ||
            pantone.colorName.toLowerCase().includes(query) ||
            majorColor.toLowerCase().includes(query)
        )
        return [majorColor, filteredPantones] as [string, PantoneColor[]]
      })
      .filter(([, pantones]) => pantones.length > 0)
  } else {
    // Limit initial display to first 8 categories for better performance
    filteredCategories = filteredCategories.slice(0, 8)
  }

  return {
    width: 'w-80',
    scrollAreaMaxHeight: 'max-h-60',
    blockList: filteredCategories.map(([majorColor, pantones]) => ({
      blockTitle: majorColor,
      menuList: pantones.map((pantone) => ({
        title: pantone.name,
        selectValue: pantone.name,
        labelColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})`,
        description: pantone.colorName,
      })),
    })),
  }
})

// Handle search input for pantone dropdown
const handlePantoneSearch = (query: string) => {
  pantoneSearchQuery.value = query
}

const specificationCustomFields = computed((): CustomField[] => {
  const currentMaterialType = materialFormService.values.faceSide?.materialType
  if (!materialOptions.value || !currentMaterialType) {
    return []
  }

  const allSpecFields =
    materialOptions.value.customFieldList?.specificationList || []

  const filteredFields = allSpecFields.filter((field: CustomField) => {
    return (
      field.customFieldId !== null &&
      (field.applyTo.length === 0 ||
        field.applyTo.includes(currentMaterialType))
    )
  })

  return filteredFields
})
</script>
