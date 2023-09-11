<template lang="pug">
div(class="pb-15")
  div(class="h-16 flex items-center")
    h5(class="text-h5 text-grey-900 font-bold pr-1.5") {{ $t('EE0038') }}
    f-svg-icon(
      :iconName="materialScanImageStatus.iconName"
      :tooltipMessage="materialScanImageStatus.tooltipMessage"
      size="24"
      class="text-grey-900"
    )
  div
    div(class="flex flex-col gap-y-2")
      p(class="text-body2 text-grey-900 leading-1.6") {{ $t('EE0039') }}
      div(class="flex items-center gap-x-5")
        p(class="text-body1 text-grey-900 font-bold") {{ uploadMaterialEmail }}
        span(class="flex items-center gap-x-1 cursor-pointer")
          f-svg-icon(iconName="info_outline" size="20" class="text-grey-900")
          span(
            class="text-body2 text-grey-900 underline font-normal"
            @click="openModalHowToScan"
          ) {{ $t('UU0032') }}
      div(class="pt-7.5 flex gap-x-7.5")
        div(class="w-115 flex-shrink-0")
          div(class="aspect-square rounded overflow-hidden")
            template(v-if="!!imageList[currentDisplayIndex].src")
              img(class="w-full h-full" :src="imageList[currentDisplayIndex].src")
            div(
              class="rounded w-full h-full border border-grey-250 bg-grey-100 flex items-center justify-center text-h4 font-bold text-grey-250"
            ) {{ $t('RR0103') }}
          div(class="grid grid-flow-col gap-x-2 justify-start pt-2 pb-6")
            div(
              v-for="(image, index) in imageList"
              @click="currentDisplayIndex = index"
              :key="image.src"
            )
              div(
                class="w-13 h-13 rounded overflow-hidden border border-grey-250 bg-grey-100"
              )
                template(v-if="!!image.src")
                  img(class="w-full h-full" :src="image.src")
              p(
                v-for="text in image.text"
                :key="text"
                class="text-caption leading-1.6 text-center"
                :class="{ 'font-bold': index === currentDisplayIndex }"
              ) {{ text }}
          p(
            v-if="canEditScannedImg"
            class="text-body2 text-cyan-400 underline cursor-pointer pb-3"
            @click="openModalEditImage"
          ) {{ $t('UU0011') }}
          p(
            class="text-body2 text-cyan-400 underline cursor-pointer"
            @click="openModalChangeCover"
          ) {{ $t('UU0012') }}
        div(class="w-52.5")
          h5(class="text-h5 font-bold text-grey-900 pb-5") {{ $t('RR0131') }}
          f-input-text(
            v-model:textValue="pantoneName"
            :label="$t('EE0040')"
            :placeholder="$t('EE0078')"
            :button="{ type: 'primary', icon: 'add' }"
            @click:button="addPantone"
            class="pb-5"
          )
          div(class="grid gap-y-3")
            div(
              v-for="pantone in material.pantoneList"
              :key="pantone.name"
              class="flex items-center gap-x-3"
            )
              f-tooltip-media(
                placement="right-end"
                :pantone="{ r: pantone.r, g: pantone.g, b: pantone.g }"
                :tooltipTitle="pantone.name"
                :tooltipMessage="pantone.colorName"
              )
                template(#slot:tooltip-trigger)
                  div(
                    class="rounded w-5.5 h-5.5"
                    :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }"
                  )
              p(class="text-body2 text-grey-900") {{ pantone.name }}
              f-svg-icon(
                iconName="clear"
                size="20"
                class="text-grey-250 cursor-pointer"
                @click="removePantone(pantone.materialPantoneId)"
              )
        slot(name="slot:block-material-u3m")
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useMaterialOld from '@/composables/useMaterialOld'
import { SIDE_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'

const { t } = useI18n()
const store = useStore()
const material = computed(() => store.getters['assets/material'])
const { materialScanImageStatus, imageList, defaultCoverImgIndex } =
  useMaterialOld(material.value)
const { goToMaterialUpload } = useNavigation()

const uploadMaterialEmail = computed(() => {
  return store.getters['helper/routeLocation'] === 'org'
    ? store.getters['organization/uploadMaterialEmail']
    : store.getters['group/uploadMaterialEmail']
})

const currentDisplayIndex = ref(defaultCoverImgIndex.value)

const pantoneName = ref('')

const addPantone = async () => {
  if (!pantoneName.value) {
    return
  }

  await store.dispatch('assets/addPantone', { name: pantoneName.value })
  pantoneName.value = ''
}

const removePantone = (materialPantoneId) => {
  store.dispatch('assets/removePantone', { materialPantoneId })
}

const openModalHowToScan = () => {
  store.dispatch('helper/openModalBehavior', {
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
      materialList: [material.value],
    },
  })
}

const openModalChangeCover = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-change-cover',
  })
}

const openModalEditImage = async () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-edit-scanned-image',
    properties: {
      afterCropHandler: async (params) => {
        await store.dispatch('assets/updateScannedImage', params)
        store.dispatch('helper/reloadInnerApp')
      },
    },
  })
}

const canEditScannedImg = computed(() => {
  const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } =
    material.value
  const isFaceSideExist = !!faceSideImg.original
  const isBackSideExist = !!backSideImg.original

  if (isDoubleSideMaterial) {
    return isFaceSideExist || isBackSideExist
  } else if (sideType === SIDE_TYPE.FACE) {
    return isFaceSideExist
  } else if (sideType === SIDE_TYPE.BACK) {
    return isBackSideExist
  } else {
    return false
  }
})
</script>
