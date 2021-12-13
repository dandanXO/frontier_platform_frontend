<template lang="pug">
div(class="flex items-center gap-x-2 h-9 pl-3 pr-2 hover:bg-black-400 cursor-pointer"
  :class="[{ 'bg-black-500': isActive }]"
  @click="goTo"
)
  slot
    svg-icon(:iconName="icon" class="text-black-700")
    span(class="text-body2 text-primary") {{$t(title)}}
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { inject } from 'vue'

export default {
  name: 'SidebarItem',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    path: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()
    const reloadRootRoute = inject('reloadRootRoute')

    const isActive = computed(() => {
      // Speacial case
      if (props.id === 'management' && ['OrgManagement', 'GroupManagement'].includes(route.name)) {
        return true
      }

      const matched = route.matched
      const matchedPathList = matched.map(item => {
        let path = item.path
        Object.keys(route.params).forEach(key => {
          const regex = new RegExp(':' + key)
          path = path.replace(regex, route.params[key])
        })
        path = path.replace(/\(\\d\+\)/, '')
        return path
      })
      return matchedPathList.some(matchedPath => matchedPath.includes(props.path))
    })

    const goTo = async () => {
      if (props.path === route.path) {
        await router.push(props.path)
        reloadRootRoute()
      } else {
        router.push(props.path)
      }
    }

    return {
      goTo,
      isActive,
      reloadRootRoute
    }
  }
}
</script>
