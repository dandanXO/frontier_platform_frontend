import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PaginationReqSortEnum,
  LengthUnit,
  WeightUnit,
  MaterialType,
  AssetsFilterStatusEnum,
  MaterialQuantityUnit,
  MaterialSideType,
  CurrencyCode,
} from '@frontier/platform-web-sdk'

const useEnumText = () => {
  const { t } = useI18n()

  const lengthUnitText = computed<{ [key in LengthUnit]: string }>(() => {
    return {
      [LengthUnit.CM]: t('EE0099'),
      [LengthUnit.INCH]: t('RR0020'),
    }
  })

  const weightUnitText = computed<{ [key in WeightUnit]: string }>(() => {
    return {
      [WeightUnit.GSM]: t('RR0016'),
      [WeightUnit.OZ]: t('RR0017'),
      [WeightUnit.GY]: t('RR0018'),
      [WeightUnit.GM]: t('RR0315'),
    }
  })

  const materialQuantityText = computed<{
    [key in MaterialQuantityUnit]: string
  }>(() => {
    return {
      [MaterialQuantityUnit.Y]: t('RR0039'),
      [MaterialQuantityUnit.M]: t('RR0040'),
      [MaterialQuantityUnit.KG]: t('RR0041'),
    }
  })

  const materialPerQuantityText = computed<{
    [key in MaterialQuantityUnit]: string
  }>(() => {
    return {
      [MaterialQuantityUnit.Y]: `/${t('RR0039')}`,
      [MaterialQuantityUnit.M]: `/${t('RR0040')}`,
      [MaterialQuantityUnit.KG]: `/${t('RR0041')}`,
    }
  })

  const materialTypeText = computed<{ [key in MaterialType]: string }>(() => {
    return {
      [MaterialType.WOVEN]: t('RR0091'),
      [MaterialType.KNIT]: t('RR0092'),
      [MaterialType.LEATHER]: t('MI0018'),
      [MaterialType.NON_WOVEN]: t('MI0020'),
      [MaterialType.TRIM]: t('MI0021'),
      [MaterialType.OTHERS]: t('MI0022'),
    }
  })

  const materialSideTypeText = computed<{ [key in MaterialSideType]: string }>(
    () => {
      return {
        [MaterialSideType.FACE_SIDE]: t('DD0048'),
        [MaterialSideType.BACK_SIDE]: t('DD0049'),
      }
    }
  )

  const currencyText = computed<{ [key in CurrencyCode]: string }>(() => {
    return {
      [CurrencyCode.USD]: 'USD',
      [CurrencyCode.EUR]: 'EUR',
      [CurrencyCode.CNY]: 'CNY',
      [CurrencyCode.TWD]: 'TWD',
      [CurrencyCode.JPY]: 'JPY',
      [CurrencyCode.INR]: 'INR',
      [CurrencyCode.BDT]: 'BDT',
      [CurrencyCode.BRL]: 'BRL',
      [CurrencyCode.KHR]: 'KHR',
      [CurrencyCode.CAD]: 'CAD',
      [CurrencyCode.HKD]: 'HKD',
      [CurrencyCode.IDR]: 'IDR',
      [CurrencyCode.IRR]: 'IRR',
      [CurrencyCode.IQD]: 'IQD',
      [CurrencyCode.KRW]: 'KRW',
      [CurrencyCode.MYR]: 'MYR',
      [CurrencyCode.NZD]: 'NZD',
      [CurrencyCode.PKR]: 'PKR',
      [CurrencyCode.SAR]: 'SAR',
      [CurrencyCode.SGD]: 'SGD',
      [CurrencyCode.LKR]: 'LKR',
      [CurrencyCode.THB]: 'THB',
      [CurrencyCode.TRY]: 'TRY',
      [CurrencyCode.GBP]: 'GBP',
      [CurrencyCode.VND]: 'VND',
    }
  })

  const sortByText = computed<{ [key in PaginationReqSortEnum]: string }>(
    () => {
      return {
        [PaginationReqSortEnum.RELEVANCE]: t('RR0070'),
        [PaginationReqSortEnum.RELEVANCE_C_M]: t('RR0114'),
        [PaginationReqSortEnum.RELEVANCE_M_C]: t('RR0115'),
        [PaginationReqSortEnum.ITEM_NO_A_Z]: t('RR0067'),
        [PaginationReqSortEnum.ITEM_NO_A_Z_C_M]: t('RR0110'),
        [PaginationReqSortEnum.ITEM_NO_A_Z_M_C]: t('RR0111'),
        [PaginationReqSortEnum.CREATE_DATE]: t('RR0065'),
        [PaginationReqSortEnum.CREATE_DATE_C_M]: t('RR0112'),
        [PaginationReqSortEnum.CREATE_DATE_M_C]: t('RR0113'),
        [PaginationReqSortEnum.NEW_ARRIVED]: t('RR0129'),
        [PaginationReqSortEnum.LAST_UPDATE]: t('RR0066'),
        [PaginationReqSortEnum.RANDOM]: t('RR0128'),
        [PaginationReqSortEnum.GHG_LOW_TO_HIGH]: t('RR0251'),
        [PaginationReqSortEnum.WATER_LOW_TO_HIGH]: t('RR0252'),
        [PaginationReqSortEnum.LAND_LOW_TO_HIGH]: t('RR0253'),
      }
    }
  )

  const assetsFilterStatusText = computed<{
    [key in AssetsFilterStatusEnum]: string
  }>(() => {
    return {
      [AssetsFilterStatusEnum.NOT_IN_WORKSPACE]: t('RR0099'),
      [AssetsFilterStatusEnum.NO_SCAN_IMAGE]: t('RR0102'),
      [AssetsFilterStatusEnum.NO_IMAGE]: t('RR0103'),
      [AssetsFilterStatusEnum.NO_REQUIRED_FIELD]: t('RR0104'),
      [AssetsFilterStatusEnum.DUPLICATE_ITEM_NO]: 'Show duplicate product',
    }
  })

  return {
    lengthUnitText,
    weightUnitText,
    materialQuantityText,
    materialPerQuantityText,
    materialTypeText,
    materialSideTypeText,
    currencyText,
    sortByText,
    assetsFilterStatusText,
  }
}

export default useEnumText
