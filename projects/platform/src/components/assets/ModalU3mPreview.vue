<template lang="pug">
modal-behavior(
  :header="$t('EE0067')"
  :usingCustomFooter="true"
  data-theme="new"
)
  div(:class="[isDoubleSide ? 'w-full' : 'w-[304px]']")
    div(class="flex justify-center items-center gap-4")
      div(v-if="isDoubleSide || sideType === MaterialSideType.FACE_SIDE")
        div(class="text-center text-grey-950-v1 text-body2 font-bold mb-4") {{ $t('EE0051') }}
        div(
          class="rounded"
          :class="[!faceSideU3mImage ? 'border border-dashed border-grey-250' : '', isDoubleSide ? 'h-[308px]' : 'h-[304px]']"
        )
          img(
            v-if="faceSideU3mImage"
            :src="faceSideU3mImage?.crop"
            :class="[isDoubleSide ? 'w-[308px]' : 'w-[304px]']"
          )
      div(v-if="isDoubleSide || sideType === MaterialSideType.BACK_SIDE")
        div(class="text-center text-grey-950-v1 text-body2 font-bold mb-4") {{ $t('EE0052') }}
        div(
          class="rounded"
          :class="[!backSideU3mImage ? 'border border-dashed border-grey-250' : '', isDoubleSide ? 'h-[308px]' : 'h-[304px]']"
        )
          img(
            v-if="backSideU3mImage"
            :src="backSideU3mImage?.crop"
            :class="[isDoubleSide ? 'w-[308px]' : 'w-[304px]']"
          )
    div(class="flex flex-col p-3 mt-4 border border-primary-border rounded")
      div(class="flex flex-row justify-between gap-2")
        div(class="flex flex-col gap-1")
          p(class="text-sm font-bold text-grey-950-v1") {{ $t('EE0196') }}
          p(class="text-sm text-grey-900-v1") {{ $t('EE0197') }}
        f-input-toggle(
          :value="throughSwitch"
          @update:value="changeThroughSwitch"
        )
      template(v-if="throughSwitch") 
        div(
          class="border-t mt-3 pt-3 border-grey-250 text-sm font-bold flex flex-row items-center gap-1"
        ) 
          div
            span(class="text-grey-950-v1") {{ $t('EE0239') }}
            span(class="text-red-400 pl-0.5") *
          f-tooltip(
            :placement="TOOLTIP_PLACEMENT.TOP_START"
            classContainer="w-82"
            theme="new-dark"
          )
            template(#slot:tooltip-trigger)
              f-svg-icon(iconName="info_outline" class="cursor-pointer" size="14")
            template(#slot:tooltip-content)
              img(:src="blackWhiteHoleTourImage")
              div(class="break-words text-xs") {{ $t('EE0201') }}

        div(class="flex fflex-row")
          f-input-radio(
            class="mr-2 text-grey-900-v1"
            v-model:inputValue="backgroundImageColor"
            :label="$t('EE0199')"
            :value="HOLE_TYPE.WHITE"
            iconSize="20"
          )
          f-input-radio(
            class="text-grey-900-v1"
            v-model:inputValue="backgroundImageColor"
            :label="$t('EE0200')"
            :value="HOLE_TYPE.BLACK"
            iconSize="20"
          )
  template(#custom-footer)
    div(class="p-5 h-18.5 border-t flex justify-center items-center border-primary-border")
      f-button(
        data-cy="modal-behavior_text"
        @click="handleRecutImage"
        :disabled="disabledRecutImage"
        size="md"
        :isFullWidth="!isDoubleSide"
      ) {{ $t('EE0150') }}
</template>

<script setup lang="ts">
import blackWhiteHoleTourImage from '@/assets/images/black_white_hole_tour.png'
import { useStore } from 'vuex'
import { computed, toRef, ref } from 'vue'
import { type Material, MaterialSideType } from '@frontier/platform-web-sdk'
import { HOLE_TYPE, TOOLTIP_PLACEMENT } from '@/utils/constants'

const props = defineProps<{
  material: Material
}>()

const store = useStore()

const material = toRef(props.material)
const throughSwitch = ref(false)
const changeThroughSwitch = (value: boolean) => {
  throughSwitch.value = value
}
const backgroundImageColor = ref<HOLE_TYPE | null>(null)
const faceSideU3mImage = computed(
  () => material.value.faceSide?.u3mImage || null
)
const backSideU3mImage = computed(
  () => material.value.backSide?.u3mImage || null
)

const isDoubleSide = computed(() => material.value.isDoubleSide)
const sideType = computed(() => material.value.sideType)

const disabledRecutImage = computed(
  () => throughSwitch.value && backgroundImageColor.value === null
)

const handleRecutImage = () => {
  store.dispatch('helper/replaceModal', {
    component: 'modal-u3m-recut',
    properties: {
      material,
      HasHole: throughSwitch.value,
      HoleColor: backgroundImageColor.value ?? HOLE_TYPE.WHITE,
    },
  })
}
</script>
