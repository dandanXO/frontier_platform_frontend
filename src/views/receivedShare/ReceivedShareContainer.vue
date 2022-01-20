<template lang="pug">
fullscreen-header
  template(#left)
    template(v-if="share.sharingFrom === SHARING_FROM.WORKSPACE")
      img(:src="logo" class="w-10 h-10 rounded-full")
      div(class="flex items-end pl-2")
        p(class="text-body1 font-bold text-primary pr-2.5") {{share.displayName}}
        p(class="text-caption text-black-700") {{$t('RR0148')}} {{$dayjs.unix(share.shareDate).format('YYYY/MM/DD')}}
    template(v-else-if="share.sharingFrom === SHARING_FROM.PUBLIC_LIBRARY")
      p(class="text-body1 font-bold text-primary pr-2.5") {{$t('GG0032')}}
      img(:src="logo" class="w-10 h-10 rounded-full")
      p(class="text-body1 font-bold text-primary pl-2.5") {{share.displayName}}
  template(#right)
    div(class="relative pr-4")
      svg-icon(iconName="chat" size="24" class="text-black-700")
    btn(size="md" @click="saveReceivedShare") {{$t('UU0018')}}
  template(#content)
    div(v-if="share.isClosed" class="w-full h-full flex items-center justify-center")
      p(class="text-body1 text-primary") {{$t('GG0026')}}
    router-view(v-else)
    div(class="fixed z-index:footer bottom-0 w-full h-13 bg-black-100 px-36 flex items-center justify-end card-shadow")
      p(class="text-body2 text-primary") {{$t('GG0004')}}
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import useReceivedShare from '@/composables/useReceivedShare.js'
import { SHARING_FROM } from '@/utils/constants.js'

export default {
  name: 'ReceivedShareContainer',
  components: {
    FullscreenHeader
  },
  setup () {
    const store = useStore()
    const { saveReceivedShare } = useReceivedShare()

    const share = computed(() => store.getters['share/share'])
    const logo = computed(() => store.getters['share/logo'])

    return {
      share,
      logo,
      saveReceivedShare,
      SHARING_FROM
    }
  }
}
</script>
