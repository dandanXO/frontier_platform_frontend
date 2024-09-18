<template lang="pug">
modal-behavior(
  :header="title"
  :primaryBtnText="''"
  :secondaryBtnText="''"
  :footer="false"
  :closable="false"
  :displayHeader="false"
  animation
)
  div(class="w-[416px] h-[444px] flex flex-col justify-between")
    div(class="w-full h-[280px]") 
      img(class="w-full h-full" src="@/assets/images/upload_welcome.png")
    div
      div(class="font-bold") {{ $t('RR0371') }}
      div(class="font-normal") {{ $t('RR0372') }}
    div(class="w-full flex justify-center")
      f-button(class="py-6" size="sm" type="primary" @click="closeModalBehavior") {{ $t('RR0373') }}
</template>

<script setup lang="ts">
import { useStore } from 'vuex'

const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>
