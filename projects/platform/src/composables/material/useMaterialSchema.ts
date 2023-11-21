import { z, type ZodErrorMap } from 'zod'
import i18n from '@frontier/i18n'
import {
  MaterialSideType,
  MaterialQuantityUnit,
  CurrencyCode,
  MaterialType,
  LengthUnit,
  WeightUnit,
} from '@frontier/platform-web-sdk'

const integerOnlyMessage = i18n.global.t('WW0007')
const requiredMessage = i18n.global.t('WW0002')

const nonNullErrorMap: ZodErrorMap = (_, ctx) => ({
  message: ctx.data == null ? requiredMessage : ctx.defaultError,
})

const nonNullParams = {
  errorMap: nonNullErrorMap,
}

const toCommaSeparated = (n: number) => n.toLocaleString('en-US')

const getMaxLengthParams = (qty: number) => {
  const message = i18n.global.t('MOCK00', {
    qty: toCommaSeparated(qty),
  })
  return [qty, message] as const
}

const getMaxNumberParams = (qty: number) => {
  const message = i18n.global.t('MOCK01', { qty: toCommaSeparated(qty) })
  return [qty, message] as const
}

const getMinNumberParams = (qty: number) => {
  const message = i18n.global.t('MOCK02', { qty: toCommaSeparated(qty) })
  return [qty, message] as const
}

const getMaxDecimalPlacesParams = (dp: number) => {
  const multipleOf = 10 ** -dp
  const message = i18n.global.t('MOCK03', { dp })
  return [multipleOf, message] as const
}

const useMaterialSchema = () => {
  const featureListSchema = z.array(z.string()).default([])

  const finishListSchema = z
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

  const descriptionListSchema = z
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

  const materialWovenConstructionSchema = z.object({
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

  const materialKnitConstructionSchema = z.object({
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

  const materialLeatherConstructionSchema = z.object({
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

  const materialNonWovenConstructionSchema = z.object({
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

  const materialTrimConstructionSchema = z.object({
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

  const materialConstructionSchema = materialWovenConstructionSchema
    .merge(materialKnitConstructionSchema)
    .merge(materialLeatherConstructionSchema)
    .merge(materialNonWovenConstructionSchema)
    .merge(materialTrimConstructionSchema)

  const customPropertyListSchema = z.array(
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

  const contentSchema = z.object({
    contentId: z.number().int().nullable(),
    name: z.string(nonNullParams).max(...getMaxLengthParams(100)),
    percentage: z
      .number(nonNullParams)
      .min(...getMinNumberParams(1))
      .max(...getMaxNumberParams(100))
      .multipleOf(...getMaxDecimalPlacesParams(2)),
  })

  const materialMiddleSideSchema = z.object({
    featureList: featureListSchema,
    finishList: finishListSchema,
    customPropertyList: customPropertyListSchema.default([]),
  })

  const materialSideSchema = z.object({
    featureList: featureListSchema,
    finishList: finishListSchema,
    materialType: z.nativeEnum(MaterialType).default(MaterialType.WOVEN),
    descriptionList: descriptionListSchema,
    construction: materialConstructionSchema,
    constructionCustomPropertyList: customPropertyListSchema.default([]),
    contentList: z
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
      .default([{ contentId: null, name: '', percentage: 100 }]),
    patternInfo: z.object({
      pattern: z
        .string()
        .max(...getMaxLengthParams(100))
        .nullable()
        .default(null),
      customPropertyList: customPropertyListSchema.default([]),
    }),
    colorInfo: z.object({
      color: z
        .string()
        .max(...getMaxLengthParams(100))
        .nullable()
        .default(null),
      customPropertyList: customPropertyListSchema.default([]),
    }),
    pantoneList: z
      .array(
        z
          .string(nonNullParams)
          .nonempty(requiredMessage)
          .max(...getMaxLengthParams(20))
      )
      .default([]),
  })

  const materialPriceInfoSchema = z.object({
    countryOfOriginal: z
      .string()
      .max(...getMaxLengthParams(2))
      .nullable()
      .default(null),
    pricing: z
      .object({
        currencyCode: z.nativeEnum(CurrencyCode),
        price: z
          .number()
          .min(...getMinNumberParams(0))
          .max(...getMaxNumberParams(999999999999999999.99))
          .multipleOf(...getMaxDecimalPlacesParams(2))
          .nullable(),
        unit: z.nativeEnum(MaterialQuantityUnit),
      })
      .nullable()
      .default({
        currencyCode: CurrencyCode.USD,
        price: null,
        unit: MaterialQuantityUnit.Y,
      }),
    minimumOrder: z
      .object({
        qty: z
          .number(nonNullParams)
          .int(integerOnlyMessage)
          .min(...getMinNumberParams(0))
          .nullable(),
        unit: z
          .nativeEnum(MaterialQuantityUnit)
          .default(MaterialQuantityUnit.Y),
      })
      .nullable()
      .default({
        qty: null,
        unit: MaterialQuantityUnit.Y,
      }),
    minimumColor: z
      .object({
        qty: z
          .number(nonNullParams)
          .int(integerOnlyMessage)
          .min(...getMinNumberParams(0))
          .nullable(),
        unit: z.nativeEnum(MaterialQuantityUnit),
      })
      .nullable()
      .default({
        qty: null,
        unit: MaterialQuantityUnit.Y,
      }),
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
    .min(...getMinNumberParams(1))
    .max(...getMaxNumberParams(999))
    .nullable()

  const inventoryInfoSchema = z.object({
    isTotalPublic: z.boolean().default(false),
    sampleCardsRemainingList: z
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
      ]),
    hangersRemainingList: z
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
      ]),
    yardageRemainingInfo: z
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
              .min(...getMinNumberParams(1))
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
      }),
  })

  const widthValueSchema = z
    .number(nonNullParams)
    .multipleOf(...getMaxDecimalPlacesParams(2))
    .min(...getMinNumberParams(1))
    .max(...getMaxNumberParams(999))

  const tagListSchema = z.array(z.string()).nullable().default([])

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
    seasonInfo: z.object({
      season: z
        .object({
          seasonId: z.number().int().nullable().default(null),
          name: z
            .string()
            .max(...getMaxLengthParams(10))
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
    }),
    width: z.object({
      cuttable: widthValueSchema,
      full: widthValueSchema,
      unit: z.nativeEnum(LengthUnit).default(LengthUnit.CM),
    }),
    weight: z.object({
      value: z
        .number(nonNullParams)
        .multipleOf(...getMaxDecimalPlacesParams(3))
        .min(...getMinNumberParams(1))
        .max(...getMaxNumberParams(999)),
      unit: z.nativeEnum(WeightUnit).default(WeightUnit.OZ),
    }),
    isAutoSyncFaceToBackSideInfo: z.boolean(nonNullParams).default(false),
    faceSide: materialSideSchema,
    middleSide: materialMiddleSideSchema,
    backSide: materialSideSchema,
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

  return materialSchema
}

export default useMaterialSchema
