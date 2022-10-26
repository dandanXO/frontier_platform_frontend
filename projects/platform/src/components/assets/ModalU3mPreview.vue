<template lang="pug">
modal-behavior(
  :header="$t('EE0067')"
  :primaryBtnText="$t('UU0038')"
  :secondaryBtnText="$t('UU0039')"
  @click:primary="handleCreateU3mAuto"
  @click:secondary="handleRecutImage"
)
  div(class="flex justify-between items-center gap-12")
    div(v-if="isDoubleSideMaterial || isFaceSideMaterial" class="w-70")
      div(class="text-center text-grey-900 text-body2 font-bold mb-3.5") {{ $t('EE0051') }}
      div(
        class="rounded overflow-hidden h-70"
        :class="[!isFaceSideU3mCropExist ? 'border border-dashed border-grey-200' : '']"
      )
        img(v-if="isFaceSideU3mCropExist" :src="faceSideImg.u3mCrop" class="w-full")
    div(v-if="isDoubleSideMaterial || isBackSideMaterial" class="w-70")
      div(class="text-center text-grey-900 text-body2 font-bold mb-3.5") {{ $t('EE0052') }}
      div(
        class="rounded overflow-hidden h-70"
        :class="[!isBackSideU3mCropExist ? 'border border-dashed border-grey-200' : '']"
      )
        img(v-if="isBackSideU3mCropExist" :src="backSideImg.u3mCrop" class="w-full")
  i18n-t(
    keypath="EE0068"
    tag="div"
    class="mt-3.5 text-grey-900 text-body2 leading-1.6"
    scope="global"
  )
    template(#auto)
      strong {{ $t('EE0085') }}
    template(#reCut)
      strong {{ $t('EE0086') }}
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed } from 'vue'
import useMaterialImage from '@/composables/useMaterialImage'
import useNavigation from '@/composables/useNavigation'

const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const material = computed(() => store.getters['assets/material'])
const { faceSideImg, backSideImg } = material.value
const {
  isDoubleSideMaterial,
  isFaceSideMaterial,
  isBackSideMaterial,
  isFaceSideU3mCropExist,
  isBackSideU3mCropExist,
} = useMaterialImage(material.value, 'u3m')

const handleRecutImage = () => {
  store.dispatch('helper/replaceModal', {
    component: 'modal-u3m-recut',
  })
}

const handleCreateU3mAuto = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/generateU3m', { isAutoRepeat: true })
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/openModalConfirm', {
    type: 2,
    header: t('EE0121'),
    contentText: t('EE0122', { RR0008: t('RR0008') }),
    primaryBtnText: t('UU0103'),
    secondaryBtnText: t('UU0090'),
    secondaryBtnHandler: () => goToProgress('u3m'),
  })
}
</script>
