<template lang="pug">
div(data-theme="startrust" class="flex flex-1 gap-3")
  div(
    class="flex flex-col flex-1 rounded-xl gap-5 border-grey-250 border p-8 bg-cover"
    :style="{ backgroundImage: `url(${startrustBgImg})` }"
  )
    p(class="text-md font-bold") {{ $t('VV0075') }}
    p(class="text-sm text-grey-600") {{ $t('VV0076') }}
    div(class="flex flex-row gap-5 self-end")
      f-button(size="md" type="text") {{ $t('VV0074') }}
      f-button(size="md") {{ $t('UU0064') }}
  div(
    class="flex flex-col flex-1 justify-between rounded-xl gap-5 border-grey-250 border p-8"
  )
    div
      p(class="text-md font-bold") {{ $t('VV0077') }}
      p(class="text-caption text-grey-600 leading-1.6") {{ $t('VV0078') }}
    div(class="flex flex-row gap-5 w-full")
      div(class="flex items-center flex-1")
        p(class="text-body1 font-bold leading-1.6 text-link") {{ quota }}/{{ maxQuota }}
          span(class="text-caption font-normal pl-1") {{ $t('OO0035') }}
      f-circle-progress-bar(
        class="self-end"
        :size="60"
        :current="quota"
        :max="maxQuota"
        :primaryColor="'stroke-brand-solid'"
      )
        div(class="text-caption font-normal text-grey-900 text-center")
          f-svg-icon(iconName="done" size="24")
</template>

<script setup lang="ts">
import startrustBgImg from '@/assets/images/card_promo_startrust_bg_x0.2.png'
import { ref } from 'vue'

const quota = ref(0)
const maxQuota = ref(300)
</script>
