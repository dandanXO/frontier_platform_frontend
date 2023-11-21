<template lang="pug">
modal-behavior(
  :header="`${material.itemNo} - ${$t('RR0135')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!materialFormService.meta.value.valid"
  @click:primary="updateMaterialSimpleInventory"
  @click:secondary="store.dispatch('helper/closeModal')"
)
  div(class="min-w-200")
    block-material-inventory
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { materialFormServiceKey } from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import useMaterialForm from '@/composables/material/useMaterialForm'
import type { MaterialFormService } from '@/types'
import type {
  Material,
  MaterialInternalInventoryInfo,
  MaterialOptions,
} from '@frontier/platform-web-sdk'
import BlockMaterialInventory from '@/components/assets/edit/BlockMaterialInventory.vue'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

const props = defineProps<{
  material: Material
  materialOptions: MaterialOptions
}>()

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()

const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
const materialFormService: MaterialFormService = useMaterialForm({
  material: props.material,
  materialOptions: props.materialOptions,
})

provide(materialFormServiceKey, materialFormService)

const updateMaterialSimpleInventory = async () => {
  store.dispatch('helper/pushModalLoading')

  const mapToReq = (
    form: typeof materialFormService['values']
  ): Omit<MaterialInternalInventoryInfo, 'ogType' | 'ogId' | 'orgId'> => {
    return {
      materialId: props.material.materialId,
      internalInfo: {
        inventoryInfo: {
          isTotalPublic: form.internalInfo?.inventoryInfo?.isTotalPublic,
          sampleCardsRemainingList:
            form.internalInfo?.inventoryInfo?.sampleCardsRemainingList,
          hangersRemainingList:
            form.internalInfo?.inventoryInfo?.hangersRemainingList,
          yardageRemainingInfo:
            form.internalInfo?.inventoryInfo?.yardageRemainingInfo,
        },
        nativeCode: form.internalInfo?.nativeCode,
      },
    }
  }

  await ogBaseAssetsApi(
    'updateAssetsMaterialSimpleInventory',
    mapToReq(materialFormService.values)
  )

  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}
</script>
