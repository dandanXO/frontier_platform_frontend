<template lang="pug">
div(class="flex h-full")
  router-view(name="sidebar")
  main(class="flex-grow")
    router-view(v-if="isReloadInnerApp" :key="$route.path" v-slot="{ Component }" class="overflow-y-auto")
      suspense
        component(:is="Component")
        template(#fallback)
          div(class="h-full flex justify-center items-center")
            svg-icon(iconName="loading" size="92" class="text-brand-dark")
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

export default {
  name: 'InnerAppLayout',
  setup () {
    const store = useStore()

    const isReloadInnerApp = computed(() => store.getters['helper/isReloadInnerApp'])

    onBeforeRouteUpdate(async (to, from) => {
      const isFromGroup = 'groupId' in from.params
      const isToGroup = 'groupId' in to.params
      if (isFromGroup && isToGroup && (from.params.groupId !== to.params.groupId)) {
        await store.dispatch('group/getGroup', { groupId: to.params.groupId })
        await store.dispatch('user/groupUser/getGroupUser')
      }
    })

    return {
      isReloadInnerApp
    }
  }
}
</script>
