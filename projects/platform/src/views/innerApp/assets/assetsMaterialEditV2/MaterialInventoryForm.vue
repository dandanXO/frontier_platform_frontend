<template>
  <f-accordion
    :title="$t('RR0135')"
    class="bg-white"
    :defaultExpanded="defaultExpanded"
  >
    <div class="flex flex-col gap-y-4 p-3">
      <TCTabs v-model="activeInventoryTab" :tabs="inventoryTabsDefinition" />

      <div v-if="activeInventoryTab === 'public'">
        <div class="flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-3">
            <div class="flex flex-row items-center gap-x-1">
              <span class="text-body2 text-grey-800">{{ $t('RR0034') }}</span>
              <f-tooltip-standard :tooltipMessage="$t('MI0058')">
                <template #slot:tooltip-trigger>
                  <f-svg-icon
                    iconName="info_outline"
                    class="cursor-pointer"
                    size="14"
                  />
                </template>
              </f-tooltip-standard>
            </div>
            <div class="flex flex-row items-center gap-x-4">
              <f-input-text
                class="w-50"
                :textValue="totalInventoryQtyInY"
                disabled
                :clearable="false"
                :addOnRight="inventoryUnit"
              />
              <div class="flex items-center gap-2">
                <f-input-toggle
                  :value="isTotalPublic.value"
                  @update:value="isTotalPublic.onInput"
                />
                <span class="text-sm text-grey-900">{{ $t('MI0025') }}</span>
              </div>
            </div>
          </div>
          <f-infobar
            class="w-130"
            :notifyType="NOTIFY_TYPE.TIPS"
            :messageText="$t('MI0059')"
          />
        </div>
      </div>

      <div v-if="activeInventoryTab === 'private'" class="flex flex-col gap-5">
        <f-input-container>
          <template #slot:label>
            <div class="flex items-center gap-x-2 pb-3 text-body2 font-bold">
              <f-svg-icon iconName="table_view" size="24" />
              <span class="text-grey-900">{{ $t('RR0031') }}</span>
            </div>
          </template>
          <div class="flex flex-col gap-y-4">
            <div
              v-for="(field, index) in sampleCardsRemainingFields"
              :key="field.key"
              class="flex flex-row gap-x-3"
            >
              <div
                class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5"
              >
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.source"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].source`
                    ]
                  "
                  :label="$t('MI0061')"
                  :placeholder="$t('MI0092')"
                />
                <f-input-text
                  class="w-58"
                  v-model:textValue="field.value.qtyInPcs"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].qtyInPcs`
                    ]
                  "
                  inputType="number"
                  :label="$t('RR0037')"
                  :placeholder="$t('MI0056')"
                  :addOnRight="$t('RR0307')"
                />
                <f-input-container class="w-full" :label="$t('RR0036')">
                  <div class="flex flex-row gap-x-3 w-full">
                    <f-input-text
                      class="flex-grow"
                      v-model:textValue="field.value.shelf1"
                      :hintError="
                        displayErrors[
                          `internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf1`
                        ]
                      "
                      :placeholder="$t('MI0093')"
                    />
                    <f-input-text
                      class="flex-grow"
                      v-model:textValue="field.value.shelf2"
                      :hintError="
                        displayErrors[
                          `internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].shelf2`
                        ]
                      "
                      :placeholder="$t('MI0093')"
                    />
                  </div>
                </f-input-container>
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.location"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.sampleCardsRemainingList[${index}].location`
                    ]
                  "
                  :label="$t('RR0032')"
                  :placeholder="$t('MI0094')"
                />
              </div>
              <div class="flex justify-center items-center">
                <div
                  v-if="index === 0"
                  class="cursor-pointer"
                  @click="
                    pushSampleCardsRemainingField({
                      qtyInPcs: null,
                      location: null,
                      source: null,
                      shelf1: null,
                      shelf2: null,
                    })
                  "
                >
                  <f-svg-icon
                    class="text-grey-600"
                    size="24"
                    iconName="add_box"
                  />
                </div>
                <div
                  v-else
                  class="cursor-pointer"
                  @click="removeSampleCardsRemainingField(index)"
                >
                  <f-svg-icon
                    class="text-grey-600"
                    size="20"
                    iconName="delete"
                  />
                </div>
              </div>
            </div>
          </div>
        </f-input-container>

        <f-input-container>
          <template #slot:label>
            <div class="flex items-center gap-x-2 pb-3 text-body2 font-bold">
              <f-svg-icon iconName="table_view" size="24" />
              <span class="text-grey-900">{{ $t('RR0033') }}</span>
            </div>
          </template>
          <div class="flex flex-col gap-y-4">
            <div
              v-for="(field, index) in hangersRemainingFields"
              :key="field.key"
              class="flex items-center gap-x-3"
            >
              <div
                class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5"
              >
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.source"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.hangersRemainingList[${index}].source`
                    ]
                  "
                  :label="$t('MI0061')"
                  :placeholder="$t('MI0097')"
                />
                <f-input-text
                  class="w-58"
                  v-model:textValue="field.value.qtyInPcs"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.hangersRemainingList[${index}].qtyInPcs`
                    ]
                  "
                  inputType="number"
                  :label="$t('RR0037')"
                  :placeholder="$t('MI0056')"
                  :addOnRight="$t('RR0307')"
                />
                <f-input-container class="w-full" :label="$t('RR0036')">
                  <div class="flex flex-row gap-x-3 w-full">
                    <f-input-text
                      class="flex-grow"
                      v-model:textValue="field.value.shelf1"
                      :hintError="
                        displayErrors[
                          `internalInfo.inventoryInfo.hangersRemainingList[${index}].shelf1`
                        ]
                      "
                      :placeholder="$t('MI0093')"
                    />
                    <f-input-text
                      class="flex-grow"
                      v-model:textValue="field.value.shelf2"
                      :hintError="
                        displayErrors[
                          `internalInfo.inventoryInfo.hangersRemainingList[${index}].shelf2`
                        ]
                      "
                      :placeholder="$t('MI0093')"
                    />
                  </div>
                </f-input-container>
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.location"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.hangersRemainingList[${index}].location`
                    ]
                  "
                  :label="$t('RR0032')"
                  :placeholder="$t('MI0094')"
                />
              </div>
              <div class="flex justify-center items-center">
                <div
                  v-if="index === 0"
                  class="cursor-pointer"
                  @click="
                    pushHangersRemainingField({
                      qtyInPcs: null,
                      location: null,
                      source: null,
                      shelf1: null,
                      shelf2: null,
                    })
                  "
                >
                  <f-svg-icon
                    class="text-grey-600"
                    size="24"
                    iconName="add_box"
                  />
                </div>
                <div
                  v-else
                  class="cursor-pointer"
                  @click="removeHangersRemainingField(index)"
                >
                  <f-svg-icon
                    class="text-grey-600"
                    size="20"
                    iconName="delete"
                  />
                </div>
              </div>
            </div>
          </div>
        </f-input-container>

        <f-input-container>
          <template #slot:label>
            <div class="flex items-center gap-x-2 pb-3 text-body2 font-bold">
              <f-svg-icon iconName="table_view" size="24" />
              <span class="text-grey-900">{{ $t('RR0296') }}</span>
            </div>
          </template>
          <div class="flex flex-col gap-y-4">
            <div
              v-for="(field, index) in yardageRemainingInfoFields"
              :key="field.key"
              class="flex items-center gap-x-3"
            >
              <div
                class="flex-1 rounded-xl p-7.5 bg-grey-100 flex flex-col items-start gap-y-7.5"
              >
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.productionNo"
                  :label="$t('MI0062')"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].productionNo`
                    ]
                  "
                  :placeholder="$t('MI0095')"
                />
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.source"
                  :label="$t('MI0061')"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].source`
                    ]
                  "
                  :placeholder="$t('MI0096')"
                />
                <f-input-text
                  class="w-58"
                  v-model:textValue="field.value.roll"
                  :label="$t('MI0063')"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].roll`
                    ]
                  "
                  :placeholder="$t('MI0098')"
                />
                <f-input-text
                  class="w-58"
                  v-model:textValue="field.value.lot"
                  :label="$t('MI0064')"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].lot`
                    ]
                  "
                  :placeholder="$t('MI0099')"
                />
                <f-input-text
                  v-model:textValue="field.value.qty"
                  :label="$t('RR0037')"
                  class="w-66"
                  inputType="number"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].qty`
                    ]
                  "
                  :placeholder="$t('MI0056')"
                  :rightSelectValue="yardageRemainingInfoUnit.value"
                  @update:rightSelectValue="yardageRemainingInfoUnit.onInput"
                  :rightDropdownOption="inventoryUnitList"
                >
                  <template #slot:right-dropdown-trigger="{ selectedMenu }">
                    <p>{{ selectedMenu?.title }}</p>
                  </template>
                </f-input-text>
                <f-input-container class="w-full" :label="$t('RR0036')">
                  <div class="flex flex-row gap-x-3 w-full">
                    <f-input-text
                      class="flex-grow"
                      v-model:textValue="field.value.shelf1"
                      :hintError="
                        displayErrors[
                          `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].shelf1`
                        ]
                      "
                      :placeholder="$t('MI0093')"
                    />
                    <f-input-text
                      class="flex-grow"
                      v-model:textValue="field.value.shelf2"
                      :hintError="
                        displayErrors[
                          `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].shelf2`
                        ]
                      "
                      :placeholder="$t('MI0093')"
                    />
                  </div>
                </f-input-container>
                <f-input-text
                  class="w-full"
                  v-model:textValue="field.value.location"
                  :hintError="
                    displayErrors[
                      `internalInfo.inventoryInfo.yardageRemainingInfo.list[${index}].location`
                    ]
                  "
                  :label="$t('RR0032')"
                  :placeholder="$t('MI0094')"
                />
              </div>
              <div class="flex justify-center items-center">
                <div
                  v-if="index === 0"
                  class="cursor-pointer"
                  @click="
                    pushYardageRemainingInfoField({
                      productionNo: null,
                      location: null,
                      source: null,
                      shelf1: null,
                      shelf2: null,
                      roll: null,
                      lot: null,
                      qty: null,
                    })
                  "
                >
                  <f-svg-icon
                    class="text-grey-600"
                    size="24"
                    iconName="add_box"
                  />
                </div>
                <div
                  v-else
                  class="cursor-pointer"
                  @click="removeYardageRemainingInfoField(index)"
                >
                  <f-svg-icon
                    class="text-grey-600"
                    size="20"
                    iconName="delete"
                  />
                </div>
              </div>
            </div>
          </div>
        </f-input-container>
      </div>
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFieldArray } from 'vee-validate'
import { NOTIFY_TYPE } from '@/utils/constants'
import { materialFormServiceKey } from '@/utils/constants'
import type { MaterialFormService } from '@/types'
import { FInputText } from '@frontier/ui-component'

import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import TCTabs from '@/components/TCTabs.vue'

const props = defineProps<{
  defaultExpanded?: boolean
}>()

const { t } = useI18n()

// Inject the material form service
const materialFormService = inject(
  materialFormServiceKey
) as MaterialFormService

const {
  inputMenu,
  totalInventoryQtyInY,
  inventoryUnit,
  displayErrors,
  defineInputBinds,
} = materialFormService

// Inventory tabs
const activeInventoryTab = ref('public')
const inventoryTabsDefinition = computed(() => [
  { id: 'public', name: t('FF0030') },
  { id: 'private', name: t('FF0031') },
])

// Inventory field bindings
const isTotalPublic = defineInputBinds(
  'internalInfo.inventoryInfo.isTotalPublic'
)

// Sample Cards Remaining fields
const {
  fields: sampleCardsRemainingFields,
  push: pushSampleCardsRemainingField,
  remove: removeSampleCardsRemainingField,
} = useFieldArray<{
  source: string | null
  qtyInPcs: number | null
  shelf1: string | null
  shelf2: string | null
  location: string | null
}>('internalInfo.inventoryInfo.sampleCardsRemainingList')

// Hangers Remaining fields
const {
  fields: hangersRemainingFields,
  push: pushHangersRemainingField,
  remove: removeHangersRemainingField,
} = useFieldArray<{
  source: string | null
  qtyInPcs: number | null
  shelf1: string | null
  shelf2: string | null
  location: string | null
}>('internalInfo.inventoryInfo.hangersRemainingList')

// Yardage Remaining Info fields
const {
  fields: yardageRemainingInfoFields,
  push: pushYardageRemainingInfoField,
  remove: removeYardageRemainingInfoField,
} = useFieldArray<{
  productionNo: string | null
  source: string | null
  roll: string | null
  lot: string | null
  qty: number | null
  shelf1: string | null
  shelf2: string | null
  location: string | null
}>('internalInfo.inventoryInfo.yardageRemainingInfo.list')

const yardageRemainingInfoUnit = defineInputBinds(
  'internalInfo.inventoryInfo.yardageRemainingInfo.unit'
)

// Get inventory unit list from input menu
const { inventoryUnitList } = inputMenu

const defaultExpanded = props.defaultExpanded || false
</script>
