import i18n from '@frontier/i18n'
import type { MaterialRow } from '@/types'
import { MaterialType } from '@frontier/platform-web-sdk'
import type { ColGroupDef, EditableCallbackParams } from 'ag-grid-enterprise'
import {
  constructionEditable,
  getNumberCellProps,
  getStringCellProps,
  rowEditable,
} from '../../cell/cellUtils'
import { materialKnitConstructionSchema } from '@/composables/material/useMaterialSchema'

const t = i18n.global.t

const getKnitConstruction = (
  side: 'faceSide' | 'backSide'
): ColGroupDef<MaterialRow> => {
  const editable = (params: EditableCallbackParams<MaterialRow>) =>
    rowEditable(params) && constructionEditable(side, MaterialType.KNIT)(params)

  return {
    headerName: t('RR0092'),
    columnGroupShow: 'open',
    children: [
      {
        field: `${side}.construction.machineType`,
        headerName: t('MI0031'),
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialKnitConstructionSchema.shape.machineType,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.walesPerInch`,
        headerName: `${t('MI0032')} (${t('RR0020')})`,
        minWidth: 150,
        editable,
        ...getNumberCellProps(
          materialKnitConstructionSchema.shape.walesPerInch,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.coursesPerInch`,
        headerName: `${t('MI0033')} (${t('RR0020')})`,
        minWidth: 150,
        editable,
        ...getNumberCellProps(
          materialKnitConstructionSchema.shape.coursesPerInch,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.yarnSize`,
        headerName: t('RR0023'),
        minWidth: 150,
        editable,
        ...getStringCellProps(
          materialKnitConstructionSchema.shape.yarnSize,
          t('MI0030')
        ),
      },
      {
        field: `${side}.construction.machineGaugeInGg`,
        headerName: `${t('MI0068')} (${t('MI0070')})`,
        minWidth: 150,
        editable,
        ...getNumberCellProps(
          materialKnitConstructionSchema.shape.machineGaugeInGg,
          t('MI0030')
        ),
      },
    ],
  }
}

export default getKnitConstruction
