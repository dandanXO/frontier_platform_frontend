<template lang="pug">
div(class="flex items-center gap-x-2 h-9 pl-3 pr-2 hover:bg-black-400 cursor-pointer"
  :class="[{ 'bg-black-500': isActive }]"
  @click="$router.push(path)"
)
  slot
    svg-icon(:iconName="icon" class="text-black-700")
    span(class="text-body2 text-primary") {{$t(title)}}
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
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
    }
  },
  setup (props) {
    const route = useRoute()
    const isActive = computed(() => {
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
    return {
      isActive
    }
  }
}
</script>
