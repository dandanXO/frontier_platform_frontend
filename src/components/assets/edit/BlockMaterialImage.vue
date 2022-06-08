<template lang="pug">
div(class="pb-15 mb-5 border-b border-black-400")
  div(class="h-16 flex items-center")
    h5(class="text-h5 text-primary font-bold pr-1.5") {{ $t("EE0038") }}
    svg-icon(:iconName="statusIconName" size="24" class="text-primary")
  div
    div(class="flex flex-col gap-y-2")
      p(class="text-body2 text-primary leading-1.6") {{ $t("EE0039") }}
      div(class="flex items-center gap-x-5")
        p(class="text-body1 text-primary font-bold") {{ uploadMaterialEmail }}
        span(class="flex items-center gap-x-1 cursor-pointer")
          svg-icon(iconName="info_outline" size="20" class="text-primary")
          span(class="text-body2 text-primary underline font-normal" @click="openModalHowToScan") {{ $t("UU0032") }}
      div(class="pt-7.5 flex gap-x-10")
        div(class="w-112.5 flex-shrink-0")
          div(class="aspect-square rounded overflow-hidden")
            template(v-if="!!imageList[currentDisplayIndex].src")
              img(class="w-full h-full" :src="imageList[currentDisplayIndex].src")
            div(class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{ $t("RR0103") }}
          div(class="grid grid-flow-col gap-x-2 justify-start pt-2 pb-6")
            div(v-for="(image, index) in imageList" @click="currentDisplayIndex = index")
              div(class="w-13 h-13 rounded overflow-hidden border border-black-400 bg-black-200")
                template(v-if="!!image.src")
                  img(class="w-full h-full" :src="image.src")
              p(
                v-for="text in image.text"
                class="text-caption leading-1.6 text-center"
                :class="{ 'font-bold': index === currentDisplayIndex }"
              ) {{ text }}
          p(
            v-if="canEditScannedImg"
            class="text-body2 text-assist-blue underline cursor-pointer pb-3"
            @click="openModalEditImage"
          ) {{ $t("UU0011") }}
          p(class="text-body2 text-assist-blue underline cursor-pointer" @click="openModalChangeCover") {{ $t("UU0012") }}
        div(class="w-52.5")
          h5(class="text-h5 font-bold text-primary pb-5") {{ $t("RR0131") }}
          input-text-icon(
            v-model:textValue="pantoneName"
            :label="$t('EE0040')"
            :placeholder="$t('EE0078')"
            @click:icon="addPantone"
            class="pb-5"
          )
          div(class="grid gap-y-3")
            div(v-for="pantone in material.pantoneList" class="flex items-center gap-x-3")
              tooltip(placement="right")
                template(#trigger)
                  div(class="rounded w-5.5 h-5.5" :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
                template(#content)
                  div(class="w-30 h-11 relative")
                    div(class="w-30 h-30 absolute -top-29 rounded-t" :style="{ backgroundColor: `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
                    div(class="p-2 text-primary text-caption font-bold")
                      div(class="pb-1") {{ pantone.name }}
                      div {{ pantone.majorColorName }}
              p(class="text-body2 text-primary") {{ pantone.name }}
              svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer" @click="removePantone(pantone.materialPantoneId)")
        block-material-u3m-status(:material="material")
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useMaterial from '@/composables/useMaterial'
import { SIDE_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import BlockMaterialU3mStatus from '@/components/assets/edit/BlockMaterialU3mStatus.vue'
import useNavigation from '@/composables/useNavigation'

const { t } = useI18n()
const store = useStore()
const material = computed(() => store.getters['assets/material'])
const { statusIconName, imageList, defaultCoverImgIndex } = useMaterial(material.value)
const { goToMaterialUpload } = useNavigation()

const uploadMaterialEmail = computed(() => {
  return store.getters['helper/routeLocation'] === 'org'
    ? store.getters['organization/uploadMaterialEmail']
    : store.getters['group/uploadMaterialEmail']
})

const currentDisplayIndex = ref(defaultCoverImgIndex.value)

const pantoneName = ref('')

const addPantone = async () => {
  if (pantoneName.value === '') {
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
      materialList: [material.value]
    }
  })
}

const openModalChangeCover = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-change-cover'
  })
}

const openModalEditImage = async () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-edit-scanned-image',
    properties: {
      afterCropHandler: async ({ faceSideCropImg, backSideCropImg, isExchange }) => {
        await store.dispatch('assets/updateScannedImage', {
          faceSideCropImg,
          backSideCropImg,
          isExchange
        })
        store.dispatch('helper/reloadInnerApp')
      }
    }
  })
}

const canEditScannedImg = computed(() => {
  const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } = material.value
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
