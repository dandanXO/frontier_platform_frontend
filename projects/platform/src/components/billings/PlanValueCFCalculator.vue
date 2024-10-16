<template lang="pug">
div(data-theme="startrust" class="flex gap-3")
  div(
    class="flex flex-col flex-1 rounded-xl gap-5 border-grey-250 border p-8 bg-cover"
    :style="{ backgroundImage: `url(${startrustBgImg})` }"
  )
    p(class="text-md font-bold") {{ $t('RR0459') }}
    p(class="text-sm text-grey-600") {{ $t('RR0460') }}
    div(class="flex flex-row gap-5 self-end")
      f-button(size="md" type="text" @click="onShowGuide") {{ $t('RR0453') }}
      f-button(size="md" @click="onUpgrade") {{ $t('OO0045') }}
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
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import { useConstants } from '@/utils/constants'
import startrustBgImg from '@/assets/images/card_promo_startrust_bg_x0.2.png'

const quota = ref(0)
const maxQuota = ref(300)
const { FEEDBACK_CATEGORY } = useConstants()
const store = useStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const onUpgrade = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties: {
      title: t('OO0045'),
      category: FEEDBACK_CATEGORY.value.PAYMENT.value,
    },
  })
}

const onShowGuide = () => {
  router.push({
    name: route.name!,
    params: { tab: 'value-added-service' },
    query: { scroll_to: 'cfc-guide' },
  })
}
</script>
