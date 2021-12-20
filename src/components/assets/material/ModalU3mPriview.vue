<template lang="pug">
div(:class="{'w-86': !isDoubleSideMaterial, 'w-168':isDoubleSideMaterial}")
  div(class="border-t-2 border-b-2 px-8 py-5")
    div(class="flex justify-between items-center gap-12")
      div(v-if="isDoubleSideMaterial || isFaceSideMaterial" class="w-70")
        div(class="text-center text-primary text-body2 font-bold mb-3.5") {{$t("EE0051")}}
        div(class="rounded overflow-hidden h-70" :class="[!isFaceSideU3mCropExist ? 'border border-dashed border-black-400' : '']")
          img(v-if="isFaceSideU3mCropExist" :src="faceSideImg.u3mCrop" class="w-full")
      div(v-if="isDoubleSideMaterial || isBackSideMaterial" class="w-70")
        div(class="text-center text-primary text-body2 font-bold mb-3.5") {{$t("EE0052")}}
        div(class="rounded overflow-hidden h-70" :class="[!isBackSideU3mCropExist ? 'border border-dashed border-black-400' : '']")
          img(v-if="isBackSideU3mCropExist" :src="backSideImg.u3mCrop" class="w-full")
    //- i18n-t(keypath="EE0068" tag="div" class="mt-3.5 text-primary text-body2 line-height-1.6")
    //-   template(#auto)
    //-     strong {{$t("EE0085")}}
    //-   template(#reCut)
    //-     strong {{$t("EE0086")}}
  btn-group(
    class="h-25"
    :secondaryButton="true"
    :primaryText="$t('UU0038')"
    @click:primary="handleCreateU3mAuto()"
    :secondaryText="$t('UU0039')"
    @click:secondary="handleRecutMaterial()"
  )
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import useNavigation from '@/composables/useNavigation'
import useMaterialImage from '@/composables/useMaterialImage'

export default {
  name: 'ModalU3mPriview',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { goToAssetsMaterialRecutImage } = useNavigation()
    const material = computed(() => store.getters['material/material'])
    const { faceSideImg, backSideImg } = material.value
    const {
      isDoubleSideMaterial,
      isFaceSideMaterial,
      isBackSideMaterial,
      isFaceSideU3mCropExist,
      isBackSideU3mCropExist
    } = useMaterialImage(material.value)

    const handleRecutMaterial = () => {
      goToAssetsMaterialRecutImage()
      store.dispatch('helper/closeModal')
    }

    const handleCreateU3mAuto = async () => {
      await store.dispatch('material/generateU3m', {})
      store.dispatch('helper/openModalConfirm', {
        title: t('RR0132'),
        content: t('EE0070'),
        primaryText: t('UU0031')
      })
    }

    return {
      isDoubleSideMaterial,
      isFaceSideMaterial,
      isBackSideMaterial,
      faceSideImg,
      backSideImg,
      isFaceSideU3mCropExist,
      isBackSideU3mCropExist,
      handleRecutMaterial,
      handleCreateU3mAuto
    }
  }
}
</script>
