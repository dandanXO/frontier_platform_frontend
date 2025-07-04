<template lang="pug">
div(class="flex flex-col gap-y-5 w-[360px]")
  div(class="relative w-full h-[360px]")
    file-display(
      class="w-full h-full"
      :displayUrl="localFileList[currentDisplayIndex]?.displayUrl"
      :originalUrl="localFileList[currentDisplayIndex]?.originalUrl"
      :extension="localFileList[currentDisplayIndex]?.extension"
    )
    template(v-if="props.showMoreMenu")
      f-button(
        class="!absolute !top-5 !right-5 dropdown-container !h-10 !w-10 !rounded-[4px] !border !border-green-200-v1 !bg-white focus:!shadow-[0px_0px_0px_2px_#8ADDF4]"
        @click="isDropdownOpen = !isDropdownOpen"
        isIcon
      )
        f-svg-icon(iconName="more" size="20" class="text-green-500-v1")
      f-contextual-menu(
        v-if="isDropdownOpen"
        class="absolute top-[68px] right-5 z-50"
        :menuTree="moreMenuTree"
      )
    div(class="absolute flex bottom-5 right-5 gap-x-5")
      low-dpi-label(
        :material="material"
        :materialOptions="materialOptions"
        :placement="TOOLTIP_PLACEMENT.LEFT"
        v-if="localFileList[currentDisplayIndex]?.isLowDpi"
        :offset="[0, 10]"
        theme="new-dark"
      )
    div(class="absolute flex top-5 right-5 gap-x-5")
      f-tooltip(
        :placement="TOOLTIP_PLACEMENT.TOP"
        theme="new-dark"
        :offset="[0, 4]"
      )
        template(#slot:tooltip-trigger)
          f-button(
            v-if="!props.hideMagnifier"
            @click="openViewMode"
            size="md"
            type="secondary"
            isIcon
            data-theme="new"
            class="!bg-primary"
          )
            f-svg-icon(iconName="loupe" size="20")
        template(#slot:tooltip-content)
          p(class="text-xs break-all") {{ $t('EE0242') }}
    div(class="absolute flex items-center bottom-5 left-5 right-5 gap-x-5")
      button(
        v-if="isShowEdit"
        class="flex items-center justify-center w-10 h-10 rounded-md cursor-pointer bg-grey-100/40"
        @click="emits('editScannedImage')"
      )
        f-svg-icon(iconName="reset_image" size="32" class="text-grey-900")
      button(
        v-if="isShowStar"
        class="flex items-center justify-center w-10 h-10 rounded-md cursor-pointer bg-grey-100/40"
        @click="emits('updateCurrentCoverIndex', currentDisplayIndex)"
      )
        f-svg-icon(
          v-if="localFileList[currentDisplayIndex].id === props.coverId"
          iconName="star_solid"
          size="32"
          class="text-primary-400"
        )
        f-svg-icon(
          v-else
          iconName="star"
          size="32"
          :class="[props.selectedId && props.selectedId === localFileList[currentDisplayIndex].id ? 'text-primary-400' : 'text-grey-900']"
        )
      div(v-if="isShowDDButton" class="flex-col ml-auto")
        button(
          class="flex flex-col items-center justify-center w-10 h-10 rounded-md cursor-pointer bg-grey-100/40"
          @click="isDDMenuOpen = !isDDMenuOpen"
        )
          f-svg-icon(iconName="3D_material" size="32" class="text-grey-900")
        div
          f-contextual-menu(
            class="absolute z-50 mt-2"
            :menuTree="dDMenuTree"
            v-if="isDDMenuOpen"
          )
    //- Warning message is displayed when the 3D Digital Drape image fails to be processed.
    div(
      v-if="isShowDDButton && isDDFailedToGenerate && isShowDDWarning"
      class="absolute bg-grey-50 z-50 py-3 px-4 top-2.5 right-2.5 left-2.5 border border-yellow-300 border-solid rounded flex"
    )
      div(class="w-4 mr-2.5")
        f-svg-icon(iconName="error_outline" size="16" class="text-yellow-500")
      div(class="flex-grow leading-4 text-grey-600 text-caption") 
        p(class="font-bold leading-4") {{ $t('WW0167') }}
        p(class="font-normal leading-4") 
          span {{ $t('EE0188') + ' ' }}
          a(class="underline cursor-pointer" @click.prevent="handleCreateFeedback") {{ $t('RR0123') }}
        a(class="cursor-pointer text-cyan-500" @click.prevent="handleCreateU3m") {{ $t('UU0082') }}
      div(class="w-4 ml-2.5")
        f-svg-icon(
          iconName="close"
          size="16"
          class="text-grey-600"
          @click.prevent="hideDDWarning"
        )
    //- A loading spinner is displayed when the 3D Digital Drape image is being processed.
    div(
      v-if="isShowDDButton && isDDProcessing"
      class="absolute z-50 flex flex-col items-center justify-center p-3 transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-grey-50 w-51 top-1/2 left-1/2 shadow-2"
    )
      f-svg-icon(iconName="loading" size="40" class="text-primary-500, min-h-7")
      p(class="leading-4 text-center text-grey-600 text-caption") {{ isCustomDDSelected ? $t('EE0185') : $t('EE0184') }}
  slider(ref="refSlider" class="w-full")
    div(class="flex justify-start gap-3")
      div(
        v-for="(image, index) in localFileList"
        :key="image.displayNameShort"
        class="flex flex-col gap-2 p-2 border rounded-lg cursor-pointer group"
        :class="currentDisplayIndex === index ? 'border-brand-solid bg-brand' : 'border-primary-border bg-white'"
        @click="clickSmallImage(index)"
        :data-index="index"
      )
        span(class="text-caption/1.6 text-primary-inverse line-clamp-1") {{ image.displayNameShort }} {{ image.caption ? `(${image.caption})` : '' }}
        file-thumbnail(
          class="w-[5.438rem] h-[5.438rem] group-hover:border-2"
          :thumbnailUrl="currentCoverImageUrl(image, index)"
          :originalUrl="image.originalUrl"
          :extension="image.extension"
          :loading="index === 3 && isDDProcessing"
        )
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  watch,
  type Ref,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import Slider from '@/components/common/Slider.vue'
import type { THEME } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { CoverId, MaterialFile } from '@/types'
import FileThumbnail from '@/components/common/material/file/FileThumbnail.vue'
import FileDisplay from '@/components/common/material/file/FileDisplay.vue'
import { IMAGE_FILE_ACCEPT_TYPE, TOOLTIP_PLACEMENT } from '@/utils/constants'
import { useCurrentDisplayIndex } from '@/composables/material/useMaterialDetailImage'
import { useI18n } from 'vue-i18n'
import {
  DigitalDrapeStatus,
  Extension,
  MaterialU3mSourceType,
  type Material,
  type SetAssetsMaterialDigitalDrapeRequest,
} from '@frontier/platform-web-sdk'
import useAssets from '@/composables/useAssets'
import { useAssetsStore } from '@/stores/assets'
import useNavigation from '@/composables/useNavigation'
import LowDpiLabel from '@/components/assets/LowDpiLabel.vue'
// 預防edge case暫存上一個選擇
const preDisplayIndex = ref(0)
const props = withDefaults(
  defineProps<{
    availableFileList: Array<MaterialFile>
    currentCoverIndex?: number
    currentSideType: number
    getMenuTree?: ((index: number | string, theme: THEME) => MenuTree) | null
    canEdit?: boolean
    canStar?: boolean
    selectedId?: number | null
    selectCover?: ((index: CoverId) => void) | null
    coverId?: CoverId | null
    hideMagnifier?: boolean
    material: Material
    showMoreMenu?: boolean
  }>(),
  {
    canEdit: false,
    canStar: false,
    selectedId: null,
    coverId: null,
    hideMagnifier: false,
    showMoreMenu: false,
  }
)

const localFileList = reactive<MaterialFile[]>([])
watch(
  () => props.availableFileList,
  async (newFileList) => {
    localFileList.splice(0, localFileList.length, ...newFileList)

    await nextTick()
    if (refSlider.value) {
      refSlider.value.recalculateSlider()
    }

    if (
      currentDisplayIndex.value >= newFileList.length &&
      newFileList.length > 0
    ) {
      setCurrentDisplayIndex(0)
    } else if (newFileList.length === 0) {
      // Handle case where all files are deleted
      setCurrentDisplayIndex(0)
    }
  },
  { immediate: true, deep: true }
)

const { t } = useI18n()

const openModal = (component: any, properties = {}) => {
  store.dispatch('helper/openModalBehavior', {
    component,
    properties,
  })
}
const handleCreateFeedback = openModal.bind(undefined, 'modal-send-feedback')

const { createU3m } = useAssets()
const handleCreateU3m = () => {
  createU3m.func(props.material)
}

const isCustomDDSelected = computed(() => {
  return props.material.customU3m?.digitalDrape?.isSelected
})

const isDDProcessing = computed(() => {
  const isCustomProcessing =
    props.material.customU3m?.digitalDrape?.isSelected &&
    props.material.customU3m.digitalDrape.status ===
      DigitalDrapeStatus.PROCESSING
  const isAutoProcessing =
    props.material.u3m?.digitalDrape?.isSelected &&
    props.material.u3m.digitalDrape.status === DigitalDrapeStatus.PROCESSING
  return isCustomProcessing || isAutoProcessing
})

const isDDFailedToGenerate = computed(() => {
  const isCustomFailed =
    props.material.customU3m?.digitalDrape?.isSelected &&
    props.material.customU3m.digitalDrape.status ===
      DigitalDrapeStatus.UNSUCCESSFUL
  const isAutoFailed =
    props.material.u3m?.digitalDrape?.isSelected &&
    props.material.u3m.digitalDrape.status === DigitalDrapeStatus.UNSUCCESSFUL
  return isCustomFailed || isAutoFailed
})

const isShowDDWarning = ref(true)
const hideDDWarning = () => {
  isShowDDWarning.value = false
}

const { ogBaseAssetsApi } = useAssetsStore()

const materialOptionsRes = await ogBaseAssetsApi('getMaterialOptions')
const materialOptions = materialOptionsRes.data.result

const isDDMenuOpen = ref(false)
const dDMenuTree: Ref<MenuTree> = computed(() => {
  let menuList = []
  const hasAutoDD = props.material.u3m?.digitalDrape
  const hasCustomDD = props.material.customU3m?.digitalDrape
  const hasNoDDs = !hasAutoDD && !hasCustomDD

  if (hasNoDDs) {
    menuList.push({
      title: t('EE0181'),
    })
  }

  menuList.push({
    title: hasAutoDD
      ? t('EE0174')
      : t('EE0182', { EE0174: t('EE0174'), EE0019: t('EE0019') }),
    clickHandler: async () => {
      isDDMenuOpen.value = false
      try {
        await ogBaseAssetsApi(
          'setAssetsMaterialDigitalDrape',
          getDDReq(MaterialU3mSourceType.FRONTIER)
        )
        updateDigitalDrape(MaterialU3mSourceType.FRONTIER)
      } catch (error) {
        console.error(
          'An error occurred while setting the Digital Drape Asset:',
          error
        )
      }
    },
    disabled: !hasAutoDD,
  })

  menuList.push({
    title: hasCustomDD
      ? t('EE0175')
      : t('EE0183', { EE0175: t('EE0175'), EE0019: t('EE0019') }),
    clickHandler: async () => {
      isDDMenuOpen.value = false
      try {
        await ogBaseAssetsApi(
          'setAssetsMaterialDigitalDrape',
          getDDReq(MaterialU3mSourceType.CUSTOMIZED)
        )
        updateDigitalDrape(MaterialU3mSourceType.CUSTOMIZED)
      } catch (error) {
        console.error(
          'An error occurred while setting the Digital Drape Asset:',
          error
        )
      }
    },
    disabled: !hasCustomDD,
  })

  return {
    rootTitle: t('EE0180'),
    width: 'w-100',
    blockList: [
      {
        menuList: menuList,
      },
    ],
  }
})

const currentCoverImageUrl = (image: MaterialFile, index: number) => {
  return index !== 0
    ? image.thumbnailUrl
    : props.availableFileList[props.currentCoverIndex ?? 0].thumbnailUrl
}

// 這裡的currentDisplayIndex 1:face, 2:middle 3:back
const { currentDisplayIndex, setCurrentDisplayIndex } = useCurrentDisplayIndex()
// reset to 0 以防切換布料detail out of range 問題
setCurrentDisplayIndex(0)

preDisplayIndex.value = currentDisplayIndex.value
const refSlider = ref<InstanceType<typeof Slider>>()
const clickSmallImage = (index: number) => {
  const isValidCoverIndex =
    index === 0 &&
    props.currentCoverIndex != null &&
    props.currentCoverIndex < props.availableFileList.length

  setCurrentDisplayIndex(
    isValidCoverIndex ? props.currentCoverIndex ?? 0 : index
  )
  preDisplayIndex.value = currentDisplayIndex.value

  // Auto-scroll to make the clicked thumbnail fully visible
  if (refSlider.value) {
    const thumbnailElement = refSlider.value.$el.querySelector(
      `[data-index="${index}"]`
    )
    if (thumbnailElement) {
      const sliderRect = refSlider.value.$el.getBoundingClientRect()
      const thumbnailRect = thumbnailElement.getBoundingClientRect()

      // Check if thumbnail is partially visible
      if (
        thumbnailRect.right > sliderRect.right ||
        thumbnailRect.left < sliderRect.left
      ) {
        // Calculate which page the thumbnail should be on
        const thumbnailWidth = thumbnailRect.width
        const thumbnailsPerPage = Math.floor(sliderRect.width / thumbnailWidth)
        const targetPage = Math.floor(index / thumbnailsPerPage)

        // Use the movement value to scroll to the correct page
        const scrollAmount = targetPage * refSlider.value.movement
        refSlider.value.scrollTo(scrollAmount)
      }
    }
  }
}

const emits = defineEmits<{
  (e: 'editMultimedia'): void
  (e: 'editScannedImage'): void
  (e: 'updateCurrentCoverIndex', index: number): void
}>()

const store = useStore()

const orgId = computed(() => store.getters['organization/orgId'] as number)
const { ogId, ogType } = useNavigation()

const openViewMode = () => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: currentDisplayIndex.value,
        fileList: computed(() => props.availableFileList),
        getMenuTree: props.getMenuTree,
      },
    },
  })
}

const isShowStar = computed(
  () =>
    props.canStar &&
    IMAGE_FILE_ACCEPT_TYPE.includes(
      props.availableFileList[currentDisplayIndex.value].extension
    ) &&
    props.availableFileList[currentDisplayIndex.value].id !== 'faceSideRuler' &&
    props.availableFileList[currentDisplayIndex.value].id !== 'backSideRuler' &&
    props.availableFileList[currentDisplayIndex.value].id !== 'cover'
)

const isShowDDButton = computed(
  // F22-3498 Hide and wait for custom U3M DD ready.
  () => false
  // () => props.availableFileList[currentDisplayIndex.value].id === 'digitalDrape'
)

const isShowEdit = computed(
  () =>
    props.canEdit &&
    IMAGE_FILE_ACCEPT_TYPE.includes(
      props.availableFileList[currentDisplayIndex.value].extension
    ) &&
    (props.availableFileList[currentDisplayIndex.value].id === 'faceSide' ||
      props.availableFileList[currentDisplayIndex.value].id === 'backSide')
)

watch(
  // props.currentSideType 1:face, 2:middle 3:back
  () => props.currentSideType,
  (currentSideIndex) => {
    const sideMap: { [key: number]: string } = {
      1: 'faceSide',
      3: 'backSide',
    }
    // 2是mimiddle 不會有圖片因此跳過
    if (currentSideIndex === 2) {
      return
    }
    // 可能會有超過問題 因此使用id找
    if (props.availableFileList[currentDisplayIndex.value]) {
      let findInAvailableFileListIndex = props.availableFileList.findIndex(
        (item) => {
          return item.id === sideMap[currentSideIndex]
        }
      )
      currentDisplayIndex.value = findInAvailableFileListIndex
      return
    }
    currentDisplayIndex.value = currentSideIndex
  }
)

const getDDReq = (
  sourceType: MaterialU3mSourceType
): SetAssetsMaterialDigitalDrapeRequest => {
  const req: SetAssetsMaterialDigitalDrapeRequest = {
    orgId: orgId.value,
    ogId: ogId.value,
    ogType: ogType.value,
    materialId: props.material.materialId,
    sourceType,
  }
  return req
}

function updateDigitalDrape(sourceType: MaterialU3mSourceType) {
  const digitalDrapeIndex = localFileList.findIndex(
    (item) => item.id === 'digitalDrape'
  )
  if (digitalDrapeIndex !== -1) {
    const source =
      sourceType === MaterialU3mSourceType.CUSTOMIZED
        ? props.material.customU3m.digitalDrape
        : props.material.u3m.digitalDrape
    localFileList.splice(digitalDrapeIndex, 1, {
      id: 'digitalDrape',
      fileId: null,
      displayUrl: source.displayUrl,
      originalUrl: source.originalUrl,
      thumbnailUrl: source.thumbnailUrl,
      displayName: `${t('MI0136')}${
        sourceType === MaterialU3mSourceType.CUSTOMIZED
          ? ''
          : `(${t('MI0137')})`
      }`,
      displayNameShort: t('MI0136'),
      caption: null,
      extension: Extension.JPG,
    })
  }
}

const isDropdownOpen = ref(false)

const deleteMenuItem = computed(() => {
  const currentFile = props.availableFileList[currentDisplayIndex.value]
  if (
    !currentFile ||
    typeof currentFile.id !== 'number' ||
    !props.getMenuTree
  ) {
    return null
  }
  // The theme is hardcoded as we don't have theme prop here.
  const menuTree = props.getMenuTree(currentFile.id, 'light' as THEME)
  if (!menuTree) {
    return null
  }

  return menuTree.blockList
    .flatMap((block) => block.menuList)
    .find((item) => item.title && item.title.toLowerCase().includes('delete'))
})

const isDeletable = computed(() => {
  return !!(deleteMenuItem.value && deleteMenuItem.value.clickHandler)
})

const handleSetAsCover = () => {
  isDropdownOpen.value = false
  emits('updateCurrentCoverIndex', currentDisplayIndex.value)
}

const handleReplaceAndEdit = () => {
  isDropdownOpen.value = false
  emits('editScannedImage')
}

const handlePreviewSampleCard = () => {
  isDropdownOpen.value = false

  // Clean up old preview data from sessionStorage
  const keysToRemove = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key && key.startsWith('preview_')) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key))

  // Create a unique key for this preview session
  const previewKey = `preview_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`

  // Store the preview data in sessionStorage
  const previewData = {
    startIndex: currentDisplayIndex.value,
    fileList: props.availableFileList.map((file) => ({
      id: file.id,
      originalUrl: file.originalUrl,
      displayUrl: file.displayUrl || file.originalUrl, // Ensure displayUrl is set
      thumbnailUrl: file.thumbnailUrl,
      displayName: file.displayName,
      extension: file.extension,
      caption: file.caption,
    })),
  }

  sessionStorage.setItem(previewKey, JSON.stringify(previewData))

  // Open in new tab with the preview key
  const previewUrl = `${window.location.origin}/preview?key=${previewKey}`
  window.open(previewUrl, '_blank')
}

const handleDelete = () => {
  isDropdownOpen.value = false
  if (deleteMenuItem.value && deleteMenuItem.value.clickHandler) {
    deleteMenuItem.value.clickHandler(deleteMenuItem.value)
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    // a bit hacky, but it works for now.
    if (
      isDropdownOpen.value &&
      !target.closest('.dropdown-container') &&
      !target.closest('.f-contextual-menu')
    ) {
      isDropdownOpen.value = false
    }
  })
})

onUnmounted(() => {
  // A bit hacky, but it works for now.
  document.removeEventListener('click', () => {})
})

const moreMenuTree: Ref<MenuTree> = computed(() => {
  return {
    width: 'w-fit',
    blockList: [
      {
        menuList: [
          {
            title: 'Set as Cover',
            clickHandler: handleSetAsCover,
            disabled: !isShowStar.value,
          },
          {
            title: 'Replace & Edit',
            clickHandler: handleReplaceAndEdit,
            disabled: !isShowEdit.value,
          },
          {
            title: 'Preview Sample Card',
            clickHandler: handlePreviewSampleCard,
            // disabled: props.hideMagnifier,
          },
        ],
      },
      {
        menuList: [
          {
            title: 'Delete',
            icon: 'delete_forever',
            iconClass: isDeletable.value ? '!text-red-500-v1' : '',
            titleClass: isDeletable.value ? '!text-red-500-v1' : '',
            clickHandler: handleDelete,
            disabled: !isDeletable.value,
          },
        ],
      },
    ],
  }
})
</script>
