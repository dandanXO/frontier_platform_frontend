import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import useMaterialSchema from '@/composables/material/useMaterialSchema'
import type { MaterialRow } from '@/types'
import type {
  ColDef,
  ColGroupDef,
  EditableCallbackParams,
  NewValueParams,
} from 'ag-grid-enterprise'
import { WeightUnit } from '@frontier/platform-web-sdk'
import useEnumText from '@/composables/useEnumText'
import {
  getEnumCellProps,
  getNumberCellProps,
  requiredColumnComponentParams,
  rowEditable,
} from '@/utils/material/spreadsheet'
import { materialWeightSchema } from '@/composables/material/useMaterialSchema'

const useWeightInfoCol = (): ComputedRef<
  ColDef<MaterialRow> | ColGroupDef<MaterialRow>
> => {
  const { t } = useI18n()
  const materialSchema = useMaterialSchema()
  const { weightUnitText } = useEnumText()

  const weightDisplayEditable =
    (weightUnit: WeightUnit) =>
    (params: EditableCallbackParams<MaterialRow, boolean>) => {
      if (!params.data) {
        return false
      }

      const { weight } = params.data
      if (!weight) {
        return true
      }
      const { unit } = weight

      return weightUnit !== unit
    }

  return computed(() => {
    return {
      headerName: t('RR0015'),
      groupId: 'weightInfo',
      children: [
        {
          field: 'weight.value',
          headerName: t('RR0015'),
          headerComponentParams: requiredColumnComponentParams,
          editable: rowEditable,
          ...getNumberCellProps(
            materialSchema.shape.weight.shape.value,
            t('MI0039')
          ),
        },

        {
          field: 'weight.unit',
          headerName: t('RR0320'),
          headerComponentParams: requiredColumnComponentParams,
          editable: rowEditable,
          ...getEnumCellProps(
            materialWeightSchema.shape.unit,
            WeightUnit,
            weightUnitText
          ),
          onCellValueChanged: (
            params: NewValueParams<MaterialRow, WeightUnit>
          ) => {
            params.node &&
              params.api.refreshCells({ rowNodes: [params.node], force: true })

            if (!params.data) return

            const row = params.data
            const weightUnit = row.weight?.unit
            const oldWeightUnit = params.oldValue

            if (!weightUnit) return

            const setWeightDisplaySetting = (
              unit: WeightUnit,
              value: boolean
            ) => {
              switch (unit) {
                case WeightUnit.GM:
                  row.weightDisplaySetting.isShowWeightGm = value
                  break
                case WeightUnit.GSM:
                  row.weightDisplaySetting.isShowWeightGsm = value
                  break
                case WeightUnit.GY:
                  row.weightDisplaySetting.isShowWeightGy = value
                  break
                case WeightUnit.OZ:
                  row.weightDisplaySetting.isShowWeightOz = value
                  break
              }
            }

            setWeightDisplaySetting(weightUnit, true)
            oldWeightUnit && setWeightDisplaySetting(oldWeightUnit, false)
            params.api.applyTransaction({ update: [row] })
          },
        },
        {
          headerName: t('MI0149'),
          columnGroupShow: 'open',
          children: [
            {
              field: 'weightDisplaySetting.isShowWeightGm',
              headerName: weightUnitText.value[WeightUnit.GM],
              width: 110,
              editable: (params) =>
                weightDisplayEditable(WeightUnit.GM)(params) &&
                rowEditable(params),
            },
            {
              field: 'weightDisplaySetting.isShowWeightGsm',
              headerName: weightUnitText.value[WeightUnit.GSM],
              width: 110,
              editable: (params) =>
                weightDisplayEditable(WeightUnit.GSM)(params) &&
                rowEditable(params),
            },
            {
              field: 'weightDisplaySetting.isShowWeightGy',
              headerName: weightUnitText.value[WeightUnit.GY],
              width: 110,
              editable: (params) =>
                weightDisplayEditable(WeightUnit.GY)(params) &&
                rowEditable(params),
            },
            {
              field: 'weightDisplaySetting.isShowWeightOz',
              headerName: weightUnitText.value[WeightUnit.OZ],
              width: 110,
              editable: (params) =>
                weightDisplayEditable(WeightUnit.OZ)(params) &&
                rowEditable(params),
            },
          ],
        },
      ],
    }
  })
}

export default useWeightInfoCol
