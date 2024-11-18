<template lang="pug">
div(class="gap-5 flex flex-row align-middle justify-center m-auto p-25" data-theme="new")
  div(class="flex flex-col align-middle justify-center min-w-160 max-w-[50vw] gap-16")
    div(class="flex flex-col justify-start gap-4 w-9/12")
      span(class="font-bold text-2xl") {{ $t('UU0167') }}
      span(class="text-lg") {{ $t('UU0168') }}
      div
        f-button(size="lg" @click="goToLobby") {{ $t('UU0169') }}
    contact-support

  div(class="flex flex-col align-middle justify-center")
    img(src="@/assets/images/frame.gif" class="aspect-[10/11] min-w-60 max-w-125")
</template>

<script lang="ts" setup>
import ContactSupport from '@/components/common/ContactSupport.vue'
import useNavigation from '@/composables/useNavigation'

const { goToLobby } = useNavigation()
</script>
