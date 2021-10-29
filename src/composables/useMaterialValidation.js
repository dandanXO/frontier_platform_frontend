import { useStore } from 'vuex'
import { ref, reactive, computed } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'

export default function useMaterialValidation () {
  const store = useStore()
  const { t } = useI18n()

  const hasValidate = ref(false)
  const material = computed(() => store.getters['material/material'])

  const required = (v) => !v && t('WW0002')
  const maxLength = (v, max) => v?.length > max && t('WW0003')
  const maxIntegerDecimal = (maxInteger, maxDecimal, v) => {
    if (!v) { return false }

    const [integer, decimal] = String(v).split('.')
    return integer?.length > maxInteger || decimal?.length > maxDecimal
  }
  const integerOnly = (v) => !!v && !Number.isInteger(v) && t('WW0007')
  const maxI6D2 = (v) => maxIntegerDecimal(6, 2, v) && t('WW0009')
  const maxI3D2 = (v) => maxIntegerDecimal(3, 2, v) && t('WW0010')
  const maxI9D1 = (v) => maxIntegerDecimal(9, 1, v) && t('WW0011')
  const maxI18D10 = (v) => maxIntegerDecimal(18, 10, v) && t('WW0012')

  const validations = reactive({
    materialNo: computed(() => {
      const materialNo = material.value.materialNo
      return hasValidate.value && (required(materialNo) || maxLength(materialNo, 50)
      )
    }),
    weight: computed(() => hasValidate.value && maxI6D2(material.value.weight)),
    contentList: computed(() => {
      if (!hasValidate.value) {
        return false
      }

      const contentList = material.value.contentList
      let total = 0
      for (let i = 0; i < contentList.length; i++) {
        const { name, percentage } = contentList[i]

        const result = required(name) || maxI3D2(percentage)

        if (result) {
          return result
        }

        total += percentage
      }
      if (total !== 100) {
        return t('WW0005')
      }

      return false
    }),
    warpYarnCount: computed(() => hasValidate.value && (maxLength(material.value.warpYarnCount, 100))),
    weftYarnCount: computed(() => hasValidate.value && (maxLength(material.value.weftYarnCount, 100))),
    warpDensity: computed(() => hasValidate.value && (maxLength(material.value.warpDensity, 100))),
    weftDensity: computed(() => hasValidate.value && (maxLength(material.value.weftDensity, 100))),
    pattern: computed(() => hasValidate.value && (maxLength(material.value.pattern, 100))),
    color: computed(() => hasValidate.value && (maxLength(material.value.color, 100))),
    materialSeq: computed(() => hasValidate.value && (maxLength(material.value.materialSeq, 50))),
    sampleCardsRemainingQty: computed(() => integerOnly(material.value.sampleCardsRemainingQty)),
    sampleCardsLocation: computed(() => hasValidate.value && (maxLength(material.value.sampleCardsLocation, 256))),
    hangersRemainingQty: computed(() => integerOnly(material.value.hangersRemainingQty)),
    hangersLocation: computed(() => hasValidate.value && (maxLength(material.value.hangersLocation, 256))),
    inventoryList: computed(() => {
      if (!hasValidate.value) {
        return false
      }

      const inventoryList = material.value.inventoryList

      for (let i = 0; i < inventoryList.length; i++) {
        const { section, shelf, quantity } = inventoryList[i]

        const result = maxLength(section, 20) || maxLength(shelf, 20) || maxI9D1(quantity)

        if (result) {
          return result
        }
      }

      return false
    }),
    publicPricePrice: computed(() => hasValidate.value && maxI18D10(material.value.publicPrice.price)),
    publicPriceMinimumOrderQuantity: computed(() => integerOnly(material.value.publicPrice.minimumOrderQuantity)),
    publicPriceMinimumContainerQuantity: computed(() => integerOnly(material.value.publicPrice.minimumContainerQuantity)),
    publicPriceProductionLeadTime: computed(() => hasValidate.value && (maxLength(material.value.publicPrice.productionLeadTime, 20))),
    publicPriceSampleLeadTime: computed(() => hasValidate.value && (maxLength(material.value.publicPrice.sampleLeadTime, 20))),
    privatePricePrice: computed(() => hasValidate.value && maxI18D10(material.value.privatePrice.price)),
    privatePriceMinimumOrderQuantity: computed(() => integerOnly(material.value.privatePrice.minimumOrderQuantity)),
    privatePriceMinimumContainerQuantity: computed(() => integerOnly(material.value.privatePrice.minimumContainerQuantity)),
    privatePriceProductionLeadTime: computed(() => hasValidate.value && (maxLength(material.value.privatePrice.productionLeadTime, 20))),
    privatePriceSampleLeadTime: computed(() => hasValidate.value && (maxLength(material.value.privatePrice.sampleLeadTime, 20)))
  })

  const validate = () => {
    hasValidate.value = true
    return Object.keys(validations).some(key => !!validations[key])
  }

  const reset = () => {
    hasValidate.value = false
  }

  return {
    validations,
    validate,
    reset
  }
}
