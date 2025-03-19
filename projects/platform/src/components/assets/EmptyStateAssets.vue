<template lang="pug">
div(class="flex h-full py-24 px-32" data-theme="new")
  div(class="flex flex-col gap-10 w-107")
    div(class="flex flex-col gap-3")
      div(class="flex justify-center items-center p-5 bg-primary-hover w-fit rounded")
        f-svg-icon(iconName="texture_add" size="48" class="text-primary-inverse")
      div(class="flex flex-col gap-3")
        p(class="text-3xl font-bold text-[32px]") {{ $t('RR0490') }}
        p(class="text-xl text-tertiary-text") {{ $t('RR0491') }}
        f-button(
          type="text"
          size="lg"
          class="underline font-semibold w-fit h-fit !p-0"
        ) {{ $t('RR0492') }}
    f-button(
      v-permission="{ FUNC_ID: FUNC_ID.ASSET_CREATE, behavior: 'deleteElement' }"
      size="lg"
      @click="goToMaterialUpload"
      class="w-fit !font-bold"
    ) {{ $t('UU0190') }}
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { FUNC_ID } from '@/utils/constants'

const { goToMaterialUpload } = useNavigation()
</script>
