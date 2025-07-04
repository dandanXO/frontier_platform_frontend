<template>
  <f-accordion :title="$t('MI0005')" class="bg-white">
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
          <div class="flex flex-col gap-y-4 p-5 bg-green-50-v1 rounded-t-md">
            <!-- Material Type -->
            <f-input-container :label="$t('MI0003')" required>
              <f-select-input
                :placeholder="$t('RR0588')"
                :selectValue="faceSideMaterialTypeValue.value"
                @update:selectValue="faceSideMaterialTypeValue.onInput"
                :dropdownMenuTree="faceSideMaterialTypeDropdownSource"
                :hintError="
                  materialFormService.displayErrors.value[
                    'faceSide.materialType'
                  ]
                "
                :canAddNew="false"
                emit-value
                map-options
                class="w-full"
              ></f-select-input>
            </f-input-container>

            <!-- Construction Type -->
            <f-input-container
              :label="$t('MI0150')"
              required
              v-if="
                faceSideMaterialTypeValue.value &&
                WITH_CONSTRUCTION_TYPE_MATERIALS.includes(
                  faceSideMaterialTypeValue.value
                )
              "
            >
              <f-select-input
                :placeholder="$t('MI0152')"
                :selectValue="faceSideMaterialTypeConstructionValue.value?.name"
                @update:selectValue="selectFaceSideMaterialTypeConstruction"
                @addNew="inputMenu.addMaterialTypeConstructionOption($event)"
                :dropdownMenuTree="faceSideConstructionTypeDropdownSource"
                :hintError="
                  materialFormService.displayErrors.value[
                    'faceSide.materialTypeConstruction'
                  ]
                "
                emit-value
                map-options
                class="w-full"
              ></f-select-input>
            </f-input-container>

            <!-- Content -->
            <f-input-container
              :label="$t('RR0021')"
              required
              v-if="faceSideMaterialTypeValue.value != null"
              :hintError="faceSideContentDisplayError"
            >
              <div
                v-for="(field, index) in faceSideContentFields"
                :key="field.key"
                :class="
                  faceSideContentFields.length > 1
                    ? 'grid grid-cols-[1fr_1fr_auto] items-center gap-x-2'
                    : 'grid grid-cols-[1fr_1fr] items-center gap-x-2'
                "
                :style="{ marginTop: index > 0 ? '6px' : '0' }"
              >
                <f-select-input
                  :placeholder="$t('RR0591')"
                  :selectValue="field.value.name"
                  @update:selectValue="
                    selectFaceSideContentName($event, index, field.value)
                  "
                  @addNew="inputMenu.addContentOption($event)"
                  :dropdownMenuTree="faceSideContentNameDropdownSource"
                  :hintError="
                    materialFormService.displayErrors.value[
                      `faceSide.contentList[${index}].name`
                    ]
                  "
                  :hasError="!field.value.name"
                  emit-value
                  map-options
                ></f-select-input>
                <f-input-text
                  v-model:textValue="field.value.percentage"
                  inputType="number"
                  :placeholder="$t('MI0043')"
                  addOnRight="%"
                  :hintError="
                    materialFormService.displayErrors.value[
                      `faceSide.contentList[${index}].percentage`
                    ]
                  "
                  :hasError="!field.value.percentage"
                  data-cy="content-text-value"
                ></f-input-text>
                <!-- prettier-ignore -->
                <f-svg-icon
                v-if="faceSideContentFields.length > 1"
                class="text-grey-600 cursor-pointer"
                size="20"
                iconName="delete"
                @click="async () => {
                  const currentIndex = index; // Capture index
                  removeFaceSideContentField(currentIndex);
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
                pushFaceSideContentField({
                  contentId: null,
                  name: null,
                  percentage: '',
                })
              "
              class="!text-cyan-500-v1 text-sm font-medium underline self-start !p-0"
              ><f-svg-icon iconName="add" size="24" class="text-cyan-500-v1" />
              {{ $t('RR0592') }}</f-button
            >
          </div>
          <!-- See More -->
          <div
            class="flex flex-col bg-grey-50-v1 rounded-b-md border-t border-green-200-v1"
          >
            <div class="flex justify-end items-center py-2 px-5 h-12">
              <button
                class="text-cyan-500-v1 underline text-sm font-semibold flex flex-row items-center gap-x-1"
                @click="isFaceSideExpanded = !isFaceSideExpanded"
              >
                {{ isFaceSideExpanded ? $t('EE0245') : $t('EE0244') }}
                <f-svg-icon
                  size="24"
                  iconName="arrow_drop_down"
                  :class="{ 'rotate-180': isFaceSideExpanded }"
                ></f-svg-icon>
              </button>
            </div>

            <!-- Additional Fields -->
            <div v-if="isFaceSideExpanded" class="flex flex-col gap-y-4 p-3">
              <!-- Material Description -->
              <f-select-input
                :selectValue="faceSideDescriptionList.value"
                @update:selectValue="faceSideDescriptionList.onInput"
                :dropdownMenuTree="inputMenu.specOptions.descriptionList"
                @addNew="inputMenu.addDescriptionOption"
                :label="$t('MI0023')"
                :placeholder="$t('MI0151')"
                :hintError="
                  materialFormService.displayErrors.value[
                    'faceSide.descriptionList'
                  ]
                "
                multiple
                :multipleTagInputValidations="[inputValidate, lengthValidate]"
                class="w-full"
              >
                <template #custom-not-found>
                  <custom-not-found />
                </template>
              </f-select-input>

              <!-- Density (only for WOVEN materials) -->
              <f-input-container
                v-if="faceSideMaterialTypeValue.value === MaterialType.WOVEN"
                :label="`${$t('MI0027')}(${$t('MI0028')} ✕ ${$t('MI0029')})`"
              >
                <div class="flex flex-row items-center gap-x-3 w-full">
                  <f-input-text
                    :textValue="faceSideWarpDensity.value"
                    @update:textValue="faceSideWarpDensity.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'faceSide.construction.warpDensity'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                  <span>x</span>
                  <f-input-text
                    :textValue="faceSideWeftDensity.value"
                    @update:textValue="faceSideWeftDensity.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'faceSide.construction.weftDensity'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                </div>
              </f-input-container>

              <!-- Yarn Size (only for WOVEN materials) -->
              <f-input-container
                v-if="faceSideMaterialTypeValue.value === MaterialType.WOVEN"
                :label="`${$t('RR0023')}(${$t('MI0028')} ✕ ${$t('MI0029')})`"
              >
                <div class="flex flex-row items-center gap-x-3 w-full">
                  <f-input-text
                    :textValue="faceSideWarpYarnSize.value"
                    @update:textValue="faceSideWarpYarnSize.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'faceSide.construction.warpYarnSize'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                  <span>x</span>
                  <f-input-text
                    :textValue="faceSideWeftYarnSize.value"
                    @update:textValue="faceSideWeftYarnSize.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'faceSide.construction.weftYarnSize'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                </div>
              </f-input-container>

              <!-- Finish -->
              <f-select-input
                :selectValue="faceSideFinishList.value"
                @update:selectValue="faceSideFinishList.onInput"
                :dropdownMenuTree="inputMenu.specOptions.finishList"
                @addNew="inputMenu.addFinishOption"
                :label="$t('RR0022')"
                :placeholder="$t('MI0040')"
                :hintError="
                  materialFormService.displayErrors.value['faceSide.finishList']
                "
                multiple
                :multipleTagInputValidations="[inputValidate, lengthValidate]"
              ></f-select-input>

              <!-- Pantone Color -->
              <f-input-container :label="$t('EE0040')">
                <div class="flex flex-col gap-y-4">
                  <f-input-text
                    class="w-72"
                    v-model:textValue="pantoneColor"
                    :placeholder="$t('MI0067')"
                    :button="{
                      type: 'primary',
                      icon: 'add',
                      isFile: false,
                    }"
                    @click:button="handleAddFaceSidePantone"
                  />
                  <div class="grid gap-y-3">
                    <div
                      v-for="pantone in faceSidePantoneValueDisplayList"
                      :key="pantone.name"
                      class="flex items-center gap-x-3"
                    >
                      <f-tooltip-media
                        placement="right-end"
                        :pantone="{
                          r: pantone.r,
                          g: pantone.g,
                          b: pantone.b,
                        }"
                        :tooltipTitle="pantone.name"
                        :tooltipMessage="pantone.colorName"
                      >
                        <template #slot:tooltip-trigger>
                          <div
                            class="rounded w-5.5 h-5.5"
                            :style="{
                              backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})`,
                            }"
                          ></div>
                        </template>
                      </f-tooltip-media>
                      <p class="text-body2 text-grey-900">
                        {{ pantone.name }}
                      </p>
                      <f-svg-icon
                        iconName="clear"
                        size="20"
                        class="text-grey-250 cursor-pointer"
                        @click="removeFaceSidePantone(pantone.name)"
                      />
                    </div>
                  </div>
                </div>
              </f-input-container>
            </div>
          </div>
        </div>

        <div v-if="activeSide === 'middleSide'">
          <div class="flex flex-col gap-y-4 p-3 bg-green-50-v1 rounded-t-md">
            <!-- Info Bar -->
            <f-infobar
              class="w-full"
              :notifyType="NOTIFY_TYPE.TIPS"
              :display="DISPLAY.BLOCK"
              :title="$t('MI0045')"
              :messageText="$t('MI0046')"
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
                {{ isMiddleSideExpanded ? $t('EE0245') : $t('EE0244') }}
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
              <f-input-container :label="$t('MI0014')" required>
                <f-select-input
                  :selectValue="middleSideFeatureList.value"
                  @update:selectValue="middleSideFeatureList.onInput"
                  :dropdownMenuTree="inputMenu.specOptions.featureList"
                  @addNew="inputMenu.addFeatureOption"
                  :placeholder="$t('RR0288')"
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
              <f-input-container :label="$t('RR0593')">
                <f-select-input
                  :selectValue="middleSideFinishList.value"
                  @update:selectValue="middleSideFinishList.onInput"
                  :dropdownMenuTree="inputMenu.specOptions.finishList"
                  @addNew="inputMenu.addFinishOption"
                  :placeholder="$t('MI0040')"
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
            </div>
          </div>
        </div>

        <div v-if="activeSide === 'backSide'">
          <div class="flex flex-col gap-y-4 p-3 bg-green-50-v1 rounded-t-md">
            <!-- Material Type -->
            <f-input-container :label="$t('MI0003')" required>
              <f-select-input
                :placeholder="$t('RR0588')"
                :selectValue="backSideMaterialTypeValue.value"
                @update:selectValue="backSideMaterialTypeValue.onInput"
                :dropdownMenuTree="backSideMaterialTypeDropdownSource"
                :hintError="
                  materialFormService.displayErrors.value[
                    'backSide.materialType'
                  ]
                "
                emit-value
                map-options
                class="w-full"
              ></f-select-input>
            </f-input-container>

            <!-- Construction Type -->
            <f-input-container
              :label="$t('MI0150')"
              required
              v-if="
                backSideMaterialTypeValue.value &&
                WITH_CONSTRUCTION_TYPE_MATERIALS.includes(
                  backSideMaterialTypeValue.value
                )
              "
            >
              <f-select-input
                :placeholder="$t('MI0152')"
                :selectValue="backSideMaterialTypeConstructionValue.value?.name"
                @update:selectValue="selectBackSideMaterialTypeConstruction"
                @addNew="inputMenu.addMaterialTypeConstructionOption($event)"
                :dropdownMenuTree="backSideConstructionTypeDropdownSource"
                :hintError="
                  materialFormService.displayErrors.value[
                    'backSide.materialTypeConstruction'
                  ]
                "
                emit-value
                map-options
                class="w-full"
              ></f-select-input>
            </f-input-container>

            <!-- Content -->
            <f-input-container
              :label="$t('RR0021')"
              required
              v-if="backSideMaterialTypeValue.value != null"
              :hintError="backSideContentDisplayError"
            >
              <div
                v-for="(field, index) in backSideContentFields"
                :key="field.key"
                class="grid grid-cols-[1fr_1fr_auto] items-start gap-x-2 mt-1.5"
              >
                <f-select-input
                  :placeholder="$t('RR0591')"
                  :selectValue="field.value.name"
                  @update:selectValue="
                    selectBackSideContentName($event, index, field.value)
                  "
                  @addNew="inputMenu.addContentOption($event)"
                  :dropdownMenuTree="backSideContentNameDropdownSource"
                  :hintError="
                    materialFormService.displayErrors.value[
                      `backSide.contentList[${index}].name`
                    ]
                      ? Boolean(
                          materialFormService.displayErrors.value[
                            `backSide.contentList[${index}].name`
                          ]
                        )
                      : undefined
                  "
                  :hasError="!field.value.name"
                  emit-value
                  map-options
                ></f-select-input>
                <f-input-text
                  v-model:textValue="field.value.percentage"
                  inputType="number"
                  :placeholder="$t('MI0043')"
                  addOnRight="%"
                  :hintError="
                    materialFormService.displayErrors.value[
                      `backSide.contentList[${index}].percentage`
                    ]
                  "
                  :hasError="!field.value.percentage"
                  data-cy="content-text-value"
                ></f-input-text>
                <!-- prettier-ignore -->
                <f-svg-icon
                v-if="backSideContentFields.length > 1"
                class="text-grey-600 cursor-pointer"
                size="20"
                iconName="delete"
                @click="async () => {
                  const currentIndex = index; // Capture index
                  removeBackSideContentField(currentIndex);
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
                pushBackSideContentField({
                  contentId: null,
                  name: null,
                  percentage: '',
                })
              "
              class="text-cyan-500-v1 text-sm font-medium underline self-start !p-0"
              ><f-svg-icon iconName="add" size="24" class="text-cyan-500-v1" />
              {{ $t('RR0592') }}</f-button
            >
          </div>
          <!-- See More -->
          <div
            class="flex flex-col bg-grey-50-v1 rounded-b-md border-t border-green-200-v1"
          >
            <div class="flex justify-end items-center py-2 px-5 h-12">
              <button
                class="text-cyan-500-v1 underline text-sm font-semibold flex flex-row items-center gap-x-1"
                @click="isBackSideExpanded = !isBackSideExpanded"
              >
                {{ isBackSideExpanded ? $t('EE0245') : $t('EE0244') }}
                <f-svg-icon
                  size="24"
                  iconName="arrow_drop_down"
                  :class="{ 'rotate-180': isBackSideExpanded }"
                ></f-svg-icon>
              </button>
            </div>

            <!-- Additional Fields -->
            <div v-if="isBackSideExpanded" class="flex flex-col gap-y-4 p-3">
              <!-- Material Description -->
              <f-select-input
                :selectValue="backSideDescriptionList.value"
                @update:selectValue="backSideDescriptionList.onInput"
                :dropdownMenuTree="inputMenu.specOptions.descriptionList"
                @addNew="inputMenu.addDescriptionOption"
                :label="$t('MI0023')"
                :placeholder="$t('MI0151')"
                :hintError="
                  materialFormService.displayErrors.value[
                    'backSide.descriptionList'
                  ]
                "
                multiple
                :multipleTagInputValidations="[inputValidate, lengthValidate]"
                class="w-full"
              >
                <template #custom-not-found>
                  <custom-not-found />
                </template>
              </f-select-input>

              <!-- Density (only for WOVEN materials) -->
              <f-input-container
                v-if="backSideMaterialTypeValue.value === MaterialType.WOVEN"
                :label="`${$t('MI0027')}(${$t('MI0028')} ✕ ${$t('MI0029')})`"
              >
                <div class="flex flex-row items-center gap-x-3 w-full">
                  <f-input-text
                    :textValue="backSideWarpDensity.value"
                    @update:textValue="backSideWarpDensity.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'backSide.construction.warpDensity'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                  <span>x</span>
                  <f-input-text
                    :textValue="backSideWeftDensity.value"
                    @update:textValue="backSideWeftDensity.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'backSide.construction.weftDensity'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                </div>
              </f-input-container>

              <!-- Yarn Size (only for WOVEN materials) -->
              <f-input-container
                v-if="backSideMaterialTypeValue.value === MaterialType.WOVEN"
                :label="`${$t('RR0023')}(${$t('MI0028')} ✕ ${$t('MI0029')})`"
              >
                <div class="flex flex-row items-center gap-x-3 w-full">
                  <f-input-text
                    :textValue="backSideWarpYarnSize.value"
                    @update:textValue="backSideWarpYarnSize.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'backSide.construction.warpYarnSize'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                  <span>x</span>
                  <f-input-text
                    :textValue="backSideWeftYarnSize.value"
                    @update:textValue="backSideWeftYarnSize.onInput"
                    :hintError="
                      materialFormService.displayErrors.value[
                        'backSide.construction.weftYarnSize'
                      ]
                    "
                    :placeholder="$t('MI0030')"
                    class="flex-1"
                  />
                </div>
              </f-input-container>

              <!-- Finish -->
              <f-select-input
                :selectValue="backSideFinishList.value"
                @update:selectValue="backSideFinishList.onInput"
                :dropdownMenuTree="inputMenu.specOptions.finishList"
                @addNew="inputMenu.addFinishOption"
                :label="$t('RR0022')"
                :placeholder="$t('MI0040')"
                :hintError="
                  materialFormService.displayErrors.value['backSide.finishList']
                "
                multiple
                :multipleTagInputValidations="[inputValidate, lengthValidate]"
              ></f-select-input>

              <!-- Pantone Color -->
              <f-input-container :label="$t('EE0040')">
                <div class="flex flex-col gap-y-4">
                  <f-input-text
                    class="w-72"
                    v-model:textValue="pantoneColor"
                    :placeholder="$t('MI0067')"
                    :button="{
                      type: 'primary',
                      icon: 'add',
                      isFile: false,
                    }"
                    @click:button="handleAddBackSidePantone"
                  />
                  <div class="grid gap-y-3">
                    <div
                      v-for="pantone in backSidePantoneValueDisplayList"
                      :key="pantone.name"
                      class="flex items-center gap-x-3"
                    >
                      <f-tooltip-media
                        placement="right-end"
                        :pantone="{
                          r: pantone.r,
                          g: pantone.g,
                          b: pantone.b,
                        }"
                        :tooltipTitle="pantone.name"
                        :tooltipMessage="pantone.colorName"
                      >
                        <template #slot:tooltip-trigger>
                          <div
                            class="rounded w-5.5 h-5.5"
                            :style="{
                              backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})`,
                            }"
                          ></div>
                        </template>
                      </f-tooltip-media>
                      <p class="text-body2 text-grey-900">
                        {{ pantone.name }}
                      </p>
                      <f-svg-icon
                        iconName="clear"
                        size="20"
                        class="text-grey-250 cursor-pointer"
                        @click="removeBackSidePantone(pantone.name)"
                      />
                    </div>
                  </div>
                </div>
              </f-input-container>
            </div>
          </div>
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
import {
  NOTIFY_TYPE,
  DISPLAY,
  WITH_CONSTRUCTION_TYPE_MATERIALS,
  materialFormServiceKey,
} from '@/utils/constants'
import {
  type Material,
  type PantoneColor,
  type MaterialOptionsMaterialTypeConstructionListWoven,
  MaterialType,
  type CustomField,
} from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import FInputText from '@frontier/ui-component/src/FInput/FInputText/FInputText.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FAccordion from '@frontier/ui-component/src/FAccordion/FAccordion.vue'
import MaterialSpecificationSharedFields from './MaterialSpecificationSharedFields.vue'
import SidesTabs from './SidesTabs.vue'
import { useAssetsStore } from '@/stores/assets'
import MaterialCustomFieldsForm from './MaterialCustomFieldsForm.vue'

interface Props {
  material: Material
  pantoneList: PantoneColor[]
}

interface FaceSideContentItem {
  contentId: number | null
  name: string | null
  percentage: string
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

// Face Side Content Section
const {
  fields: faceSideContentFields,
  push: pushFaceSideContentField,
  remove: removeFaceSideContentField,
  update: updateFaceSideContentField,
} = useFieldArray<FaceSideContentItem>('faceSide.contentList')

// Face Side Bindings
const faceSideMaterialTypeValue = materialFormService.defineInputBinds(
  'faceSide.materialType'
)
const faceSideMaterialTypeConstructionValue =
  materialFormService.defineInputBinds('faceSide.materialTypeConstruction')
const faceSideDescriptionList = materialFormService.defineInputBinds(
  'faceSide.descriptionList'
)
const faceSideWarpDensity = materialFormService.defineInputBinds(
  'faceSide.construction.warpDensity'
)
const faceSideWeftDensity = materialFormService.defineInputBinds(
  'faceSide.construction.weftDensity'
)
const faceSideWarpYarnSize = materialFormService.defineInputBinds(
  'faceSide.construction.warpYarnSize'
)
const faceSideWeftYarnSize = materialFormService.defineInputBinds(
  'faceSide.construction.weftYarnSize'
)
const faceSideFinishList = materialFormService.defineInputBinds(
  'faceSide.finishList'
)
const faceSidePantoneValue = materialFormService.defineInputBinds(
  'faceSide.pantoneValue'
)

// Back Side Content Section
const {
  fields: backSideContentFields,
  push: pushBackSideContentField,
  remove: removeBackSideContentField,
  update: updateBackSideContentField,
} = useFieldArray<FaceSideContentItem>('backSide.contentList')

// Back Side Bindings
const backSideMaterialTypeValue = materialFormService.defineInputBinds(
  'backSide.materialType'
)
const backSideMaterialTypeConstructionValue =
  materialFormService.defineInputBinds('backSide.materialTypeConstruction')
const backSideDescriptionList = materialFormService.defineInputBinds(
  'backSide.descriptionList'
)
const backSideWarpDensity = materialFormService.defineInputBinds(
  'backSide.construction.warpDensity'
)
const backSideWeftDensity = materialFormService.defineInputBinds(
  'backSide.construction.weftDensity'
)
const backSideWarpYarnSize = materialFormService.defineInputBinds(
  'backSide.construction.warpYarnSize'
)
const backSideWeftYarnSize = materialFormService.defineInputBinds(
  'backSide.construction.weftYarnSize'
)
const backSideFinishList = materialFormService.defineInputBinds(
  'backSide.finishList'
)
const backSidePantoneValue = materialFormService.defineInputBinds(
  'backSide.pantoneValue'
)

// Middle Side Bindings
const middleSideFeatureList = materialFormService.defineInputBinds(
  'middleSide.featureList'
)
const middleSideFinishList = materialFormService.defineInputBinds(
  'middleSide.finishList'
)

// Face Side Dropdown Sources
const faceSideMaterialTypeDropdownSource = computed(() => {
  const options = inputMenu.materialTypeOptionList.value || []
  return {
    blockList: [
      {
        menuList: options.map((opt) => ({
          title: opt.name,
          selectValue: opt.value,
        })),
      },
    ],
  }
})

const faceSideConstructionTypeDropdownSource = computed(() => {
  return inputMenu.specOptions.materialTypeConstructionList
})

const faceSideContentNameDropdownSource = computed(() => {
  return inputMenu.specOptions.contentList
})

// Back Side Dropdown Sources
const backSideMaterialTypeDropdownSource = computed(() => {
  const options = inputMenu.materialTypeOptionList.value || []
  return {
    blockList: [
      {
        menuList: options.map((opt) => ({
          title: opt.name,
          selectValue: opt.value,
        })),
      },
    ],
  }
})

const backSideConstructionTypeDropdownSource = computed(() => {
  return inputMenu.specOptions.materialTypeConstructionList
})

const backSideContentNameDropdownSource = computed(() => {
  return inputMenu.specOptions.contentList
})

// Face Side Content Functions
const selectFaceSideContentName = (
  name: string | null,
  index: number,
  currentFieldData: FaceSideContentItem
) => {
  if (name === null || name.length === 0) {
    updateFaceSideContentField(index, {
      ...currentFieldData,
      contentId: null,
      name: null,
    })
    return
  }

  const targetContent = inputMenu.allContentList.value.find(
    (c: any) => c.name === name
  )
  if (targetContent) {
    updateFaceSideContentField(index, {
      percentage: currentFieldData.percentage,
      ...targetContent,
    })
  } else {
    updateFaceSideContentField(index, {
      ...currentFieldData,
      contentId: null,
      name: name,
    })
  }
}

const selectFaceSideMaterialTypeConstruction = (
  value:
    | string
    | MaterialOptionsMaterialTypeConstructionListWoven['default'][number]
) => {
  let newFieldValue: any

  if (typeof value === 'string') {
    newFieldValue = {
      id: null,
      isCustom: true,
      name: value,
    }
  } else {
    newFieldValue = {
      id: value.id,
      isCustom: !!value.isCustom,
      name: value.name ?? '',
      ...(typeof value === 'object' && value !== null ? value : {}),
    }
  }
  faceSideMaterialTypeConstructionValue.value.onInput(newFieldValue)
}

const faceSideContentDisplayError = computed(() => {
  const errors = []
  const generalContentError =
    materialFormService.displayErrors.value['faceSide.contentList']
  if (generalContentError) {
    errors.push(generalContentError)
  }

  for (let i = 0; i < faceSideContentFields.value.length; i++) {
    if (
      materialFormService.displayErrors.value[`faceSide.contentList[${i}].name`]
    ) {
      errors.push(
        materialFormService.displayErrors.value[
          `faceSide.contentList[${i}].name`
        ]
      )
    }
    if (
      materialFormService.displayErrors.value[
        `faceSide.contentList[${i}].percentage`
      ]
    ) {
      errors.push(
        materialFormService.displayErrors.value[
          `faceSide.contentList[${i}].percentage`
        ]
      )
    }
  }
  return errors.length ? [...new Set(errors)].join(', ') : undefined
})

// Back Side Content Functions
const selectBackSideContentName = (
  name: string | null,
  index: number,
  currentFieldData: FaceSideContentItem
) => {
  if (name === null || name.length === 0) {
    updateBackSideContentField(index, {
      ...currentFieldData,
      contentId: null,
      name: null,
    })
    return
  }

  const targetContent = inputMenu.allContentList.value.find(
    (c: any) => c.name === name
  )
  if (targetContent) {
    updateBackSideContentField(index, {
      percentage: currentFieldData.percentage,
      ...targetContent,
    })
  } else {
    updateBackSideContentField(index, {
      ...currentFieldData,
      contentId: null,
      name: name,
    })
  }
}

const selectBackSideMaterialTypeConstruction = (
  value:
    | string
    | MaterialOptionsMaterialTypeConstructionListWoven['default'][number]
) => {
  let newFieldValue: any

  if (typeof value === 'string') {
    newFieldValue = {
      id: null,
      isCustom: true,
      name: value,
    }
  } else {
    newFieldValue = {
      id: value.id,
      isCustom: !!value.isCustom,
      name: value.name ?? '',
      ...(typeof value === 'object' && value !== null ? value : {}),
    }
  }
  backSideMaterialTypeConstructionValue.value.onInput(newFieldValue)
}

const backSideContentDisplayError = computed(() => {
  const errors = []
  const generalContentError =
    materialFormService.displayErrors.value['backSide.contentList']
  if (generalContentError) {
    errors.push(generalContentError)
  }

  for (let i = 0; i < backSideContentFields.value.length; i++) {
    if (
      materialFormService.displayErrors.value[`backSide.contentList[${i}].name`]
    ) {
      errors.push(
        materialFormService.displayErrors.value[
          `backSide.contentList[${i}].name`
        ]
      )
    }
    if (
      materialFormService.displayErrors.value[
        `backSide.contentList[${i}].percentage`
      ]
    ) {
      errors.push(
        materialFormService.displayErrors.value[
          `backSide.contentList[${i}].percentage`
        ]
      )
    }
  }
  return errors.length ? [...new Set(errors)].join(', ') : undefined
})

// Pantone Functions
const faceSidePantoneValueDisplayList = computed(() => {
  const pantoneValueList = faceSidePantoneValue.value || []
  return pantoneValueList.map((p: string) => {
    const pantone = props.pantoneList.find((pant) => pant.name === p)
    return pantone || { name: p, r: 128, g: 128, b: 128, colorName: 'Unknown' }
  })
})

const backSidePantoneValueDisplayList = computed(() => {
  const pantoneValueList = backSidePantoneValue.value || []
  return pantoneValueList.map((p: string) => {
    const pantone = props.pantoneList.find((pant) => pant.name === p)
    return pantone || { name: p, r: 128, g: 128, b: 128, colorName: 'Unknown' }
  })
})

const handleAddFaceSidePantone = () => {
  if (pantoneColor.value.trim()) {
    const currentList = faceSidePantoneValue.value.value || []
    if (!currentList.includes(pantoneColor.value.trim())) {
      faceSidePantoneValue.value.onInput([
        ...currentList,
        pantoneColor.value.trim(),
      ] as any)
    }
    pantoneColor.value = ''
  }
}

const handleAddBackSidePantone = () => {
  if (pantoneColor.value.trim()) {
    const currentList = backSidePantoneValue.value.value || []
    if (!currentList.includes(pantoneColor.value.trim())) {
      backSidePantoneValue.value.onInput([
        ...currentList,
        pantoneColor.value.trim(),
      ] as any)
    }
    pantoneColor.value = ''
  }
}

const removeFaceSidePantone = (pantone: string) => {
  const currentList = faceSidePantoneValue.value.value || []
  faceSidePantoneValue.value.onInput(
    currentList.filter((p: string) => p !== pantone) as any
  )
}

const removeBackSidePantone = (pantone: string) => {
  const currentList = backSidePantoneValue.value.value || []
  backSidePantoneValue.value.onInput(
    currentList.filter((p: string) => p !== pantone) as any
  )
}

const specificationCustomFields = computed((): CustomField[] => {
  const currentMaterialType = faceSideMaterialTypeValue.value.value
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
