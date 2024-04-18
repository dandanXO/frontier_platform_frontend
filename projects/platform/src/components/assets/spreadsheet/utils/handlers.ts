import type { ICellEditorParams } from 'ag-grid-enterprise'
import type { Ref } from 'vue'

export function handleEnterKeyDuringIMEComposition(
  event: KeyboardEvent,
  isComposing: Ref<boolean>,
  params: ICellEditorParams
) {
  if (isComposing.value) {
    event.stopPropagation()
  } else {
    params.api.stopEditing()
  }
}
