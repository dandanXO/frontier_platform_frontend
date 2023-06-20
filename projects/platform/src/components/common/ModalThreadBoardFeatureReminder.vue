<template lang="pug">
div(
  class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center"
  @click="closeReminder"
)
  div(class="w-211 h-159.5 bg-grey-0 rounded relative overflow-hidden" @click.stop)
    div(
      class="w-full h-15 px-6 flex flex-row items-center justify-between"
      :style="{ 'box-shadow': '0px 0.15px 0.45px rgba(103, 103, 103, 0.11), 0px 0.8px 1.8px rgba(103, 103, 103, 0.13)' }"
    )
      f-svg-icon(
        iconName="clear"
        class="absolute top-5 right-5 text-grey-600 cursor-pointer"
        @click="closeReminder"
      )
      h5(class="text-h5/1.5 text-grey-900 font-bold") {{ $t('TT0115') }} {{ $t('TT0132') }}
    f-scrollbar-container(class="w-full h-126 px-10 pt-8 pb-3")
      div(class="flex flex-col gap-y-4")
        template(v-for="(content, index) in contentList" :key="content.title")
          div(class="w-full min-h-40 pb-8 flex flex-row gap-x-4")
            div(
              class="flex-shrink-0 flex flex-row items-center justify-center w-6 h-7.5 rounded-md bg-primary-600 text-grey-0 text-body-2"
            ) {{ index + 1 }}
            div(class="flex-1")
              p(class="text-body2/1.6 text-grey-900 font-bold") {{ content.title }}
              template(v-if="index === 0")
                i18n-t(
                  keypath="TT0179"
                  tag="p"
                  class="text-body2/1.6 text-grey-600"
                  scope="global"
                )
                  template(#threadIcon)
                    span
                      f-svg-icon(class="inline" iconName="sticker_thread" size="20")
              template(v-if="index === 1")
                i18n-t(
                  keypath="TT0181"
                  tag="p"
                  class="text-body2/1.6 text-grey-600"
                  scope="global"
                )
                  template(#RR0278)
                    span(class="font-bold") {{ $t('RR0278') }}
                  template(#RR0054)
                    span(class="font-bold") {{ $t('RR0054') }}
                  template(#RR0277)
                    span(class="font-bold") {{ $t('RR0277') }}
                  template(#RR0063)
                    span(class="font-bold") {{ $t('RR0063') }}
              template(v-if="index === 2")
                ul(
                  class="ml-2.5 list-inside list-disc text-body2/1.6 text-grey-600 marker:text-caption2 marker:mr-0"
                )
                  li {{ $t('TT0184') }}
                  li {{ $t('TT0185') }}
                  li {{ $t('TT0186') }}
              template(v-if="index === 3")
                div(class="text-body2/1.6 text-grey-600")
                  p {{ $t('TT0188') }}
                  ul(
                    class="ml-2.5 list-inside list-disc marker:text-caption2 marker:mr-0"
                  ) 
                    li {{ $t('TT0189') }}
                    li {{ $t('TT0190') }}
                    li {{ $t('TT0191') }}
                    li {{ $t('TT0192') }}
                    li {{ $t('TT0193') }}
                  p {{ $t('TT0194') }}
                  ul(
                    class="ml-2.5 list-inside list-disc marker:text-caption2 marker:mr-0"
                  ) 
                    li {{ $t('TT0195') }}
                    li {{ $t('TT0196') }}
                    li {{ $t('TT0197') }}
            div(class="w-93.5 flex-shrink-0")
              img(class="w-full" :src="content.image")
          div(v-if="index !== contentList.length - 1" class="w-full h-px bg-grey-150")
    div(
      class="flex flex-row items-center justify-between border-t border-px border-grey-150"
    )
      div(
        class="absolute bottom-5 left-5 h-8.5 flex flex-row items-center gap-x-1.5 text-grey-600 text-caption"
      )
        f-svg-icon(iconName="question" size="14")
        p {{ $t('TT0198') }}
          span(
            class="text-cyan-400 text-right cursor-pointer"
            @click="openModalSendFeedback"
          ) {{ $t('UU0078') }}
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
import instruction1 from '@/assets/images/announcement/img_threadboard_instruction_01.png'
import instruction2 from '@/assets/images/announcement/img_threadboard_instruction_02.png'
import instruction3 from '@/assets/images/announcement/img_threadboard_instruction_03.png'
import instruction4 from '@/assets/images/announcement/img_threadboard_instruction_04.png'

const store = useStore()
const { t } = useI18n()

interface Content {
  iconName: string
  title: string
  image: string | null
}
const contentList = computed<Content[]>(
  () =>
    [
      {
        iconName: 'sticker_thread',
        title: t('TT0178'),
        image: instruction1,
      },
      {
        iconName: 'teams',
        title: t('TT0180'),
        image: instruction2,
      },
      {
        iconName: 'starred',
        title: t('TT0183'),
        image: instruction3,
      },
      {
        iconName: 'summary',
        title: t('TT0187'),
        image: instruction4,
      },
    ] as Content[]
)

const openModalSendFeedback = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-send-feedback',
  })
}

const closeReminder = () => {
  store.dispatch('helper/closeModal')
}
</script>
