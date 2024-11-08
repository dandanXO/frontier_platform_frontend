import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ColDef, ColGroupDef } from 'ag-grid-enterprise'
import { LengthUnit } from '@frontier/platform-web-sdk'
import useMaterialSchema, {
  materialWidthSchema,
} from '@/composables/material/useMaterialSchema'
import {
  getEnumCellProps,
  getNumberCellProps,
  requiredColumnComponentParams,
  rowEditable,
} from '@/utils/material/spreadsheet'
import type { MaterialRow } from '@/types'
import useEnumText from '@/composables/useEnumText'

const useWidthInfoCol = (): ComputedRef<
  ColDef<MaterialRow> | ColGroupDef<MaterialRow>
> => {
  const { t } = useI18n()
  const materialSchema = useMaterialSchema()
  const { lengthUnitText } = useEnumText()

  return computed(() => {
    return {
      headerName: t('RR0088'),
      children: [
        {
          field: 'width.cuttable',
          headerName: t('RR0019'),
          headerComponentParams: requiredColumnComponentParams,
          minWidth: 150,
          editable: rowEditable,
          ...getNumberCellProps(
            materialSchema.shape.width.shape.cuttable,
            t('MI0037')
          ),
        },
        {
          field: 'width.full',
          headerName: t('MI0036'),
          headerComponentParams: requiredColumnComponentParams,
          minWidth: 150,
          editable: rowEditable,
          ...getNumberCellProps(
            materialSchema.shape.width.shape.full,
            t('MI0038')
          ),
        },
        {
          field: 'width.unit',
          headerName: t('RR0320'),
          headerComponentParams: requiredColumnComponentParams,
          editable: rowEditable,
          ...getEnumCellProps(
            materialWidthSchema.shape.unit,
            LengthUnit,
            lengthUnitText
          ),
        },
      ],
    }
  })
}

export default useWidthInfoCol
