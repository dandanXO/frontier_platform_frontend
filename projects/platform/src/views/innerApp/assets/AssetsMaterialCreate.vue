<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-260 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$event.goTo?.()"
      )
    div(v-if="materialOptions" class="flex flex-col gap-y-17.5")
      div(class="flex items-center h-16")
        h5(class="text-h5 font-bold") {{ $t('MI0001') }}
      div(class="flex flex-col divide-y divide-grey-250")
        div(class="pl-15")
          block-material-type
        div(class="pl-15")
          f-tabs(:tabList="tabList" keyField="id" class="pt-10")
            template(#default="{ currentTab }")
              div(class="pt-10 grid gap-y-10")
                block-material-specification(
                  v-show="currentTab === TAB.SPECIFICATION"
                )
                block-material-tags(v-show="currentTab === TAB.TAGS")
                block-material-pricing(v-show="currentTab === TAB.PRICING")
                block-material-inventory(v-show="currentTab === TAB.INVENTORY")
                block-material-upload-files(
                  v-show="currentTab === TAB.UPLOAD_FILES"
                )
      div(class="flex flex-row gap-x-2 pl-15 justify-end w-full")
        f-button(type="secondary" size="md" @click="cancel") {{ $t('UU0002') }}
        f-button(
          type="primary"
          size="md"
          prependIcon="done"
          :disabled="submitCount > 0 && !meta.valid"
          @click="submit"
          data-cy="save-button"
        ) {{ $t('UU0018') }}
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import useNavigation from '@/composables/useNavigation'
import { useAssetsStore } from '@/stores/assets'
import {
  MaterialSideType,
  type CreateAssetsMaterialRequest,
  type CreateMultimediaFile,
} from '@frontier/platform-web-sdk'
import BlockMaterialType from '@/components/assets/edit/BlockMaterialType.vue'
import BlockMaterialSpecification from '@/components/assets/edit/blockMaterialSpecification/BlockMaterialSpecification.vue'
import BlockMaterialTags from '@/components/assets/edit/BlockMaterialTags.vue'
import BlockMaterialInventory from '@/components/assets/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/edit/BlockMaterialPricing.vue'
import BlockMaterialUploadFiles from '@/components/assets/edit/BlockMaterialUploadFiles.vue'
import {
  NOTIFY_TYPE,
  materialAttachmentCreateServiceKey,
  materialFormServiceKey,
  materialMultimediaCreateServiceKey,
  materialU3mSelectServiceKey,
} from '@/utils/constants'
import type {
  AttachmentCreateItem,
  MaterialAttachmentCreateService,
  MaterialFormService,
  MaterialMultimediaCreateService,
  MaterialU3mSelectService,
  MultimediaCreateItem,
} from '@/types'
import useMaterialForm from '@/composables/material/useMaterialForm'
import useU3mSelect from '@/composables/material/useU3mSelect'
import useMultimediaCreate from '@/composables/material/useMultimediaCreate'
import useAttachmentCreate from '@/composables/material/useAttachmentCreate'
import { uploadFileToS3 } from '@/utils/fileUpload'
import {
  convertInventoryFormToReq,
  convertPriceInfoFormToReq,
} from '@/utils/material'
import type { Organization } from '@frontier/platform-web-sdk'
import {
  TRACKER_POSTFIX,
  TRACKER_PREFIX,
  TRACKER_ADDITIONAL_PROPERTIES,
  TRACKER_ERROR_LOCATION,
  track,
} from '@frontier/lib'

const TRACKER_ID = 'Create Asset'
const { t } = useI18n()
const store = useStore()
const { uploadCustomU3m, ogBaseAssetsApi } = useAssetsStore()
const {
  goToAssets,
  goToMaterialUpload,
  goToAssetsMaterialCreate,
  goToAssetMaterialDetail,
} = useNavigation()

const isConfirmedToLeave = ref(false)
const breadcrumbList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: t('DD0045'),
      goTo: goToMaterialUpload,
    },
    {
      name: t('DD0012'),
      goTo: goToAssetsMaterialCreate,
    },
  ]
})

const materialOptionsRes = await ogBaseAssetsApi('getMaterialOptions')
const materialOptions = materialOptionsRes.data.result!

const materialFormService: MaterialFormService = useMaterialForm({
  materialOptions,
})
const u3mSelectService: MaterialU3mSelectService = useU3mSelect()
const multimediaCreateService: MaterialMultimediaCreateService =
  useMultimediaCreate()
const attachmentCreateService: MaterialAttachmentCreateService =
  useAttachmentCreate()

provide(materialFormServiceKey, materialFormService)
provide(materialU3mSelectServiceKey, u3mSelectService)
provide(materialMultimediaCreateServiceKey, multimediaCreateService)
provide(materialAttachmentCreateServiceKey, attachmentCreateService)

const {
  submitCount,
  meta,
  isSpecificationTabValid,
  isTagTabValid,
  isPricingTabValid,
  isInventoryTabValid,
  handleSubmit,
} = materialFormService

const TAB = {
  SPECIFICATION: 0,
  TAGS: 1,
  PRICING: 2,
  INVENTORY: 3,
  UPLOAD_FILES: 4,
}

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
  {
    name: t('RR0297'),
    id: TAB.UPLOAD_FILES,
  },
])

const submit = handleSubmit(
  async (form) =>
    createMaterial({
      form,
      multimediaList: multimediaCreateService.multimediaList,
      attachmentList: attachmentCreateService.attachmentList,
      u3m: u3mSelectService.u3mFile.value
        ? {
            u3mFile: u3mSelectService.u3mFile.value,
            needToGeneratePhysical:
              u3mSelectService.needToGeneratePhysical.value,
          }
        : undefined,
    }),
  (error) => {
    track({
      eventName: [
        TRACKER_PREFIX.SUBMIT_DATA,
        TRACKER_ID,
        TRACKER_POSTFIX.ERROR,
      ].join(' '),
      properties: {
        error,
        [TRACKER_ADDITIONAL_PROPERTIES.ERROR_LOCATION]:
          TRACKER_ERROR_LOCATION.FE,
      },
    })
  }
)

const createMaterial = async (payload: {
  form: ReturnType<typeof useMaterialForm>['values']
  multimediaList: MultimediaCreateItem[]
  attachmentList: AttachmentCreateItem[]
  u3m?: {
    u3mFile: File
    needToGeneratePhysical: boolean
  } | null
}) => {
  store.dispatch('helper/openModalLoading')
  const { form, multimediaList, attachmentList, u3m } = payload

  const uploadMultiMediaTasks = Promise.all(
    multimediaList.map(async (m) => {
      const uploadOriginalFileTask = uploadFileToS3(m.file, m.file.name)
      const uploadCroppedImageTask =
        m.croppedImage && m.cropRecord
          ? uploadFileToS3(m.croppedImage, m.croppedImage.name)
          : Promise.resolve(null)

      const [uploadRes, cropUploadRes] = await Promise.all([
        uploadOriginalFileTask,
        uploadCroppedImageTask,
      ])

      const result: CreateMultimediaFile = {
        s3UploadId: uploadRes.s3UploadId,
        fileName: uploadRes.fileName,
        displayFileName: m.displayFileName,
        isCover: m.isCover,
        croppedImage: cropUploadRes
          ? {
              s3UploadId: cropUploadRes.s3UploadId,
              fileName: cropUploadRes.fileName,
              cropRecord: m.cropRecord!,
            }
          : null,
      }

      return result
    })
  )

  const uploadAttachmentTasks = Promise.all(
    attachmentList.map(async (a) => {
      const result = await uploadFileToS3(a.file, a.file.name)
      return { ...result, displayFileName: a.displayFileName }
    })
  )

  const [multimediaResult, attachmentResult] = await Promise.all([
    uploadMultiMediaTasks,
    uploadAttachmentTasks,
  ])

  const processMaterialSideFormToReq = (
    form: ReturnType<typeof useMaterialForm>['values']
  ) => {
    let req: Omit<CreateAssetsMaterialRequest, 'orgId' | 'ogType' | 'ogId'> = {
      ...form,
    }

    if (!form.isDoubleSide) {
      if (form.sideType === MaterialSideType.FACE_SIDE) {
        req = { ...req, backSide: null }
      } else if (form.sideType === MaterialSideType.BACK_SIDE) {
        req = { ...req, faceSide: null }
      }
    }

    if (!form.isComposite) {
      req = { ...req, middleSide: null }
    }

    return req
  }

  const getReq = () => {
    let req = processMaterialSideFormToReq(form)

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
      hasCustomU3mUploading: u3m != null,
      multimediaList: multimediaResult.map((m) => ({
        s3UploadId: m.s3UploadId,
        fileName: m.fileName,
        displayFileName: m.displayFileName,
        isCover: m.isCover,
        croppedImage: m.croppedImage,
      })),
      internalInfo: {
        ...form.internalInfo,
        attachmentList: attachmentResult.map((a) => ({
          s3UploadId: a.s3UploadId,
          fileName: a.fileName,
          displayFileName: a.displayFileName,
        })),
      },
    }

    return req
  }

  const res = await ogBaseAssetsApi('createAssetsMaterial', getReq())
  store.dispatch('helper/closeModalLoading')

  const material = res.data.result!.material!
  if (u3m) {
    uploadCustomU3m({
      materialId: material.materialId,
      u3mFile: u3m.u3mFile,
      needToGeneratePhysical: u3m.needToGeneratePhysical,
    })
  }

  track({
    eventName: [
      TRACKER_PREFIX.SUBMIT_DATA,
      TRACKER_ID,
      TRACKER_POSTFIX.SUCCESS,
    ].join(' '),
  })
  isConfirmedToLeave.value = true
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-how-to-scan',
    properties: {
      header: t('DD0096'),
      title: t('DD0028'),
      primaryBtnText: t('UU0093'),
      secondaryBtnText: t('UU0092'),
      primaryHandler: () => {
        goToAssets()
        store.dispatch('helper/closeModalBehavior')
      },
      secondaryHandler: () => {
        goToMaterialUpload()
        store.dispatch('helper/closeModalBehavior')
      },
      materialList: [material],
    },
  })

  goToAssetMaterialDetail({}, material.materialId)
}

const org = computed<Organization>(
  () => store.getters['organization/organization']
)

const cancel = async () => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('RR0305'),
    contentText: t('RR0306'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: () => {
      isConfirmedToLeave.value = true
      goToAssets()
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
</script>
