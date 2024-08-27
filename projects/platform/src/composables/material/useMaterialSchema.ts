import { z, type RefinementCtx, type ZodErrorMap } from 'zod'
import i18n from '@frontier/i18n'
import {
  MaterialSideType,
  MaterialQuantityUnit,
  CurrencyCode,
  MaterialType,
  LengthUnit,
  WeightUnit,
} from '@frontier/platform-web-sdk'
import BigNumber from 'bignumber.js'
import { WITH_CONSTRUCTION_TYPE_MATERIALS } from '@/utils/constants'

const integerOnlyMessage = i18n.global.t('WW0007')
export const requiredMessage = i18n.global.t('WW0002')

// https://github.com/colinhacks/zod/discussions/1953
export function getDefaults<T extends z.ZodTypeAny>(
  schema: z.AnyZodObject | z.ZodEffects<any>
): z.infer<T> {
  // Check if it's a ZodEffect
  if (schema instanceof z.ZodEffects) {
    // Check if it's a recursive ZodEffect
    if (schema.innerType() instanceof z.ZodEffects)
      return getDefaults(schema.innerType())
    // return schema inner shape as a fresh zodObject
    return getDefaults(z.ZodObject.create(schema.innerType().shape))
  }

  function getDefaultValue(schema: z.ZodTypeAny): unknown {
    if (schema instanceof z.ZodDefault) return schema._def.defaultValue()
    // return an empty array if it is
    if (schema instanceof z.ZodArray) return []
    // return an empty string if it is
    if (schema instanceof z.ZodString) return ''
    // return an content of object recursivly
    if (schema instanceof z.ZodObject) return getDefaults(schema)

    if (!('innerType' in schema._def)) return undefined
    return getDefaultValue(schema._def.innerType)
  }

  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      return [key, getDefaultValue(value)]
    })
  )
}

const nonNullErrorMap: ZodErrorMap = (_, ctx) => ({
  message: ctx.data == null ? requiredMessage : ctx.defaultError,
})

const nonNullParams = {
  errorMap: nonNullErrorMap,
}

const toCommaSeparated = (
  n: number | string | BigNumber,
  decimalPlaces: number = 0
) => {
  const bigNumberValue = new BigNumber(n)
  return bigNumberValue.toFormat(decimalPlaces)
}

const getMaxLengthParams = (qty: number) => {
  const message = i18n.global.t('WW0149', {
    number: toCommaSeparated(qty),
  })
  return [qty, message] as const
}

const getMaxNumberParams = (
  qty: number | string | BigNumber,
  decimalPlaces?: number
) => {
  const bigQty = new BigNumber(qty)
  const message = i18n.global.t('WW0153', {
    maxNum: toCommaSeparated(bigQty, decimalPlaces),
  })
  const numberQty = BigNumber.isBigNumber(qty) ? qty.toNumber() : Number(qty)
  return [numberQty, message] as const
}

const getCanNotExceedNumberParams = (qty: number) => {
  const message = i18n.global.t('WW0155', { number: toCommaSeparated(qty) })
  return [qty, message] as const
}

const getMinNumberParams = (qty: number, decimalPlaces?: number) => {
  const message = i18n.global.t('WW0143', {
    minNum: toCommaSeparated(qty, decimalPlaces),
  })
  return [qty, message] as const
}

const getMinExclusiveNumberParams = (qty: number) => {
  const message = i18n.global.t('WW0154', { number: toCommaSeparated(qty) })
  return [qty, message] as const
}

const getMaxDecimalPlacesParams = (dp: number) => {
  const multipleOf = 10 ** -dp
  const message = i18n.global.t('WW0152', { number: dp })
  return [multipleOf, message] as const
}

export const featureListSchema = z.array(z.string().max(500)).default([])

export const tagListSchema = z.array(z.string().max(500)).default([])

export const finishListSchema = z
  .array(
    z.object({
      finishId: z.number().int(integerOnlyMessage).nullable(),
      name: z
        .string()
        .max(...getMaxLengthParams(500))
        .nullable(),
    })
  )
  .default([])
export const descriptionListSchema = z
  .array(
    z.object({
      descriptionId: z.number().int(integerOnlyMessage).nullable(),
      name: z
        .string()
        .max(...getMaxLengthParams(50))
        .nullable(),
    })
  )
  .default([])

export const materialWovenConstructionSchema = z.object({
  isPublic: z.boolean(nonNullParams).default(false),
  warpDensity: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
  weftDensity: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
  warpYarnSize: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
  weftYarnSize: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
})

export const materialKnitConstructionSchema = z.object({
  isPublic: z.boolean(nonNullParams).default(false),
  machineType: z
    .string()
    .max(...getMaxLengthParams(20))
    .nullable()
    .default(null),
  walesPerInch: z
    .number()
    .int(integerOnlyMessage)
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(999))
    .nullable()
    .default(null),
  coursesPerInch: z
    .number()
    .int(integerOnlyMessage)
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(999))
    .nullable()
    .default(null),
  yarnSize: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
  machineGaugeInGg: z
    .number()
    .int(integerOnlyMessage)
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(999))
    .nullable()
    .default(null),
})

export const materialLeatherConstructionSchema = z.object({
  isPublic: z.boolean(nonNullParams).default(false),
  averageSkinPerMeterSquare: z
    .string()
    .max(...getMaxLengthParams(20))
    .nullable()
    .default(null),
  grade: z
    .string()
    .max(...getMaxLengthParams(20))
    .nullable()
    .default(null),
  tannage: z
    .string()
    .max(...getMaxLengthParams(20))
    .nullable()
    .default(null),
  thicknessPerMm: z
    .number()
    .int(integerOnlyMessage)
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(999))
    .nullable()
    .default(null),
})

export const materialNonWovenConstructionSchema = z.object({
  isPublic: z.boolean(nonNullParams).default(false),
  bondingMethod: z
    .string()
    .max(...getMaxLengthParams(50))
    .nullable()
    .default(null),
  thicknessPerMm: z
    .number()
    .int(integerOnlyMessage)
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(999))
    .nullable()
    .default(null),
})

export const materialTrimConstructionSchema = z.object({
  isPublic: z.boolean(nonNullParams).default(false),
  outerDiameter: z
    .string()
    .max(...getMaxLengthParams(50))
    .nullable()
    .default(null),
  length: z
    .string()
    .max(...getMaxLengthParams(50))
    .nullable()
    .default(null),
  thickness: z
    .string()
    .max(...getMaxLengthParams(50))
    .nullable()
    .default(null),
  width: z
    .string()
    .max(...getMaxLengthParams(50))
    .nullable()
    .default(null),
})

export const materialConstructionSchema = materialWovenConstructionSchema
  .merge(materialKnitConstructionSchema)
  .merge(materialLeatherConstructionSchema)
  .merge(materialNonWovenConstructionSchema)
  .merge(materialTrimConstructionSchema)

export const customPropertyListSchema = z.array(
  z.object({
    isPublic: z.boolean(nonNullParams).default(false),
    name: z
      .string(nonNullParams)
      .nonempty(requiredMessage)
      .max(...getMaxLengthParams(15))
      .default(''),
    value: z
      .string(nonNullParams)
      .nonempty(requiredMessage)
      .max(...getMaxLengthParams(50))
      .default(''),
  })
)

export const contentSchema = z.object({
  contentId: z.number().int().nullable(),
  name: z
    .string(nonNullParams)
    .nonempty(requiredMessage)
    .max(...getMaxLengthParams(100)),
  percentage: z
    .number(nonNullParams)
    .gt(...getMinExclusiveNumberParams(0))
    .max(...getCanNotExceedNumberParams(100))
    .multipleOf(...getMaxDecimalPlacesParams(2)),
})

export const contentListSchema = z
  .array(contentSchema)
  .refine(
    (val) => {
      const contentNameList = val.map((item) => item.name)
      return new Set(contentNameList).size === contentNameList.length
    },
    { message: i18n.global.t('WW0089') }
  )
  .refine(
    (val) => {
      const total = val.reduce((acc, cur) => {
        const { percentage = 0 } = cur
        return acc + Number(percentage)
      }, 0)
      return Number(total.toFixed(3)) === 100
    },
    { message: i18n.global.t('WW0005') }
  )
  .nullable()
  .default([{ contentId: null, name: '', percentage: null }])

export const materialMiddleSideSchema = z.object({
  featureList: featureListSchema,
  finishList: finishListSchema,
  customPropertyList: customPropertyListSchema.default([]),
})

export const patternInfoSchema = z.object({
  pattern: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
  customPropertyList: customPropertyListSchema.default([]),
})

export const colorInfoSchema = z.object({
  color: z
    .string()
    .max(...getMaxLengthParams(100))
    .nullable()
    .default(null),
  customPropertyList: customPropertyListSchema.default([]),
})

export const materialTypeSchema = z
  .nativeEnum(MaterialType, nonNullParams)
  .default(MaterialType.WOVEN)

export const MATERIAL_TYPE_CONSTRUCTION_NAME_MAX_LENGTH = 50

const materialTypeConstructionSchema = z
  .object({
    id: z.number().nullable(),
    isCustom: z.boolean(),
    name: z
      .string()
      .max(...getMaxLengthParams(MATERIAL_TYPE_CONSTRUCTION_NAME_MAX_LENGTH)),
  })
  .default({ id: null, isCustom: false, name: '' })

export const materialSideSchema = z.object({
  featureList: featureListSchema,
  finishList: finishListSchema,
  materialType: materialTypeSchema,
  descriptionList: descriptionListSchema,
  construction: materialConstructionSchema,
  materialTypeConstruction: materialTypeConstructionSchema,
  constructionCustomPropertyList: customPropertyListSchema.default([]),
  contentList: contentListSchema,
  patternInfo: patternInfoSchema,
  colorInfo: colorInfoSchema,
  pantoneNameList: z
    .array(
      z
        .string(nonNullParams)
        .nonempty(requiredMessage)
        .max(...getMaxLengthParams(20))
    )
    .default([]),
})
export const materialSideWithoutTypeConstructionSchema =
  materialSideSchema.omit({
    materialTypeConstruction: true,
  })

export const validateMaterialTypeConstruction = (
  side: string,
  {
    materialTypeConstruction,
    materialType,
  }: z.infer<typeof materialSideSchema>,
  ctx: RefinementCtx
) => {
  if (WITH_CONSTRUCTION_TYPE_MATERIALS.includes(materialType)) {
    if (!materialTypeConstruction.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: 'string',
        inclusive: true,
        path: [side, 'materialTypeConstruction'],
        message: requiredMessage,
      })
    }
    if (
      materialTypeConstruction.name.length >
      MATERIAL_TYPE_CONSTRUCTION_NAME_MAX_LENGTH
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: MATERIAL_TYPE_CONSTRUCTION_NAME_MAX_LENGTH,
        type: 'string',
        inclusive: true,
        path: [side, 'materialTypeConstruction'],
        message: getMaxLengthParams(
          MATERIAL_TYPE_CONSTRUCTION_NAME_MAX_LENGTH
        )[1],
      })
    }
  }
}

const PRICE_MAX_VALUE = '999999999999999999.99'
export const priceSchema = z
  .union([z.string(), z.number()])
  .superRefine((value, ctx) => {
    if (
      value &&
      value !== 'null' &&
      !new BigNumber(value).lte(PRICE_MAX_VALUE)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: getMaxNumberParams(PRICE_MAX_VALUE)[1],
      })
    }
  })
  .nullable()
  .optional()

  .transform((value) =>
    value !== null && value !== undefined ? String(value) : value
  )

export const currencyCodeSchema = z
  .nativeEnum(CurrencyCode)
  .default(CurrencyCode.USD)

export const materialQuantityUnitSchema = z
  .nativeEnum(MaterialQuantityUnit)
  .default(MaterialQuantityUnit.Y)

export const pricingSchema = z
  .object({
    currencyCode: currencyCodeSchema.optional().nullable(),
    price: priceSchema.optional().nullable(),
    unit: materialQuantityUnitSchema.optional().nullable(),
  })
  .default({
    currencyCode: CurrencyCode.USD,
    price: null,
    unit: MaterialQuantityUnit.Y,
  })
  .nullable()
  .optional()

export const minimumQtySchema = z
  .number(nonNullParams)
  .int(integerOnlyMessage)
  .min(...getMinNumberParams(0))
  .max(...getMaxNumberParams(999999))
  .nullable()

export const minimumOrderSchema = z
  .object({
    qty: minimumQtySchema,
    unit: materialQuantityUnitSchema,
  })
  .nullable()
  .default({
    qty: null,
    unit: MaterialQuantityUnit.Y,
  })

export const minimumColorSchema = z
  .object({
    qty: minimumQtySchema,
    unit: materialQuantityUnitSchema,
  })
  .nullable()
  .default({
    qty: null,
    unit: MaterialQuantityUnit.Y,
  })

const materialPriceInfoSchema = z.object({
  countryOfOriginal: z
    .string()
    .max(...getMaxLengthParams(2))
    .nullable()
    .default(null),
  pricing: pricingSchema,
  minimumOrder: minimumOrderSchema,
  minimumColor: minimumColorSchema,
  productionLeadTimeInDays: z
    .string()
    .max(...getMaxLengthParams(10))
    .nullable()
    .default(null),
  sampleLeadTimeInDays: z
    .string()
    .max(...getMaxLengthParams(10))
    .nullable()
    .default(null),
})

const shelfSchema = z
  .string()
  .max(...getMaxLengthParams(50))
  .nullable()

const locationSchema = z
  .string()
  .max(...getMaxLengthParams(50))
  .nullable()

const sourceSchema = z
  .string()
  .max(...getMaxLengthParams(50))
  .nullable()

const qtyInPcsSchema = z
  .number()
  .int(integerOnlyMessage)
  .min(...getMinNumberParams(0))
  .max(...getMaxNumberParams(999))
  .nullable()

export const sampleCardsRemainingListSchema = z
  .array(
    z.object({
      source: sourceSchema,
      shelf1: shelfSchema,
      shelf2: shelfSchema,
      location: locationSchema,
      qtyInPcs: qtyInPcsSchema,
    })
  )
  .nullable()
  .default([
    {
      source: null,
      shelf1: null,
      shelf2: null,
      location: null,
      qtyInPcs: null,
    },
  ])

export const yardageRemainingInfoSchema = z
  .object({
    list: z.array(
      z.object({
        source: sourceSchema,
        shelf1: shelfSchema,
        shelf2: shelfSchema,
        location: locationSchema,
        productionNo: z
          .string()
          .max(...getMaxLengthParams(50))
          .nullable(),
        roll: z
          .string()
          .max(...getMaxLengthParams(10))
          .nullable(),
        lot: z
          .string()
          .max(...getMaxLengthParams(10))
          .nullable(),
        qty: z
          .number()
          .min(...getMinNumberParams(0))
          .max(...getMaxNumberParams(999999))
          .multipleOf(...getMaxDecimalPlacesParams(2))
          .nullable(),
      })
    ),
    unit: z.nativeEnum(MaterialQuantityUnit),
  })
  .nullable()
  .default({
    list: [
      {
        source: null,
        shelf1: null,
        shelf2: null,
        location: null,
        productionNo: null,
        roll: null,
        lot: null,
        qty: null,
      },
    ],
    unit: MaterialQuantityUnit.Y,
  })

export const inventoryInfoSchema = z.object({
  isTotalPublic: z.boolean().default(false),
  sampleCardsRemainingList: sampleCardsRemainingListSchema,
  hangersRemainingList: sampleCardsRemainingListSchema,
  yardageRemainingInfo: yardageRemainingInfoSchema,
})

export const seasonInfoSchema = z.object({
  season: z
    .object({
      seasonId: z.number().int().nullable().default(null),
      name: z
        .string()
        .max(...getMaxLengthParams(50))
        .nullable()
        .default(null),
    })
    .nullable()
    .default(null),
  year: z
    .number(nonNullParams)
    .int(integerOnlyMessage)
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(9999))
    .nullable()
    .default(null),
  isPublic: z.boolean(nonNullParams).default(false),
})

export const widthValueSchema = z
  .number(nonNullParams)
  .multipleOf(...getMaxDecimalPlacesParams(2))
  .min(...getMinNumberParams(1, 2))
  .max(...getMaxNumberParams(999, 2))

export const materialWidthSchema = z.object({
  cuttable: widthValueSchema,
  full: widthValueSchema,
  unit: z.nativeEnum(LengthUnit, nonNullParams).default(LengthUnit.INCH),
})

export const materialWeightSchema = z.object({
  value: z
    .number(nonNullParams)
    .multipleOf(...getMaxDecimalPlacesParams(3))
    .min(...getMinNumberParams(1, 2))
    .max(...getMaxNumberParams(99999, 3)),
  unit: z.nativeEnum(WeightUnit, nonNullParams).default(WeightUnit.GSM),
})

export const weightDisplaySettingSchema = z
  .object({
    isShowWeightGsm: z.boolean(),
    isShowWeightOz: z.boolean(),
    isShowWeightGy: z.boolean(),
    isShowWeightGm: z.boolean(),
  })
  .default({
    isShowWeightGsm: true,
    isShowWeightOz: false,
    isShowWeightGy: false,
    isShowWeightGm: false,
  })
// 簡易編輯需要 跳過 寬度和重量的檢查 因此 寫一個新的可以放入null
export const inventoryMaterialWidthSchema = z.object({
  cuttable: z.number().nullable().default(0),
  full: z.number().nullable().default(0),
  unit: z.nativeEnum(LengthUnit, nonNullParams).default(LengthUnit.INCH),
})
// 簡易編輯需要 跳過 寬度和重量的檢查 因此 寫一個新的可以放入null
export const inventoryMaterialWeightSchema = z.object({
  value: z
    .number()
    .multipleOf(...getMaxDecimalPlacesParams(3))
    .min(...getMinNumberParams(0))
    .max(...getMaxNumberParams(99999, 3))
    .nullable()
    .default(0),
  unit: z.nativeEnum(WeightUnit, nonNullParams).default(WeightUnit.GSM),
})
export const useMaterialInventorySchema = () => {
  const schema = z.object({
    width: inventoryMaterialWidthSchema,
    weight: inventoryMaterialWeightSchema,
    internalInfo: z.object({
      tagList: tagListSchema,
      remark: z
        .string()
        .max(...getMaxLengthParams(2500))
        .nullable()
        .default(null),
      priceInfo: materialPriceInfoSchema,
      inventoryInfo: inventoryInfoSchema,
      nativeCode: z
        .string()
        .max(...getMaxLengthParams(50))
        .nullable()
        .default(null),
    }),
  })

  return schema
}
export const useMaterialPublicPriceSchema = () => {
  const schema = z.object({
    priceInfo: materialPriceInfoSchema,
  })

  return schema
}
export const useMaterialTagSchema = () => {
  const schema = z.object({
    internalInfo: z.object({
      tagList: tagListSchema,
      remark: z
        .string()
        .max(...getMaxLengthParams(2500))
        .nullable()
        .default(null),
      priceInfo: materialPriceInfoSchema,
      inventoryInfo: inventoryInfoSchema,
      nativeCode: z
        .string()
        .max(...getMaxLengthParams(50))
        .nullable()
        .default(null),
    }),
    tagInfo: z.object({
      tagList: tagListSchema,
      certificationTagIdList: z.array(z.number().int()).nullable().default([]),
    }),
  })

  return schema
}
const useMaterialSchema = (uploadExcel?: boolean) => {
  const sideSchema = uploadExcel
    ? materialSideWithoutTypeConstructionSchema
    : materialSideSchema

  const materialSchema = z.object({
    itemNo: z
      .string(nonNullParams)
      .nonempty(requiredMessage)
      .max(...getMaxLengthParams(50))
      .default(''),
    isDoubleSide: z.boolean(nonNullParams).default(false),
    sideType: z
      .nativeEnum(MaterialSideType)
      .nullable()
      .default(MaterialSideType.FACE_SIDE),
    isComposite: z.boolean(nonNullParams).default(false),
    seasonInfo: seasonInfoSchema,
    width: materialWidthSchema,
    weight: materialWeightSchema,
    weightDisplaySetting: weightDisplaySettingSchema,
    isAutoSyncFaceToBackSideInfo: z.boolean(nonNullParams).default(false),
    faceSide: sideSchema.nullable().default(getDefaults(sideSchema)),
    middleSide: materialMiddleSideSchema
      .nullable()
      .default(getDefaults(materialMiddleSideSchema)),
    backSide: sideSchema.nullable().default(getDefaults(sideSchema)),
    tagInfo: z.object({
      tagList: tagListSchema,
      certificationTagIdList: z.array(z.number().int()).nullable().default([]),
    }),
    priceInfo: materialPriceInfoSchema,
    internalInfo: z.object({
      tagList: tagListSchema,
      remark: z
        .string()
        .max(...getMaxLengthParams(2500))
        .nullable()
        .default(null),
      priceInfo: materialPriceInfoSchema,
      inventoryInfo: inventoryInfoSchema,
      nativeCode: z
        .string()
        .max(...getMaxLengthParams(50))
        .nullable()
        .default(null),
    }),
  })

  materialSchema.superRefine(
    ({ faceSide, backSide, isComposite, isDoubleSide }, ctx) => {
      if (!faceSide || uploadExcel) {
        return
      }

      validateMaterialTypeConstruction(
        'faceSide',
        faceSide as z.infer<typeof materialSideSchema>,
        ctx
      )

      if (isComposite && isDoubleSide && backSide) {
        validateMaterialTypeConstruction(
          'backSide',
          backSide as z.infer<typeof materialSideSchema>,
          ctx
        )
      }
    }
  )

  return materialSchema
}

export default useMaterialSchema
