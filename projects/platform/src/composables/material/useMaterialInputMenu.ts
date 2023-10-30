import type { Ref } from 'vue'
import type { z } from 'zod'
import type { MaterialOptionsCode } from '@frontier/platform-web-sdk'
import useMaterialStaticMenu from '@/composables/material/useMaterialStaticMenu'
import useMaterialDynamicMenu from '@/composables/material/useMaterialDynamicMenu'
import type useMaterialSchema from '@/composables/material/useMaterialSchema'
import type { MATERIAL_SIDE_TYPE } from '@/utils/constants'

export default function useMaterialInputMenu(
  materialFormValues: z.infer<ReturnType<typeof useMaterialSchema>>,
  materialOptions: MaterialOptionsCode,
  currentMaterialSide: Ref<MATERIAL_SIDE_TYPE>
) {
  const materialStaticMenu = useMaterialStaticMenu()
  const materialDynamicMenu = useMaterialDynamicMenu(
    materialFormValues,
    materialOptions,
    currentMaterialSide
  )

  return { ...materialStaticMenu, ...materialDynamicMenu }
}
