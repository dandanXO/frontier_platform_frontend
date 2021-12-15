<template lang="pug">
div(class="pb-15 mb-5 border-b border-black-400")
  div(class="h-16 flex items-center")
    h5(class="text-h5 text-primary font-bold pr-1.5") {{$t('EE0038')}}
    svg-icon(:iconName="statusIconName" size="24" class="text-primary")
  div(class="pl-15")
    div(class="flex flex-col gap-y-2")
      p(class="text-body2 text-primary line-height-1.6") {{$t('EE0039')}}
      div(class="flex items-center gap-x-5")
        p(class="text-body1 text-primary font-bold") {{uploadMaterialEmail}}
        span(class="flex items-center gap-x-1 cursor-pointer")
          svg-icon(iconName="info_outline" size="20" class="text-primary")
          span(class="text-body2 text-primary underline font-normal" @click="openModalHowToScan") {{$t('UU0032')}}
      div(class="pt-10.5 flex gap-x-10")
        div(class="w-75")
          div(class="w-full h-75 rounded overflow-hidden")
            template(v-if="!!imageList[currentDisplayIndex].src")
              img(class="w-full h-full" :src="imageList[currentDisplayIndex].src")
            div(class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{$t('RR0103')}}
          div(class="grid grid-flow-col gap-x-2 justify-start pt-2 pb-6")
            div(v-for="(image, index) in imageList" @click="currentDisplayIndex = index")
              div(class="w-13 h-13 rounded overflow-hidden border border-black-400 bg-black-200")
                template(v-if="!!image.src")
                  img(class="w-full h-full" :src="image.src")
              p(
                v-for="text in image.text"
                class="text-caption line-height-1.6 text-center"
                :class="{ 'font-bold': index === currentDisplayIndex }"
              ) {{text}}
          p(
            v-if="canEditScannedImg"
            class="text-body2 text-assist-blue underline cursor-pointer pb-3"
            @click="openModalEditImage"
          ) {{$t('UU0011')}}
          p(class="text-body2 text-assist-blue underline cursor-pointer" @click="openModalChangeCover") {{$t('UU0012')}}
        div(class="w-52.5")
          h5(class="text-h5 font-bold text-primary pb-5") {{$t('RR0131')}}
          input-text-icon(
            v-model:textValue="pantoneName"
            :label="$t('EE0040')"
            :placeholder="$t('EE0078')"
            :customErrorMsg="pantoneErrorMsg"
            @click:icon="addPantone"
            class="pb-5"
          )
          div(class="grid gap-y-3")
            div(v-for="pantone in material.pantoneList" class="flex items-center gap-x-3")
              tooltip(placement="right")
                template(#trigger)
                  div(class="rounded w-5.5 h-5.5" :style="{ 'background-color': `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
                template(#content)
                  div(class="w-30 h-11 relative")
                    div(class="w-30 h-30 absolute -top-29 rounded-t" :style="{ 'background-color': `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
                    div(class="p-2 text-primary text-caption font-bold")
                      div(class="pb-1") {{pantone.name}}
                      div {{pantone.majorColorName}}
              p(class="text-body2 text-primary") {{pantone.name}}
              svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer" @click="removePantone(pantone.materialPantoneId)")
        assets-material-u3m-status
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import useMaterial from '@/composables/useMaterial'
import { SIDE_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import AssetsMaterialU3mStatus from '@/components/AssetsMaterialU3mStatus'

export default {
  name: 'BlockMaterialImage',
  components: { AssetsMaterialU3mStatus },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const { statusIconName, imageList, defaultCoverImgIndex } = useMaterial(material.value)

    const uploadMaterialEmail = computed(() => {
      return store.getters['helper/routeLocation']
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    const currentDisplayIndex = ref(defaultCoverImgIndex.value)

    const pantoneName = ref('')
    const pantoneErrorMsg = ref('')

    const addPantone = async () => {
      try {
        if (pantoneName.value === '') {
          return
        }

        await store.dispatch('material/addPantone', { name: pantoneName.value })
        pantoneName.value = ''
      } catch (error) {
        pantoneErrorMsg.value = error
      }
    }

    const removePantone = (materialPantoneId) => {
      store.dispatch('material/removePantone', { materialPantoneId })
    }

    const openModalHowToScan = () => {
      store.dispatch('helper/pushModal', {
        header: t('DD0043'),
        component: 'modal-how-to-scan'
      })
    }

    const openModalChangeCover = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-change-cover'
      })
    }

    const openModalEditImage = async () => {
      store.dispatch('helper/pushModal', {
        header: t('EE0050'),
        component: 'modal-edit-scanned-image',
        properties: {
          afterCropHandler: async ({ faceSideCropImg, backSideCropImg, isExchange }) => {
            await store.dispatch('material/updateScannedImage', {
              faceSideCropImg,
              backSideCropImg,
              isExchange
            })
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

    watch(
      () => pantoneName.value,
      () => {
        pantoneErrorMsg.value = ''
      }
    )

    return {
      uploadMaterialEmail,
      material,
      currentDisplayIndex,
      imageList,
      pantoneName,
      addPantone,
      pantoneErrorMsg,
      removePantone,
      openModalHowToScan,
      openModalChangeCover,
      openModalEditImage,
      statusIconName,
      canEditScannedImg
    }
  }
}
</script>
