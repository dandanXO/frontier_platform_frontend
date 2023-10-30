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
import type { MaterialOptionsCode } from '@frontier/platform-web-sdk'
import mockMaterialOptions from '@/stores/assets/mockMaterialOptions'
import { NOTIFY_TYPE } from '@/utils/constants'
import assetsApi from '@/apis/assets'
import type { Multimedia } from '@/composables/material/useMultimediaSelect'
import type { Attachment } from '@/composables/material/useAttachmentSelect'
import type useMaterialForm from '@/composables/material/useMaterialForm'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'

const { t } = useI18n()
const store = useStore()
const { uploadCustomU3m } = useAssetsStore()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
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

const materialOptions = ref<MaterialOptionsCode | null>(null)

const fetchMaterialOptions = async () => {
  // const res = await assetsApi.getMaterialOptions(req)
  // materialOptions.value = res.data.result!.code
  await new Promise((resolve) => setTimeout(resolve, 1000))
  materialOptions.value = mockMaterialOptions
}

const createMaterial = async (payload: {
  form: ReturnType<typeof useMaterialForm>['values']
  multimediaList: Multimedia[]
  attachmentList: Attachment[]
  u3m?: {
    u3mFile: File
    needToGeneratePhysical: boolean
    hasUploadedU3mFile: boolean
  } | null
}) => {
  const { form, multimediaList, attachmentList, u3m } = payload
  store.dispatch('helper/openModalLoading')

  const uploadMultiMediaTasks = Promise.all(
    multimediaList.map((m) => uploadFileToS3(m.file, m.file.name))
  )
  const uploadAttachmentTasks = Promise.all(
    attachmentList.map((m) => uploadFileToS3(m.file, m.file.name))
  )

  const [multimediaResult, attachmentResult] = await Promise.all([
    uploadMultiMediaTasks,
    uploadAttachmentTasks,
  ])

  const req = {
    ...form,
    hasCustomU3mUploading: u3m.hasUploadedU3mFile || false,
    multimediaList: multimediaResult.map((m) => ({
      s3UploadId: m.s3UploadId,
      fileName: m.fileName,
      displayFileName: m.fileName,
      isCover: true,
      croppedImage: null,
    })),
    internalInfo: {
      ...form.internalInfo,
      attachmentList: attachmentResult.map((m) => ({
        s3UploadId: m.s3UploadId,
        fileName: m.fileName,
        displayFileName: m.fileName,
      })),
    },
  }

  // const res = await assetsApi.createAssetsMaterial(req)
  const res = await ogBaseAssetsApi(assetsApi.createAssetsMaterial)(req)
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
