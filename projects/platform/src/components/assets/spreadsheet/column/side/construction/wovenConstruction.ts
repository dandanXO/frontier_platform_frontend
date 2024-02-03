import i18n from '@frontier/i18n'
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { ColGroupDef, EditableCallbackParams } from 'ag-grid-enterprise'
import { getStringCellProps, rowEditable } from '@/utils/material/spreadsheet'
import { materialWovenConstructionSchema } from '@/composables/material/useMaterialSchema'

const t = i18n.global.t

const constructionEditable =
  (side: 'faceSide' | 'backSide', materialType: MaterialType) =>
  (params: EditableCallbackParams<MaterialRow>) => {
    return params.data?.[side]?.materialType === materialType || false
  }

const getWovenConstruction = (
  side: 'faceSide' | 'backSide'
): ColGroupDef<MaterialRow> => {
  const editable = (params: EditableCallbackParams<MaterialRow>) =>
    rowEditable(params) &&
    constructionEditable(side, MaterialType.WOVEN)(params)

  return {
    headerName: t('RR0091'),
    columnGroupShow: 'open',
    children: [
      {
        field: `${side}.construction.warpDensity`,
        headerName: `${t('MI0028')}  ${t('MI0027')}`,
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialWovenConstructionSchema.shape.warpDensity,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.weftDensity`,
        headerName: `${t('MI0029')}  ${t('MI0027')}`,
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialWovenConstructionSchema.shape.weftDensity,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.warpYarnSize`,
        headerName: `${t('MI0028')}  ${t('RR0023')}`,
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialWovenConstructionSchema.shape.warpYarnSize,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.weftYarnSize`,
        headerName: `${t('MI0029')}  ${t('RR0023')}`,
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialWovenConstructionSchema.shape.weftYarnSize,
          t('MI0030')
        ),
      },
    ],
  }
}

export default getWovenConstruction
