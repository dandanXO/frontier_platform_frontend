<template lang="pug">
modal-behavior(
  :header="$t('EE0067')"
  :usingCustomFooter="true"
  data-theme="new"
)
  div(:class="[isDoubleSide ? 'w-152' : 'w-86']")
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
    div(class="flex flex-col p-3 mt-4 border border-primary-border rounded")
      div(class="flex flex-row justify-between gap-2")
        div(class="flex flex-col gap-1")
          p(class="text-sm font-bold") {{ $t('EE0196') }}
          p(class="text-sm") {{ $t('EE0197') }}
        f-input-toggle(
          :value="throughSwitch"
          @update:value="changeThroughSwitch"
        )
      template(v-if="throughSwitch") 
        div(
          class="border-t mt-3 pt-3 border-grey-250 text-sm font-bold flex flex-row items-center gap-1"
        ) 
          div
            span {{ $t('EE0239') }}
            span(class="text-red-400 pl-0.5") *
          f-tooltip(
            :placement="TOOLTIP_PLACEMENT.TOP_END"
            :offset="[13, 0]"
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
  template(#custom-footer)
    div(class="p-5 h-18.5 border-t flex items-center border-primary-border")
      f-button(
        data-cy="modal-behavior_text"
        @click="handleRecutImage"
        :disabled="disabledRecutImage"
        size="md"
        isFullWidth
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
