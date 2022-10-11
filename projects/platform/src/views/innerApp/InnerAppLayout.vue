<template lang="pug">
div(class="flex h-full")
  router-view(name="sidebar")
  main(class="flex-grow relative")
    router-view(v-if="isReloadInnerApp" :key="$route.name" v-slot="{ Component }" class="overflow-y-auto")
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center")
            f-svg-icon(iconName="loading" size="92" class="text-primary-500")
    notify-bar-buffer(v-if="isInInnerApp && planStatus.BUFFER" :key="$route.params.orgNo" class="absolute bottom-0 left-0 z-100")
</template>

<script>
import { setOptions, bootstrap } from 'vue-gtag'
import { useStore } from 'vuex'
import { computed, defineAsyncComponent } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

export default {
  name: 'InnerAppLayout',
  components: {
    NotifyBarBuffer: defineAsyncComponent(() => import('@/components/billings/NotifyBarBuffer.vue'))
  },
  setup () {
    const store = useStore()
    const route = useRoute()

    const isReloadInnerApp = computed(() => store.getters['helper/isReloadInnerApp'])
    const planStatus = computed(() => store.getters['polling/planStatus'])
    const isInInnerApp = computed(() => route.matched.some(r => r.name === 'InnerAppRoot'))
    const user = computed(() => store.getters['user/user'])

    onBeforeRouteUpdate(async (to, from) => {
      const isFromGroup = 'groupId' in from.params
      const isToGroup = 'groupId' in to.params
      if (isFromGroup && isToGroup && (from.params.groupId !== to.params.groupId)) {
        await store.dispatch('group/getGroup', { groupId: to.params.groupId })
        await store.dispatch('group/groupUser/getGroupUser')
      }
    })

    setOptions({
      config: {
        id: import.meta.env.VITE_APP_GA_MEASUREMENT_ID,
        params: {
          'user_id': user.value.email
        }
      }
    })
    bootstrap()

    return {
      planStatus,
      isReloadInnerApp,
      isInInnerApp
    }
  }
}
</script>
