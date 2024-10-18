<template lang="pug">
#cfc-guide(class="w-195 mx-auto" data-theme="startrust")
  div(class="text-sm text-grey-900 pb-5") {{ $t('VV0073') }}
  div(class="flex flex-col flex-1 rounded-xl gap-5 border-grey-250 border bg-cover")
    div(class="flex flex-row gap-5")
      div(class="flex flex-col justify-between flex-1 py-5 pl-8")
        div(class="flex flex-col gap-1")
          p(class="text-2xl font-bold") {{ $t('RR0453') }}
          f-badge(type="information" size="small" v-if="isActive") 
            div(class="flex gap-1 flex-row")
              f-svg-icon(iconName="check_circle_outline" size="16") 
              p {{ $t('VV0054') }}
        div
          f-button(size="md" @click="onUpgrade") {{ $t(isActive ? 'UU0078' : 'OO0045') }}
      div(
        :style="{ backgroundImage: `url(${cfIllustration})` }"
        class="h-62 w-137 bg-cover rounded-tr-xl"
      )
    div(class="py-5 px-8 gap-5 flex flex-col text-sm text-grey-900")
      p {{ $t('VV0079') }}
      p(class="font-bold") {{ $t('VV0080') }}
      ul(class="list-disc pl-6")
        li {{ $t('VV0081') }}
        li {{ $t('VV0082') }}
      p(class="font-bold") {{ $t('VV0083') }}
      ul(class="list-disc pl-6")
        li {{ $t('VV0084') }}
        li {{ $t('VV0085') }}
        li {{ $t('VV0086') }}
      p {{ $t('VV0087') }}
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import cfIllustration from '@/assets/images/cf_illustration_x1.5.png'
import { useConstants } from '@/utils/constants'
import type { ValueAddedService } from '@frontier/platform-web-sdk'

const { FEEDBACK_CATEGORY } = useConstants()
const { t } = useI18n()
const store = useStore()
const valueAddedServices: ValueAddedService =
  store.getters['polling/valueAddedService']
const route = useRoute()

const isActive = ref(valueAddedServices.starTrust?.isActive)
const onUpgrade = () => {
  const properties = isActive.value
    ? undefined
    : {
        title: t('OO0045'),
        category: FEEDBACK_CATEGORY.value.PAYMENT.value,
      }
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
    properties,
  })
}

onMounted(() => {
  const targetScrollId = route.query.scroll_to

  if (!targetScrollId) {
    return
  }
  const target = document.getElementById(String(targetScrollId))

  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>
