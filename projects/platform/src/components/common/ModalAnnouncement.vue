<template lang="pug">
div(
  ref="refAnnouncement"
  class="fixed top-0 left-0 w-screen h-screen bg-grey-900/40 z-100 flex items-center justify-center"
  @click="closeAnnouncement"
)
  div(class="w-192.5 h-119.5 bg-grey-0 rounded relative flex overflow-hidden" @click.stop)
    f-svg-icon(
      iconName="clear"
      class="absolute top-7.5 right-7.5 text-grey-600 cursor-pointer"
      @click="closeAnnouncement"
    )
    div(class="w-70 h-full shrink-0")
      img(src="@/assets/images/announcement/modal_left_side.png")
    div(class="flex-grow pt-6 pl-8 pr-5")
      h3(class="text-h3/1.3 text-grey-900 font-normal") {{ $t('TT0115') }}
      h3(class="text-h3/1.3 text-primary-400 font-bold") {{ $t('TT0116') }}
      div(class="pt-5.5 flex flex-col gap-y-5")
        div(v-for="content in contentList" class="flex gap-x-3")
          f-svg-icon(:iconName="content.iconName" size="30")
          div(class="w-96")
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

const store = useStore()
const { t } = useI18n()

interface Content {
  iconName: string
  title: string
  description: string
}
const contentList = computed<Content[]>(() => [
  {
    iconName: 'sticker_thread',
    title: t('TT0117'),
    description: t('TT0123'),
  },
  {
    iconName: 'teams',
    title: t('TT0118'),
    description: t('TT0124'),
  },
  {
    iconName: 'starred',
    title: t('TT0119'),
    description: t('TT0125'),
  },
  {
    iconName: 'summary',
    title: t('TT0120'),
    description: t('TT0126'),
  },
])

const refAnnouncement = ref<HTMLElement>()
const closeAnnouncement = () => {
  store.dispatch('user/readAnnouncement')
  refAnnouncement.value?.remove()
}
</script>
