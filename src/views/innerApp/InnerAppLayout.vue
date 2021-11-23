<template lang="pug">
div(class="flex h-full")
  router-view(name="sidebar")
  main(class="flex-grow")
    router-view(v-if="isRouterAlive" :key="$route.path" v-slot="{ Component }" class="overflow-y-auto")
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center")
            svg-icon(iconName="loading" size="92" class="text-brand-dark")
</template>

<script>
import { useStore } from 'vuex'
import { ref, nextTick, provide } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

export default {
  name: 'InnerAppLayout',
  setup () {
    const store = useStore()

    const isRouterAlive = ref(true)
    const reloadRootRoute = async () => {
      isRouterAlive.value = false
      await nextTick()
      isRouterAlive.value = true
    }
    provide('reloadRootRoute', reloadRootRoute)

    onBeforeRouteUpdate(async (to, from) => {
      const isFromGroup = 'groupId' in from.params
      const isToGroup = 'groupId' in to.params
      if (isFromGroup && isToGroup && (from.params.groupId !== to.params.groupId)) {
        await store.dispatch('group/getGroup', { groupId: to.params.groupId })
      }
    })

    return {
      isRouterAlive
    }
  }
}
</script>
