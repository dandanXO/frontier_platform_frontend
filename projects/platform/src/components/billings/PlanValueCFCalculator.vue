<template lang="pug">
div(data-theme="startrust" class="flex gap-3")
  div(
    class="flex flex-col flex-1 rounded-xl gap-5 border-grey-250 border p-5 bg-cover"
    :style="{ backgroundImage: `url(${startrustBgImg})` }"
  )
    div(class="flex gap-3 px-5 flex-col")
      div(class="flex gap-2 flex-col")
        p(class="text-md font-bold") {{ $t('RR0459') }}
        p(class="text-sm text-grey-600") {{ $t('RR0474') }}
      //- will used it later on 
      //- when BE already provide the expiration date of the subscription
      //- p(class="text-sm text-grey-600") {{ $t('RR0475', { date: expirationDate }) }}
    div(class="flex flex-row gap-5 self-end")
      f-button(size="md" type="text" @click="onShowGuide") {{ $t('RR0453') }}
      f-button(size="md" @click="onOpenFeedback") {{ $t('UU0078') }}
  div(
    class="flex flex-col flex-1 justify-between rounded-xl gap-5 border-grey-250 border p-8"
    v-if="showQuota"
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
import { useRoute, useRouter } from 'vue-router'

import startrustBgImg from '@/assets/images/card_promo_startrust_bg_x0.2.png'

const quota = ref(0)
const maxQuota = ref(300)
const showQuota = ref(false)
const store = useStore()
const route = useRoute()
const router = useRouter()
const onOpenFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
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
