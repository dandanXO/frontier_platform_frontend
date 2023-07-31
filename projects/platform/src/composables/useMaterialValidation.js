import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import inputRules from '@/utils/inputRules'
import inputValidator from '@/utils/inputValidator'

/**
 * @param {ComputedRef} material
 * @param {string[]} needValidatedFieldList
 * @returns
 */
export default function useMaterialValidation(
  material,
  needValidatedFieldList
) {
  const { t } = useI18n()

  const required = (v) => inputRules.required()(v)
  const maxLength = (v, max) => inputRules()(v, max)
  const integerOnly = (v) => !!v && !Number.isInteger(v) && t('WW0007')
  const maxI6D2 = (v) =>
    !inputValidator.maxIntegerDecimal(6, 2, v) && t('WW0009')
  const maxI3D2 = (v) =>
    !inputValidator.maxIntegerDecimal(3, 2, v) && t('WW0010')
  const maxI9D1 = (v) =>
    !inputValidator.maxIntegerDecimal(9, 1, v) && t('WW0011')
  const maxI18D10 = (v) =>
    !inputValidator.maxIntegerDecimal(18, 10, v) && t('WW0012')

  const invalidation = reactive({
    materialNo: computed(() => {
      const materialNo = material.value.materialNo
      return (
        fieldHasValidatedMap.materialNo &&
        (required(materialNo) || maxLength(materialNo, 50))
      )
    }),
    width: computed(() => {
      const width = material.value.width
      return fieldHasValidatedMap.width && (required(width) || maxI6D2(width))
    }),
    weight: computed(() => {
      const weight = material.value.weight
      return (
        fieldHasValidatedMap.weight && (required(weight) || maxI6D2(weight))
      )
    }),
    weightGy: computed(() => {
      const weightGy = material.value.weightGy
      return fieldHasValidatedMap.weightGy && maxI6D2(weightGy)
    }),
    contentList: computed(() => {
      if (!fieldHasValidatedMap.contentList) {
        return false
      }

      const contentList = material.value.contentList

      if (
        new Set(contentList.map(({ name }) => name)).size !== contentList.length
      ) {
        return t('WW0089')
      }

      let total = 0
      for (let i = 0; i < contentList.length; i++) {
        const { name, percentage } = contentList[i]

        const result = required(name) || maxI3D2(percentage)

        if (result) {
          return result
        }

        total += Number(percentage)
      }
      if (Number(total.toFixed(3)) !== 100) {
        return t('WW0005')
      }

      return false
    }),
    warpYarnCount: computed(
      () =>
        fieldHasValidatedMap.warpYarnCount &&
        maxLength(material.value.warpYarnCount, 100)
    ),
    weftYarnCount: computed(
      () =>
        fieldHasValidatedMap.weftYarnCount &&
        maxLength(material.value.weftYarnCount, 100)
    ),
    warpDensity: computed(
      () =>
        fieldHasValidatedMap.warpDensity &&
        maxLength(material.value.warpDensity, 100)
    ),
    weftDensity: computed(
      () =>
        fieldHasValidatedMap.weftDensity &&
        maxLength(material.value.weftDensity, 100)
    ),
    pattern: computed(
      () =>
        fieldHasValidatedMap.pattern && maxLength(material.value.pattern, 100)
    ),
    color: computed(
      () => fieldHasValidatedMap.color && maxLength(material.value.color, 100)
    ),
    materialSeq: computed(
      () =>
        fieldHasValidatedMap.materialSeq &&
        maxLength(material.value.materialSeq, 50)
    ),
    sampleCardsRemainingQty: computed(
      () =>
        fieldHasValidatedMap.sampleCardsRemainingQty &&
        integerOnly(material.value.sampleCardsRemainingQty)
    ),
    sampleCardsLocation: computed(
      () =>
        fieldHasValidatedMap.sampleCardsLocation &&
        maxLength(material.value.sampleCardsLocation, 256)
    ),
    hangersRemainingQty: computed(
      () =>
        fieldHasValidatedMap.hangersRemainingQty &&
        integerOnly(material.value.hangersRemainingQty)
    ),
    hangersLocation: computed(
      () =>
        fieldHasValidatedMap.hangersLocation &&
        maxLength(material.value.hangersLocation, 256)
    ),
    inventoryList: computed(() => {
      if (!fieldHasValidatedMap.inventoryList) {
        return false
      }

      const inventoryList = material.value.inventoryList

      for (let i = 0; i < inventoryList.length; i++) {
        const { section, shelf, quantity } = inventoryList[i]

        const result =
          maxLength(section, 200) || maxLength(shelf, 200) || maxI9D1(quantity)

        if (result) {
          return result
        }
      }

      return false
    }),
    publicPricePrice: computed(
      () =>
        fieldHasValidatedMap.publicPricePrice &&
        maxI18D10(material.value.publicPrice.price)
    ),
    publicPriceMinimumOrderQuantity: computed(() =>
      integerOnly(material.value.publicPrice.minimumOrderQuantity)
    ),
    publicPriceMinimumContainerQuantity: computed(() =>
      integerOnly(material.value.publicPrice.minimumContainerQuantity)
    ),
    publicPriceProductionLeadTime: computed(
      () =>
        fieldHasValidatedMap.publicPriceProductionLeadTime &&
        maxLength(material.value.publicPrice.productionLeadTime, 20)
    ),
    publicPriceSampleLeadTime: computed(
      () =>
        fieldHasValidatedMap.publicPriceSampleLeadTime &&
        maxLength(material.value.publicPrice.sampleLeadTime, 20)
    ),
    privatePricePrice: computed(
      () =>
        fieldHasValidatedMap.privatePricePrice &&
        maxI18D10(material.value.privatePrice.price)
    ),
    privatePriceMinimumOrderQuantity: computed(() =>
      integerOnly(material.value.privatePrice.minimumOrderQuantity)
    ),
    privatePriceMinimumContainerQuantity: computed(() =>
      integerOnly(material.value.privatePrice.minimumContainerQuantity)
    ),
    privatePriceProductionLeadTime: computed(
      () =>
        fieldHasValidatedMap.privatePriceProductionLeadTime &&
        maxLength(material.value.privatePrice.productionLeadTime, 20)
    ),
    privatePriceSampleLeadTime: computed(
      () =>
        fieldHasValidatedMap.privatePriceSampleLeadTime &&
        maxLength(material.value.privatePrice.sampleLeadTime, 20)
    ),
  })

  const fieldHasValidatedMap = reactive({})
  Object.keys(invalidation).forEach(
    (field) => (fieldHasValidatedMap[field] = false)
  )
  const innerNeedValidatedFieldList = !needValidatedFieldList
    ? Object.keys(invalidation)
    : needValidatedFieldList

  const isInvalid = computed(() =>
    innerNeedValidatedFieldList.some((field) => !!invalidation[field])
  )

  const validate = () => {
    innerNeedValidatedFieldList.forEach(
      (field) => (fieldHasValidatedMap[field] = true)
    )
    return !isInvalid.value
  }

  return {
    invalidation,
    validate,
    isInvalid,
  }
}
