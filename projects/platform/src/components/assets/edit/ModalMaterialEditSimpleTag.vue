<template lang="pug">
modal-behavior(
  :header="`${material.itemNo} - ${$t('RR0133')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!materialFormService.meta.value.valid"
  @click:primary="updateMaterialSimpleTag"
  @click:secondary="store.dispatch('helper/closeModal')"
)
  div(class="w-200")
    block-material-tags
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type {
  Material,
  MaterialOptions,
  MaterialUpdateTag,
} from '@frontier/platform-web-sdk'
import { useNotifyStore } from '@/stores/notify'
import BlockMaterialTags from '@/components/assets/edit/BlockMaterialTags.vue'
import { useMaterialTagForm } from '@/composables/material/useMaterialForm'
import { materialFormServiceKey } from '@/utils/constants'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'

const props = defineProps<{
  material: Material
  materialOptions: MaterialOptions
}>()

const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()

const materialFormService = useMaterialTagForm({
  material: props.material,
  materialOptions: props.materialOptions,
})

// 從這改變 provide 影響子組件block-material-tags inject
provide(materialFormServiceKey, materialFormService)

const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

const updateMaterialSimpleTag = async () => {
  store.dispatch('helper/pushModalLoading')

  const mapToReq = (
    form: typeof materialFormService['values']
  ): Omit<MaterialUpdateTag, 'ogType' | 'ogId' | 'orgId'> => {
    return {
      materialId: props.material.materialId,
      tagInfo: form.tagInfo,
      internalInfo: {
        tagList: form.internalInfo.tagList,
        remark: form.internalInfo.remark,
      },
    }
  }

  await ogBaseAssetsApi(
    'updateAssetsMaterialSimpleTag',
    mapToReq(materialFormService.values)
  )

  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}
</script>
