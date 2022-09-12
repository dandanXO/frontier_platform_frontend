<template lang="pug">
div(class="flex flex-col")
  f-input-checkbox(
    v-model:inputValue="isShowGraph"
    :label="$t('RR0241')"
    iconSize="20"
    binary
    class="self-end"
  )
  div(class="pt-2 pb-10")
    div(class="px-10 h-10 grid grid-cols-12 gap-x-6 items-center bg-black-200 text-body2 text-black-600")
      p(class="col-start-4 col-span-3") {{ $t('RR0237') }}
      p(class="col-span-2") {{ $t('RR0238') }}
      p(class="col-span-2") {{ $t('RR0239') }}
      p(class="col-span-2") {{ $t('RR0240') }}
    div(class="pt-2 grid gap-y-2")
      div(
        v-for="property in carbonEmissionInfo"
        class="px-10 py-4 hover:bg-black-200 grid grid-cols-12 gap-x-6 items-start"
      )
        div(class="col-span-3 h-9.5 text-primary flex items-center gap-x-3")
          f-svg-icon(:iconName="property.icon" size="32")
          p(class="text-body2 font-bold") {{ property.title }}
        div(class="col-span-7")
          div(class="h-9.5 grid grid-cols-7 gap-x-6")
            div(class="col-span-3 flex items-center gap-x-2")
              template(v-if="property.personalized != null")
                div(class="w-2 h-2 rounded-sm bg-brand")
                p(class="text-body2 text-primary") {{ property.personalized }} {{ property.unitLong }}
              hr(v-else class="w-4 border-black-500")
            div(class="col-span-2 flex items-center gap-x-2")
              //- template(v-if="property.benchmark != null")
              //-   div(class="w-2 h-2 rounded-sm bg-black-500")
              //-   p(class="text-body2 text-primary") {{ property.benchmark }} {{ property.unitShort }}
              hr(class="w-4 border-black-500")
            div(class="col-span-2 flex items-center")
              //- div(
              //-   v-if="property.differenceInPercent != null"
              //-   class="h-6 flex items-center justify-center gap-x-2 rounded px-2 whitespace-nowrap text-caption"
              //-   :class="[property.differenceInPercent > 0 ? 'bg-brand-light text-brand' : 'bg-black-50 text-black-500']"
              //- )
              //-   p(class="font-bold") {{ property.differenceInPercent }}% {{ $t('RR0229') }}
              //-   f-svg-icon(v-if="property.differenceInPercent > 0" iconName="done" size="16" class="text-brand")
              hr(class="w-4 border-black-500")
          div(v-if="isShowGraph" class="pt-2")
            div(class="relative")
              div(class="grid grid-cols-5 h-10 divide-x divide-primary-thin bg-black-50 border border-primary-thin rounded mb-3.5")
                div(v-for="i in 5" class="relative")
                  span(v-if="i === 1" class="absolute -bottom-0.5 translate-y-full left-0 text-caption text-black-400") 0
                  span(class="absolute -bottom-0.5 translate-y-full right-0 text-caption text-black-400") {{ i * 10 }}
              div(class="border-0 absolute z-1 left-0 top-3 bg-brand h-1" :style="{ 'width': 100 * (property.personalized / 50) + '%' }")
              div(class="border-0 absolute z-2 right-1 top-1 text-brand-dark text-caption") {{ property.personalized }}
              //- div(class="border-0 absolute z-1 left-0 bottom-3 bg-black-400 h-1" :style="{ 'width': 100 * (property.benchmark / 50) + '%' }")
              //- div(class="border-0 absolute z-2 right-1 bottom-1 text-black-500 text-caption") {{ property.benchmark }}
        div(class="col-span-2 h-9.5 flex items-center gap-x-1")
          //- f-svg-icon(iconName="keyboard_arrow_right" size="24" class="text-black-400")
          //- span(v-if="property.saving != null" class="whitespace-nowrap text-caption leading-1.6") {{ property.saving }}&nbsp
          //-   i18n-t(:keypath="property.saveUnit" scope="global")
          //-     template(#newline)
          //-       br
          hr(class="w-4 border-black-500")
  div(v-if="showLogo || showMethodology || canSendFeedback" class="flex items-center gap-x-4")
    img(v-if="showLogo" src="@/assets/images/m2f_logo.png" class="w-16 h-4.5")
    div(class="flex items-center gap-x-1.5 text-black-600 cursor-pointer" @click="openModalIndicatorMethodology")
      f-svg-icon(iconName="info_outline" size="14")
      p(class="text-caption leading-1.6") {{ $t('UU0092') }}
    p(class="text-caption text-black-600 leading-1.6 cursor-pointer" @click="openModalSendFeedback") {{ $t('RR0123') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import useMaterial from '@/composables/useMaterial'

const store = useStore()

const props = defineProps({
  material: {
    type: Object,
    required: true
  },
  showLogo: {
    type: Boolean,
    default: true
  },
  showMethodology: {
    type: Boolean,
    default: true
  },
  canSendFeedback: {
    type: Boolean,
    default: true
  }
})

const isShowGraph = ref(false)

const { carbonEmissionInfo } = useMaterial(props.material)

const openModalIndicatorMethodology = () => {
  store.dispatch('helper/pushModalBehavior', { component: 'modal-indicator-methodology' })
}

const openModalSendFeedback = () => {
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-send-feedback'
  })
}
</script>
