import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import SelectCellEditor from '@/components/assets/spreadsheet/cell/SelectCellEditor.vue'
import {
  getStringCellProps,
  handleCellValueDelete,
  rowEditable,
} from '@/utils/material/spreadsheet'
import type { MaterialRow } from '@/types'
import type {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ValueFormatterParams,
} from 'ag-grid-enterprise'
import useMaterialSchema from '@/composables/material/useMaterialSchema'
import type { SpreadsheetService } from '@/components/assets/spreadsheet/Spreadsheet.vue'
import { defaultCellStyle } from '@/components/assets/spreadsheet/utils/utils'
import { getCellStyle } from '../../utils/material/spreadsheet'
import { tagListSchema } from '../material/useMaterialSchema'

const useTagInfoCol = (
  spreadsheetService: SpreadsheetService
): ComputedRef<ColDef<MaterialRow> | ColGroupDef<MaterialRow>> => {
  const { t } = useI18n()
  const materialSchema = useMaterialSchema()
  const {
    materialOptions,
    menuTreePublicTag,
    menuTreePrivateTag,
    publicTagMenuList,
    privateTagMenuList,
  } = spreadsheetService

  function getTagListValidatedCellStyle(params: CellClassParams<MaterialRow>) {
    const editable = params.column.isCellEditable(params.node)
    const isValid = editable
      ? tagListSchema.safeParse(params.value).success
      : true
    const cellStyle = getCellStyle({ valid: isValid, editable })

    return { ...cellStyle, ...defaultCellStyle }
  }

  return computed(() => {
    return {
      headerName: t('RR0133'),
      children: [
        {
          headerName: t('RR0027'),
          field: 'tagInfo.tagList',
          minWidth: 200,
          editable: rowEditable,
          cellEditorPopup: true,
          cellEditor: SelectCellEditor,
          cellEditorParams: {
            placeholder: t('RR0288'),
            multiple: true,
            dropdownMenuTree: () => menuTreePublicTag.value,
            onAddNew: (name: string) => {
              publicTagMenuList.value.push({
                title: name,
                selectValue: name,
              })
            },
          },
          valueFormatter: (
            params: ValueFormatterParams<MaterialRow, string[]>
          ) => {
            return params.value?.join(',') || ''
          },
          valueParser: (params) => {
            const result = params.newValue.split(',').map((s) => s.trim())
            result.forEach((tag) => {
              if (!publicTagMenuList.value.find((t) => t.title === tag)) {
                publicTagMenuList.value.push({
                  title: tag,
                  selectValue: tag,
                })
              }
            })
            return result
          },
          onCellValueChanged: handleCellValueDelete((row) => {
            const target = row.tagInfo
            if (target) {
              target.tagList = []
            }
          }),
          cellStyle: getTagListValidatedCellStyle,
        },
        {
          headerName: t('MI0051'),
          field: 'tagInfo.certificationTagList',
          minWidth: 200,
          editable: rowEditable,
          cellEditorPopup: true,
          cellEditor: SelectCellEditor,
          cellEditorParams: {
            placeholder: t('MI0052'),
            multiple: true,
            dropdownMenuTree: () => ({
              blockList: [
                {
                  menuList:
                    materialOptions.certificateList.map(
                      ({ name, certificateId }) => ({
                        title: name,
                        selectValue: certificateId,
                      })
                    ) || [],
                },
              ],
            }),
          },
          valueFormatter: (params) => {
            const idArray = params.value as number[]
            return materialOptions.certificateList
              .filter((c) => idArray.includes(c.certificateId))
              .map((c) => c.name)
              .join(',')
          },
          valueParser: (params) => {
            const result = params.newValue.split(',').map((s) => s.trim())
            return result
              .map((name) => {
                return materialOptions.certificateList.find(
                  (c) => c.name === name
                )
              })
              .filter(Boolean)
              .map((m) => m?.certificateId)
          },
          onCellValueChanged: handleCellValueDelete((row) => {
            const target = row.tagInfo
            if (target) {
              target.certificationTagList = []
            }
          }),
          cellStyle: defaultCellStyle,
        },
        {
          headerName: t('RR0289'),
          columnGroupShow: 'open',
          children: [
            {
              field: 'internalInfo.tagList',
              headerName: t('RR0028'),
              minWidth: 200,
              editable: rowEditable,
              cellEditorPopup: true,
              cellEditor: SelectCellEditor,
              cellEditorParams: {
                placeholder: t('RR0290'),
                multiple: true,
                dropdownMenuTree: () => menuTreePrivateTag.value,
                onAddNew: (name: string) => {
                  privateTagMenuList.value.push({
                    title: name,
                    selectValue: name,
                  })
                },
              },
              valueFormatter: (
                params: ValueFormatterParams<MaterialRow, string[]>
              ) => {
                return params.value?.join(',') || ''
              },
              valueParser: (params) => {
                const result = params.newValue.split(',').map((s) => s.trim())
                result.forEach((tag) => {
                  if (!privateTagMenuList.value.find((t) => t.title === tag)) {
                    privateTagMenuList.value.push({
                      title: tag,
                      selectValue: tag,
                    })
                  }
                })
                return result
              },
              onCellValueChanged: handleCellValueDelete((row) => {
                const target = row.internalInfo
                if (target) {
                  target.tagList = []
                }
              }),
              cellStyle: getTagListValidatedCellStyle,
            },
            {
              field: 'internalInfo.remark',
              headerName: t('RR0029'),
              editable: rowEditable,
              minWidth: 200,
              ...getStringCellProps(
                materialSchema.shape.internalInfo.shape.remark,
                t('MI0054')
              ),
            },
          ],
        },
      ],
    }
  })
}

export default useTagInfoCol
