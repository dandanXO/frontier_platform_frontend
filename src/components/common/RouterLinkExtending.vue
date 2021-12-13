<template lang="pug">
a(v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank")
  slot
router-link(
  v-else
  v-bind="$props"
  custom
  :to="to"
  v-slot="{ isActive, href, navigate }"
)
  a(
    v-bind="$attrs"
    :href="href"
    @click="navigate"
    :class="isActive ? activeClass : inactiveClass"
  )
    slot
</template>

<script>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

export default {
  name: 'RouterLinkExtending',
  props: {
    ...RouterLink.props,
    inactiveClass: String
  },
  setup (props, context) {
    const isExternalLink = computed(() => typeof props.to === 'string' && (/(http(s?)):\/\//i).test(props.to))

    return {
      ...props,
      isExternalLink
    }
  }
}
</script>
