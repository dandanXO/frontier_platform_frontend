<template lang="pug">
div(:class="{'w-86': !isDoubleSideMaterial, 'w-168':isDoubleSideMaterial}")
  div(class="border-t-2 border-b-2 px-8 py-5")
    div(class="flex justify-between items-center gap-12")
      div(v-if="isDoubleSideMaterial || isFaceSide" class="w-70")
        div(class="text-center text-primary text-body2 font-bold mb-3.5") {{$t("EE0051")}}
        div(class="rounded overflow-hidden h-70" :class="[!faceSideImg.u3mCrop ? 'border border-dashed border-black-400' : '']")
          img(v-if="!!faceSideImg.u3mCrop" :src="faceSideImg.u3mCrop" class="w-full")
      div(v-if="isDoubleSideMaterial || isBackSide" class="w-70")
        div(class="text-center text-primary text-body2 font-bold mb-3.5") {{$t("EE0052")}}
        div(class="rounded overflow-hidden h-70" :class="[!backSideImg.u3mCrop ? 'border border-dashed border-black-400' : '']")
          img(v-if="!!backSideImg.u3mCrop" :src="backSideImg.u3mCrop" class="w-full")
    div(class="mt-3.5 text-primary text-body2 line-height-1.6") {{$t("EE0068")}}
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
import { SIDE_TYPE } from '@/utils/constants'

export default {
  name: 'ModalU3mPriview',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const material = computed(() => store.getters['material/material'])
    const { isDoubleSideMaterial, sideType, faceSideImg, backSideImg } = material.value

    const isFaceSide = !isDoubleSideMaterial && sideType === SIDE_TYPE.FACE
    const isBackSide = !isDoubleSideMaterial && sideType === SIDE_TYPE.BACK

    const handleRecutMaterial = () => {
      // route change
    }

    const handleCreateU3mAuto = async () => {
      await store.dispatch('material/generateU3m', {})
      store.dispatch('helper/openModalConfirm', {
        title: t('EE0016'),
        content: t('EE0070'),
        primaryText: t('UU0031')
      })
    }

    return {
      isDoubleSideMaterial,
      isFaceSide,
      isBackSide,
      faceSideImg,
      backSideImg,
      handleRecutMaterial,
      handleCreateU3mAuto
    }
  }
}
</script>
