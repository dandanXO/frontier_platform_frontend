<template lang="pug">
div(class="w-full h-full flex justify-center" data-theme="new")
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
          prependIcon="done"
          :disabled="!meta.valid"
          @click="submit"
        ) {{ $t('UU0018') }}
    div(class="flex flex-col gap-y-17.5")
      div(class="flex flex-row gap-x-15")
        material-detail-image(
          canEdit
          canStar
          :selectedId="multimediaUpdateService.selectedCoverId.value"
          :getMenuTree="multimediaUpdateService.getMultimediaMenuTree"
          :selectCover="multimediaUpdateService.selectCover"
          :coverId="coverId"
          @editScannedImage="openModalScannedImageUpdate"
          :currentCoverIndex="currentCoverIndex"
          :availableFileList="availableFileList"
          @updateCurrentCoverIndex="handleUpdateCurrentCoverIndex"
          hideMagnifier
          :material="material"
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
                    @selectCover="handleSelectCoverFromAttachmentFiles"
                  )
                  div(class="flex flex-row gap-x-2 pl-15 justify-end w-full")
                    f-button(type="secondary" size="md" @click="cancel") {{ $t('UU0002') }}
                    f-button(
                      type="primary"
                      size="md"
                      prependIcon="done"
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
                    @click="openSampleCard()"
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
import {
  computed,
  ref,
  reactive,
  provide,
  watchEffect,
  onMounted,
  watch,
} from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { onBeforeRouteLeave } from 'vue-router'
import {
  ATTACHMENT_FILE_ACCEPT_TYPE,
  NOTIFY_TYPE,
  THEME,
} from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { useAssetsStore } from '@/stores/assets'
import {
  OgType,
  type MultimediaFile,
  type PantoneColor,
  type UpdateAssetsMaterialRequest,
} from '@frontier/platform-web-sdk'
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
  MaterialFile,
  CoverId,
} from '@/types'
import { Cropper } from '@/utils/cropper'
import {
  convertInventoryFormToReq,
  convertPriceInfoFormToReq,
} from '@/utils/material'
import { useCurrentCoverIndex } from '@/composables/material/useMaterialDetailImage'
import ModalUploadProgress from '@/components/common/modal/ModalUploadProgress.vue'

const props = defineProps<{
  materialId: string
}>()

const { t } = useI18n()
const store = useStore()
const { uploadCustomU3m, ogBaseAssetsApi } = useAssetsStore()
const notify = useNotifyStore()
const { goToAssets, goToAssetMaterialDetail, goToAssetMaterialEdit } =
  useNavigation()
const assetsStore = useAssetsStore()
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

const u3mSelectService: MaterialU3mSelectService = useU3mSelect(material.value)
const multimediaUpdateService: MaterialMultimediaUpdateService =
  useMultimediaUpdate(material, materialFormService.updatePantoneList)
const attachmentUpdateService: MaterialAttachmentUpdateService =
  useAttachmentUpdate(material)

provide(materialFormServiceKey, materialFormService)
provide(materialU3mSelectServiceKey, u3mSelectService)
provide(materialMultimediaUpdateServiceKey, multimediaUpdateService)
provide(materialAttachmentUpdateServiceKey, attachmentUpdateService)

const {
  meta,
  handleSubmit,
  isSpecificationTabValid,
  isTagTabValid,
  isPricingTabValid,
  isInventoryTabValid,
  validate,
} = materialFormService

const TAB = {
  SPECIFICATION: 0,
  TAGS: 1,
  PRICING: 2,
  INVENTORY: 3,
  ATTACHMENTS: 4,
}

const cropRectSize = 300

const tabList = computed(() => [
  {
    name: t('MI0005'),
    id: TAB.SPECIFICATION,
    hasNewUpdate: !isSpecificationTabValid.value,
  },
  {
    name: t('RR0133'),
    id: TAB.TAGS,
    hasNewUpdate: !isTagTabValid.value,
  },
  {
    name: t('RR0134'),
    id: TAB.PRICING,
    hasNewUpdate: !isPricingTabValid.value,
  },
  {
    name: t('RR0135'),
    id: TAB.INVENTORY,
    hasNewUpdate: !isInventoryTabValid.value,
  },
  { name: t('RR0298'), id: TAB.ATTACHMENTS },
])

const coverId = computed(() => {
  const materialCover = multimediaUpdateService.multimediaList.value.find(
    (item) => item.isCover === true
  )

  return materialCover?.fileId || null
})

const { primarySideImage, publicFileList } = useMaterial(material)
const availableFileList = publicFileList.value.filter((item: MaterialFile) => {
  if (store.getters['permission/isDigitalDrapeTrialRule']) {
    return ATTACHMENT_FILE_ACCEPT_TYPE.includes(item.extension)
  } else {
    return (
      ATTACHMENT_FILE_ACCEPT_TYPE.includes(item.extension) &&
      item.id !== 'digitalDrape'
    )
  }
})

const { currentCoverIndex, setCurrentCoverIndex } = useCurrentCoverIndex()
setCurrentCoverIndex(0)
const handleUpdateCurrentCoverIndex = (index: number) => {
  setCurrentCoverIndex(index)
  multimediaUpdateService.selectCover(availableFileList[index].id as CoverId)
}

watch(
  () => multimediaUpdateService.multimediaList.value,
  (newList, oldList) => {
    const addedItems = newList.filter(
      (newItem: MultimediaFile) =>
        !oldList.some(
          (oldItem: MultimediaFile) => oldItem.fileId === newItem.fileId
        )
    )
    addedItems.forEach((item: MultimediaFile) => {
      availableFileList.push({
        id: item.fileId,
        fileId: item.fileId,
        originalUrl: item.originalUrl,
        thumbnailUrl: item.thumbnailUrl,
        displayUrl: item.displayUrl,
        displayName: item.displayFileName,
        displayNameShort: item.displayFileName,
        caption: item.displayFileName,
        extension: item.extension,
      })
    })

    const removedItems = oldList.filter(
      (oldItem: MultimediaFile) =>
        !newList.some(
          (newItem: MultimediaFile) => newItem.fileId === oldItem.fileId
        )
    )
    removedItems.forEach((item: MultimediaFile) => {
      const index = availableFileList.findIndex(
        (file: MaterialFile) => file.id === item.fileId
      )
      availableFileList.splice(index, 1)
    })
  }
)

const handleSelectCoverFromAttachmentFiles = (coverId: number) => {
  setCurrentCoverIndex(
    availableFileList.findIndex((item: MaterialFile) => item.id === coverId)
  )
  multimediaUpdateService.selectCover(coverId)
}

const cropperConfig: CropperConfig = reactive({})
const isOpenSampleCard = ref(true)
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

const openModalScannedImageUpdate = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-scanned-image-update',
    properties: { multimediaUpdateService },
  })
}

const submit = handleSubmit(async (form) => {
  await updateMaterial({
    form,
    u3m: u3mSelectService.u3mFile.value
      ? {
          u3mFile: u3mSelectService.u3mFile.value,
          needToGeneratePhysical: u3mSelectService.needToGeneratePhysical.value,
          hasUploadedU3mFile: u3mSelectService.hasUploadedU3mFile.value,
        }
      : undefined,
  })
  if (multimediaUpdateService.selectedCoverId.value) {
    await multimediaUpdateService.saveCover()
  }
})
const openSampleCard = () => {
  isOpenSampleCard.value = !isOpenSampleCard.value
}
const updateMaterial = async (payload: {
  form: ReturnType<typeof useMaterialForm>['values']
  u3m?: {
    u3mFile: File
    needToGeneratePhysical: boolean
    hasUploadedU3mFile: boolean
  } | null
}) => {
  function handleBeforeUnload(event) {
    event.returnValue = 'leave?'
    return 'leave?'
  }

  //beforeunload event
  window.addEventListener('beforeunload', handleBeforeUnload)

  const { form, u3m } = payload
  if (u3m) {
    store.dispatch('helper/pushModalUploadProgress', {
      body: ModalUploadProgress,
      classModal: 'w-116',
      closable: false,
      properties: {
        theme: THEME.LIGHT,
        hasUpload: true,
        onHandleCancel: () => {
          store.dispatch('helper/closeModal')
          assetsStore.updateabortController()
          store.commit('assets/SET_progressLoaded', 0)
          store.commit('assets/SET_progressTotal', 0)
        },
      },
      // theme: THEME.LIGHT,
      // hasUpload: !!u3m,
    })
  } else {
    store.dispatch('helper/pushModalLoading', {
      theme: THEME.LIGHT,
    })
  }
  const getReq = () => {
    let req: Omit<UpdateAssetsMaterialRequest, 'orgId' | 'ogType' | 'ogId'> = {
      ...form,
    }

    req.priceInfo = convertPriceInfoFormToReq(req.priceInfo)
    if (req.internalInfo) {
      req.internalInfo.priceInfo = convertPriceInfoFormToReq(
        req.internalInfo.priceInfo
      )
      req.internalInfo.inventoryInfo = convertInventoryFormToReq(
        req.internalInfo.inventoryInfo
      )
    }

    req = {
      ...req,
      materialId: materialId.value,
      hasCustomU3mUploading: u3m != null,
    }
    return req
  }

  if (u3m) {
    await uploadCustomU3m({
      materialId: material.value.materialId,
      u3mFile: u3m.u3mFile,
      needToGeneratePhysical: u3m.needToGeneratePhysical,
      callBackUrlTarget: 'updateAssetsMaterial',
      callBackUrlTargetQuery: getReq(),
    })
      .then(() => {
        store.dispatch('helper/closeModalLoading')
        window.removeEventListener('beforeunload', handleBeforeUnload)
        isConfirmedToLeave.value = true
        goToAssetMaterialDetail({}, materialId.value)
        notify.showNotifySnackbar({ messageText: t('EE0164') })
      })
      .catch(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      })
  } else {
    await ogBaseAssetsApi('updateAssetsMaterial', getReq())
    store.dispatch('helper/closeModalLoading')
    window.removeEventListener('beforeunload', handleBeforeUnload)
    isConfirmedToLeave.value = true
    goToAssetMaterialDetail({}, materialId.value)
    notify.showNotifySnackbar({ messageText: t('EE0164') })
  }
}

const cancel = async () => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('RR0305'),
    contentText: t('RR0306'),
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
      header: t('RR0305'),
      contentText: t('RR0306'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: resolve.bind(undefined, 'confirm'),
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
    })
  })

  return result === 'confirm'
})

watchEffect(getCropperConfig)

onMounted(() => {
  validate()
  if (!hasSampleCard.value) {
    isOpenSampleCard.value = false
  }
})
</script>
