import i18n from '@frontier/i18n'
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { ColGroupDef, EditableCallbackParams } from 'ag-grid-enterprise'
import {
  getNumberCellProps,
  getStringCellProps,
  rowEditable,
} from '@/utils/material/spreadsheet'
import { materialNonWovenConstructionSchema } from '@/composables/material/useMaterialSchema'

const t = i18n.global.t

const constructionEditable =
  (side: 'faceSide' | 'backSide', materialType: MaterialType) =>
  (params: EditableCallbackParams<MaterialRow>) => {
    return params.data?.[side]?.materialType === materialType || false
  }

const getNonWovenConstruction = (
  side: 'faceSide' | 'backSide'
): ColGroupDef<MaterialRow> => {
  const editable = (params: EditableCallbackParams<MaterialRow>) =>
    rowEditable(params) &&
    constructionEditable(side, MaterialType.NON_WOVEN)(params)

  return {
    headerName: t('MI0020'),
    columnGroupShow: 'open',
    children: [
      {
        field: `${side}.construction.bondingMethod`,
        headerName: t('MI0078'),
        editable,
        ...getStringCellProps(
          materialNonWovenConstructionSchema.shape.bondingMethod,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.thicknessPerMm`,
        headerName: `${t('MI0074')} (${t('MI0077')})`,
        editable,
        ...getNumberCellProps(
          materialNonWovenConstructionSchema.shape.thicknessPerMm,
          t('MI0030')
        ),
      },
    ],
  }
}

export default getNonWovenConstruction
