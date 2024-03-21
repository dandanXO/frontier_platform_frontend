import {
  PaginationReqSortEnum,
  LengthUnit,
  WeightUnit,
  MaterialType,
  AssetsFilterStatusEnum,
  MaterialQuantityUnit,
  MaterialSideType,
  CurrencyCode,
  SharePermission,
} from '@frontier/platform-web-sdk'
import i18n from '@frontier/i18n'

const t = i18n.global.t

export const LengthUnitText: { [key in LengthUnit]: string } = {
  [LengthUnit.CM]: t('EE0099'),
  [LengthUnit.INCH]: t('RR0020'),
}

export const WeightUnitText: { [key in WeightUnit]: string } = {
  [WeightUnit.GSM]: t('RR0016'),
  [WeightUnit.OZ]: t('RR0017'),
  [WeightUnit.GY]: t('RR0018'),
  [WeightUnit.GM]: 'g/m',
}

export const MaterialQuantityText: { [key in MaterialQuantityUnit]: string } = {
  [MaterialQuantityUnit.Y]: t('RR0039'),
  [MaterialQuantityUnit.M]: t('RR0040'),
  [MaterialQuantityUnit.KG]: t('RR0041'),
}

export const MaterialTypeText: { [key in MaterialType]: string } = {
  [MaterialType.WOVEN]: t('RR0091'),
  [MaterialType.KNIT]: t('RR0092'),
  [MaterialType.LEATHER]: t('MI0018'),
  [MaterialType.NON_WOVEN]: t('MI0020'),
  [MaterialType.TRIM]: t('MI0021'),
  [MaterialType.OTHERS]: t('MI0022'),
}

export const MaterialSideTypeText: { [key in MaterialSideType]: string } = {
  [MaterialSideType.FACE_SIDE]: t('DD0048'),
  [MaterialSideType.BACK_SIDE]: t('DD0049'),
}

export const CurrencyText: { [key in CurrencyCode]: string } = {
  [CurrencyCode.USD]: t('RR0044'),
  [CurrencyCode.EUR]: t('RR0293'),
  [CurrencyCode.CNY]: t('RR0045'),
  [CurrencyCode.TWD]: t('RR0046'),
  [CurrencyCode.JPY]: t('RR0294'),
  [CurrencyCode.INR]: t('RR0295'),
}

export const SortByText: { [key in PaginationReqSortEnum]: string } = {
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

export const AssetsFilterStatusText: {
  [key in AssetsFilterStatusEnum]: string
} = {
  [AssetsFilterStatusEnum.NOT_IN_WORKSPACE]: t('RR0099'),
  [AssetsFilterStatusEnum.NO_SCAN_IMAGE]: t('RR0102'),
  [AssetsFilterStatusEnum.NO_IMAGE]: t('RR0103'),
  [AssetsFilterStatusEnum.NO_REQUIRED_FIELD]: t('RR0104'),
  [AssetsFilterStatusEnum.DUPLICATE_ITEM_NO]: 'Show duplicate product',
}

export const SharePermissionText: {
  [key in SharePermission]: string
} = {
  [SharePermission.VIEW_ONLY]: t('FF0076'),
  [SharePermission.IS_CAN_DOWNLOAD_U3M]: t('FF0033'),
  [SharePermission.IS_CAN_CLONE]: t('FF0034'),
  [SharePermission.ALL_ALLOW]: t('FF0080'),
}
