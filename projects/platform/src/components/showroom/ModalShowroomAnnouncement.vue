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
    div(class="w-86 h-full shrink-0")
      img(:src="announcement.coverImg")
    div(class="flex-grow pt-6 pl-8.5 pr-8")
      h5(
        class="w-84.5 h-23.5 text-h5 leading-1.5 text-grey-900 font-bold flex items-end"
      ) {{ announcement.title }}
      div(class="pt-5 pb-3 grid grid-flow-col gap-x-3 justify-start")
        div(
          v-for="logo in announcement.participatedOrgLogoList"
          class="rounded-full card-shadow w-10 h-10 overflow-hidden border border-grey-0"
        )
          img(:src="logo" class="w-full h-full")
      p(class="w-84.5 text-body2 text-grey-400 leading-1.6 pb-5") {{ announcement.subtitle }}
      f-button(size="md") {{ $t('UU0118') }}
      div(class="mt-8 mb-6 w-full h-px bg-grey-100")
      component(:is="announcementDescriptionComponent")
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'

const store = useStore()

const announcement = computed(() => store.getters['showroom/announcement'])
const announcementDescriptionComponent = computed(
  () => store.getters['showroom/announcementDescriptionComponent']
)

const refAnnouncement = ref(null)
const closeAnnouncement = () => {
  refAnnouncement.value.remove()
}
</script>
