<template lang="pug">
div(class="pb-15 mb-5 border-b border-black-400")
  div(class="h-16 flex items-center")
    h5(class="text-h5 text-primary font-bold pr-1.5") {{$t('Fabric image')}}
    svg-icon(:iconName="iconSideTypeAndScanStatus" size="24" class="text-primary")
  div(class="pl-15")
    div(class="flex flex-col gap-y-2")
      p(class="text-body2 text-primary line-height-1.6") {{$t('Scan and send the fabric to Group1 dedicated email')}}
      div(class="flex items-center gap-x-5")
        p(class="text-body1 text-primary font-bold") {{uploadMaterialEmail}}
        span(class="flex items-center gap-x-1 cursor-pointer")
          svg-icon(iconName="info_outline" size="20" class="text-primary")
          span(class="text-body2 text-primary underline font-normal" @click="pushModalHowToScan") {{$t('How to scan?')}}
      div(class="pt-10.5 flex gap-x-15")
        div(class="w-75")
          div(class="w-full h-75 rounded overflow-hidden")
            template(v-if="!!imageList[currentDisplayIndex].src")
              img(class="w-full h-full" :src="imageList[currentDisplayIndex].src")
            div(class="rounded w-full h-full border border-black-400 bg-black-200 flex items-center justify-center text-h4 font-bold text-black-400") {{$t('No image')}}
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
          p(class="text-body2 text-assist-blue underline cursor-pointer pb-3" @click="pushModalChangeCover") {{$t('UU0011')}}
          p(class="text-body2 text-assist-blue underline cursor-pointer") {{$t('UU0012')}}
        div(class="w-52.5")
          h5(class="text-h5 font-bold text-primary pb-5") {{$t('Color Tickets')}}
          input-text-icon(
            v-model:textValue="pantoneName"
            :label="$t('New color ticket')"
            placeholder="Ex: 11-0102TCX"
            :customErrorMsg="pantoneErrorMsg"
            @click:icon="addPantone"
            class="pb-5"
          )
          div(class="grid gap-y-3")
            div(v-for="pantone in material.pantoneList" class="flex items-center gap-x-3")
              div(class="rounded w-5.5 h-5.5" :style="{ 'background-color': `rgb(${pantone.r}, ${pantone.g}, ${pantone.b})` }")
              p(class="text-body2 text-primary") {{pantone.name}}
              svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer" @click="removePantone(pantone.materialPantoneId)")
        div
          h5(class="text-h5 font-bold text-primary pb-3") {{$t('3D Material')}}
          template(v-if="material.u3m.status === U3M_STATUS.UNQUALIFIED")
            p(class="flex items-center text-body2 text-primary line-height-1.6 pb-2") {{$t('Status')}} : {{$t('Cannot be created')}}
              tooltip(placement="top" class="pl-1")
                svg-icon(iconName="info_outline")
                template(#content)
                  div(class="p-5 w-68.5")
                    p Scan files are required to make U3M U3M of instructions
            btn(size="md" disabled) {{$t('reuse.create')}}
          template(v-if="material.u3m.status === U3M_STATUS.INITIAL")
            p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('Status')}} : {{$t('To be established')}}
            btn(size="md") {{$t('reuse.create')}}
          template(v-if="material.u3m.status === U3M_STATUS.PROCESSING")
            p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('Status')}} : {{$t('Creating')}}
            btn(size="md" disabled) {{$t('reuse.create')}}
          template(v-if="material.u3m.status === U3M_STATUS.COMPLETED")
            p(class="text-body2 text-primary line-height-1.6 pb-2") {{$t('Status')}} : {{$t('Filled')}} &nbsp
              span(class="text-assist-blue underline cursor-pointer") {{$t('Download')}}
            btn(size="md") {{$t('3D viewer')}}
          template(v-if="material.u3m.status === U3M_STATUS.FAIL")
            p(class="flex items-center text-body2 text-primary line-height-1.6 pb-2") {{$t('Status')}} : {{$t('Fail')}}
              tooltip(placement="top" class="pl-1")
                svg-icon(iconName="info_outline")
                template(#content)
                  div(class="p-5 w-71")
                    p Please contact support@frontier.cool
            btn(size="md") {{$t('Re-create')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import useNavigation from '@/composables/useNavigation'
import { COVER_MODE, SIDE_TYPE, U3M_STATUS } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export default {
  name: 'BlockMaterialImage',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { location } = useNavigation()

    const material = computed(() => store.getters['material/material'])
    const uploadMaterialEmail = computed(() => {
      return location.value === 'org'
        ? store.getters['organization/uploadMaterialEmail']
        : store.getters['group/uploadMaterialEmail']
    })

    const currentDisplayIndex = ref(0)
    const { coverMode } = material.value
    if (coverMode === COVER_MODE.FACE) {
      currentDisplayIndex.value = 0
    } else if (coverMode === COVER_MODE.BACK) {
      currentDisplayIndex.value = 2
    } else if (coverMode === COVER_MODE.SUP) {
      currentDisplayIndex.value = 4
    }

    const imageList = computed(() => {
      const { isDoubleSideMaterial, sideType, coverMode, coverImg, faceSideImg, backSideImg } = material.value
      const list = []
      const faceCrop = {
        src: faceSideImg.crop,
        text: [t('Front')]
      }
      const faceRuler = {
        src: faceSideImg.ruler,
        text: [t('Front'), `(${t('Ruler')})`]
      }
      const backCrop = {
        src: backSideImg.crop,
        text: [t('Back')]
      }
      const backRuler = {
        src: backSideImg.ruler,
        text: [t('Back'), `(${t('Ruler')})`]
      }

      if (isDoubleSideMaterial) {
        if (coverMode === COVER_MODE.SUP) {
          list.push({
            src: coverImg,
            text: [t('Cover')]
          })
          list.push(faceCrop, faceRuler, backCrop, backRuler)
        } else if (coverMode === COVER_MODE.FACE) {
          faceCrop.text.push(`(${t('Cover')})`)
          list.push(faceCrop, faceRuler, backCrop, backRuler)
        } else if (coverMode === COVER_MODE.BACK) {
          backCrop.text.push(`(${t('Cover')})`)
          list.push(faceCrop, faceRuler, backCrop, backRuler)
        }
      } else {
        if (sideType === SIDE_TYPE.FACE) {
          if (coverMode === COVER_MODE.SUP) {
            list.push({
              src: coverImg,
              text: [t('Cover')]
            })
          } else {
            faceCrop.text.push(`(${t('Cover')})`)
          }
          list.push(faceCrop, faceRuler)
        } else if (sideType === SIDE_TYPE.BACK) {
          if (coverMode === COVER_MODE.SUP) {
            list.push({
              src: coverImg,
              text: [t('Cover')]
            })
          } else {
            backCrop.text.push(`(${t('Cover')})`)
          }
          list.push(backCrop, backRuler)
        }
      }

      return list
    })

    const pantoneName = ref('')
    const pantoneErrorMsg = ref('')

    const addPantone = async () => {
      try {
        if (pantoneName.value === '') {
          return
        }

        await store.dispatch('material/addPantone', { location: location.value, name: pantoneName.value })
        pantoneName.value = ''
      } catch (error) {
        pantoneErrorMsg.value = error
      }
    }

    const removePantone = (materialPantoneId) => {
      store.dispatch('material/removePantone', { location: location.value, materialPantoneId })
    }

    const iconSideTypeAndScanStatus = computed(() => {
      const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } = material.value
      const scanFaceSide = !!faceSideImg.crop
      const scanBackSide = !!backSideImg.crop

      if (isDoubleSideMaterial) {
        if (scanFaceSide && scanBackSide) return 'double'
        else if (scanFaceSide && !scanBackSide) return 'double-front'
        else if (!scanFaceSide && scanBackSide) return 'double-back'
        else if (!scanFaceSide && !scanBackSide) return 'no-image-double'
      } else {
        if (sideType === SIDE_TYPE.FACE) return scanFaceSide ? 'front' : 'no-image-front'
        else if (sideType === SIDE_TYPE.BACK) return scanBackSide ? 'back' : 'no-image-back'
      }

      return 'front'
    })

    const pushModalHowToScan = () => {
      store.dispatch('helper/pushModal', {
        header: 'How to scan fabric',
        component: 'modal-how-to-scan'
      })
    }

    const pushModalChangeCover = () => {
      store.dispatch('helper/pushModal', {
        component: 'modal-change-cover'
      })
    }

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
      U3M_STATUS,
      pushModalHowToScan,
      pushModalChangeCover,
      iconSideTypeAndScanStatus
    }
  }
}
</script>
