<template lang="pug">
div(class="mb-15 grid gap-y-7.5")
  f-select-dropdown(
    class="w-100"
    :selectValue="publicPriceCountryOfOriginal.value"
    @update:selectValue="publicPriceCountryOfOriginal.onInput"
    :dropdownMenuTree="countryMenuTree"
    :label="$t('RR0042')"
    :hintError="displayErrors['priceInfo.countryOfOriginal']"
    :placeholder="$t('RR0292')"
  )
  f-input-text(
    :label="$t('RR0134')"
    :textValue="publicPricingPrice.value"
    @update:textValue="publicPricingPrice.onInput"
    inputType="number"
    :placeholder="$t('MI0055')"
    :hintError="displayErrors['priceInfo.pricing.price']"
    :leftSelectValue="publicPricingCurrencyCode.value"
    @update:leftSelectValue="publicPricingCurrencyCode.onInput"
    :leftDropdownOption="currencyList"
    :rightSelectValue="publicPricingUnit.value"
    @update:rightSelectValue="publicPricingUnit.onInput"
    :rightDropdownOption="inventoryUnitList"
    class="w-78"
  )
    template(#slot:left-dropdown-trigger="{ selectedMenu }")
      p {{ selectedMenu?.title }}
    template(#slot:right-dropdown-trigger="{ selectedMenu }")
      p {{ selectedMenu?.title }}
  f-input-text(
    :textValue="publicPricingMinimumOrderQty.value"
    @update:textValue="publicPricingMinimumOrderQty.onInput"
    inputType="number"
    :label="$t('RR0047')"
    :placeholder="$t('MI0056')"
    class="w-78"
    :hintError="displayErrors['priceInfo.minimumOrder.qty']"
    :rightSelectValue="publicPricingMinimumOrderUnit.value"
    @update:rightSelectValue="publicPricingMinimumOrderUnit.onInput"
    :rightDropdownOption="inventoryUnitList"
  )
    template(#slot:right-dropdown-trigger="{ selectedMenu }")
      p {{ selectedMenu?.title }}
  f-input-text(
    :textValue="publicPricingMinimumColorQty.value"
    @update:textValue="publicPricingMinimumColorQty.onInput"
    inputType="number"
    :label="$t('RR0048')"
    :placeholder="$t('MI0056')"
    class="w-78"
    :hintError="displayErrors['priceInfo.minimumColor.qty']"
    :rightSelectValue="publicPricingMinimumColorUnit.value"
    @update:rightSelectValue="publicPricingMinimumColorUnit.onInput"
    :rightDropdownOption="inventoryUnitList"
  )
    template(#slot:right-dropdown-trigger="{ selectedMenu }")
      p {{ selectedMenu?.title }}
  f-input-text(
    :label="$t('RR0049')"
    :textValue="publicPricingProductionLeadTimeInDays.value"
    @update:textValue="publicPricingProductionLeadTimeInDays.onInput"
    :placeholder="$t('RR0051')"
    class="w-78"
    :hintError="displayErrors['priceInfo.productionLeadTimeInDays']"
    :addOnRight="$t('RR0050')"
  )
  f-input-text(
    :label="$t('RR0051')"
    :textValue="publicPricingSampleLeadTimeInDays.value"
    @update:textValue="publicPricingSampleLeadTimeInDays.onInput"
    :placeholder="$t('RR0051')"
    class="w-78"
    :hintError="displayErrors['priceInfo.sampleLeadTimeInDays']"
    :addOnRight="$t('RR0050')"
  )
  div(v-if="!onlyPublic" class="bg-grey-50 rounded px-15 py-12.5 grid gap-y-7.5")
    h6(class="text-h6 text-grey-600 font-bold") {{ $t('RR0289') }}
    f-select-dropdown(
      class="w-100"
      :selectValue="privatePriceCountryOfOriginal.value"
      @update:selectValue="privatePriceCountryOfOriginal.onInput"
      :dropdownMenuTree="countryMenuTree"
      :label="$t('RR0042')"
      :hintError="displayErrors['internalInfo.priceInfo.countryOfOriginal']"
      :placeholder="$t('RR0292')"
    )
    f-input-text(
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
      :rightDropdownOption="inventoryUnitList"
      class="w-78"
    )
      template(#slot:left-dropdown-trigger="{ selectedMenu }")
        p {{ selectedMenu?.title }}
      template(#slot:right-dropdown-trigger="{ selectedMenu }")
        p {{ selectedMenu?.title }}
    f-input-text(
      :textValue="privatePricingMinimumOrderQty.value"
      @update:textValue="privatePricingMinimumOrderQty.onInput"
      inputType="number"
      :label="$t('RR0047')"
      :placeholder="$t('MI0056')"
      class="w-78"
      :hintError="displayErrors['internalInfo.priceInfo.minimumOrder.qty']"
      :rightSelectValue="privatePricingMinimumOrderUnit.value"
      @update:rightSelectValue="privatePricingMinimumOrderUnit.onInput"
      :rightDropdownOption="inventoryUnitList"
    )
      template(#slot:right-dropdown-trigger="{ selectedMenu }")
        p {{ selectedMenu?.title }}
    f-input-text(
      :textValue="privatePricingMinimumColorQty.value"
      @update:textValue="privatePricingMinimumColorQty.onInput"
      inputType="number"
      :label="$t('RR0048')"
      :placeholder="$t('MI0056')"
      :hintError="displayErrors['internalInfo.priceInfo.minimumColor.qty']"
      :rightSelectValue="privatePricingMinimumColorUnit.value"
      @update:rightSelectValue="privatePricingMinimumColorUnit.onInput"
      :rightDropdownOption="inventoryUnitList"
      class="w-78"
    )
      template(#slot:right-dropdown-trigger="{ selectedMenu }")
        p {{ selectedMenu?.title }}
    f-input-text(
      :label="$t('RR0049')"
      :textValue="privatePricingProductionLeadTimeInDays.value"
      @update:textValue="privatePricingProductionLeadTimeInDays.onInput"
      :placeholder="$t('MI0057')"
      class="w-78"
      :hintError="displayErrors['internalInfo.priceInfo.productionLeadTimeInDays']"
      :addOnRight="$t('RR0050')"
    )
    f-input-text(
      :label="$t('RR0051')"
      :textValue="privatePricingSampleLeadTimeInDays.value"
      @update:textValue="privatePricingSampleLeadTimeInDays.onInput"
      :placeholder="$t('MI0057')"
      class="w-78"
      :hintError="displayErrors['internalInfo.priceInfo.sampleLeadTimeInDays']"
      :addOnRight="$t('RR0050')"
    )
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStore } from 'vuex'
import type { MaterialFormService } from '@/types'
import { materialFormServiceKey } from '@/utils/constants'

withDefaults(
  defineProps<{
    onlyPublic: boolean
  }>(),
  {
    onlyPublic: false,
  }
)

const store = useStore()

const materialFormService = inject<MaterialFormService>(materialFormServiceKey)
if (!materialFormService) {
  throw new Error('useMaterialForm is not provided')
}
const { defineInputBinds, displayErrors, inputMenu } = materialFormService
const { currencyList, inventoryUnitList } = inputMenu

const countryMenuTree = computed(() => store.getters['code/countryMenuTree'])

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
</script>
