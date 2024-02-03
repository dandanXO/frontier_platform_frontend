import i18n from '@frontier/i18n'
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { ColGroupDef, EditableCallbackParams } from 'ag-grid-enterprise'
import { getStringCellProps, rowEditable } from '@/utils/material/spreadsheet'
import { materialTrimConstructionSchema } from '@/composables/material/useMaterialSchema'

const t = i18n.global.t

const constructionEditable =
  (side: 'faceSide' | 'backSide', materialType: MaterialType) =>
  (params: EditableCallbackParams<MaterialRow>) => {
    return params.data?.[side]?.materialType === materialType || false
  }

const getTrimConstruction = (
  side: 'faceSide' | 'backSide'
): ColGroupDef<MaterialRow> => {
  const editable = (params: EditableCallbackParams<MaterialRow>) =>
    rowEditable(params) && constructionEditable(side, MaterialType.TRIM)(params)

  return {
    headerName: t('MI0021'),
    columnGroupShow: 'open',
    children: [
      {
        field: `${side}.construction.outerDiameter`,
        headerName: t('MI0079'),
        editable,
        ...getStringCellProps(
          materialTrimConstructionSchema.shape.outerDiameter,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.length`,
        headerName: t('MI0080'),
        editable,
        ...getStringCellProps(
          materialTrimConstructionSchema.shape.length,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.thickness`,
        headerName: t('MI0081'),
        editable,
        ...getStringCellProps(
          materialTrimConstructionSchema.shape.thickness,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.width`,
        headerName: t('MI0082'),
        editable,
        ...getStringCellProps(
          materialTrimConstructionSchema.shape.width,
          t('MI0030')
        ),
      },
    ],
  }
}

export default getTrimConstruction
