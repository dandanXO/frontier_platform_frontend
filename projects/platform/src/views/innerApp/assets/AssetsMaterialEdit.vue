<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-260 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$event.goTo?.()"
      )
      div(class="flex flex-row gap-x-2")
        f-button(type="secondary" size="md" @click="cancel") {{ $t('UU0002') }}
        f-button(
          type="primary"
          size="md"
          :disabled="!valid"
          @click="refBlockMaterialEdit?.submit()"
        ) {{ $t('UU0018') }}
    block-material-edit(
      ref="refBlockMaterialEdit"
      :material="material"
      :materialOptions="materialOptions"
      :pantoneList="pantoneList"
      @submit="updateMaterial"
      @cancel="cancel"
    )
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { NOTIFY_TYPE } from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { useAssetsStore } from '@/stores/assets'
import { OgType, type PantoneColor } from '@frontier/platform-web-sdk'
import BlockMaterialEdit from '@/components/assets/edit/BlockMaterialEdit.vue'
import type useMaterialForm from '@/composables/material/useMaterialForm'

const props = defineProps<{
  materialId: string
}>()

const { t } = useI18n()
const store = useStore()
const { uploadCustomU3m, ogBaseAssetsApi } = useAssetsStore()
const notify = useNotifyStore()
const { goToAssets, goToAssetMaterialDetail, goToAssetMaterialEdit } =
  useNavigation()

const materialId = computed(() => Number(props.materialId))
const [materialOptionsRes, materialRes] = await Promise.all([
  ogBaseAssetsApi('getMaterialOptions'),
  ogBaseAssetsApi('getAssetsMaterial', {
    materialId: materialId.value,
  }),
])
const materialOptions = ref(materialOptionsRes.data.result!)
const material = ref(materialRes.data.result!.material)

const refBlockMaterialEdit = ref<InstanceType<typeof BlockMaterialEdit> | null>(
  null
)
const isConfirmedToLeave = ref(false)

const breadcrumbList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: material.value?.itemNo || '',
      goTo: () => goToAssetMaterialDetail({}, materialId.value),
    },
    {
      name: t('EE0037'),
      goTo: () => goToAssetMaterialEdit(materialId.value, OgType.ORG),
    },
  ]
})

const valid = computed(() => {
  if (!refBlockMaterialEdit.value) {
    return false
  }

  return refBlockMaterialEdit.value.meta.valid
})

const pantoneList = computed(
  () => store.getters['code/pantoneList'] as PantoneColor[]
)

const updateMaterial = async (payload: {
  form: ReturnType<typeof useMaterialForm>['values']
  u3m?: {
    u3mFile: File
    needToGeneratePhysical: boolean
    hasUploadedU3mFile: boolean
  } | null
}) => {
  store.dispatch('helper/pushModalLoading')
  const { form, u3m } = payload
  const req = {
    materialId: materialId.value,
    ...form,
    hasCustomU3mUploading: u3m != null,
  }
  await ogBaseAssetsApi('updateAssetsMaterial', req)

  if (u3m) {
    uploadCustomU3m({
      materialId: material.value.materialId,
      u3mFile: u3m.u3mFile,
      needToGeneratePhysical: u3m.needToGeneratePhysical,
    })
  }

  store.dispatch('helper/closeModalLoading')
  isConfirmedToLeave.value = true
  goToAssetMaterialDetail({}, materialId.value)
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}

const cancel = async () => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('EE0045'),
    contentText: t('EE0046'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: () => {
      isConfirmedToLeave.value = true
      goToAssetMaterialDetail({}, materialId.value)
    },
    secondaryBtnText: t('UU0002'),
  })
}

onBeforeRouteLeave(async () => {
  if (isConfirmedToLeave.value) {
    return true
  }

  const result = await new Promise((resolve) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('EE0045'),
      contentText: t('EE0046'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: resolve.bind(undefined, 'confirm'),
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
    })
  })

  return result === 'confirm'
})
</script>
