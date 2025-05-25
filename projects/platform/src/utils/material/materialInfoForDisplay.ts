import i18n from '@frontier/i18n'
import {
  type MaterialSeasonInfo,
  type MaterialFinish,
  type MaterialConstruction,
  type MaterialWovenConstruction,
  type MaterialKnitConstruction,
  type MaterialLeatherConstruction,
  type MaterialNonWovenConstruction,
  type MaterialTrimConstruction,
  type MaterialSideAllOfConstructionCustomPropertyList,
  type MaterialWidth,
  type MaterialWeight,
  type MaterialPriceInfo,
  type MaterialCarbonEmission,
  type MaterialSideAllOfContentList,
  type Country,
  type MaterialDescription,
  type MaterialWeightForDisplay,
  WeightUnit,
  type MaterialWeightDisplaySetting,
  type IdTextWithCustomData,
} from '@frontier/platform-web-sdk'
import {
  MaterialTypeText,
  MaterialTypeOption,
  LengthUnitText,
  WeightUnitText,
} from '@/utils/enumText'
import { MaterialType, LengthUnit } from '@frontier/platform-web-sdk'
import { getNameValueMap } from '@/utils/mapping'
import store from '@/store'
import { type QrCodePrintLabelSetting } from '@/composables/useAssets'

import { computed } from 'vue'
import { WITH_CONSTRUCTION_TYPE_MATERIALS } from '../constants'

const t = i18n.global.t

const isCustomizeWeight = computed(
  () => store.getters['permission/isTaiwanTaffetaRule']
)

const materialInfoForDisplay = {
  seasonInfo: (seasonInfo: MaterialSeasonInfo | null) => {
    let value = ''
    const { season, year } = seasonInfo ?? {}
    if (season) {
      value += `${season.name} `
    }
    if (year) {
      value += `${year}`
    }
    return {
      name: t('MI0011'),
      value,
    }
  },
  featureList: (featureList: string[]) => ({
    name: t('MI0016'),
    value: featureList.join(', '),
  }),
  constructionType: (
    materialType: MaterialType,
    constructionType: IdTextWithCustomData,
    descriptionList: MaterialDescription[]
  ) => {
    const withConstructionType =
      WITH_CONSTRUCTION_TYPE_MATERIALS.includes(materialType)
    const valueInArray =
      withConstructionType && !!constructionType.name
        ? [constructionType.name]
        : []

    if (descriptionList?.length > 0) {
      valueInArray.push(...descriptionList.map(({ name }) => name))
    }
    return {
      name: t(withConstructionType ? 'MI0150' : 'MI0023'),
      value: valueInArray.join(', '),
    }
  },
  constructionTypeOnly: (
    materialType: MaterialType,
    constructionType: IdTextWithCustomData
  ) => {
    const withConstructionType =
      WITH_CONSTRUCTION_TYPE_MATERIALS.includes(materialType)
    return {
      name: t('MI0150'),
      value: withConstructionType ? constructionType.name : undefined,
    }
  },
  finishList: (finishList: MaterialFinish[]) => ({
    name: t('RR0022'),
    value: finishList.map((finish) => finish.name).join(', '),
  }),
  contentList: (contentList: MaterialSideAllOfContentList[]) => ({
    name: t('RR0021'),
    value: contentList
      ?.map((content) => `${content.percentage}% ${content.name}`)
      .join(', '),
  }),
  materialType: (isComposite: boolean, materialType: MaterialType) => {
    const stringList = []

    if (isComposite) {
      stringList.push('Composite')
    }

    stringList.push(MaterialTypeText[materialType])

    return {
      name: t('MI0003'),
      value: stringList.join(', '),
    }
  },
  materialTypeBySetting: (
    isComposite: boolean,
    materialType: MaterialType,
    descriptionList: MaterialDescription[],
    setting: QrCodePrintLabelSetting
  ) => {
    const stringList = []

    if (setting) {
      const materialOption = setting[MaterialTypeOption[materialType]]
      if (materialOption?.isPrintMaterialType) {
        if (isComposite) {
          stringList.push('Composite')
        }
        stringList.push(MaterialTypeText[materialType])
      }

      if (
        descriptionList?.length > 0 &&
        materialOption.isPrintMaterialDescription
      ) {
        stringList.push(
          ...descriptionList.map((description) => description.name)
        )
      }
    }

    return { value: stringList.join(', ') }
  },
  construction: (
    materialType: MaterialType,
    construction: MaterialConstruction | {}
  ) => {
    return {
      name: t('MI0026'),
      value: (() => {
        type OmitIsPublic<T> = Omit<T, 'isPublic'>

        let temp: any = {}

        switch (materialType) {
          case MaterialType.WOVEN: {
            const {
              warpDensity,
              weftDensity,
              warpYarnSize,
              weftYarnSize,
              isPublic,
            } = (construction as MaterialWovenConstruction) ?? {}
            temp = {
              isPublic,
              density: {
                name: t('MI0027'),
                value:
                  warpDensity && weftDensity
                    ? `${warpDensity} X ${weftDensity}`
                    : warpDensity || weftDensity,
              },
              yarnSize: {
                name: t('RR0023'),
                value:
                  warpYarnSize && weftYarnSize
                    ? `${warpYarnSize} X ${weftYarnSize}`
                    : warpYarnSize || weftYarnSize,
              },
            }
            break
          }
          case MaterialType.KNIT: {
            temp = getNameValueMap<OmitIsPublic<MaterialKnitConstruction>>(
              {
                machineType: t('MI0031'),
                walesPerInch: t('MI0032'),
                coursesPerInch: t('MI0033'),
                yarnSize: t('RR0023'),
                machineGaugeInGg: t('MI0068'),
              },
              (construction as MaterialKnitConstruction) ?? {}
            )
            break
          }
          case MaterialType.LEATHER: {
            temp = getNameValueMap<OmitIsPublic<MaterialLeatherConstruction>>(
              {
                averageSkinPerMeterSquare: t('MI0071'),
                grade: t('MI0072'),
                tannage: t('MI0073'),
                thicknessPerMm: t('MI0074'),
              },
              (construction as MaterialLeatherConstruction) ?? {}
            )
            break
          }
          case MaterialType.NON_WOVEN: {
            temp = getNameValueMap<OmitIsPublic<MaterialNonWovenConstruction>>(
              {
                bondingMethod: t('MI0078'),
                thicknessPerMm: t('MI0074'),
              },
              (construction as MaterialNonWovenConstruction) ?? {}
            )
            break
          }
          case MaterialType.TRIM: {
            temp = getNameValueMap<OmitIsPublic<MaterialTrimConstruction>>(
              {
                outerDiameter: t('MI0079'),
                length: t('MI0080'),
                thickness: t('MI0081'),
                width: t('MI0082'),
              },
              (construction as MaterialTrimConstruction) ?? {}
            )
            break
          }
        }

        delete temp.isPublic

        if (Object.keys(temp).every((key) => !temp[key].value)) {
          return null
        }

        return temp as Record<string, { name: string; value: string }>
      })(),
    }
  },
  constructionCustomPropertyList: (
    constructionCustomPropertyList: MaterialSideAllOfConstructionCustomPropertyList[]
  ) => ({
    name: t('Custom Construction'),
    value: constructionCustomPropertyList,
  }),
  width: (width: MaterialWidth | null, onlyCuttable = false) => {
    return {
      name: t('RR0088'),
      value: (() => {
        if (!width) {
          return ''
        }
        const { cuttable, full } = width
        const unit =
          width.unit === LengthUnit.INCH
            ? '"'
            : ` ${LengthUnitText[width.unit]}`

        return onlyCuttable
          ? `${cuttable}${unit}`
          : `${cuttable}/${full}${unit}`
      })(),
    }
  },
  weight: (
    weight: MaterialWeight | null,
    weightForDisplay: MaterialWeightForDisplay,
    weightDisplaySetting: MaterialWeightDisplaySetting,
    onlyOriginWeight = false
  ) => {
    const getWeightDisplay = () => {
      if (!weight) {
        return ''
      }

      function getItemDisplay(weight: MaterialWeight) {
        return `${weight.value} ${WeightUnitText[weight.unit]}`
      }
      function getItemDisplayRounded(weight: MaterialWeight) {
        let displayValue = weight.value
        if (displayValue > 1) {
          displayValue = Math.round(displayValue)
        } else {
          displayValue = parseFloat(displayValue.toFixed(2))
        }
        return `${displayValue} ${WeightUnitText[weight.unit]}`
      }
      function getItemDisplayFloor(weight: MaterialWeight) {
        let displayValue = weight.value
        if (displayValue > 1) {
          displayValue = Math.floor(displayValue)
        } else {
          displayValue = parseFloat(displayValue.toFixed(2))
        }
        return `${displayValue} ${WeightUnitText[weight.unit]}`
      }
      const originWeightDisplay = getItemDisplay(weight)
      const computedWeightDisplay = [
        { value: weightForDisplay.weightGsm!, unit: WeightUnit.GSM },
        { value: weightForDisplay.weightOz!, unit: WeightUnit.OZ },
        { value: weightForDisplay.weightGy!, unit: WeightUnit.GY },
        { value: weightForDisplay.weightGm!, unit: WeightUnit.GM },
      ]
        .filter((w) => w.unit != weight.unit)
        .filter((w) => {
          switch (w.unit) {
            case WeightUnit.GSM:
              return weightDisplaySetting.isShowWeightGsm
            case WeightUnit.OZ:
              return weightDisplaySetting.isShowWeightOz
            case WeightUnit.GY:
              return weightDisplaySetting.isShowWeightGy
            case WeightUnit.GM:
              return weightDisplaySetting.isShowWeightGm
          }
        })
        .map(
          isCustomizeWeight.value ? getItemDisplayFloor : getItemDisplayRounded
        )
        .join(', ')
      if (computedWeightDisplay.length === 0) {
        return originWeightDisplay
      }

      return `${originWeightDisplay} (${computedWeightDisplay})`
    }
    if (onlyOriginWeight) {
      return {
        name: t('RR0015'),
        value: weight ? `${weight.value} ${WeightUnitText[weight.unit]}` : '',
      }
    }
    return {
      name: t('RR0015'),
      value: getWeightDisplay(),
    }
  },
  priceInfo: (priceInfo: MaterialPriceInfo | null) => {
    const countryList = store.getters['code/countryList'] as Country[]
    const { currencyCode, price, unit: priceUnit } = priceInfo?.pricing || {}
    const { qty: minimumOrderQty, unit: minimumOrderUnit } =
      priceInfo?.minimumOrder || {}
    const { qty: minimumColorQty, unit: minimumColorUnit } =
      priceInfo?.minimumColor || {}
    const {
      countryOfOriginal,
      productionLeadTimeInDays,
      sampleLeadTimeInDays,
    } = priceInfo || {}

    return {
      countryOfOriginal: {
        name: t('RR0042'),
        value:
          countryList.find(
            (country) => country.countryCode === countryOfOriginal
          )?.name || '',
      },
      pricing: {
        name: t('RR0134'),
        value:
          price && currencyCode && priceUnit
            ? `${price} ${currencyCode} / ${priceUnit}`
            : '',
      },
      minimumOrderQty: {
        name: t('RR0047'),
        value:
          minimumOrderQty && minimumOrderUnit
            ? `${minimumOrderQty} / ${minimumOrderUnit}`
            : '',
      },
      minimumColor: {
        name: t('RR0048'),
        value:
          minimumColorQty && minimumColorUnit
            ? `${minimumColorQty} / ${minimumColorUnit}`
            : '',
      },
      productionLeadTimeInDays: {
        name: t('RR0049'),
        value: productionLeadTimeInDays
          ? t('RR0083', { number: productionLeadTimeInDays })
          : '',
      },
      sampleLeadTimeInDays: {
        name: t('RR0051'),
        value: sampleLeadTimeInDays
          ? t('RR0083', { number: sampleLeadTimeInDays })
          : '',
      },
    }
  },
  carbonEmission: (carbonEmission: MaterialCarbonEmission | null) => {
    const { co2, water, land } = carbonEmission ?? {
      co2: null,
      water: null,
      land: null,
    }

    const makeObj = (
      value: number | null,
      icon: string,
      title: string,
      unitShort: string,
      unitLong: string,
      saveUnit: string
    ) => {
      return {
        icon,
        value,
        title,
        unitShort,
        unitLong,
        saveUnit,
      }
    }
    return {
      co2: makeObj(
        co2,
        'co2',
        t('RR0221'),
        t('RR0215'),
        t('RR0225'),
        t('RR0230')
      ),
      water: makeObj(
        water,
        'water',
        t('RR0222'),
        t('RR0216'),
        t('RR0226'),
        t('RR0231')
      ),
      land: makeObj(
        land,
        'land',
        t('RR0224'),
        t('RR0218'),
        t('RR0228'),
        t('RR0233')
      ),
    }
  },
}

export default materialInfoForDisplay
