<template>
  <f-accordion
    :title="$t('RR0134')"
    class="bg-white"
    :defaultExpanded="defaultExpanded"
  >
    <div class="flex flex-col gap-y-4 p-3">
      <TCTabs v-model="activePricingTab" :tabs="pricingTabsDefinition" />
      <div v-if="activePricingTab === 'public'">
        <!-- Public Pricing Fields -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-5">
          <f-select-dropdown
            ref="publicCountryInputRef"
            class="w-full"
            :selectValue="publicPriceCountryOfOriginal.value"
            @update:selectValue="publicPriceCountryOfOriginal.onInput"
            :dropdownMenuTree="countryMenuTree"
            :label="$t('RR0042')"
            :hintError="displayErrors['priceInfo.countryOfOriginal']"
            :placeholder="$t('RR0292')"
          />
          <f-input-text
            :label="$t('RR0134')"
            :textValue="publicPricingPrice.value"
            @update:textValue="publicPricingPrice.onInput"
            inputType="bigNumber"
            :placeholder="$t('MI0055')"
            :hintError="displayErrors['priceInfo.pricing.price']"
            :leftSelectValue="publicPricingCurrencyCode.value"
            @update:leftSelectValue="publicPricingCurrencyCode.onInput"
            :leftDropdownOption="currencyList"
            :rightSelectValue="publicPricingUnit.value"
            @update:rightSelectValue="publicPricingUnit.onInput"
            :rightDropdownOption="inventoryPerUnitList"
            class="w-full"
          >
            <template #slot:left-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
            <template #slot:right-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
          </f-input-text>
          <f-input-text
            :textValue="publicPricingMinimumOrderQty.value"
            @update:textValue="publicPricingMinimumOrderQty.onInput"
            inputType="number"
            :label="$t('RR0047')"
            :placeholder="$t('MI0056')"
            class="w-full"
            :hintError="displayErrors['priceInfo.minimumOrder.qty']"
            :rightSelectValue="publicPricingMinimumOrderUnit.value"
            @update:rightSelectValue="publicPricingMinimumOrderUnit.onInput"
            :rightDropdownOption="inventoryUnitList"
          >
            <template #slot:right-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
          </f-input-text>
          <f-input-text
            :textValue="publicPricingMinimumColorQty.value"
            @update:textValue="publicPricingMinimumColorQty.onInput"
            inputType="number"
            :label="$t('RR0048')"
            :placeholder="$t('MI0056')"
            class="w-full"
            :hintError="displayErrors['priceInfo.minimumColor.qty']"
            :rightSelectValue="publicPricingMinimumColorUnit.value"
            @update:rightSelectValue="publicPricingMinimumColorUnit.onInput"
            :rightDropdownOption="inventoryUnitList"
          >
            <template #slot:right-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
          </f-input-text>
          <f-input-text
            :label="$t('RR0049')"
            :textValue="publicPricingProductionLeadTimeInDays.value"
            @update:textValue="publicPricingProductionLeadTimeInDays.onInput"
            :placeholder="$t('MI0057')"
            class="w-full"
            :hintError="displayErrors['priceInfo.productionLeadTimeInDays']"
            :addOnRight="$t('RR0050')"
          />
          <f-input-text
            :label="$t('RR0051')"
            :textValue="publicPricingSampleLeadTimeInDays.value"
            @update:textValue="publicPricingSampleLeadTimeInDays.onInput"
            :placeholder="$t('MI0057')"
            class="w-full"
            :hintError="displayErrors['priceInfo.sampleLeadTimeInDays']"
            :addOnRight="$t('RR0050')"
          />
        </div>
      </div>
      <div v-if="activePricingTab === 'private'">
        <!-- Private Pricing Fields -->
        <div class="grid grid-cols-2 gap-x-4 gap-y-5">
          <f-select-dropdown
            class="w-full"
            :selectValue="privatePriceCountryOfOriginal.value"
            @update:selectValue="privatePriceCountryOfOriginal.onInput"
            :dropdownMenuTree="countryMenuTree"
            :label="$t('RR0042')"
            :hintError="
              displayErrors['internalInfo.priceInfo.countryOfOriginal']
            "
            :placeholder="$t('RR0292')"
          />
          <f-input-text
            :label="$t('RR0134')"
            :textValue="privatePricingPrice.value"
            @update:textValue="privatePricingPrice.onInput"
            inputType="number"
            :placeholder="$t('MI0055')"
            :hintError="displayErrors['internalInfo.priceInfo.pricing.price']"
            :leftSelectValue="privatePricingCurrencyCode.value"
            @update:leftSelectValue="privatePricingCurrencyCode.onInput"
            :leftDropdownOption="currencyList"
            :rightSelectValue="privatePricingUnit.value"
            @update:rightSelectValue="privatePricingUnit.onInput"
            :rightDropdownOption="inventoryPerUnitList"
            class="w-full"
          >
            <template #slot:left-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
            <template #slot:right-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
          </f-input-text>
          <f-input-text
            :textValue="privatePricingMinimumOrderQty.value"
            @update:textValue="privatePricingMinimumOrderQty.onInput"
            inputType="number"
            :label="$t('RR0047')"
            :placeholder="$t('MI0056')"
            class="w-full"
            :hintError="
              displayErrors['internalInfo.priceInfo.minimumOrder.qty']
            "
            :rightSelectValue="privatePricingMinimumOrderUnit.value"
            @update:rightSelectValue="privatePricingMinimumOrderUnit.onInput"
            :rightDropdownOption="inventoryUnitList"
          >
            <template #slot:right-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
          </f-input-text>
          <f-input-text
            :textValue="privatePricingMinimumColorQty.value"
            @update:textValue="privatePricingMinimumColorQty.onInput"
            inputType="number"
            :label="$t('RR0048')"
            :placeholder="$t('MI0056')"
            :hintError="
              displayErrors['internalInfo.priceInfo.minimumColor.qty']
            "
            :rightSelectValue="privatePricingMinimumColorUnit.value"
            @update:rightSelectValue="privatePricingMinimumColorUnit.onInput"
            :rightDropdownOption="inventoryUnitList"
          >
            <template #slot:right-dropdown-trigger="{ selectedMenu }">
              <p>{{ selectedMenu?.title }}</p>
            </template>
          </f-input-text>
          <f-input-text
            :label="$t('RR0049')"
            :textValue="privatePricingProductionLeadTimeInDays.value"
            @update:textValue="privatePricingProductionLeadTimeInDays.onInput"
            :placeholder="$t('MI0057')"
            class="w-full"
            :hintError="
              displayErrors['internalInfo.priceInfo.productionLeadTimeInDays']
            "
            :addOnRight="$t('RR0050')"
          />
          <f-input-text
            :label="$t('RR0051')"
            :textValue="privatePricingSampleLeadTimeInDays.value"
            @update:textValue="privatePricingSampleLeadTimeInDays.onInput"
            :placeholder="$t('MI0057')"
            class="w-full"
            :hintError="
              displayErrors['internalInfo.priceInfo.sampleLeadTimeInDays']
            "
            :addOnRight="$t('RR0050')"
          />
        </div>
      </div>
      <!-- Custom Fields Accordion -->
      <material-custom-fields-form
        :fields="pricingCustomFields"
        :form-service="materialFormService"
        field-list-name="pricingList"
      />
    </div>
  </f-accordion>
</template>

<script setup lang="ts">
import { computed, ref, inject, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useFieldArray } from 'vee-validate'
import {
  type CustomField,
  CustomFieldType as FType,
} from '@frontier/platform-web-sdk'
import { materialFormServiceKey } from '@/utils/constants'
import type { MaterialFormService } from '@/types'
import FAccordion from '@frontier/ui-component/src/FAccordion/FAccordion.vue'
import FSelectDropdown from '@frontier/ui-component/src/FInput/FSelectDropdown/FSelectDropdown.vue'
import FInputText from '@frontier/ui-component/src/FInput/FInputText/FInputText.vue'
import FInputContainer from '@frontier/ui-component/src/FInput/FInputContainer/FInputContainer.vue'
import FSelectInput from '@frontier/ui-component/src/FInput/FSelectInput/FSelectInput.vue'
import TCTabs from '@/components/TCTabs.vue'
import { useAssetsStore } from '@/stores/assets'
import MaterialCustomFieldsForm from './MaterialCustomFieldsForm.vue'

const props = defineProps<{
  defaultExpanded?: boolean
  focusOnLoad?: boolean
}>()

const { t } = useI18n()
const store = useStore()
const assetsStore = useAssetsStore()
const materialOptions = ref()

// Inject material form service
const materialFormService = inject<MaterialFormService>(materialFormServiceKey)!

// Access required data from materialFormService
const { defineInputBinds, inputMenu, displayErrors } = materialFormService

const { push: pushCustomField } = useFieldArray('customFieldList.pricingList')

const publicCountryInputRef = ref<any>(null)

onMounted(async () => {
  materialOptions.value = await assetsStore.getMaterialOptions()

  if (pricingCustomFields.value.length > 0) {
    const formCustomFields =
      materialFormService.values.customFieldList?.pricingList || []
    pricingCustomFields.value.forEach((specField) => {
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

  // Focus on input field when component mounts and focusOnLoad is true
  if (props.focusOnLoad) {
    await nextTick()
    // Wait a bit more for the accordion animation to complete
    setTimeout(() => {
      if (publicCountryInputRef.value) {
        // Use the new focus method on FSelectDropdown
        if (typeof publicCountryInputRef.value.focus === 'function') {
          publicCountryInputRef.value.focus()
        }
      }
    }, 300)
  }
})

// Pricing tab state and tab definitions
const activePricingTab = ref('public') // 'public', 'private'
const pricingTabsDefinition = computed(() => [
  { id: 'public', name: t('FF0030') },
  { id: 'private', name: t('FF0031') },
])

// Pricing field bindings (reuse from BlockMaterialPricing.vue)
const publicPriceCountryOfOriginal = defineInputBinds(
  'priceInfo.countryOfOriginal'
)
const publicPricingCurrencyCode = defineInputBinds(
  'priceInfo.pricing.currencyCode'
)
const publicPricingPrice = defineInputBinds('priceInfo.pricing.price')
const publicPricingUnit = defineInputBinds('priceInfo.pricing.unit')
const publicPricingMinimumOrderQty = defineInputBinds(
  'priceInfo.minimumOrder.qty'
)
const publicPricingMinimumOrderUnit = defineInputBinds(
  'priceInfo.minimumOrder.unit'
)
const publicPricingMinimumColorQty = defineInputBinds(
  'priceInfo.minimumColor.qty'
)
const publicPricingMinimumColorUnit = defineInputBinds(
  'priceInfo.minimumColor.unit'
)
const publicPricingProductionLeadTimeInDays = defineInputBinds(
  'priceInfo.productionLeadTimeInDays'
)
const publicPricingSampleLeadTimeInDays = defineInputBinds(
  'priceInfo.sampleLeadTimeInDays'
)
const privatePriceCountryOfOriginal = defineInputBinds(
  'internalInfo.priceInfo.countryOfOriginal'
)
const privatePricingCurrencyCode = defineInputBinds(
  'internalInfo.priceInfo.pricing.currencyCode'
)
const privatePricingPrice = defineInputBinds(
  'internalInfo.priceInfo.pricing.price'
)
const privatePricingUnit = defineInputBinds(
  'internalInfo.priceInfo.pricing.unit'
)
const privatePricingMinimumOrderQty = defineInputBinds(
  'internalInfo.priceInfo.minimumOrder.qty'
)
const privatePricingMinimumOrderUnit = defineInputBinds(
  'internalInfo.priceInfo.minimumOrder.unit'
)
const privatePricingMinimumColorQty = defineInputBinds(
  'internalInfo.priceInfo.minimumColor.qty'
)
const privatePricingMinimumColorUnit = defineInputBinds(
  'internalInfo.priceInfo.minimumColor.unit'
)
const privatePricingProductionLeadTimeInDays = defineInputBinds(
  'internalInfo.priceInfo.productionLeadTimeInDays'
)
const privatePricingSampleLeadTimeInDays = defineInputBinds(
  'internalInfo.priceInfo.sampleLeadTimeInDays'
)

// Get menu options from store and inputMenu
const countryMenuTree = computed(() => store.getters['code/countryMenuTree'])
const { currencyList, inventoryUnitList, inventoryPerUnitList } = inputMenu

const pricingCustomFields = computed((): CustomField[] => {
  const currentMaterialType = materialFormService.values.faceSide?.materialType
  if (!materialOptions.value || !currentMaterialType) {
    return []
  }

  const allPricingFields =
    materialOptions.value.customFieldList?.pricingList || []

  const filteredFields = allPricingFields.filter((field: CustomField) => {
    return (
      field.customFieldId !== null &&
      (field.applyTo.length === 0 ||
        field.applyTo.includes(currentMaterialType))
    )
  })

  return filteredFields
})
</script>
