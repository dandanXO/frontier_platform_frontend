<template lang="pug">
div(
  ref="refAnnouncement"
  class="fixed top-0 left-0 w-screen h-screen bg-grey-900/40 z-100 flex items-center justify-center"
  @click="closeAnnouncement"
)
  div(class="w-192.5 h-119.5 bg-grey-0 rounded relative flex overflow-hidden" @click.stop)
    f-svg-icon(
      iconName="clear"
      class="absolute top-5 right-5 text-grey-600 cursor-pointer"
      @click="closeAnnouncement"
    )
    div(class="w-70 h-full shrink-0")
      img(:src="contentList[activeContentIndex].leftSideImg")
    div(class="flex-grow pt-8 pl-10.5 pr-5.5")
      div(class="pr-9 flex flex-col gap-y-2")
        h3(class="text-caption text-primary-400 font-bold") {{ $t('TT0115') }}
        h3(class="text-h3/1.3 text-grey-900 font-medium") {{ $t('TT0132') }}
        p(class="text-body2/1.6 text-grey-900") {{ $t('TT0174') }}
          span(
            class="text-cyan-400 cursor-pointer"
            @click="store.dispatch('helper/pushModal', { component: 'modal-thread-board-feature-reminder' })"
          ) {{ ' ' + $t('RR0275') }}
      div(class="pt-8 flex flex-col gap-y-2")
        div(
          v-for="(content, index) in contentList"
          :key="index"
          class="flex gap-x-3 hover:bg-grey-150 hover:outline outline-grey-150 outline-1 rounded-lg p-4 cursor-pointer"
          :class="activeContentIndex === index ? 'bg-grey-50 outline' : ''"
          @click="activeContentIndex = index"
        )
          f-svg-icon(
            :iconName="content.iconName"
            size="32"
            :class="{ [content.iconActiveClass]: activeContentIndex === index }"
          )
          div(class="")
            p(class="text-body2/1.6 text-grey-900 font-bold") {{ content.title }}
            p(class="text-body2/1.6 text-grey-600") {{ content.description }}
    f-button(
      class="absolute bottom-5 right-5"
      type="secondary"
      size="md"
      @click="closeAnnouncement"
    ) {{ $t('UU0094') }}
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import announcement1 from '@/assets/images/announcement/img_threadboard_announcement_01.png'
import announcement2 from '@/assets/images/announcement/img_threadboard_announcement_02.png'

const store = useStore()
const { t } = useI18n()

interface Content {
  iconName: string
  iconActiveClass: string
  title: string
  description: string
  leftSideImg: string
}

const activeContentIndex = ref(0)

const contentList = computed<Content[]>(() => [
  {
    iconName: 'board',
    iconActiveClass: 'text-primary-300',
    title: t('TT0132'),
    description: t('TT0175'),
    leftSideImg: announcement1,
  },
  {
    iconName: 'workflow_stage',
    iconActiveClass: 'text-cyan-300',
    title: t('TT0176'),
    description: t('TT0177'),
    leftSideImg: announcement2,
  },
])

const refAnnouncement = ref<HTMLElement>()
const closeAnnouncement = () => {
  store.dispatch('user/readAnnouncement')
  store.commit('user/SET_isShowAnnouncement', false)
  refAnnouncement.value?.remove()
  store.dispatch('helper/closeModal')
}
</script>
