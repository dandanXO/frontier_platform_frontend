<template lang="pug">
div(
  class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
  @click="closeReminder"
)
  div(class="w-281 h-159.5 p-5 bg-grey-0 rounded relative overflow-hidden" @click.stop)
    f-svg-icon(
      iconName="clear"
      class="absolute top-5 right-5 text-grey-600 cursor-pointer"
      @click="closeReminder"
    )
    h5(class="text-h5/1.5 text-grey-900 font-bold pb-5") {{ $t('TT0121') }}
    div(class="h-120 grid grid-flow-col grid-cols-4 gap-x-3 relative")
      div(
        v-for="content in contentList"
        :key="content.title"
        class="bg-grey-100 rounded relative"
      )
        div(class="pt-5 px-4")
          f-svg-icon(
            :iconName="content.iconName"
            size="30"
            class="text-primary-400 mb-2"
          )
          p(class="text-body2/1.6 text-grey-900 font-bold") {{ content.title }}
          p(class="text-body2/1.6 text-grey-600") {{ content.description }}
        div(
          v-if="content.image"
          class="absolute bottom-0 left-0 z-1"
          :style="{ width: content.iconName === 'teams' ? '200%' : '100%' }"
        )
          img(:src="content.image")
    f-button(
      class="absolute bottom-5 right-5"
      type="secondary"
      size="md"
      @click="closeReminder"
    ) {{ $t('UU0094') }}
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import analyze_tw from '@/assets/images/announcement/pic_digitalthread_feature_analyze_262_315_CN.png'
import analyze_en from '@/assets/images/announcement/pic_digitalthread_feature_analyze_262_315.png'
import connect from '@/assets/images/announcement/pic_digitalthread_feature_connect_262_292.png'
import teams_tw from '@/assets/images/announcement/pic_digitalthread_feature_teamsandmark_536_315_CN.png'
import teams_en from '@/assets/images/announcement/pic_digitalthread_feature_teamsandmark_536_315.png'

const store = useStore()
const { t } = useI18n()

const locale = computed<string>(() => store.getters['user/user'].locale)

interface Content {
  iconName: string
  title: string
  description: string
  image: string | null
}
const contentList = computed<Content[]>(
  () =>
    [
      {
        iconName: 'sticker_thread',
        title: t('TT0117'),
        description: t('TT0123'),
        image: connect,
      },
      {
        iconName: 'teams',
        title: t('TT0118'),
        description: t('TT0124'),
        image: locale.value === 'en-US' ? teams_en : teams_tw,
      },
      {
        iconName: 'starred',
        title: t('TT0119'),
        description: t('TT0125'),
        image: null,
      },
      {
        iconName: 'summary',
        title: t('TT0120'),
        description: t('TT0126'),
        image: locale.value === 'en-US' ? analyze_en : analyze_tw,
      },
    ] as Content[]
)

const closeReminder = () => {
  store.dispatch('helper/closeModal')
}
</script>
