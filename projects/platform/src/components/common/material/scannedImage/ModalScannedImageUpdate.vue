<template lang="pug">
modal-behavior(
  :header="$t('Scanned Display Settings')"
  :primaryBtnText="$t('UU0022')"
  :secondaryBtnText="$t('UU0002')"
  primaryBtnIcon="upload"
  :primaryBtnDisabled="!canSubmit"
  @click:primary="handleUpload"
  @click:secondary="closeModal"
)
  template(#note)
    div(class="pr-36.5")
      div(class="flex gap-x-2")
        div
          f-svg-icon(
            class="inline-block text-grey-600"
            iconName="info_outline"
            size="14"
          )
        p
          span {{ $t('You can also scan and email the material image to a preselected address') }}
          span {{ ' ' }}
          span(class="font-bold") {{ $t('CILynn@frontier.cool') }}
          span {{ ' ' }}
          span {{ ' ' }}
          span {{ ' ' }}
          span(
            class="text-body2 text-cyan-400 font-normal cursor-pointer"
            @click="openModalHowToScan"
          ) {{ $t('UU0032') }}
  div(class="min-w-196 p-5 flex flex-col gap-y-4")
    div(class="w-full h-full rounded flex items-center justify-center gap-x-2")
      side-image-row(
        v-if="isDoubleSide || sideType === MaterialSideType.FACE_SIDE"
        :title="$t('Face Side')"
        :originalThumbnailUrl="faceSideImage?.thumbnailUrl"
        :newImagePreviewUrl="faceSideChosenFilePreviewUrl"
        @upload="chooseFile(MaterialSideType.FACE_SIDE)"
        @delete="deleteChosenFile(MaterialSideType.FACE_SIDE)"
      )
      side-image-row(
        v-if="isDoubleSide || sideType === MaterialSideType.BACK_SIDE"
        :title="$t('Back Side')"
        :originalThumbnailUrl="backSideImage?.thumbnailUrl"
        :newImagePreviewUrl="backSideChosenFilePreviewUrl"
        @upload="chooseFile(MaterialSideType.BACK_SIDE)"
        @delete="deleteChosenFile(MaterialSideType.BACK_SIDE)"
      )
    div(
      class="w-full h-14.5 rounded px-4 bg-grey-50 flex flex-row items-center justify-between"
    )
      p(class="text-body2 text-grey-900") {{ $t('Crop material for better presentation in the preview and magnify mode') }}
      f-button(
        type="secondary"
        size="sm"
        prependIcon="crop"
        :disabled="!editable"
        @click="editSideImage"
      ) {{ $t('UU0027') }}
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import { useStore } from 'vuex'
import { MaterialSideType } from '@frontier/platform-web-sdk'
import { useI18n } from 'vue-i18n'
import { EXTENSION, FileOperator, NOTIFY_TYPE } from '@frontier/lib'
import useNavigation from '@/composables/useNavigation'
import SideImageRow from './SideImageRow.vue'
import type { MaterialMultimediaUpdateService } from '@/types'

const props = defineProps<{
  multimediaUpdateService: MaterialMultimediaUpdateService
}>()

const store = useStore()
const { t } = useI18n()
const { goToMaterialUpload } = useNavigation()

const fileSizeMaxLimit = 100 * Math.pow(1024, 3)
const acceptType = [EXTENSION.PNG, EXTENSION.JPEG, EXTENSION.JPG]
const faceSideFileOperator = new FileOperator(acceptType, fileSizeMaxLimit)
const backSideFileOperator = new FileOperator(acceptType, fileSizeMaxLimit)

const multimediaUpdateService = toRaw(props.multimediaUpdateService)

const { material, editSideImage, uploadSideImage } = multimediaUpdateService

const isDoubleSide = computed(() => material.value.isDoubleSide)
const sideType = computed(() => material.value.sideType)
const faceSideImage = computed(() => material.value.faceSide?.sideImage || null)
const backSideImage = computed(() => material.value.backSide?.sideImage || null)

const faceSideChosenFile = ref<File | null>(null)
const backSideChosenFile = ref<File | null>(null)

faceSideFileOperator.on('finish', (file: File) => {
  faceSideChosenFile.value = file
})
backSideFileOperator.on('finish', (file: File) => {
  backSideChosenFile.value = file
})

const faceSideChosenFilePreviewUrl = computed(() => {
  if (faceSideChosenFile.value) {
    return URL.createObjectURL(faceSideChosenFile.value)
  }
  return null
})

const backSideChosenFilePreviewUrl = computed(() => {
  if (backSideChosenFile.value) {
    return URL.createObjectURL(backSideChosenFile.value)
  }
  return null
})

const editable = computed(() => {
  if (faceSideChosenFile.value || backSideChosenFile.value) {
    return false
  }

  if (isDoubleSide.value) {
    return faceSideImage.value || backSideImage.value
  }

  return sideType.value === MaterialSideType.FACE_SIDE
    ? !!faceSideImage.value
    : !!backSideImage.value
})

const canSubmit = computed(() => {
  if (isDoubleSide.value) {
    return !!faceSideChosenFile.value || !!backSideChosenFile.value
  }

  if (sideType.value === MaterialSideType.FACE_SIDE) {
    return !!faceSideChosenFile.value
  } else {
    return !!backSideChosenFile.value
  }
})

watch(faceSideChosenFilePreviewUrl, (_newVal, oldVal) => {
  if (oldVal != null) {
    URL.revokeObjectURL(oldVal)
  }
})

watch(backSideChosenFilePreviewUrl, (_newVal, oldVal) => {
  if (oldVal != null) {
    URL.revokeObjectURL(oldVal)
  }
})

const chooseFile = (targetSide: MaterialSideType) => {
  if (targetSide === MaterialSideType.FACE_SIDE) {
    faceSideFileOperator.upload()
  } else {
    backSideFileOperator.upload()
  }
}

const deleteChosenFile = (targetSide: MaterialSideType) => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('DD0068'),
    contentText: t('DD0069'),
    primaryBtnText: t('UU0002'),
    secondaryBtnText: t('UU0001'),
    secondaryBtnHandler: () => {
      if (targetSide === MaterialSideType.FACE_SIDE) {
        faceSideChosenFile.value = null
      } else {
        backSideChosenFile.value = null
      }
    },
  })
}

const closeModal = () => {
  if (faceSideChosenFile.value || backSideChosenFile.value) {
    store.dispatch('helper/pushModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('TT0235'),
      contentText: t('DD0034'),
      primaryBtnText: t('Keep Editing'),
      secondaryBtnText: t('Leave Away'),
      secondaryBtnHandler: () => store.dispatch('helper/clearModalPipeline'),
    })

    return
  }

  store.dispatch('helper/closeModalBehavior')
}

const openModalHowToScan = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-how-to-scan',
    properties: {
      header: t('UU0032'),
      title: t('EE0109'),
      description: t('EE0110'),
      primaryBtnText: t('UU0094'),
      secondaryBtnText: t('UU0092'),
      primaryHandler: () => {
        store.dispatch('helper/closeModalBehavior')
      },
      secondaryHandler: () => {
        store.dispatch('helper/closeModalBehavior')
        goToMaterialUpload()
      },
      // materialList: [props.material],
    },
  })
}

const handleUpload = async () => {
  await uploadSideImage(faceSideChosenFile.value, backSideChosenFile.value)
  faceSideChosenFile.value = null
  backSideChosenFile.value = null
}
</script>
