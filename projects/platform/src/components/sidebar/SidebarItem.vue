<template lang="pug">
div(
  class="flex items-center gap-x-2 h-9 pl-3 pr-2 hover:bg-grey-100 cursor-pointer"
  :class="[{ 'bg-grey-150': isActive }, { 'pointer-events-none': disabled }]"
  @click="goTo"
)
  slot
    f-svg-icon(
      :iconName="icon"
      size="20"
      :class="[disabled ? 'text-grey-250' : 'text-grey-600']"
    )
    span(
      class="text-body2 line-clamp-1"
      :class="[disabled ? 'text-grey-250' : 'text-grey-900']"
    ) {{ title }}
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SidebarItem',
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      required: true,
    },
    pathUseToMatch: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const isActive = computed(() => {
      // Special case
      if (
        (props.id === 'management' &&
          ['OrgManagement', 'GroupManagement'].includes(route.name)) ||
        (props.id === 'progress' &&
          ['OrgProgress', 'GroupProgress'].includes(route.name))
      ) {
        return true
      }

      const matched = route.matched
      const matchedPathList = matched.map((item) => {
        let path = item.path
        Object.keys(route.params).forEach((key) => {
          const regex = new RegExp(':' + key)
          path = path.replace(regex, route.params[key])
        })
        path = path.replace(/\(\\d\+\)/, '')
        return path
      })

      return matchedPathList.some((matchedPath) =>
        matchedPath.includes(
          props.pathUseToMatch !== '' ? props.pathUseToMatch : props.path
        )
      )
    })

    const goTo = async () => {
      if (props.disabled) {
        return
      }

      await router.push(props.path)
      store.dispatch('helper/reloadInnerApp')
    }

    return {
      goTo,
      isActive,
    }
  },
}
</script>
