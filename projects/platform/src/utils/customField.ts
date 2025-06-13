import { CustomFieldType, MaterialType } from '@frontier/platform-web-sdk'

import i18n from '@frontier/i18n'
const t = i18n.global.t

export const FIELD_TYPE_OPTIONS = [
  {
    title: t('RR0537'),
    selectValue: CustomFieldType.SINGLE_LINE_TEXT,
  },
  {
    title: t('RR0538'),
    selectValue: CustomFieldType.NUMERIC_INPUT,
  },
  {
    title: t('RR0539'),
    selectValue: CustomFieldType.SINGLE_SELECT_RADIO_BUTTON,
  },
  {
    title: t('RR0540'),
    selectValue: CustomFieldType.SINGLE_SELECT_DROPDOWN,
  },
  {
    title: t('RR0541'),
    selectValue: CustomFieldType.MULTI_SELECT_DROPDOWN,
  },
]

export const APPLY_TO_OPTIONS = [
  {
    title: t('RR0091'),
    selectValue: MaterialType.WOVEN,
  },
  {
    title: t('RR0092'),
    selectValue: MaterialType.KNIT,
  },
  {
    title: t('MI0018'),
    selectValue: MaterialType.LEATHER,
  },
  {
    title: t('MI0020'),
    selectValue: MaterialType.NON_WOVEN,
  },
  {
    title: t('MI0021'),
    selectValue: MaterialType.TRIM,
  },
  {
    title: t('MI0022'),
    selectValue: MaterialType.OTHERS,
  },
]

export const formatFieldType = (type: number) => {
  return (
    FIELD_TYPE_OPTIONS.find((item) => item.selectValue === type)?.title || ''
  )
}

export const formatApplyTo = (types: Array<number | string>) => {
  return types.length === APPLY_TO_OPTIONS.length
    ? t('RR0052')
    : types
        .map((num: number | string) => {
          const item = APPLY_TO_OPTIONS.find((item) => item.selectValue === num)
          return item ? item.title : ''
        })
        .join(', ')
}

export const isValidString = (str: any) => {
  return /^[^|":;\\]*$/.test(str)
}

export const MAX_LENGTH_ERROR = 'maxLengthError'

export const customFieldPlaceholder = (
  fieldType: number | null,
  optionIdx: number
) => {
  switch (fieldType) {
    case CustomFieldType.SINGLE_SELECT_RADIO_BUTTON:
      return optionIdx === 0 ? t('RR0548') : t('RR0549')
    case CustomFieldType.SINGLE_SELECT_DROPDOWN:
      return t('RR0550')
    case CustomFieldType.MULTI_SELECT_DROPDOWN:
      return t('RR0551')
    default:
      return t('RR0550')
  }
}
