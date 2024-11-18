<template lang="pug">
div(class="gap-5 flex flex-row align-middle justify-center m-auto p-25" data-theme="new")
  div(class="flex flex-col align-middle justify-center min-w-160 max-w-[50vw] gap-16")
    div(class="flex flex-col justify-start gap-4 w-9/12")
      span(class="font-bold text-2xl") {{ $t('UU0157') }}
      span(class="text-lg") {{ $t('UU0158') }}
    div(class="flex flex-col justify-start gap-4 text-base w-[85%]")
      span(class="font-bold") {{ $t('UU0159') }}
      div(v-for="(action, index) in ACTION_LIST" :key="`action_${index}`")
        span(class="font-bold text-brand-solid") {{ action.title }}
        span(class="text-secondary-text") {{ action.desc }}
      div(class="flex flex-row gap-1")
    contact-support
  div(class="flex flex-col align-middle justify-center")
    img(src="@/assets/images/frame.gif" class="aspect-[10/11] min-w-60 max-w-125")
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ContactSupport from '@/components/common/ContactSupport.vue'
const { t } = useI18n()

const ACTION_LIST = computed(() => [
  {
    title: t('UU0160'),
    desc: t('UU0161'),
  },
  {
    title: t('UU0162'),
    desc: t('UU0163'),
  },
  {
    title: t('UU0164'),
    desc: t('UU0165'),
  },
])
</script>
