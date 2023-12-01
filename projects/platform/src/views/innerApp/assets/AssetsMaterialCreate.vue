<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-260 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$event.goTo?.()"
      )
      f-button(size="sm" type="secondary" class="ml-5" @click="openModalMassUpload") {{ $t('UU0009') }}
    block-material-create(
      v-if="materialOptions != null"
      :materialOptions="materialOptions"
      @submit="createMaterial"
    )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import BlockMaterialCreate from '@/components/assets/edit/BlockMaterialCreate.vue'
import useNavigation from '@/composables/useNavigation'
import { useAssetsStore } from '@/stores/assets'
import {
  MaterialSideType,
  type MaterialOptions,
  type MaterialPriceInfo,
  type CreateAssetsMaterialRequest,
  type MaterialInternalInventoryInfo,
  type MaterialInternalInventoryInfoSampleCardsRemainingListInner,
} from '@frontier/platform-web-sdk'
import { NOTIFY_TYPE } from '@/utils/constants'
import type { AttachmentCreateItem, MultimediaCreateItem } from '@/types'
import type useMaterialForm from '@/composables/material/useMaterialForm'
import { uploadFileToS3 } from '@/utils/fileUpload'

const { t } = useI18n()
const store = useStore()
const { uploadCustomU3m, ogBaseAssetsApi } = useAssetsStore()
const { goToAssets, goToMaterialUpload, goToAssetsMaterialCreate } =
  useNavigation()

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

const materialOptions = ref<MaterialOptions | null>(null)

const fetchMaterialOptions = async () => {
  const res = await ogBaseAssetsApi('getMaterialOptions')
  materialOptions.value = res.data.result!
}

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
      const result = await uploadFileToS3(m.file, m.file.name)
      return {
        ...result,
        displayFileName: m.displayFileName,
        isCover: m.isCover,
      }
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

  const convertInventoryFormToReq = (
    inventoryInfo: MaterialInternalInventoryInfo
  ): MaterialInternalInventoryInfo => {
    const processRemainingList = (
      list: MaterialInternalInventoryInfoSampleCardsRemainingListInner[] | null
    ): MaterialInternalInventoryInfoSampleCardsRemainingListInner[] | null => {
      if (!list) {
        return null
      }

      const haveValues = list.some((h) => {
        if (
          h.location ||
          h.qtyInPcs != null ||
          h.shelf1 ||
          h.shelf2 ||
          h.source
        ) {
          return true
        }
        return false
      })
      return haveValues ? inventoryInfo.hangersRemainingList : null
    }

    const processYardageRemainingInfo = (
      info: MaterialInternalInventoryInfo['yardageRemainingInfo']
    ): MaterialInternalInventoryInfo['yardageRemainingInfo'] => {
      if (!info) {
        return null
      }

      const haveValues = info.list.some((i) => {
        if (
          i.location ||
          i.lot ||
          i.productionNo ||
          i.qty != null ||
          i.roll ||
          i.shelf1 ||
          i.shelf2 ||
          i.source
        ) {
          return true
        }
        return false
      })

      return haveValues ? info : null
    }

    return {
      isTotalPublic: inventoryInfo.isTotalPublic,
      hangersRemainingList: processRemainingList(
        inventoryInfo.hangersRemainingList
      ),
      sampleCardsRemainingList: processRemainingList(
        inventoryInfo.sampleCardsRemainingList
      ),
      yardageRemainingInfo: processYardageRemainingInfo(
        inventoryInfo.yardageRemainingInfo
      ),
    }
  }

  const convertPriceInfoFormToReq = (
    priceInfo: MaterialPriceInfo
  ): MaterialPriceInfo => {
    return {
      ...priceInfo,
      pricing: priceInfo.pricing?.price ? priceInfo.pricing : null,
      minimumColor: priceInfo.minimumColor?.qty
        ? {
            qty: priceInfo.minimumColor.qty,
            unit: priceInfo.minimumColor.unit,
          }
        : null,
      minimumOrder: priceInfo.minimumOrder?.qty
        ? {
            qty: priceInfo.minimumOrder.qty,
            unit: priceInfo.minimumOrder.unit,
          }
        : null,
    }
  }

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
        croppedImage: null,
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

  return material
}

const openModalMassUpload = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-mass-upload',
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

fetchMaterialOptions()
</script>
