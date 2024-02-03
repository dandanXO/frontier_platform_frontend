import i18n from '@frontier/i18n'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { ColGroupDef, EditableCallbackParams } from 'ag-grid-enterprise'
import type { MaterialRow } from '@/types'
import {
  constructionEditable,
  getNumberCellProps,
  getStringCellProps,
  rowEditable,
} from '@/utils/material/spreadsheet'
import { materialLeatherConstructionSchema } from '@/composables/material/useMaterialSchema'

const t = i18n.global.t

const getLeatherConstruction = (
  side: 'faceSide' | 'backSide'
): ColGroupDef<MaterialRow> => {
  const editable = (params: EditableCallbackParams<MaterialRow>) =>
    rowEditable(params) &&
    constructionEditable(side, MaterialType.LEATHER)(params)

  return {
    headerName: t('MI0018'),
    columnGroupShow: 'open',
    children: [
      {
        field: `${side}.construction.averageSkinPerMeterSquare`,
        headerName: `${t('MI0071')} (${t('MI0075')})`,
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialLeatherConstructionSchema.shape.averageSkinPerMeterSquare,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.grade`,
        headerName: t('MI0072'),
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialLeatherConstructionSchema.shape.grade,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.tannage`,
        headerName: t('MI0073'),
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialLeatherConstructionSchema.shape.tannage,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.thicknessPerMm`,
        headerName: `${t('MI0074')} (${t('MI0077')})`,
        minWidth: 150,
        editable,
        ...getNumberCellProps(
          materialLeatherConstructionSchema.shape.thicknessPerMm,
          t('MI0030')
        ),
      },
    ],
  }
}

export default getLeatherConstruction
