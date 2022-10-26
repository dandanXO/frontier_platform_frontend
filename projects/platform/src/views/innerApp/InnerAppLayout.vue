<template lang="pug">
div(class="flex h-full")
  router-view(name="sidebar")
  main(class="flex-grow relative")
    router-view(
      v-if="isReloadInnerApp"
      :key="$route.name"
      v-slot="{ Component }"
      class="overflow-y-auto"
    )
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center")
            f-svg-icon(iconName="loading" size="92" class="text-primary-500")
    notify-bar-buffer(
      v-if="isInInnerApp && planStatus.BUFFER"
      :key="$route.params.orgNo"
      class="absolute bottom-0 left-0 z-100"
    )
    div(
      v-if="isInInnerApp && isShowTitasAnnouncement"
      class="fixed top-0 left-0 w-screen h-screen bg-grey-900/40 z-100 flex items-center justify-center"
      @click="isShowTitasAnnouncement = false"
    )
      div(
        class="w-192.5 h-119.5 bg-grey-0 rounded relative flex overflow-hidden"
        @click.stop
      )
        f-svg-icon(
          iconName="clear"
          class="absolute top-6 right-6 text-grey-600 cursor-pointer"
          @click="isShowTitasAnnouncement = false"
        )
        div(class="w-86 h-full shrink-0")
          img(src="@/assets/images/titas_announcement_banner.png")
        div(class="flex-grow pt-15 pl-8.5 pr-8")
          h5(class="w-84.5 text-h5 leading-1.5 text-grey-900 font-bold") {{ $t('II0016') }}
          div(class="pt-7.5 pb-3 grid grid-flow-col gap-x-3 justify-start")
            div(
              v-for="org in titasInfo.orgList"
              class="rounded-full card-shadow w-10 h-10 overflow-hidden border border-grey-0"
            )
              img(:src="org.logo" class="w-full h-full")
          p(class="w-84.5 text-body2 text-grey-400 leading-1.6 pb-5") {{ $t('II0017') }}
          f-button(
            size="md"
            @click="goToTitasShowroom(); isShowTitasAnnouncement = false"
          ) {{ $t('UU0118') }}
          div(class="my-6 w-full h-px bg-grey-100")
          p(class="text-body2 leading-1.6")
            span(class="text-grey-400") {{ $t('II0018') }}
            a(
              href="https://event.frontier.cool/titas2022"
              target="_blank"
              class="text-cyan-400"
            ) &nbsp;&nbsp;{{ $t('II0019') }}
</template>

<script>
export default {
  name: 'InnerAppLayout',
}
</script>

<script setup>
import { setOptions, bootstrap } from 'vue-gtag'
import { useStore } from 'vuex'
import { ref, computed, defineAsyncComponent } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import useNavigation from '@/composables/useNavigation'

const NotifyBarBuffer = defineAsyncComponent(() =>
  import('@/components/billings/NotifyBarBuffer.vue')
)
const store = useStore()
const route = useRoute()
const { goToTitasShowroom } = useNavigation()
const isReloadInnerApp = computed(
  () => store.getters['helper/isReloadInnerApp']
)
const planStatus = computed(() => store.getters['polling/planStatus'])
const isInInnerApp = computed(() =>
  route.matched.some((r) => r.name === 'InnerAppRoot')
)
const user = computed(() => store.getters['user/user'])

onBeforeRouteUpdate(async (to, from) => {
  const isFromGroup = 'groupId' in from.params
  const isToGroup = 'groupId' in to.params
  if (isFromGroup && isToGroup && from.params.groupId !== to.params.groupId) {
    await store.dispatch('group/getGroup', { groupId: to.params.groupId })
    await store.dispatch('group/groupUser/getGroupUser')
  }
})

/** GA */
setOptions({
  config: {
    id: import.meta.env.VITE_APP_GA_MEASUREMENT_ID,
    params: {
      user_id: user.value.email,
    },
  },
})
bootstrap()

/** Titas */
const isShowTitasAnnouncement = ref(true)
const titasInfo = computed(() => store.getters['titas/titasInfo'])
</script>
