<template>
  <div class="flex flex-col gap-8 p-8 bg-grey-100-v1">
    <!-- Header -->
    <header-section
      :material-item-no="material?.itemNo"
      :material-id="materialId"
    />
    <!-- Content -->
    <div class="w-full h-fit pb-25" data-theme="new">
      <div class="flex justify-between pb-9">
        <material-item-display
          v-model:itemNo="itemNoForDisplay"
        ></material-item-display>
        <div class="flex flex-row items-center gap-4">
          <f-button
            class="!h-12 !font-bold !bg-white"
            type="secondary"
            size="md"
            @click="cancel"
            >{{ $t('UU0002') }}</f-button
          >
          <f-button
            class="!h-12 !font-bold"
            type="primary"
            size="md"
            :disabled="!meta.valid"
            @click="submit"
            >{{ $t('UU0018') }}</f-button
          >
        </div>
      </div>
      <div class="flex flex-row gap-8" data-theme="new">
        <!-- Left Side: Image and U3M -->
        <div class="flex flex-col gap-8">
          <material-detail-image
            showMoreMenu
            :selectedId="
              typeof multimediaUpdateService.selectedCoverId.value === 'string'
                ? parseInt(multimediaUpdateService.selectedCoverId.value, 10)
                : multimediaUpdateService.selectedCoverId.value
            "
            :getMenuTree="(index: string | number, theme?: THEME) => multimediaUpdateService.getMultimediaMenuTree(typeof index === 'string' ? parseInt(index, 10) : index, theme)"
            :selectCover="multimediaUpdateService.selectCover"
            :coverId="coverId"
            @editScannedImage="openModalScannedImageUpdate"
            :currentCoverIndex="currentCoverIndex"
            :availableFileList="availableFileList"
            @updateCurrentCoverIndex="handleUpdateCurrentCoverIndex"
            hideMagnifier
            :material="material"
            :currentSideType="1"
          >
          </material-detail-image>

          <!-- 3D -->
          <material-u3m-section
            :material="material"
            :formFieldsMeta="formFieldsMeta"
          />
        </div>

        <!-- Right Side: Tabs and Content -->
        <div class="flex flex-col flex-1 min-w-164">
          <div class="flex flex-col gap-8">
            <!-- <TCInputShowcase /> -->

            <!-- Material Specification Form -->
            <material-specification-form
              :material="material"
              :pantoneList="pantoneList"
            />

            <!-- Material Tags Form -->
            <div ref="tagsAccordionRef">
              <material-tags-form
                :defaultExpanded="shouldExpandTags"
                :focusOnLoad="shouldFocusTags"
              />
            </div>

            <!-- Material Certification Form -->
            <div ref="certificationAccordionRef">
              <material-certification-form
                :defaultExpanded="shouldExpandCertification"
                :focusOnLoad="shouldFocusCertification"
              />
            </div>

            <!-- Material Pricing Form -->
            <div ref="pricingAccordionRef">
              <material-pricing-form
                :defaultExpanded="shouldExpandPricing"
                :focusOnLoad="shouldFocusPricing"
              />
            </div>

            <!-- Material Inventory Form -->
            <div ref="inventoryAccordionRef">
              <material-inventory-form
                :defaultExpanded="shouldExpandInventory"
              />
            </div>

            <!-- Material Attachments Form -->
            <div ref="attachmentsAccordionRef">
              <material-attachments-form
                :material="material"
                :defaultExpanded="shouldExpandAttachments"
                @selectCover="emits('selectCover', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import {
  ATTACHMENT_FILE_ACCEPT_TYPE,
  NOTIFY_TYPE,
  THEME,
  VERSION,
} from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { useAssetsStore } from '@/stores/assets'
import {
  type MultimediaFile,
  type PantoneColor,
  CustomFieldType as FType,
} from '@frontier/platform-web-sdk'
import useMaterialForm from '@/composables/material/useMaterialForm'
import useU3mSelect from '@/composables/material/useU3mSelect'
import useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'
import useAttachmentUpdate from '@/composables/material/useAttachmentUpdate'
import useMaterial from '@/composables/material/useMaterial'
import MaterialDetailImage from '@/components/common/material/detail/internal/MaterialDetailImage.vue'
import MaterialItemDisplay from './MaterialItemDisplay.vue'

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
import TCInputShowcase from '@/components/TCInputShowcase.vue'
import { useField } from 'vee-validate'

import HeaderSection from './assetsMaterialEditV2/HeaderSection.vue'
import MaterialU3mSection from './assetsMaterialEditV2/MaterialU3mSection.vue'
import MaterialSpecificationForm from './assetsMaterialEditV2/MaterialSpecificationForm.vue'
import MaterialTagsForm from './assetsMaterialEditV2/MaterialTagsForm.vue'
import MaterialCertificationForm from './assetsMaterialEditV2/MaterialCertificationForm.vue'
import MaterialPricingForm from './assetsMaterialEditV2/MaterialPricingForm.vue'
import MaterialInventoryForm from './assetsMaterialEditV2/MaterialInventoryForm.vue'
import MaterialAttachmentsForm from './assetsMaterialEditV2/MaterialAttachmentsForm.vue'
import type { FormFieldsMeta } from './assetsMaterialEditV2/types'

const props = defineProps<{
  materialId: string
}>()

const { t } = useI18n()
const store = useStore()
const { uploadCustomU3m, ogBaseAssetsApi } = useAssetsStore()
const notify = useNotifyStore()
const { goToAssetMaterialDetail } = useNavigation()
const assetsStore = useAssetsStore()
const materialId = computed(() => Number(props.materialId))
const route = useRoute()

// Check if we should expand and focus on tags based on query parameters
const shouldExpandTags = computed(() => {
  return route.query.expandTags === 'true' || route.query.focusTags === 'true'
})

const shouldFocusTags = computed(() => {
  return route.query.focusTags === 'true'
})

// Check if we should expand and focus on certification based on query parameters
const shouldExpandCertification = computed(() => {
  return (
    route.query.expandCertification === 'true' ||
    route.query.focusCertification === 'true'
  )
})

const shouldFocusCertification = computed(() => {
  return route.query.focusCertification === 'true'
})

// Check if we should expand and focus on pricing based on query parameters
const shouldExpandPricing = computed(() => {
  return (
    route.query.expandPricing === 'true' || route.query.focusPricing === 'true'
  )
})

const shouldFocusPricing = computed(() => {
  return route.query.focusPricing === 'true'
})

// Check if we should expand inventory based on query parameters
const shouldExpandInventory = computed(() => {
  return route.query.focusInventory === 'true'
})

// Check if we should expand attachments based on query parameters
const shouldExpandAttachments = computed(() => {
  return route.query.focusAttachments === 'true'
})

const [materialOptionsRes, materialRes] = await Promise.all([
  ogBaseAssetsApi('getMaterialOptions'),
  ogBaseAssetsApi('getAssetsMaterial', {
    materialId: materialId.value,
    searchLog: null,
  }),
])
const materialOptions = ref(materialOptionsRes.data.result!)
const material = ref(materialRes.data.result!.material)

const pantoneList = computed(
  () => store.getters['code/pantoneList'] as PantoneColor[]
)

const materialFormService: MaterialFormService = useMaterialForm({
  material: material.value,
  materialOptions: materialOptions.value,
  pantoneList: pantoneList.value,
})

const itemNoForDisplay = computed({
  get: () => material.value?.itemNo || '',
  set: (newValue: string) => {
    if (material.value) {
      material.value.itemNo = newValue
    }
  },
})

const isConfirmedToLeave = ref(false)
const initialFormValues = ref<any>(null)

const u3mSelectService: MaterialU3mSelectService = useU3mSelect(material.value)
const multimediaUpdateService: MaterialMultimediaUpdateService =
  useMultimediaUpdate(material, materialFormService.updatePantoneList)
const attachmentUpdateService: MaterialAttachmentUpdateService =
  useAttachmentUpdate(material)

provide(materialFormServiceKey, materialFormService)
provide(materialU3mSelectServiceKey, u3mSelectService)
provide(materialMultimediaUpdateServiceKey, multimediaUpdateService)
provide(materialAttachmentUpdateServiceKey, attachmentUpdateService)

const { meta, handleSubmit, validate } = materialFormService

const cropRectSize = 300

const coverId = computed(() => {
  const materialCover = multimediaUpdateService.multimediaList.value.find(
    (item) => item.isCover === true
  )

  return materialCover?.fileId || null
})

const { primarySideImage, publicFileList } = useMaterial(material)
const availableFileList = computed(() =>
  publicFileList.value.filter((item: MaterialFile) => {
    if (store.getters['permission/isDigitalDrapeTrialRule']) {
      return ATTACHMENT_FILE_ACCEPT_TYPE.includes(item.extension)
    } else {
      return (
        ATTACHMENT_FILE_ACCEPT_TYPE.includes(item.extension) &&
        item.id !== 'digitalDrape'
      )
    }
  })
)

const { currentCoverIndex, setCurrentCoverIndex } = useCurrentCoverIndex()
setCurrentCoverIndex(0)
const handleUpdateCurrentCoverIndex = (index: number) => {
  setCurrentCoverIndex(index)
  if (availableFileList.value[index]) {
    multimediaUpdateService.selectCover(
      availableFileList.value[index].id as CoverId
    )
  }
}

// Track form changes - simplified approach
// We'll track this manually in the form components instead of using watchers

// Track material changes - simplified approach
// We'll track this manually when user makes changes

// Deep comparison function for Vue reactive objects - only compare existing fields
const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return obj1 === obj2
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // Only compare keys that exist in both objects
  const commonKeys = keys1.filter((key) => keys2.includes(key))

  for (const key of commonKeys) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

// Track changes by comparing against initial values
const hasUnsavedChanges = computed(() => {
  const hasU3mFile = u3mSelectService.u3mFile.value !== null
  const hasMultimedia = multimediaUpdateService.multimediaList.value.length > 0
  const hasAttachments = attachmentUpdateService.attachmentList.value.length > 0

  // Compare current form values with initial values using deep comparison
  let formChanged = false
  if (initialFormValues.value) {
    formChanged = !deepEqual(
      materialFormService.values,
      initialFormValues.value
    )
  }

  // Track itemNoForDisplay changes
  const itemNoChanged =
    initialFormValues.value &&
    itemNoForDisplay.value !== initialFormValues.value.itemNo

  return (
    formChanged ||
    itemNoChanged ||
    hasU3mFile ||
    hasMultimedia ||
    hasAttachments
  )
})

const cropperConfig: CropperConfig = reactive({})
const isOpenSampleCard = ref(true)
const isImageCropConfigReady = ref(false)

const hasSampleCard = computed(() => Boolean(primarySideImage.value))

const getCropperConfig = async () => {
  if (
    primarySideImage.value &&
    typeof primarySideImage.value === 'object' &&
    'originalUrl' in primarySideImage.value &&
    'dpi' in primarySideImage.value
  ) {
    const cropper = new Cropper({
      src: (primarySideImage.value as any).originalUrl,
      dpi: (primarySideImage.value as any).dpi,
      cropRectSize,
    })
    await cropper.formatImage()
    Object.assign(cropperConfig, cropper.config)
    isImageCropConfigReady.value = true
  } else {
    // Handle the case where primarySideImage is not as expected, e.g., log an error or set defaults
    console.warn(
      'primarySideImage.value is not in the expected format or is missing:',
      primarySideImage.value
    )
    isImageCropConfigReady.value = false // Ensure we don't try to render cropper with bad config
  }
}

const openModalScannedImageUpdate = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-scanned-image-update',
    properties: { multimediaUpdateService },
  })
}

const submit = handleSubmit(async (form) => {
  // Sync form values with material.value before submission
  if (material.value) {
    materialFormService.values.itemNo = material.value.itemNo
    form.itemNo = material.value.itemNo || ''
  }

  // Ensure custom fields have valid default values
  if (form.customFieldList) {
    const allCustomFields = [
      ...(materialOptions.value.customFieldList.specificationList || []),
      ...(materialOptions.value.customFieldList.fabricDetailList || []),
      ...(materialOptions.value.customFieldList.tagList || []),
      ...(materialOptions.value.customFieldList.pricingList || []),
      ...(materialOptions.value.customFieldList.inventoryList || []),
    ]

    Object.keys(form.customFieldList).forEach((key) => {
      const listName = key as keyof typeof form.customFieldList
      const list = form.customFieldList![listName]

      if (Array.isArray(list)) {
        list.forEach((field) => {
          if (field.value === null) {
            const fieldDefinition = allCustomFields.find(
              (f) => f.customFieldId === field.customFieldId
            )
            if (fieldDefinition) {
              switch (fieldDefinition.fieldType) {
                case FType.SINGLE_LINE_TEXT:
                case FType.NUMERIC_INPUT:
                case FType.SINGLE_SELECT_DROPDOWN:
                case FType.SINGLE_SELECT_RADIO_BUTTON:
                  field.value = ''
                  break
                case FType.MULTI_SELECT_DROPDOWN:
                  field.value = []
                  break
                default:
                  break
              }
            }
          }
        })
      }
    })
  }

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

const updateMaterial = async (payload: {
  form: ReturnType<typeof useMaterialForm>['values']
  u3m?: {
    u3mFile: File
    needToGeneratePhysical: boolean
    hasUploadedU3mFile: boolean
  } | null
}) => {
  function handleBeforeUnload(event: BeforeUnloadEvent) {
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
    })
  } else {
    store.dispatch('helper/pushModalLoading', {
      theme: THEME.LIGHT,
    })
  }
  const getReq = () => {
    const baseReq = {
      materialId: materialId.value,
      itemNo: form.itemNo,
      width: form.width,
      weight: form.weight,
      faceSide: form.faceSide,
      backSide: form.backSide,
      weightDisplaySetting: form.weightDisplaySetting,
      seasonInfo: form.seasonInfo,
      middleSide: form.middleSide,
      tagInfo: form.tagInfo,
      priceInfo: form.priceInfo,
      internalInfo: form.internalInfo,
      customFieldList: {
        specificationList: [],
        fabricDetailList: [],
        tagList: [],
        pricingList: [],
        inventoryList: [],
      },
      ...form,
    }

    baseReq.priceInfo = convertPriceInfoFormToReq(baseReq.priceInfo)
    if (baseReq.internalInfo) {
      baseReq.internalInfo.priceInfo = convertPriceInfoFormToReq(
        baseReq.internalInfo.priceInfo
      )
      baseReq.internalInfo.inventoryInfo = convertInventoryFormToReq(
        baseReq.internalInfo.inventoryInfo
      )
    }

    return {
      ...baseReq,
      materialId: materialId.value,
      hasCustomU3mUploading: u3m != null,
    }
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
        notify.showNotifySnackbar({
          title: t('RR0528'),
          messageText: t('EE0164'),
          version: VERSION.V2,
          hasCloseButton: false,
        })
      })
      .catch(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      })
  } else {
    await ogBaseAssetsApi('updateAssetsMaterial', getReq())

    // Refresh material data after successful update
    const updatedMaterialRes = await ogBaseAssetsApi('getAssetsMaterial', {
      materialId: materialId.value,
      searchLog: null,
    })
    material.value = updatedMaterialRes.data.result!.material

    store.dispatch('helper/closeModalLoading')
    window.removeEventListener('beforeunload', handleBeforeUnload)
    isConfirmedToLeave.value = true
    goToAssetMaterialDetail({}, materialId.value)
    notify.showNotifySnackbar({
      title: t('RR0528'),
      messageText: t('EE0164'),
      version: VERSION.V2,
      hasCloseButton: false,
    })
  }
}

const cancel = async () => {
  // Only show confirm modal if there are unsaved changes
  if (hasUnsavedChanges.value) {
    store.dispatch('helper/pushModalConfirmLeave', {
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
  } else {
    // No unsaved changes, go directly to detail page
    isConfirmedToLeave.value = true
    goToAssetMaterialDetail({}, materialId.value)
  }
}

onBeforeRouteLeave(async () => {
  if (isConfirmedToLeave.value) {
    return true
  }

  // Only show confirm modal if there are unsaved changes
  if (!hasUnsavedChanges.value) {
    return true
  }

  const result = await new Promise((resolve) => {
    store.dispatch('helper/pushModalConfirmLeave', {
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

// Add emits definition
const emits = defineEmits<{
  (e: 'selectCover', coverId: number): void
}>()

// Create meta fields for MaterialU3mSection
const { meta: itemNoMeta } = useField('itemNo')
const { meta: widthMeta } = useField('width')
const { meta: weightMeta } = useField('weight')
const { meta: faceSideMaterialTypeMeta } = useField('faceSide.materialType')
const { meta: faceSideWarpDensityMeta } = useField(
  'faceSide.construction.warpDensity'
)
const { meta: faceSideWeftDensityMeta } = useField(
  'faceSide.construction.weftDensity'
)
const { meta: faceSideWarpYarnSizeMeta } = useField('faceSide.warpYarnSize')
const { meta: faceSideWeftYarnSizeMeta } = useField('faceSide.weftYarnSize')
const { meta: faceSideContentListMeta } = useField('faceSide.contentList')
const { meta: backSideMaterialTypeMeta } = useField('backSide.materialType')
const { meta: backSideWarpDensityMeta } = useField(
  'backSide.construction.warpDensity'
)
const { meta: backSideWeftDensityMeta } = useField(
  'backSide.construction.weftDensity'
)
const { meta: backSideWarpYarnSizeMeta } = useField('backSide.warpYarnSize')
const { meta: backSideWeftYarnSizeMeta } = useField('backSide.weftYarnSize')
const { meta: backSideContentListMeta } = useField('backSide.contentList')

// Create formFieldsMeta object for MaterialU3mSection
const formFieldsMeta = computed<FormFieldsMeta>(() => ({
  itemNoMeta,
  widthMeta,
  weightMeta,
  faceSideMaterialTypeMeta,
  faceSideWarpDensityMeta,
  faceSideWeftDensityMeta,
  faceSideWarpYarnSizeMeta,
  faceSideWeftYarnSizeMeta,
  faceSideContentListMeta,
  backSideMaterialTypeMeta,
  backSideWarpDensityMeta,
  backSideWeftDensityMeta,
  backSideWarpYarnSizeMeta,
  backSideWeftYarnSizeMeta,
  backSideContentListMeta,
}))

// Refs for accordion container divs (direct DOM access for scrolling)
const tagsAccordionRef = ref<HTMLElement | null>(null)
const certificationAccordionRef = ref<HTMLElement | null>(null)
const pricingAccordionRef = ref<HTMLElement | null>(null)
const inventoryAccordionRef = ref<HTMLElement | null>(null)
const attachmentsAccordionRef = ref<HTMLElement | null>(null)

// Function to scroll to expanded accordion when navigating from detail page
// This ensures the expanded accordion is visible in the viewport
const scrollToExpandedAccordion = async () => {
  await nextTick()

  // Wait for accordion animations to complete
  setTimeout(() => {
    let targetElement: HTMLElement | null = null

    if (shouldFocusTags.value && tagsAccordionRef.value) {
      targetElement = tagsAccordionRef.value
    } else if (
      shouldFocusCertification.value &&
      certificationAccordionRef.value
    ) {
      targetElement = certificationAccordionRef.value
    } else if (shouldFocusPricing.value && pricingAccordionRef.value) {
      targetElement = pricingAccordionRef.value
    } else if (shouldExpandInventory.value && inventoryAccordionRef.value) {
      targetElement = inventoryAccordionRef.value
    } else if (shouldExpandAttachments.value && attachmentsAccordionRef.value) {
      targetElement = attachmentsAccordionRef.value
    }

    if (targetElement && typeof targetElement.scrollIntoView === 'function') {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    } else if (targetElement) {
      // Fallback: try to scroll using window.scrollTo if scrollIntoView doesn't work
      const rect = targetElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset + rect.top - 100 // 100px offset from top
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    }
  }, 400) // Delay to ensure accordion is fully expanded
}

onMounted(() => {
  validate()
  if (!hasSampleCard.value) {
    isOpenSampleCard.value = false
  }

  // Capture initial form values after form is populated
  nextTick(() => {
    // Wait a bit more for the form to be fully populated
    setTimeout(() => {
      initialFormValues.value = JSON.parse(
        JSON.stringify(materialFormService.values)
      )
    }, 100)
  })

  // Scroll to expanded accordion if needed
  if (
    shouldFocusTags.value ||
    shouldFocusCertification.value ||
    shouldFocusPricing.value ||
    shouldExpandInventory.value ||
    shouldExpandAttachments.value
  ) {
    scrollToExpandedAccordion()
  }
})

// Watch for changes in focus/expand conditions
watch(
  [
    shouldFocusTags,
    shouldFocusCertification,
    shouldFocusPricing,
    shouldExpandInventory,
    shouldExpandAttachments,
  ],
  ([tags, cert, pricing, inventory, attachments]) => {
    if (tags || cert || pricing || inventory || attachments) {
      scrollToExpandedAccordion()
    }
  },
  { immediate: false }
)
</script>
