<template lang="pug">
modal-behavior(
  :header="header"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="!materialFormService.meta.value.valid"
  @click:primary="submit"
  @click:secondary="store.dispatch('helper/closeModal')"
)
  div(class="w-200 grid gap-y-7.5")
    block-material-specification
</template>

<script setup lang="ts">
import { ref, provide, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useNotifyStore } from '@/stores/notify'
import BlockMaterialSpecification from '@/components/assets/edit/blockMaterialSpecification/BlockMaterialSpecification.vue'
import type {
  Material,
  MaterialOptions,
  MaterialUpdateSpec,
} from '@frontier/platform-web-sdk'
import type { MaterialFormService } from '@/types'
import useMaterialForm from '@/composables/material/useMaterialForm'
import { materialFormServiceKey } from '@/utils/constants'
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

const header = ref(`${props.material.itemNo} - ${t('RR0130')}`)
const pantoneList = computed(() => store.getters['code/pantoneList'])

const materialFormService: MaterialFormService = useMaterialForm({
  material: props.material,
  materialOptions: props.materialOptions,
  pantoneList: pantoneList.value,
})

provide(materialFormServiceKey, materialFormService)

const submit = materialFormService.handleSubmit((form) =>
  updateMaterialSimpleSpec(form)
)

const updateMaterialSimpleSpec = async (
  form: ReturnType<typeof useMaterialForm>['values']
) => {
  store.dispatch('helper/pushModalLoading')

  const getReq = (): Omit<MaterialUpdateSpec, 'ogType' | 'ogId' | 'orgId'> => {
    return {
      materialId: props.material.materialId,
      faceSide: form.faceSide,
      middleSide: form.middleSide,
      backSide: form.backSide,
      isAutoSyncFaceToBackSideInfo: form.isAutoSyncFaceToBackSideInfo,
      itemNo: form.itemNo,
      seasonInfo: form.seasonInfo,
      width: form.width,
      weight: form.weight,
      weightDisplaySetting: form.weightDisplaySetting,
    }
  }

  await ogBaseAssetsApi('updateMaterialSimpleSpec', getReq())

  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}

onMounted(() => {
  materialFormService.validate()
})
</script>
