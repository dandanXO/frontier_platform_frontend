<template lang="pug">
modal-behavior(
  :footer="false"
  :closable="false"
  :displayHeader="false"
  animation
)
  div(class="w-[440px] h-[393px] flex flex-col justify-between")
    div
      div(class="font-bold") {{ $t('RR0371') }}
      div(class="font-normal") {{ $t('RR0372') }}
    div(class="h-full my-2 flex flex-col justify-around")
      div(class="flex flex-row gap-2") 
        div(class="bg-primary-500 rounded-md text-white")
          f-svg-icon(iconName="upload" :size="56")
        div(class="flex flex-col gap-2")
          div(class="font-bold") {{ $t('RR0374') }}
          div(class="font-normal") {{ $t('RR0375') }}

      div(class="flex flex-row gap-2") 
        div(class="rounded-md")
          f-svg-icon(iconName="gear" :size="56")
        div(class="flex flex-col gap-2")
          div(class="font-bold") {{ $t('RR0376') }}
          div(class="font-normal") {{ $t('RR0377') }}

      div(class="flex flex-row gap-2") 
        div(class="bg-primary-300 rounded-md flex justify-center items-center")
          f-svg-icon(iconName="switch" :size="56")
        div(class="flex flex-col gap-2")
          div(class="font-bold") {{ $t('RR0378') }}
          div(class="font-normal") {{ $t('RR0379') }}

    div(class="w-full flex justify-center")
      f-button(class="py-6" size="sm" type="primary" @click="closeModalBehavior") {{ $t('RR0373') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>
