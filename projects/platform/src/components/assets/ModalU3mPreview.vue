<template lang="pug">
modal-behavior(
  :header="$t('EE0067')"
  :primaryBtnText="$t('EE0150')"
  :secondaryBtnText="$t('UU0038')"
  @click:primary="handleRecutImage"
  @click:secondary="handleCreateU3mAuto"
  :secondaryBtnDisabled="hideAutoButton"
)
  div(:class="[isDoubleSide ? 'w-152' : 'w-74']")
    div(class="flex justify-center items-center gap-12")
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
      v-if="showEE0068hint"
      keypath="EE0068"
      tag="div"
      class="mt-3.5 text-grey-900 text-body2 leading-1.6"
      scope="global"
    )
      template(#auto)
        strong {{ $t('EE0085') }}
      template(#reCut)
        strong {{ $t('EE0150') }}
    div(class="flex flex-col p-3 mt-4 border border-grey-300 rounded-[4px]")
      div(class="flex flex-row justify-between")
        div
          p(class="text-sm font-bold") {{ $t('EE0196') }}
          p(class="text-sm") {{ $t('EE0197') }}
        div(class="-mt-2")
          f-input-switch(
            :inputValue="throughSwitch"
            @update:inputValue="changeThroughSwitch"
            iconSize="40"
          )
      template(v-if="throughSwitch") 
        div(class="border-t mt-3 pt-3 border-grey-250 text-sm font-bold") {{ $t('EE0198') }}
          f-tooltip-media(
            class="ml-2 inline-block"
            :tooltipMessage="$t('EE0201')"
            :imageUrl="blackWhiteHoleTourImage"
          )
            template(#slot:tooltip-trigger)
              f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
        div(class="flex fflex-row")
          f-input-radio(
            class="mr-2"
            v-model:inputValue="backgroundImageColor"
            :label="$t('EE0199')"
            :value="HOLE_TYPE.WHITE"
            iconSize="20"
          )
          f-input-radio(
            v-model:inputValue="backgroundImageColor"
            :label="$t('EE0200')"
            :value="HOLE_TYPE.BLACK"
            iconSize="20"
          )
</template>

<script setup lang="ts">
import blackWhiteHoleTourImage from '@/assets/images/black_white_hole_tour.png'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, toRef, ref } from 'vue'
import { type Material, MaterialSideType } from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'
import { NOTIFY_TYPE, HOLE_TYPE } from '@/utils/constants'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import assetsApi from '@/apis/assets'
// F22-3410
const hideAutoButton = true
const showEE0068hint = false

const props = defineProps<{
  material: Material
}>()

const { t } = useI18n()
const store = useStore()
const { goToProgress } = useNavigation()
const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

const material = toRef(props.material)
const throughSwitch = ref(false)
const changeThroughSwitch = (value: boolean) => {
  throughSwitch.value = value
}
const backgroundImageColor = ref(HOLE_TYPE.WHITE)
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
    properties: {
      material,
      HasHole: throughSwitch.value,
      HoleColor: backgroundImageColor.value,
    },
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
