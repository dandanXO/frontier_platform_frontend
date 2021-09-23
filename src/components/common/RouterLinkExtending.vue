<template lang="pug">
a(v-if="isExternalLink" v-bind="$attrs" :href="to" targer="_blank")
  slot
router-link(v-else v-bind="$attrs" :to="to")
  slot
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'RouterLinkExtending',
  props: {
    to: {
      type: [String, Object],
      required: true
    }
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
