import i18n from '@frontier/i18n'
import type {
  MaterialSeasonInfo,
  MaterialFinish,
  MaterialConstruction,
  MaterialWovenConstruction,
  MaterialKnitConstruction,
  MaterialLeatherConstruction,
  MaterialNonWovenConstruction,
  MaterialTrimConstruction,
  MaterialSideAllOfConstructionCustomPropertyListInner,
  MaterialWidth,
  MaterialWeight,
  MaterialPriceInfo,
  MaterialCarbonEmission,
  MaterialSideAllOfContentList,
} from '@frontier/platform-web-sdk'
import {
  MaterialTypeText,
  LengthUnitText,
  WeightUnitText,
} from '@/utils/enumText'
import { MaterialType, LengthUnit } from '@frontier/platform-web-sdk'
import { getNameValueMap } from '@/utils/mapping'
import store from '@/store'

const t = i18n.global.t

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
  finishList: (finishList: MaterialFinish[]) => ({
    name: t('RR0022'),
    value: finishList.map((finish) => finish.name).join(', '),
  }),
  contentList: (contentList: MaterialSideAllOfContentList[]) => ({
    name: t('RR0021'),
    value: contentList.map((content) => content.name).join(', '),
  }),
  materialType: (
    isComposite: boolean,
    materialType: { face?: MaterialType; back?: MaterialType }
  ) => {
    const stringList = []
    if (isComposite) {
      stringList.push('Composite')
    }
    if (materialType.face) {
      stringList.push(MaterialTypeText[materialType.face])
    }
    if (materialType.back) {
      stringList.push(MaterialTypeText[materialType.back])
    }
    return {
      name: t('MI0003'),
      value: stringList.join(', '),
    }
  },
  construction: (
    materialType: MaterialType,
    construction: MaterialConstruction | {}
  ) => {
    return {
      name: t('MI0026'),
      value: (() => {
        switch (materialType) {
          case MaterialType.WOVEN: {
            const { warpDensity, weftDensity, warpYarnSize, weftYarnSize } =
              (construction as MaterialWovenConstruction) ?? {}
            return {
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
          }
          case MaterialType.KNIT: {
            return getNameValueMap<Omit<MaterialKnitConstruction, 'isPublic'>>(
              {
                machineType: 'Machine Type',
                walesPerInch: 'Wales Per Inch',
                coursesPerInch: 'Courses Per Inch',
                yarnSize: 'Yarn Size',
                machineGaugeInGg: 'Machine Gauge In Gg',
              },
              (construction as MaterialKnitConstruction) ?? {}
            )
          }
          case MaterialType.LEATHER: {
            return getNameValueMap<
              Omit<MaterialLeatherConstruction, 'isPublic'>
            >(
              {
                averageSkinPerMeterSquare: 'Average Skin Per Meter Square',
                grade: 'Grade',
                tannage: 'Tannage',
                thicknessPerMm: 'Thickness Per Mm',
              },
              (construction as MaterialLeatherConstruction) ?? {}
            )
          }
          case MaterialType.NON_WOVEN: {
            return getNameValueMap<
              Omit<MaterialNonWovenConstruction, 'isPublic'>
            >(
              {
                bondingMethod: 'Bonding Method',
                thicknessPerMm: 'Thickness Per Mm',
              },
              (construction as MaterialNonWovenConstruction) ?? {}
            )
          }
          case MaterialType.TRIM: {
            return getNameValueMap<Omit<MaterialTrimConstruction, 'isPublic'>>(
              {
                outerDiameter: 'Outer Diameter',
                length: 'Length',
                thickness: 'Thickness',
                width: 'Width',
              },
              (construction as MaterialTrimConstruction) ?? {}
            )
          }
        }
      })(),
    }
  },
  constructionCustomPropertyList: (
    constructionCustomPropertyList: MaterialSideAllOfConstructionCustomPropertyListInner[]
  ) => ({
    name: t('Custom Construction'),
    value: constructionCustomPropertyList,
  }),
  width: (width: MaterialWidth | null) => ({
    name: t('RR0088'),
    value: (() => {
      if (!width) {
        return ''
      }
      const { cuttable, full } = width
      const unit =
        width.unit === LengthUnit.INCH ? '"' : LengthUnitText[width.unit]

      return `${cuttable}/${full} ${unit}`
    })(),
  }),
  weight: (weight: MaterialWeight | null) => ({
    name: 'Weight',
    value: weight ? `${weight.value} ${WeightUnitText[weight.unit]}` : '',
  }),
  priceInfo: (priceInfo: MaterialPriceInfo | null) => {
    const countryList = store.getters['code/countryList']
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
  carbonEmission: (carbonEmission: MaterialCarbonEmission) => {
    const { co2, water, land } = carbonEmission ?? {}

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
      co2: makeObj(co2, 'co2', t('RR0221'), t('RR0215'), t('RR0225'), 'RR0230'),
      water: makeObj(
        water,
        'water',
        t('RR0222'),
        t('RR0216'),
        t('RR0226'),
        'RR0231'
      ),
      land: makeObj(
        land,
        'land',
        t('RR0224'),
        t('RR0218'),
        t('RR0228'),
        'RR0233'
      ),
    }
  },
}

export default materialInfoForDisplay
