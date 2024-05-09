<template lang="pug">
modal-behavior(
  :header="`${material.itemNo} - ${$t('RR0133')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!materialFormService.meta.value.valid"
  @click:primary="updateMaterialSimpleTag"
  @click:secondary="store.dispatch('helper/closeModal')"
)
  div(class="w-120")
    block-material-pricing(onlyPublic)
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type {
  Material,
  MaterialOptions,
  MaterialUpdatePublicPrice,
} from '@frontier/platform-web-sdk'
import { useNotifyStore } from '@/stores/notify'

import { useMaterialPublicPriceForm } from '@/composables/material/useMaterialForm'
import { materialFormServiceKey } from '@/utils/constants'
import BlockMaterialPricing from './BlockMaterialPricing.vue'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { convertPriceInfoFormToReq } from '@/utils/material'

const props = defineProps<{
  material: Material
  materialOptions: MaterialOptions
}>()

const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

const materialFormService = useMaterialPublicPriceForm({
  material: props.material,
  materialOptions: props.materialOptions,
})

// 從這改變 provide 影響子組件block-material-public-price inject
provide(materialFormServiceKey, materialFormService)

const updateMaterialSimpleTag = async () => {
  store.dispatch('helper/pushModalLoading')

  const mapToReq = (
    form: typeof materialFormService['values']
  ): Omit<MaterialUpdatePublicPrice, 'ogType' | 'ogId' | 'orgId'> => {
    return {
      materialId: props.material.materialId,
      priceInfo: convertPriceInfoFormToReq(form.priceInfo),
    }
  }

  await ogBaseAssetsApi(
    'updateAssetsMaterialSimplePublicPrice',
    mapToReq(materialFormService.values)
  )

  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}
</script>
