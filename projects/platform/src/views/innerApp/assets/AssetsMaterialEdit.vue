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
          :disabled="!meta.valid"
          @click="submit"
        ) {{ $t('UU0018') }}
    div(class="flex flex-col gap-y-17.5")
      div(class="flex flex-row gap-x-15")
        material-detail-image(
          class="w-125 shrink-0"
          canEdit
          :displayImageList="displayImageList"
          :viewModeFileList="publicFileViewModeList"
          :getMenuTree="multimediaUpdateService.getMultimediaMenuTree"
          @editMultimedia="openModalMultimediaUpdate"
          @editScannedImage="openModalScannedImageUpdate"
        )
        block-material-u3m(:material="material")
      div(class="w-full flex flex-col divide-y divide-grey-250")
        div(class="w-full")
          f-tabs(:tabList="tabList" keyField="id" class="pt-10")
            template(#default="{ currentTab }")
              div(class="w-full pt-10 flex flex-row gap-x-16")
                div(class="w-full grid gap-y-10")
                  block-material-specification(
                    v-show="currentTab === TAB.SPECIFICATION"
                  )
                  block-material-tags(v-show="currentTab === TAB.TAGS")
                  block-material-pricing(v-show="currentTab === TAB.PRICING")
                  block-material-inventory(
                    v-show="currentTab === TAB.INVENTORY"
                  )
                  block-material-attachment-files(
                    v-show="currentTab === TAB.ATTACHMENTS"
                  )
                  div(class="flex flex-row gap-x-2 pl-15 justify-end w-full")
                    f-button(type="secondary" size="md" @click="cancel") {{ $t('UU0002') }}
                    f-button(
                      type="primary"
                      size="md"
                      :disabled="!meta.valid"
                      @click="submit"
                    ) {{ $t('UU0018') }}
                div(
                  v-if="currentTab === TAB.SPECIFICATION"
                  class="flex flex-col items-end gap-y-5 w-75"
                )
                  f-button(
                    size="sm"
                    type="secondary"
                    :disabled="!hasSampleCard"
                    @click="isOpenSampleCard = !isOpenSampleCard"
                  ) {{ isOpenSampleCard ? $t('UU0026') : $t('UU0033') }}
                  div(
                    v-if="isOpenSampleCard"
                    class="flex-shrink-0 w-75 h-fit ml-8 sticky top-0"
                  )
                    cropper-default-layout(
                      v-if="isImageCropConfigReady"
                      :showScale="true"
                      :config="cropperConfig"
                      @update:rotateDeg="cropperConfig.rotateDeg = $event"
                      @update:scaleRatio="cropperConfig.scaleRatio = $event / 100"
                    )
                      template(#imageCropArea)
                        image-crop-area(
                          :config="cropperConfig"
                          :cropRectSize="cropRectSize"
                          @update:options="Object.assign(cropperConfig.options, $event)"
                        )
                    div(v-else class="h-111 flex justify-center items-center")
                      f-svg-icon(iconName="loading" size="54" class="text-primary-400")
</template>

<script setup lang="ts">
import { computed, ref, reactive, provide, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { onBeforeRouteLeave } from 'vue-router'
import { NOTIFY_TYPE } from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { useAssetsStore } from '@/stores/assets'
import { OgType, type PantoneColor } from '@frontier/platform-web-sdk'
import useMaterialForm from '@/composables/material/useMaterialForm'
import useU3mSelect from '@/composables/material/useU3mSelect'
import useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'
import useAttachmentUpdate from '@/composables/material/useAttachmentUpdate'
import useMaterial from '@/composables/material/useMaterial'
import BlockMaterialU3m from '@/components/assets/edit/BlockMaterialU3m.vue'
import BlockMaterialAttachmentFiles from '@/components/assets/edit/BlockMaterialAttachmentFiles.vue'
import MaterialDetailImage from '@/components/common/material/detail/internal/MaterialDetailImage.vue'
import BlockMaterialSpecification from '@/components/assets/edit/blockMaterialSpecification/BlockMaterialSpecification.vue'
import BlockMaterialTags from '@/components/assets/edit/BlockMaterialTags.vue'
import BlockMaterialInventory from '@/components/assets/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/edit/BlockMaterialPricing.vue'
import CropperDefaultLayout from '@/components/common/cropper/CropperDefaultLayout.vue'
import ImageCropArea from '@/components/common/cropper/ImageCropArea.vue'
import {
  materialAttachmentUpdateServiceKey,
  materialMultimediaUpdateServiceKey,
  materialFormServiceKey,
  materialU3mSelectServiceKey,
} from '@/utils/constants'
import type {
  MaterialFormService,
  CropperConfig,
  MaterialAttachmentUpdateService,
  MaterialMultimediaUpdateService,
  MaterialU3mSelectService,
} from '@/types'
import { Cropper } from '@/utils/cropper'

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

const pantoneList = computed(
  () => store.getters['code/pantoneList'] as PantoneColor[]
)

const materialFormService: MaterialFormService = useMaterialForm({
  material: material.value,
  materialOptions: materialOptions.value,
  pantoneList: pantoneList.value,
})

const u3mSelectService: MaterialU3mSelectService = useU3mSelect()
const multimediaUpdateService: MaterialMultimediaUpdateService =
  useMultimediaUpdate(material, materialFormService.updatePantoneList)
const attachmentUpdateService: MaterialAttachmentUpdateService =
  useAttachmentUpdate(material)

provide(materialFormServiceKey, materialFormService)
provide(materialU3mSelectServiceKey, u3mSelectService)
provide(materialMultimediaUpdateServiceKey, multimediaUpdateService)
provide(materialAttachmentUpdateServiceKey, attachmentUpdateService)

const { meta, handleSubmit } = materialFormService

const TAB = {
  SPECIFICATION: 0,
  TAGS: 1,
  PRICING: 2,
  INVENTORY: 3,
  ATTACHMENTS: 4,
}

const cropRectSize = 300

const tabList = computed(() => [
  { name: 'Specification', id: TAB.SPECIFICATION },
  { name: t('RR0133'), id: TAB.TAGS },
  { name: t('RR0134'), id: TAB.PRICING },
  { name: t('RR0135'), id: TAB.INVENTORY },
  { name: t('Attachments'), id: TAB.ATTACHMENTS },
])

const { primarySideImage, displayImageList, publicFileViewModeList } =
  useMaterial(material)

const cropperConfig: CropperConfig = reactive({})
const isOpenSampleCard = ref(false)
const isImageCropConfigReady = ref(false)

const hasSampleCard = computed(() => Boolean(primarySideImage.value))

const getCropperConfig = async () => {
  if (primarySideImage.value) {
    const cropper = new Cropper({
      src: primarySideImage.value.originalUrl,
      dpi: primarySideImage.value.dpi,
      cropRectSize,
    })
    await cropper.formatImage()
    Object.assign(cropperConfig, cropper.config)
    isImageCropConfigReady.value = true
  }
}

const openModalMultimediaUpdate = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-multimedia-upload',
    properties: { multimediaUpdateService },
  })
}

const openModalScannedImageUpdate = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-scanned-image-update',
    properties: { multimediaUpdateService },
  })
}

const submit = handleSubmit(async (form) => {
  updateMaterial({
    form,
    u3m: u3mSelectService.u3mFile.value
      ? {
          u3mFile: u3mSelectService.u3mFile.value,
          needToGeneratePhysical: u3mSelectService.needToGeneratePhysical.value,
          hasUploadedU3mFile: u3mSelectService.hasUploadedU3mFile.value,
        }
      : undefined,
  })
})

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

watchEffect(getCropperConfig)
</script>
