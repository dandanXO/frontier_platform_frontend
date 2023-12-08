<template lang="pug">
modal-behavior(
  :header="$t('EE0067')"
  :primaryBtnText="$t('UU0038')"
  :secondaryBtnText="$t('UU0039')"
  @click:primary="handleCreateU3mAuto"
  @click:secondary="handleRecutImage"
)
  div(:class="[isDoubleSide ? 'w-152' : 'w-70']")
    div(class="flex justify-between items-center gap-12")
      div(v-if="isDoubleSide || sideType === MaterialSideType.FACE_SIDE" class="w-70")
        div(class="text-center text-grey-900 text-body2 font-bold mb-3.5") {{ $t('EE0051') }}
        div(
          class="rounded overflow-hidden h-70"
          :class="[!faceSideU3mImage ? 'border border-dashed border-grey-250' : '']"
        )
          img(v-if="faceSideU3mImage" :src="faceSideU3mImage?.crop" class="w-full")
      div(v-if="isDoubleSide || sideType === MaterialSideType.BACK_SIDE" class="w-70")
        div(class="text-center text-grey-900 text-body2 font-bold mb-3.5") {{ $t('EE0052') }}
        div(
          class="rounded overflow-hidden h-70"
          :class="[!backSideU3mImage ? 'border border-dashed border-grey-250' : '']"
        )
          img(v-if="backSideU3mImage" :src="backSideU3mImage?.crop" class="w-full")
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

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, toRef } from 'vue'
import { type Material, MaterialSideType } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'
import { NOTIFY_TYPE } from '@/utils/constants'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import assetsApi from '@/apis/assets'

const props = defineProps<{
  material: Material
}>()

const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

const material = toRef(props.material)

const faceSideU3mImage = computed(
  () => material.value.faceSide?.u3mImage || null
)
const backSideU3mImage = computed(
  () => material.value.backSide?.u3mImage || null
)

const isDoubleSide = computed(() => material.value.isDoubleSide)
const sideType = computed(() => material.value.sideType)

const handleRecutImage = () => {
  store.dispatch('helper/replaceModal', {
    component: 'modal-u3m-recut',
    properties: { material },
  })
}

const handleCreateU3mAuto = async () => {
  store.dispatch('helper/pushModalLoading')
  const result = await ogBaseAssetsApi('generateAssetsMaterialU3m', {
    materialId: material.value.materialId,
    faceSide: null,
    backSide: null,
    isAutoRepeat: true,
  })
  material.value.u3m.status = result.data.result!.u3mStatus
  store.dispatch('helper/closeModalLoading')
  store.dispatch('helper/openModalConfirm', {
    type: NOTIFY_TYPE.SUCCESS,
    header: t('EE0121'),
    contentText: t('EE0122', { RR0008: t('RR0008') }),
    primaryBtnText: t('UU0103'),
    secondaryBtnText: t('UU0090'),
    secondaryBtnHandler: () => goToProgress({}, 'u3m'),
  })
}
</script>
